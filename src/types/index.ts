export type KycLevel = 'FULL' | 'MINIMUM' | 'SIMPLIFIED';
export type AgeGroup = '18-25' | '26-35' | '36-50' | '51+';
export type Region = 'North' | 'South' | 'West' | 'East' | 'Central';
export type AccountType = 'SAVINGS' | 'CURRENT' | 'SALARY' | 'MERCHANT' | 'STUDENT';
export type GroundTruthLabel = 'MULE' | 'NORMAL' | 'VICTIM' | 'MERCHANT_FALSE_POSITIVE';
export type FraudPatternType = 
  | 'FAN_IN_FAN_OUT' 
  | 'LAYERING_CHAIN' 
  | 'CIRCULAR_FLOW' 
  | 'STRUCTURING' 
  | 'SHARED_DEVICE' 
  | 'NEW_ACCOUNT_BURST' 
  | 'NONE';

export interface Account {
  account_id: string;
  upi_id: string;
  holder_name: string;
  bank: string;
  city: string;
  account_age_days: number;
  kyc_level: KycLevel;
  device_id: string;
  ip_cluster: string;
  declared_monthly_income: number;
  age_group: AgeGroup;
  region: Region;
  account_type: AccountType;
  ground_truth_label: GroundTruthLabel;
  fraud_ring_id?: string;
  plant_pattern?: FraudPatternType;
  created_at: string;
}

export type ChannelType = 
  | 'UPI' 
  | 'IMPS' 
  | 'NEFT' 
  | 'ATM_WITHDRAWAL' 
  | 'MERCHANT_TRANSFER' 
  | 'DIGITAL_ASSET_CASHOUT';

export type TxnStatus = 'COMPLETED' | 'FLAGGED' | 'BLOCKED';

export interface Transaction {
  txn_id: string;
  timestamp: string;
  from_account: string;
  to_account: string;
  amount: number;
  channel: ChannelType;
  transaction_status: TxnStatus;
  transaction_note: string;
  reference_id: string;
  is_suspicious?: boolean;
}

export interface AccountFeatures {
  account_id: string;
  in_degree: number;
  out_degree: number;
  unique_senders: number;
  unique_receivers: number;
  total_incoming: number;
  total_outgoing: number;
  pass_through_ratio: number;
  avg_dwell_time_minutes: number;
  min_dwell_time_minutes: number;
  account_age_days: number;
  age_volume_ratio: number;
  income_mismatch_ratio: number;
  round_amount_ratio: number;
  structuring_ratio: number;
  night_ratio: number;
  burst_velocity: number;
  shared_device_count: number;
  shared_ip_count: number;
  cycle_membership: number; // 1 if in detected cycle, 0 if not
  centrality_score: number;
  connected_component_size: number;
  suspicious_neighbors_count: number;
  money_movement_depth: number;
  rapid_transfers_count: number;
}

export type RiskBand = 'LOW' | 'REVIEW' | 'HIGH';

export interface FeatureContribution {
  featureKey: keyof AccountFeatures;
  label: string;
  value: number;
  formattedValue: string;
  contribution: number; // +ve means adds to risk, -ve means lowers risk
  reason: string;
  direction: 'RISK_INCREASE' | 'RISK_DECREASE' | 'NEUTRAL';
}

export interface RiskScoreResult {
  account_id: string;
  graphBehaviorScore: number; // 0-100
  anomalyScore: number;       // 0-100 (from Isolation Forest)
  finalScore: number;         // fused 0-100
  riskBand: RiskBand;
  featureContributions: FeatureContribution[];
  explanationEn: string;
  explanationHi: string;
  explanationKn: string;
  counterfactualExplanation: string;
  recommendedAction: string;
  isRecruitmentSuspect?: boolean;
  onboardingRisk?: number;
}

export interface MuleRing {
  ring_id: string;
  member_accounts: string[];
  total_transactions: number;
  total_incoming: number;
  total_outgoing: number;
  money_currently_in_network: number;
  money_moved_out: number;
  avg_velocity: number;
  ring_risk_score: number;
  dominant_patterns: FraudPatternType[];
  evidence_summary: string;
  first_detected_date: string;
  last_activity_date: string;
}

export type AlertStatus = 
  | 'OPEN' 
  | 'FROZEN_SIMULATED' 
  | 'ESCALATED_1930' 
  | 'KYC_REQUESTED' 
  | 'FALSE_POSITIVE' 
  | 'CLOSED';

export interface Alert {
  alert_id: string;
  account_id: string;
  ring_id?: string;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  risk_score: number;
  amount_involved: number;
  detection_reason: string;
  timestamp: string;
  status: AlertStatus;
  analyst_notes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  entity_id: string;
  previous_status: string;
  new_status: string;
  reason: string;
  analyst: string;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  tpr: number;
  fpr: number;
  true_positives: number;
  false_positives: number;
  true_negatives: number;
  false_negatives: number;
  roc_points: { fpr: number; tpr: number; threshold: number }[];
}

export interface FederatedBankUpdate {
  bankName: string;
  sampleCount: number;
  localWeights: Record<string, number>;
  localPrecision: number;
  localRecall: number;
}
