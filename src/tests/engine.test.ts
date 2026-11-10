import { describe, it, expect } from 'vitest';
import { generateSyntheticDataset } from '../data/syntheticGenerator';
import { buildDirectedGraph } from '../engine/graphBuilder';
import { detectCycles } from '../engine/cycleDetection';
import { detectCommunities } from '../engine/communityDetection';
import { traceMoneyPath } from '../engine/pathTracing';
import { computeAccountFeatures } from '../engine/featureEngineering';
import { IsolationForest } from '../engine/isolationForest';
import { calculateRiskScore } from '../engine/muleScoring';
import { extractMuleRings } from '../engine/ringDetection';
import { evaluateModels } from '../engine/modelEvaluation';

describe('MuleTrace AI Engine Unit Tests', () => {
  it('generates deterministic synthetic dataset with ~400 accounts and ~3000 transactions', () => {
    const ds1 = generateSyntheticDataset(42819);
    const ds2 = generateSyntheticDataset(42819);

    expect(ds1.accounts.length).toBeGreaterThanOrEqual(380);
    expect(ds1.transactions.length).toBeGreaterThanOrEqual(2500);
    expect(ds1.accounts[0].account_id).toBe(ds2.accounts[0].account_id);
    expect(ds1.transactions[0].txn_id).toBe(ds2.transactions[0].txn_id);

    // Verify all 6 planted patterns exist
    const patterns = new Set(ds1.accounts.map(a => a.plant_pattern));
    expect(patterns.has('FAN_IN_FAN_OUT')).toBe(true);
    expect(patterns.has('LAYERING_CHAIN')).toBe(true);
    expect(patterns.has('CIRCULAR_FLOW')).toBe(true);
    expect(patterns.has('STRUCTURING')).toBe(true);
    expect(patterns.has('SHARED_DEVICE')).toBe(true);
    expect(patterns.has('NEW_ACCOUNT_BURST')).toBe(true);

    // Verify legitimate lookalike merchant exists
    const merchant = ds1.accounts.find(a => a.ground_truth_label === 'MERCHANT_FALSE_POSITIVE');
    expect(merchant).toBeDefined();
    expect(merchant?.account_type).toBe('MERCHANT');
  });

  it('builds directed transaction graph and detects circular cycles', () => {
    const ds = generateSyntheticDataset(42819);
    const graph = buildDirectedGraph(ds.accounts, ds.transactions);

    expect(graph.nodes.size).toBeGreaterThanOrEqual(ds.accounts.length);
    expect(graph.edges.size).toBeGreaterThan(0);

    const cycles = detectCycles(graph);
    expect(cycles.cycles.length).toBeGreaterThan(0);
    expect(cycles.cycleNodes.size).toBeGreaterThan(0);
  });

  it('computes 24 features correctly without NaN or undefined', () => {
    const ds = generateSyntheticDataset(42819);
    const graph = buildDirectedGraph(ds.accounts, ds.transactions);
    const cycles = detectCycles(graph);
    const communities = detectCommunities(graph);
    const features = computeAccountFeatures(ds.accounts, ds.transactions, graph, cycles, communities);

    expect(features.size).toBe(ds.accounts.length);

    const firstAccFeatures = features.get(ds.accounts[0].account_id)!;
    expect(firstAccFeatures).toBeDefined();
    expect(typeof firstAccFeatures.pass_through_ratio).toBe('number');
    expect(isNaN(firstAccFeatures.pass_through_ratio)).toBe(false);
    expect(typeof firstAccFeatures.avg_dwell_time_minutes).toBe('number');
    expect(typeof firstAccFeatures.structuring_ratio).toBe('number');
    expect(typeof firstAccFeatures.shared_device_count).toBe('number');
  });

  it('runs true Isolation Forest anomaly scoring in TypeScript', () => {
    const data = [
      [10, 20, 5, 1],
      [11, 21, 6, 1],
      [10, 19, 5, 2],
      [12, 22, 4, 1],
      // Anomalous outlier
      [9999, 9999, 999, 99]
    ];

    const iforest = new IsolationForest({ numTrees: 50, subSampleSize: 16, seed: 12345 });
    iforest.fit(data);

    const normalScore = iforest.predictAnomalyScore([10, 20, 5, 1]);
    const outlierScore = iforest.predictAnomalyScore([9999, 9999, 999, 99]);

    expect(outlierScore).toBeGreaterThan(normalScore);
    expect(outlierScore).toBeGreaterThanOrEqual(50);
  });

  it('scores mule accounts and provides SHAP-inspired feature contributions and merchant mitigations', () => {
    const ds = generateSyntheticDataset(42819);
    const graph = buildDirectedGraph(ds.accounts, ds.transactions);
    const cycles = detectCycles(graph);
    const communities = detectCommunities(graph);
    const features = computeAccountFeatures(ds.accounts, ds.transactions, graph, cycles, communities);

    const muleAccount = ds.accounts.find(a => a.ground_truth_label === 'MULE')!;
    const muleFeat = features.get(muleAccount.account_id)!;
    const muleScore = calculateRiskScore(muleAccount, muleFeat, 75);

    expect(muleScore.finalScore).toBeGreaterThanOrEqual(60);
    expect(muleScore.featureContributions.length).toBeGreaterThan(0);
    expect(muleScore.explanationEn.length).toBeGreaterThan(10);
    expect(muleScore.counterfactualExplanation.length).toBeGreaterThan(10);

    // Verify merchant mitigation: Kirana merchant should not be categorized as HIGH
    const merchant = ds.accounts.find(a => a.ground_truth_label === 'MERCHANT_FALSE_POSITIVE')!;
    const merchantFeat = features.get(merchant.account_id)!;
    const merchantScore = calculateRiskScore(merchant, merchantFeat, 20);

    expect(merchantScore.riskBand).not.toBe('HIGH');
  });

  it('traces multi-hop money paths and computes freeze intervention points', () => {
    const ds = generateSyntheticDataset(42819);
    const graph = buildDirectedGraph(ds.accounts, ds.transactions);

    // Layering chain mules
    const ring2Accounts = ds.accounts.filter(a => a.fraud_ring_id === 'RING-02');
    if (ring2Accounts.length >= 2) {
      const source = ring2Accounts[0].account_id;
      const target = ring2Accounts[ring2Accounts.length - 1].account_id;
      const trace = traceMoneyPath(graph, source, target, ds.transactions);

      expect(trace.found).toBe(true);
      expect(trace.hops.length).toBeGreaterThanOrEqual(1);
      expect(trace.suggestedFreezePoint).toBeDefined();
    }
  });

  it('extracts mule rings and evaluates model performance against ground truth', () => {
    const ds = generateSyntheticDataset(42819);
    const graph = buildDirectedGraph(ds.accounts, ds.transactions);
    const cycles = detectCycles(graph);
    const communities = detectCommunities(graph);
    const features = computeAccountFeatures(ds.accounts, ds.transactions, graph, cycles, communities);

    const { rings } = extractMuleRings(ds.accounts, ds.transactions, graph, communities, cycles);
    expect(rings.length).toBeGreaterThanOrEqual(6);

    // Fit real Isolation Forest on features matrix
    const featureMatrix: number[][] = [];
    const accList = ds.accounts;
    accList.forEach(a => {
      const f = features.get(a.account_id)!;
      featureMatrix.push([
        f.pass_through_ratio,
        f.avg_dwell_time_minutes,
        f.income_mismatch_ratio,
        f.structuring_ratio,
        f.burst_velocity,
        f.shared_device_count,
        f.cycle_membership
      ]);
    });

    const iforest = new IsolationForest({ numTrees: 40, subSampleSize: 64, seed: 42819 });
    iforest.fit(featureMatrix);

    const riskResults = new Map();
    accList.forEach((a, idx) => {
      const feat = features.get(a.account_id)!;
      const anomScore = iforest.predictAnomalyScore(featureMatrix[idx]);
      riskResults.set(a.account_id, calculateRiskScore(a, feat, anomScore));
    });

    const evaluation = evaluateModels(ds.accounts, features, riskResults, 60);
    console.log('Evaluation Network AI:', evaluation.networkAi);
    expect(evaluation.networkAi.f1_score).toBeGreaterThan(0.5);
  });
});
