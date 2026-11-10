import React, { useState } from 'react';
import { 
  BellRing, ShieldAlert, CheckCircle, ExternalLink, 
  FileText, CheckCircle2, Download, Search, Filter, ShieldCheck, History
} from 'lucide-react';
import { useInvestigationStore } from '../../store/investigationStore';
import { useUiStore } from '../../store/uiStore';
import { RiskBadge } from '../../components/common/RiskBadge';
import { AlertStatus } from '../../types';
import Papa from 'papaparse';

import { FreezeImpactSimulator } from '../../components/investigation/FreezeImpactSimulator';

export const AlertQueuePage: React.FC = () => {
  const { alerts, auditLogs, simulateFreeze, escalateTo1930, requestKyc, markFalsePositive, selectAccount } = useInvestigationStore();
  const { setDrawerOpen, addToast } = useUiStore();

  const [activeTab, setActiveTab] = useState<'queue' | 'audit'>('queue');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    if (filterSeverity !== 'ALL' && a.risk_level !== filterSeverity) return false;
    return true;
  });

  const handleExportAuditLedger = () => {
    const csvStr = Papa.unparse(auditLogs);
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `muletrace_evidence_ledger_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-bold text-white tracking-tight">
              Operational Alert Queue & Evidence Ledger
            </h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
              {alerts.length} Total Alerts
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Prioritized case triage queue with simulated law enforcement escalation (NCRP / 1930) and tamper-evident audit ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1 rounded-md transition ${activeTab === 'queue' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'}`}
            >
              Alert Queue ({filteredAlerts.length})
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1 rounded-md transition ${activeTab === 'audit' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'}`}
            >
              Audit Ledger ({auditLogs.length})
            </button>
          </div>

          {activeTab === 'audit' && (
            <button
              onClick={handleExportAuditLedger}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" /> Export Ledger
            </button>
          )}
        </div>
      </div>

      {activeTab === 'queue' ? (
        <>
          {/* Feature I: Freeze Impact Simulator */}
          <FreezeImpactSimulator />

          {/* Filters Bar */}
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <select
                value={filterSeverity}
                onChange={e => setFilterSeverity(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical Severity (&gt;= 85)</option>
                <option value="HIGH">High Severity (66-84)</option>
                <option value="MEDIUM">Medium / Review</option>
              </select>

              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open (Pending Review)</option>
                <option value="FROZEN_SIMULATED">Simulated Freeze</option>
                <option value="ESCALATED_1930">Escalated to 1930</option>
                <option value="KYC_REQUESTED">KYC Requested</option>
                <option value="FALSE_POSITIVE">False Positive</option>
              </select>
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              Showing {filteredAlerts.length} triage records
            </div>
          </div>

          {/* Alert Queue Cards List */}
          <div className="space-y-3">
            {filteredAlerts.map(alert => {
              const isCritical = alert.risk_level === 'CRITICAL';
              return (
                <div
                  key={alert.alert_id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCritical
                      ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500/70 shadow-lg shadow-rose-950/20'
                      : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400">{alert.alert_id}</span>
                        <button
                          onClick={() => {
                            selectAccount(alert.account_id);
                            setDrawerOpen(true);
                          }}
                          className="font-mono text-sm font-bold text-cyan-300 hover:underline"
                        >
                          {alert.account_id}
                        </button>
                        <RiskBadge band={isCritical ? 'CRITICAL' : 'HIGH'} score={alert.risk_score} size="sm" />
                        {alert.ring_id && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            {alert.ring_id}
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {alert.detection_reason}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-1">
                        <span>Suspected Exposure: <strong className="text-white">₹{alert.amount_involved.toLocaleString('en-IN')}</strong></span>
                        <span>Current Status: <strong className="text-cyan-400">{alert.status}</strong></span>
                      </div>
                    </div>

                    {/* Analyst Simulation Action Buttons */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          simulateFreeze(alert.account_id);
                          addToast('danger', 'Simulated Freeze Enforced', `Hold logged for ${alert.account_id}`);
                        }}
                        className="px-2.5 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/50 text-rose-300 rounded-lg text-xs font-mono font-semibold flex items-center gap-1 transition"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" /> Freeze
                      </button>

                      <button
                        onClick={() => {
                          escalateTo1930(alert.account_id);
                          addToast('warning', 'Escalated to Cybercrime 1930', `Docket generated for ${alert.account_id}`);
                        }}
                        className="px-2.5 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/50 text-amber-300 rounded-lg text-xs font-mono font-semibold flex items-center gap-1 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> 1930
                      </button>

                      <button
                        onClick={() => {
                          requestKyc(alert.account_id);
                          addToast('info', 'Re-KYC Dispatched', `Verification requested for ${alert.account_id}`);
                        }}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-xs font-mono transition"
                      >
                        Re-KYC
                      </button>

                      <button
                        onClick={() => {
                          markFalsePositive(alert.account_id);
                          addToast('success', 'False Positive Marked', `${alert.account_id} cleared by analyst.`);
                        }}
                        className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 rounded-lg text-xs font-mono transition"
                      >
                        Clear FP
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Audit Evidence Ledger View */
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <h3 className="font-heading font-bold text-white text-sm">Chronological Forensic Audit Trail</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Tamper-Evident Ledger</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Action</th>
                  <th className="py-2.5 px-4">Target Entity</th>
                  <th className="py-2.5 px-4">State Transition</th>
                  <th className="py-2.5 px-4">Operational Rationale</th>
                  <th className="py-2.5 px-4">Officer ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-2.5 px-4 text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="py-2.5 px-4 font-bold text-cyan-300">{log.action}</td>
                    <td className="py-2.5 px-4 text-white font-bold">{log.entity_id}</td>
                    <td className="py-2.5 px-4 text-[11px]">
                      <span className="text-slate-500">{log.previous_status}</span> &rarr;{' '}
                      <span className="text-emerald-400 font-semibold">{log.new_status}</span>
                    </td>
                    <td className="py-2.5 px-4 text-[11px] font-sans text-slate-300 max-w-xs">{log.reason}</td>
                    <td className="py-2.5 px-4 text-slate-400">{log.analyst}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
