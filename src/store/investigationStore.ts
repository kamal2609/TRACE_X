import { create } from 'zustand';
import { Alert, AuditLogEntry, AlertStatus, RiskScoreResult, Account } from '../types';

interface InvestigationState {
  alerts: Alert[];
  auditLogs: AuditLogEntry[];
  selectedAccountId: string | null;
  selectedRingId: string | null;
  traceSourceId: string | null;
  traceTargetId: string | null;

  // Actions
  selectAccount: (accountId: string | null) => void;
  selectRing: (ringId: string | null) => void;
  setTraceEndpoints: (sourceId: string | null, targetId: string | null) => void;
  syncAlertsFromRisk: (riskResults: Map<string, RiskScoreResult>, accounts: Account[]) => void;
  updateAlertStatus: (alertId: string, status: AlertStatus, reason: string) => void;
  simulateFreeze: (accountId: string, reason?: string) => void;
  escalateTo1930: (accountId: string, reason?: string) => void;
  requestKyc: (accountId: string, reason?: string) => void;
  markFalsePositive: (accountId: string, reason?: string) => void;
  addAnalystNote: (accountId: string, note: string) => void;
  clearAuditLogs: () => void;
}

export const useInvestigationStore = create<InvestigationState>((set, get) => ({
  alerts: [],
  auditLogs: [
    {
      id: 'LOG-INIT-1',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      action: 'SYSTEM_BOOT',
      entity_id: 'SYSTEM',
      previous_status: 'INITIALIZING',
      new_status: 'ACTIVE',
      reason: 'MuleTrace AI forensic audit ledger initialized with tamper-evident simulation log.',
      analyst: 'SEC-OPS-01'
    }
  ],
  selectedAccountId: null,
  selectedRingId: null,
  traceSourceId: 'AC-1001',
  traceTargetId: 'AC-CASHOUT-ATM',

  selectAccount: (accountId: string | null) => set({ selectedAccountId: accountId }),
  selectRing: (ringId: string | null) => set({ selectedRingId: ringId }),
  setTraceEndpoints: (sourceId: string | null, targetId: string | null) => set({ traceSourceId: sourceId, traceTargetId: targetId }),

  syncAlertsFromRisk: (riskResults: Map<string, RiskScoreResult>, accounts: Account[]) => {
    const accMap = new Map(accounts.map(a => [a.account_id, a]));
    const currentAlerts = get().alerts;
    const existingMap = new Map(currentAlerts.map(a => [a.account_id, a]));

    const newAlerts: Alert[] = [];
    let alertSeq = 101;

    riskResults.forEach((res, accId) => {
      if (res.riskBand === 'HIGH' || res.riskBand === 'REVIEW') {
        const existing = existingMap.get(accId);
        const acc = accMap.get(accId);

        if (existing) {
          newAlerts.push({
            ...existing,
            risk_score: res.finalScore,
            risk_level: res.finalScore >= 85 ? 'CRITICAL' : res.riskBand === 'HIGH' ? 'HIGH' : 'MEDIUM',
            detection_reason: res.explanationEn
          });
        } else {
          newAlerts.push({
            alert_id: `ALT-${alertSeq++}`,
            account_id: accId,
            ring_id: acc?.fraud_ring_id,
            risk_level: res.finalScore >= 85 ? 'CRITICAL' : res.riskBand === 'HIGH' ? 'HIGH' : 'MEDIUM',
            risk_score: res.finalScore,
            amount_involved: 75000 + Math.round(res.finalScore * 2500),
            detection_reason: res.explanationEn,
            timestamp: new Date().toISOString(),
            status: 'OPEN'
          });
        }
      }
    });

    // Sort by risk score descending
    newAlerts.sort((a, b) => b.risk_score - a.risk_score);
    set({ alerts: newAlerts });
  },

  updateAlertStatus: (alertId: string, status: AlertStatus, reason: string) => {
    const { alerts, auditLogs } = get();
    const alert = alerts.find(a => a.alert_id === alertId);
    if (!alert) return;

    const prevStatus = alert.status;
    const updatedAlerts = alerts.map(a => a.alert_id === alertId ? { ...a, status } : a);

    const logEntry: AuditLogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      action: `STATUS_CHANGE_TO_${status}`,
      entity_id: alert.account_id,
      previous_status: prevStatus,
      new_status: status,
      reason,
      analyst: 'SENIOR_INVESTIGATOR_ID_88'
    };

    set({ alerts: updatedAlerts, auditLogs: [logEntry, ...auditLogs] });
  },

  simulateFreeze: (accountId: string, reason: string = 'Automated risk score exceeded critical safety threshold.') => {
    const { alerts, auditLogs } = get();
    const updatedAlerts = alerts.map(a => a.account_id === accountId ? { ...a, status: 'FROZEN_SIMULATED' as AlertStatus } : a);

    const logEntry: AuditLogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      action: 'SIMULATED_DEBIT_FREEZE',
      entity_id: accountId,
      previous_status: 'ACTIVE_DEBITS',
      new_status: 'SIMULATED_FREEZE',
      reason: `${reason} [Note: Demonstration simulation only; no actual core banking freeze executed]`,
      analyst: 'FRAUD_OPS_ANALYST'
    };

    set({ alerts: updatedAlerts, auditLogs: [logEntry, ...auditLogs] });
  },

  escalateTo1930: (accountId: string, reason: string = 'High confidence coordinated mule network detected.') => {
    const { alerts, auditLogs } = get();
    const updatedAlerts = alerts.map(a => a.account_id === accountId ? { ...a, status: 'ESCALATED_1930' as AlertStatus } : a);

    const logEntry: AuditLogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      action: 'ESCALATE_TO_CYBER_CELL_1930',
      entity_id: accountId,
      previous_status: 'INTERNAL_REVIEW',
      new_status: 'ESCALATED_1930',
      reason: `${reason} [Docket submitted to Indian Cyber Crime Reporting Portal (NCRP) / National Helpline 1930 reference pipeline]`,
      analyst: 'COMPLIANCE_OFFICER_AML'
    };

    set({ alerts: updatedAlerts, auditLogs: [logEntry, ...auditLogs] });
  },

  requestKyc: (accountId: string, reason: string = 'Profile income mismatch or suspicious counterparty activity.') => {
    const { alerts, auditLogs } = get();
    const updatedAlerts = alerts.map(a => a.account_id === accountId ? { ...a, status: 'KYC_REQUESTED' as AlertStatus } : a);

    const logEntry: AuditLogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      action: 'REQUEST_RE_KYC',
      entity_id: accountId,
      previous_status: 'VERIFIED_KYC',
      new_status: 'PENDING_RE_VERIFICATION',
      reason,
      analyst: 'KYC_OPERATIONS'
    };

    set({ alerts: updatedAlerts, auditLogs: [logEntry, ...auditLogs] });
  },

  markFalsePositive: (accountId: string, reason: string = 'Analyst confirmed legitimate commercial retail merchant activity.') => {
    const { alerts, auditLogs } = get();
    const updatedAlerts = alerts.map(a => a.account_id === accountId ? { ...a, status: 'FALSE_POSITIVE' as AlertStatus } : a);

    const logEntry: AuditLogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      action: 'MARK_FALSE_POSITIVE',
      entity_id: accountId,
      previous_status: 'FLAGGED',
      new_status: 'WHITELISTED_REVIEWED',
      reason,
      analyst: 'SENIOR_FRAUD_LEAD'
    };

    set({ alerts: updatedAlerts, auditLogs: [logEntry, ...auditLogs] });
  },

  addAnalystNote: (accountId: string, note: string) => {
    const { alerts, auditLogs } = get();
    const updatedAlerts = alerts.map(a => a.account_id === accountId ? { ...a, analyst_notes: note } : a);

    const logEntry: AuditLogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      action: 'ANALYST_CASE_NOTE_ADDED',
      entity_id: accountId,
      previous_status: 'NOTE_PENDING',
      new_status: 'NOTE_RECORDED',
      reason: note,
      analyst: 'CASE_INVESTIGATOR'
    };

    set({ alerts: updatedAlerts, auditLogs: [logEntry, ...auditLogs] });
  },

  clearAuditLogs: () => set({ auditLogs: [] })
}));
