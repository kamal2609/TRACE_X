import React, { useState } from 'react';
import { 
  X, ShieldAlert, ArrowUpRight, ArrowDownLeft, Clock, 
  Smartphone, Wifi, FileText, CheckCircle2, UserCheck, 
  ExternalLink, Send, HelpCircle, ShieldAlert as ShieldIcon
} from 'lucide-react';
import { useInvestigationStore } from '../../store/investigationStore';
import { useAnalysisStore } from '../../store/analysisStore';
import { useDatasetStore } from '../../store/datasetStore';
import { useUiStore } from '../../store/uiStore';
import { RiskBadge } from '../common/RiskBadge';

export const AccountDrawer: React.FC = () => {
  const { selectedAccountId, selectAccount, simulateFreeze, escalateTo1930, requestKyc, markFalsePositive, addAnalystNote } = useInvestigationStore();
  const { riskResults, features, graph } = useAnalysisStore();
  const { accounts, transactions } = useDatasetStore();
  const { isDrawerOpen, setDrawerOpen, addToast } = useUiStore();
  const [noteText, setNoteText] = useState('');

  if (!isDrawerOpen || !selectedAccountId) return null;

  const account = accounts.find(a => a.account_id === selectedAccountId);
  const result = riskResults.get(selectedAccountId);
  const feat = features.get(selectedAccountId);

  if (!account || !result || !feat) return null;

  // Find incoming & outgoing transactions for this account
  const relatedTxns = transactions.filter(
    t => t.from_account === selectedAccountId || t.to_account === selectedAccountId
  ).slice(0, 15);

  const handleFreeze = () => {
    simulateFreeze(account.account_id);
    addToast('danger', 'Simulated Freeze Enforced', `Debit hold simulated for ${account.account_id} (${account.holder_name}).`);
  };

  const handleEscalate = () => {
    escalateTo1930(account.account_id);
    addToast('warning', 'Escalated to Cybercrime Cell', `Docket forwarded to Indian Cyber Crime Reporting Portal (1930 reference).`);
  };

  const handleKyc = () => {
    requestKyc(account.account_id);
    addToast('info', 'Re-KYC Notice Issued', `Verification dispatch sent to ${account.bank}.`);
  };

  const handleFalsePositive = () => {
    markFalsePositive(account.account_id);
    addToast('success', 'False Positive Logged', `${account.account_id} marked as verified legitimate.`);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addAnalystNote(account.account_id, noteText.trim());
    addToast('info', 'Case Note Recorded', 'Forensic observation committed to evidence ledger.');
    setNoteText('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-slate-900 border-l border-slate-700/70 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/60 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-base font-bold text-white tracking-wide">{account.account_id}</h3>
              <RiskBadge band={result.riskBand} score={result.finalScore} size="sm" />
            </div>
            <p className="text-xs text-slate-400 font-sans">{account.holder_name} • {account.bank}</p>
          </div>
        </div>
        <button
          onClick={() => setDrawerOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Recruitment Warning Banner if applicable */}
        {result.isRecruitmentSuspect && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3">
            <ShieldIcon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300 uppercase tracking-wide">Mule Recruitment Indicator:</span>
              <p className="mt-0.5 text-slate-300 leading-relaxed">
                Account holder is {account.age_group} with declared income ₹{account.declared_monthly_income.toLocaleString('en-IN')}, suddenly receiving disproportionate credit surges. High likelihood of recruited / coerced student or gig-worker mule.
              </p>
            </div>
          </div>
        )}

        {/* Score & Risk Fusion Gauge */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="text-center border-r border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Final Risk</span>
            <div className="text-2xl font-bold font-mono text-white mt-0.5">{result.finalScore}</div>
            <span className="text-[10px] text-slate-500 font-mono">Fused 100 pt</span>
          </div>
          <div className="text-center border-r border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Network/Behavior</span>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-0.5">{result.graphBehaviorScore}</div>
            <span className="text-[10px] text-slate-500 font-mono">Weight 60%</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Isolation Forest</span>
            <div className="text-2xl font-bold font-mono text-indigo-400 mt-0.5">{result.anomalyScore}</div>
            <span className="text-[10px] text-slate-500 font-mono">Weight 40%</span>
          </div>
        </div>

        {/* Account Profile Metadata */}
        <div className="rounded-xl bg-slate-950/40 border border-slate-800/80 p-4 space-y-2.5 text-xs">
          <h4 className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider font-mono">Account Profile</h4>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-slate-300">
            <div><span className="text-slate-500">UPI Handle:</span> <span className="font-mono text-slate-200">{account.upi_id}</span></div>
            <div><span className="text-slate-500">KYC Status:</span> <span className="font-mono text-slate-200">{account.kyc_level} KYC</span></div>
            <div><span className="text-slate-500">Account Age:</span> <span className="font-mono text-slate-200">{account.account_age_days} days</span></div>
            <div><span className="text-slate-500">City / Region:</span> <span className="font-mono text-slate-200">{account.city} ({account.region})</span></div>
            <div><span className="text-slate-500">Declared Income:</span> <span className="font-mono text-slate-200">₹{account.declared_monthly_income.toLocaleString('en-IN')}/mo</span></div>
            <div><span className="text-slate-500">Account Type:</span> <span className="font-mono text-slate-200">{account.account_type}</span></div>
            <div><span className="text-slate-500">Device ID:</span> <span className="font-mono text-slate-200">{account.device_id}</span></div>
            <div><span className="text-slate-500">IP Subnet:</span> <span className="font-mono text-slate-200">{account.ip_cluster}</span></div>
          </div>
        </div>

        {/* Feature Attribution (SHAP-inspired) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider font-mono">
              Risk Attribution Breakdown
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">SHAP-inspired weights</span>
          </div>

          <div className="space-y-2">
            {result.featureContributions.map((contrib, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-200">{contrib.label}</span>
                  <span className={`font-mono font-bold ${contrib.contribution > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {contrib.contribution > 0 ? `+${contrib.contribution} pts` : `${contrib.contribution} pts`}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                  <span>{contrib.reason}</span>
                  <span className="font-mono text-slate-300 ml-2 shrink-0">{contrib.formattedValue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Counterfactual Explanation */}
        <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-cyan-300 font-semibold font-mono text-[11px] uppercase tracking-wide">
            <HelpCircle className="w-3.5 h-3.5" /> What would lower this score?
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">{result.counterfactualExplanation}</p>
        </div>

        {/* Plain Language Deterministic Reasoning */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
          <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] font-mono">Forensic Analyst Summary</h4>
          <p className="text-slate-300 leading-relaxed">{result.explanationEn}</p>
          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Action Recommendation:</span> {result.recommendedAction}
          </div>
        </div>

        {/* Transaction History Snapshot */}
        <div className="space-y-2.5">
          <h4 className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider font-mono">
            Recent Audit Transactions ({relatedTxns.length})
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {relatedTxns.map(t => {
              const isCredit = t.to_account === account.account_id;
              return (
                <div key={t.txn_id} className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/70 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isCredit ? (
                      <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <div>
                      <span className="font-mono text-slate-200">{t.txn_id}</span>
                      <p className="text-[10px] text-slate-500">{t.channel} • {new Date(t.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-medium ${isCredit ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {isCredit ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                    </span>
                    <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{t.transaction_note}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Analyst Case Note */}
        <form onSubmit={handleAddNote} className="space-y-2">
          <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Record Analyst Observation
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="e.g. Counterparty confirms invoice mismatch..."
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition"
            >
              <Send className="w-3.5 h-3.5" /> Log
            </button>
          </div>
        </form>

        {/* Simulated Enforcement Actions */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono font-semibold">
            Simulated Enforcement Actions
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleFreeze}
              className="px-3 py-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/50 text-rose-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Simulate Freeze
            </button>
            <button
              onClick={handleEscalate}
              className="px-3 py-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/50 text-amber-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Escalate (1930)
            </button>
            <button
              onClick={handleKyc}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <FileText className="w-3.5 h-3.5" /> Request Re-KYC
            </button>
            <button
              onClick={handleFalsePositive}
              className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> False Positive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
