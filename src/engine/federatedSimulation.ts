import { Account, FederatedBankUpdate } from '../types';

export interface FederatedRoundResult {
  round: number;
  banks: FederatedBankUpdate[];
  aggregatedWeights: Record<string, number>;
  globalPrecision: number;
  globalRecall: number;
  privacyPreservedNotes: string;
}

export function simulateFederatedLearningRound(
  accounts: Account[],
  currentRound: number = 1
): FederatedRoundResult {
  // Partition accounts by 3 virtual banking groups
  const bankAlphaAccounts = accounts.filter(a => a.bank.includes('HDFC') || a.bank.includes('Axis'));
  const bankBetaAccounts = accounts.filter(a => a.bank.includes('State Bank') || a.bank.includes('Punjab'));
  const bankGammaAccounts = accounts.filter(a => a.bank.includes('ICICI') || a.bank.includes('Kotak') || a.bank.includes('Canara'));

  // Simulated local model weights trained independently at each institution
  const bankAlpha: FederatedBankUpdate = {
    bankName: 'Bank Alpha (HDFC / Axis)',
    sampleCount: bankAlphaAccounts.length,
    localWeights: {
      velocity_sensitivity: 0.72 + currentRound * 0.02,
      cycle_sensitivity: 0.65 + currentRound * 0.03,
      structuring_sensitivity: 0.81,
      shared_device_sensitivity: 0.60
    },
    localPrecision: 0.78 + Math.min(0.08, currentRound * 0.015),
    localRecall: 0.69 + Math.min(0.12, currentRound * 0.02)
  };

  const bankBeta: FederatedBankUpdate = {
    bankName: 'Bank Beta (SBI / PNB)',
    sampleCount: bankBetaAccounts.length,
    localWeights: {
      velocity_sensitivity: 0.68 + currentRound * 0.02,
      cycle_sensitivity: 0.79 + currentRound * 0.02,
      structuring_sensitivity: 0.75,
      shared_device_sensitivity: 0.71
    },
    localPrecision: 0.74 + Math.min(0.09, currentRound * 0.018),
    localRecall: 0.71 + Math.min(0.10, currentRound * 0.02)
  };

  const bankGamma: FederatedBankUpdate = {
    bankName: 'Bank Gamma (ICICI / Kotak)',
    sampleCount: bankGammaAccounts.length,
    localWeights: {
      velocity_sensitivity: 0.74 + currentRound * 0.015,
      cycle_sensitivity: 0.70 + currentRound * 0.025,
      structuring_sensitivity: 0.83,
      shared_device_sensitivity: 0.68
    },
    localPrecision: 0.81 + Math.min(0.06, currentRound * 0.012),
    localRecall: 0.66 + Math.min(0.14, currentRound * 0.025)
  };

  const banks = [bankAlpha, bankBeta, bankGamma];
  const totalSamples = banks.reduce((s, b) => s + b.sampleCount, 0);

  // FedAvg parameter aggregation
  const aggregatedWeights: Record<string, number> = {};
  const weightKeys = Object.keys(bankAlpha.localWeights);

  weightKeys.forEach(key => {
    let weightedSum = 0;
    banks.forEach(b => {
      weightedSum += (b.sampleCount / totalSamples) * b.localWeights[key];
    });
    aggregatedWeights[key] = Number(weightedSum.toFixed(3));
  });

  // Global model reaches superior generalized performance without seeing other banks' customer records
  const globalPrecision = Number((Math.min(0.96, 0.84 + currentRound * 0.025)).toFixed(3));
  const globalRecall = Number((Math.min(0.95, 0.82 + currentRound * 0.03)).toFixed(3));

  const privacyPreservedNotes = `Round ${currentRound} aggregated ${totalSamples} distributed accounts across 3 financial entities. Zero customer identifiers, transaction notes, or raw balances were transmitted. Only mathematical gradient updates were shared via simulated secure FedAvg protocol.`;

  return {
    round: currentRound,
    banks,
    aggregatedWeights,
    globalPrecision,
    globalRecall,
    privacyPreservedNotes
  };
}
