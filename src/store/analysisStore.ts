import { create } from 'zustand';
import { Account, Transaction, AccountFeatures, RiskScoreResult, MuleRing, ModelMetrics } from '../types';
import { DirectedGraph, buildDirectedGraph } from '../engine/graphBuilder';
import { CycleResult, detectCycles } from '../engine/cycleDetection';
import { CommunityResult, detectCommunities } from '../engine/communityDetection';
import { computeAccountFeatures } from '../engine/featureEngineering';
import { IsolationForest } from '../engine/isolationForest';
import { calculateRiskScore } from '../engine/muleScoring';
import { extractMuleRings, RingDna } from '../engine/ringDetection';
import { evaluateModels, ModelComparison } from '../engine/modelEvaluation';

interface AnalysisState {
  graph: DirectedGraph | null;
  features: Map<string, AccountFeatures>;
  riskResults: Map<string, RiskScoreResult>;
  rings: MuleRing[];
  ringDnas: Map<string, RingDna>;
  cycles: CycleResult | null;
  communities: CommunityResult | null;
  evaluation: ModelComparison | null;
  isAnalyzing: boolean;
  lastAnalyzedAt: string | null;

  // Threshold controls
  highThreshold: number;
  reviewThreshold: number;
  fusionWeightBehavior: number;
  fusionWeightAnomaly: number;

  // Actions
  runAnalysis: (accounts: Account[], transactions: Transaction[]) => void;
  setHighThreshold: (th: number, accounts: Account[]) => void;
  setReviewThreshold: (th: number, accounts: Account[]) => void;
  setFusionWeights: (behavior: number, anomaly: number, accounts: Account[]) => void;
  recalculateSingleAccount: (account: Account) => RiskScoreResult | undefined;
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  graph: null,
  features: new Map(),
  riskResults: new Map(),
  rings: [],
  ringDnas: new Map(),
  cycles: null,
  communities: null,
  evaluation: null,
  isAnalyzing: false,
  lastAnalyzedAt: null,

  highThreshold: 66,
  reviewThreshold: 35,
  fusionWeightBehavior: 0.6,
  fusionWeightAnomaly: 0.4,

  runAnalysis: (accounts: Account[], transactions: Transaction[]) => {
    set({ isAnalyzing: true });

    // Execute in microtask/setTimeout to prevent UI freezing
    setTimeout(() => {
      const graph = buildDirectedGraph(accounts, transactions);
      const cycles = detectCycles(graph);
      const communities = detectCommunities(graph);
      const features = computeAccountFeatures(accounts, transactions, graph, cycles, communities);

      // Build feature matrix for Isolation Forest
      const featureMatrix: number[][] = [];
      const accList = accounts;

      accList.forEach(acc => {
        const f = features.get(acc.account_id);
        if (f) {
          featureMatrix.push([
            f.pass_through_ratio,
            Math.log10(Math.max(1, f.avg_dwell_time_minutes)),
            f.income_mismatch_ratio,
            f.structuring_ratio,
            f.burst_velocity,
            f.shared_device_count,
            f.cycle_membership,
            f.night_ratio,
            f.rapid_transfers_count
          ]);
        } else {
          featureMatrix.push([0, 3, 1, 0, 1, 0, 0, 0, 0]);
        }
      });

      const iForest = new IsolationForest({ numTrees: 50, subSampleSize: 128, seed: 42819 });
      iForest.fit(featureMatrix);
      const anomalyScores = iForest.predictBatch(featureMatrix);

      const riskResults = new Map<string, RiskScoreResult>();
      const state = get();

      accList.forEach((acc, idx) => {
        const feat = features.get(acc.account_id)!;
        const anom = anomalyScores[idx];
        const score = calculateRiskScore(
          acc,
          feat,
          anom,
          state.fusionWeightBehavior,
          state.fusionWeightAnomaly,
          state.highThreshold,
          state.reviewThreshold
        );
        riskResults.set(acc.account_id, score);
      });

      const { rings, ringDnas } = extractMuleRings(accounts, transactions, graph, communities, cycles);
      const evaluation = evaluateModels(accounts, features, riskResults, state.highThreshold);

      set({
        graph,
        cycles,
        communities,
        features,
        riskResults,
        rings,
        ringDnas,
        evaluation,
        isAnalyzing: false,
        lastAnalyzedAt: new Date().toISOString()
      });
    }, 50);
  },

  setHighThreshold: (highThreshold: number, accounts: Account[]) => {
    set({ highThreshold });
    const { features, riskResults, fusionWeightBehavior, fusionWeightAnomaly, reviewThreshold } = get();
    if (features.size === 0) return;

    const updated = new Map<string, RiskScoreResult>();
    accounts.forEach(acc => {
      const feat = features.get(acc.account_id);
      const existing = riskResults.get(acc.account_id);
      if (feat && existing) {
        const recalced = calculateRiskScore(
          acc,
          feat,
          existing.anomalyScore,
          fusionWeightBehavior,
          fusionWeightAnomaly,
          highThreshold,
          reviewThreshold
        );
        updated.set(acc.account_id, recalced);
      }
    });

    const evaluation = evaluateModels(accounts, features, updated, highThreshold);
    set({ riskResults: updated, evaluation });
  },

  setReviewThreshold: (reviewThreshold: number, accounts: Account[]) => {
    set({ reviewThreshold });
    const { features, riskResults, fusionWeightBehavior, fusionWeightAnomaly, highThreshold } = get();
    if (features.size === 0) return;

    const updated = new Map<string, RiskScoreResult>();
    accounts.forEach(acc => {
      const feat = features.get(acc.account_id);
      const existing = riskResults.get(acc.account_id);
      if (feat && existing) {
        const recalced = calculateRiskScore(
          acc,
          feat,
          existing.anomalyScore,
          fusionWeightBehavior,
          fusionWeightAnomaly,
          highThreshold,
          reviewThreshold
        );
        updated.set(acc.account_id, recalced);
      }
    });

    set({ riskResults: updated });
  },

  setFusionWeights: (fusionWeightBehavior: number, fusionWeightAnomaly: number, accounts: Account[]) => {
    set({ fusionWeightBehavior, fusionWeightAnomaly });
    const { features, riskResults, highThreshold, reviewThreshold } = get();
    if (features.size === 0) return;

    const updated = new Map<string, RiskScoreResult>();
    accounts.forEach(acc => {
      const feat = features.get(acc.account_id);
      const existing = riskResults.get(acc.account_id);
      if (feat && existing) {
        const recalced = calculateRiskScore(
          acc,
          feat,
          existing.anomalyScore,
          fusionWeightBehavior,
          fusionWeightAnomaly,
          highThreshold,
          reviewThreshold
        );
        updated.set(acc.account_id, recalced);
      }
    });

    const evaluation = evaluateModels(accounts, features, updated, highThreshold);
    set({ riskResults: updated, evaluation });
  },

  recalculateSingleAccount: (account: Account) => {
    const { features, riskResults, fusionWeightBehavior, fusionWeightAnomaly, highThreshold, reviewThreshold } = get();
    const feat = features.get(account.account_id);
    const existing = riskResults.get(account.account_id);
    if (!feat || !existing) return undefined;

    const recalced = calculateRiskScore(
      account,
      feat,
      existing.anomalyScore,
      fusionWeightBehavior,
      fusionWeightAnomaly,
      highThreshold,
      reviewThreshold
    );
    riskResults.set(account.account_id, recalced);
    set({ riskResults: new Map(riskResults) });
    return recalced;
  }
}));
