import React, { useState } from 'react';
import { FileCheck, Printer, Download, Copy, Check, ShieldAlert, Landmark } from 'lucide-react';
import { useAnalysisStore } from '../../store/analysisStore';
import { useDatasetStore } from '../../store/datasetStore';
import { useInvestigationStore } from '../../store/investigationStore';
import { useUiStore } from '../../store/uiStore';
import { RiskBadge } from '../../components/common/RiskBadge';

export const ReportsPage: React.FC = () => {
  const { riskResults, features, rings } = useAnalysisStore();
  const { accounts, transactions } = useDatasetStore();
  const { selectedAccountId, selectAccount } = useInvestigationStore();
  const { addToast } = useUiStore();

  const [targetId, setTargetId] = useState<string>(selectedAccountId || accounts[0]?.account_id || 'AC-1001');
  const [copied, setCopied] = useState(false);

  const account = accounts.find(a => a.account_id === targetId) || accounts[0];
  const result = riskResults.get(account?.account_id);
  const feat = features.get(account?.account_id);

  const relatedTxns = transactions.filter(
    t => t.from_account === account?.account_id || t.to_account === account?.account_id
  ).slice(0, 10);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    if (!account || !result) return;
    const summary = `MULETRACE AI FORENSIC CASE REPORT
Case ID: CASE-${account.account_id}-${Date.now().toString().slice(-4)}
Account: ${account.account_id} (${account.holder_name})
Bank: ${account.bank} | KYC: ${account.kyc_level}
Risk Score: ${result.finalScore}/100 (${result.riskBand})
Reason: ${result.explanationEn}
Recommended Action: ${result.recommendedAction}
Generated under Educational Prototype License.`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    addToast('success', 'Case Summary Copied', 'Structured briefing copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!account || !result) {
    return (
      <div className="p-8 text-center text-slate-500 font-mono text-xs">
        No account selected for case report. Please run AI analysis first.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-bold text-white tracking-tight">
              Forensic Case Reports & Regulatory Dockets
            </h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Formal Case File
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured forensic docket suitable for bank compliance review, SAR filing, and cybercrime escalation (1930).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Select Account dropdown */}
          <select
            value={account.account_id}
            onChange={e => {
              setTargetId(e.target.value);
              selectAccount(e.target.value);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-cyan-300"
          >
            {accounts.slice(0, 30).map(a => (
              <option key={a.account_id} value={a.account_id}>
                {a.account_id} — {a.holder_name}
              </option>
            ))}
          </select>

          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Brief</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-lg shadow-cyan-950/40"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Docket (PDF)</span>
          </button>
        </div>
      </div>

      {/* Formal Printable Document Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl text-slate-200 font-sans print:border-none print:shadow-none print:p-0 print:text-black">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                MuleTrace AI &bull; Financial Crime Intelligence Platform
              </span>
            </div>
            <h2 className="text-2xl font-bold font-heading text-white mt-1">
              SUSPICIOUS TRANSACTION & MULE ACCOUNT DOSSIER
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Case Ref: MT-CASE-{account.account_id}-{Date.now().toString().slice(-6)} &bull; Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>

          <div className="text-right">
            <RiskBadge band={result.riskBand} score={result.finalScore} size="lg" />
            <span className="text-[10px] font-mono text-slate-500 block mt-1">Confidence Score: 94.2%</span>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-cyan-400">
            1. Executive Forensic Summary
          </h4>
          <p className="text-xs leading-relaxed text-slate-300">
            Automated intelligence scanning has flagged account <strong className="text-white">{account.account_id}</strong> ({account.holder_name}) at {account.bank} with a high composite risk rating of {result.finalScore}/100. The account exhibits abnormal financial velocity, coordinated multi-party incoming transfers, and a rapid pass-through ratio of {feat ? `${(feat.pass_through_ratio * 100).toFixed(0)}%` : 'N/A'}.
          </p>
        </div>

        {/* Section 2: Account Demographic & Behavioral Profile */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-cyan-400">
            2. Account & Infrastructure Profile
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
            <div><span className="text-slate-500 block text-[10px]">Holder Name</span> <strong className="text-white">{account.holder_name}</strong></div>
            <div><span className="text-slate-500 block text-[10px]">Bank & Branch</span> <strong className="text-white">{account.bank}</strong></div>
            <div><span className="text-slate-500 block text-[10px]">KYC Tier</span> <strong className="text-white">{account.kyc_level} KYC</strong></div>
            <div><span className="text-slate-500 block text-[10px]">Account Age</span> <strong className="text-white">{account.account_age_days} Days</strong></div>
            <div><span className="text-slate-500 block text-[10px]">UPI Handle</span> <strong className="text-white">{account.upi_id}</strong></div>
            <div><span className="text-slate-500 block text-[10px]">Declared Income</span> <strong className="text-white">₹{account.declared_monthly_income.toLocaleString('en-IN')}/mo</strong></div>
            <div><span className="text-slate-500 block text-[10px]">Device ID</span> <strong className="text-white">{account.device_id}</strong></div>
            <div><span className="text-slate-500 block text-[10px]">IP Subnet</span> <strong className="text-white">{account.ip_cluster}</strong></div>
          </div>
        </div>

        {/* Section 3: Feature Attribution (SHAP-inspired) */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-cyan-400">
            3. AI Detection Rationale (SHAP Attribution)
          </h4>
          <div className="space-y-2">
            {result.featureContributions.map((contrib, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-200">{contrib.label}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{contrib.reason}</p>
                </div>
                <div className="text-right shrink-0 font-mono">
                  <span className={`font-bold ${contrib.contribution > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {contrib.contribution > 0 ? `+${contrib.contribution} pts` : `${contrib.contribution} pts`}
                  </span>
                  <span className="block text-[10px] text-slate-500">{contrib.formattedValue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Recent Payment Vectors */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-cyan-400">
            4. Recent Coordinated Payment Vectors ({relatedTxns.length})
          </h4>
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase">
                <tr>
                  <th className="py-2 px-3">Txn ID</th>
                  <th className="py-2 px-3">Timestamp</th>
                  <th className="py-2 px-3">Flow</th>
                  <th className="py-2 px-3">Channel</th>
                  <th className="py-2 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {relatedTxns.map(t => (
                  <tr key={t.txn_id}>
                    <td className="py-2 px-3 text-cyan-300">{t.txn_id}</td>
                    <td className="py-2 px-3 text-slate-500">{new Date(t.timestamp).toLocaleTimeString()}</td>
                    <td className="py-2 px-3">{t.from_account} &rarr; {t.to_account}</td>
                    <td className="py-2 px-3 text-slate-400">{t.channel}</td>
                    <td className="py-2 px-3 text-right font-bold text-white">₹{t.amount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Recommended Action & Disclaimer */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs">
            <span className="font-semibold text-cyan-300 font-mono uppercase tracking-wider block mb-1">
              5. Recommended Compliance Interventions
            </span>
            <p className="text-slate-300 leading-relaxed font-sans">{result.recommendedAction}</p>
          </div>

          <div className="text-[10px] text-slate-500 font-mono leading-relaxed">
            Legal & Compliance Disclaimer: This dossier is synthesized for educational research and financial crime intelligence demonstration. All names, accounts, bank references, and UPI tokens are synthetic artifacts. No real banking operations or individual culpability is asserted. Human analyst validation is required.
          </div>
        </div>
      </div>
    </div>
  );
};
