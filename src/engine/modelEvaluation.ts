import { Account, AccountFeatures, RiskScoreResult, ModelMetrics } from '../types';

export interface ModelComparison {
  ruleBased: ModelMetrics;
  behaviorMl: ModelMetrics;
  networkAi: ModelMetrics;
}

export function evaluateModels(
  accounts: Account[],
  features: Map<string, AccountFeatures>,
  riskResults: Map<string, RiskScoreResult>,
  activeThreshold: number = 66
): ModelComparison {
  // Use deterministic held-out test set: 30% of accounts based on account_id modulo
  const testAccounts = accounts.filter((_, idx) => idx % 3 === 0);

  function evaluateSystem(predictFn: (acc: Account) => boolean): ModelMetrics {
    let tp = 0;
    let fp = 0;
    let tn = 0;
    let fn = 0;

    testAccounts.forEach(acc => {
      const isActualMule = acc.ground_truth_label === 'MULE';
      const isPredictedMule = predictFn(acc);

      if (isActualMule && isPredictedMule) tp++;
      else if (!isActualMule && isPredictedMule) fp++;
      else if (!isActualMule && !isPredictedMule) tn++;
      else if (isActualMule && !isPredictedMule) fn++;
    });

    const accuracy = Number(((tp + tn) / Math.max(1, testAccounts.length)).toFixed(3));
    const precision = Number((tp / Math.max(1, tp + fp)).toFixed(3));
    const recall = Number((tp / Math.max(1, tp + fn)).toFixed(3));
    const f1_score = Number((2 * ((precision * recall) / Math.max(0.0001, precision + recall))).toFixed(3));
    const tpr = recall;
    const fpr = Number((fp / Math.max(1, fp + tn)).toFixed(3));

    // Generate ROC curve points across thresholds
    const roc_points: { fpr: number; tpr: number; threshold: number }[] = [];
    for (let th = 10; th <= 90; th += 10) {
      let t_tp = 0, t_fp = 0, t_tn = 0, t_fn = 0;
      testAccounts.forEach(acc => {
        const isActualMule = acc.ground_truth_label === 'MULE';
        const score = riskResults.get(acc.account_id)?.finalScore || 0;
        const pred = score >= th;
        if (isActualMule && pred) t_tp++;
        else if (!isActualMule && pred) t_fp++;
        else if (!isActualMule && !pred) t_tn++;
        else if (isActualMule && !pred) t_fn++;
      });
      const th_tpr = Number((t_tp / Math.max(1, t_tp + t_fn)).toFixed(3));
      const th_fpr = Number((t_fp / Math.max(1, t_fp + t_tn)).toFixed(3));
      roc_points.push({ fpr: th_fpr, tpr: th_tpr, threshold: th });
    }

    return {
      accuracy,
      precision,
      recall,
      f1_score,
      tpr,
      fpr,
      true_positives: tp,
      false_positives: fp,
      true_negatives: tn,
      false_negatives: fn,
      roc_points
    };
  }

  // 1. Traditional Rule-Based: flags if total incoming > 1,50,000 without looking at network or pass-through
  const ruleBased = evaluateSystem(acc => {
    const feat = features.get(acc.account_id);
    return (feat?.total_incoming || 0) > 150000;
  });

  // 2. Behavioral ML alone: flags if Isolation Forest anomaly score >= activeThreshold
  const behaviorMl = evaluateSystem(acc => {
    const res = riskResults.get(acc.account_id);
    return (res?.anomalyScore || 0) >= activeThreshold;
  });

  // 3. Network-Aware AI (MuleTrace Fused Engine): flags if final fused score >= activeThreshold
  const networkAi = evaluateSystem(acc => {
    const res = riskResults.get(acc.account_id);
    return (res?.finalScore || 0) >= activeThreshold;
  });

  return { ruleBased, behaviorMl, networkAi };
}
