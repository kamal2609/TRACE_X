import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert, Search, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAnalysisStore } from '../../store/analysisStore';
import { useDatasetStore } from '../../store/datasetStore';

export const SafeToPayPage: React.FC = () => {
  const { riskResults, features } = useAnalysisStore();
  const { accounts } = useDatasetStore();

  const [inputUpi, setInputUpi] = useState('rohit.sharma.agg@okhdfc');
  const [searchedUpi, setSearchedUpi] = useState<string | null>(null);

  const matchedAccount = accounts.find(
    a => a.upi_id.toLowerCase() === (searchedUpi || '').toLowerCase() ||
         a.account_id.toLowerCase() === (searchedUpi || '').toLowerCase()
  );

  const result = matchedAccount ? riskResults.get(matchedAccount.account_id) : null;
  const feat = matchedAccount ? features.get(matchedAccount.account_id) : null;

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUpi.trim()) return;
    setSearchedUpi(inputUpi.trim());
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
          <ShieldCheck className="w-4 h-4" /> Consumer Protection Interface
        </div>
        <h1 className="text-2xl font-bold font-heading text-white tracking-tight">
          Safe-to-Pay Beneficiary UPI Checker
        </h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Verify a recipient UPI ID or account number before initiating a digital payment to identify known mule aggregators and suspicious layering chains.
        </p>
      </div>

      {/* Input Box */}
      <form onSubmit={handleCheck} className="p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex items-center gap-2">
        <Search className="w-5 h-5 text-slate-500 ml-3 shrink-0" />
        <input
          type="text"
          value={inputUpi}
          onChange={e => setInputUpi(e.target.value)}
          placeholder="Enter recipient UPI ID (e.g. rohit.sharma.agg@okhdfc or AC-1001)..."
          className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-xl text-xs font-mono font-bold transition shadow-lg shadow-cyan-950/40"
        >
          Check Safety
        </button>
      </form>

      {/* Preset Suggestions */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-slate-400">
        <span>Try checking:</span>
        <button
          onClick={() => {
            setInputUpi('rohit.sharma.agg@okhdfc');
            setSearchedUpi('rohit.sharma.agg@okhdfc');
          }}
          className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25"
        >
          rohit.sharma.agg@okhdfc (Aggregator Mule)
        </button>
        <button
          onClick={() => {
            const normal = accounts.find(a => a.ground_truth_label === 'NORMAL');
            if (normal) {
              setInputUpi(normal.upi_id);
              setSearchedUpi(normal.upi_id);
            }
          }}
          className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25"
        >
          Normal Citizen UPI
        </button>
      </div>

      {/* Results Display */}
      {searchedUpi && matchedAccount && result ? (
        <div className={`p-6 rounded-3xl border shadow-2xl space-y-4 animate-in fade-in duration-200 ${
          result.riskBand === 'HIGH'
            ? 'bg-rose-950/20 border-rose-500/50'
            : result.riskBand === 'REVIEW'
            ? 'bg-amber-950/20 border-amber-500/50'
            : 'bg-emerald-950/20 border-emerald-500/50'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${
                result.riskBand === 'HIGH'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : result.riskBand === 'REVIEW'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                {result.riskBand === 'HIGH' ? (
                  <ShieldAlert className="w-8 h-8 animate-pulse" />
                ) : result.riskBand === 'REVIEW' ? (
                  <AlertTriangle className="w-8 h-8" />
                ) : (
                  <CheckCircle2 className="w-8 h-8" />
                )}
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Payer Safety Assessment</span>
                <h3 className={`text-xl font-heading font-bold ${
                  result.riskBand === 'HIGH' ? 'text-rose-400' : result.riskBand === 'REVIEW' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {result.riskBand === 'HIGH' ? 'RISKY BENEFICIARY — DO NOT PAY' : result.riskBand === 'REVIEW' ? 'CAUTION ADVISED — VERIFY IDENTITY' : 'SAFE BENEFICIARY — LOW RISK'}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  UPI: {matchedAccount.upi_id} &bull; Account: {matchedAccount.account_id} ({matchedAccount.bank})
                </p>
              </div>
            </div>

            <div className="text-right font-mono sm:self-center">
              <span className="text-[10px] text-slate-500 uppercase block">Engine Risk Score</span>
              <span className={`text-3xl font-bold ${
                result.riskBand === 'HIGH' ? 'text-rose-400' : result.riskBand === 'REVIEW' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {result.finalScore}/100
              </span>
            </div>
          </div>

          {/* 3 Plain Reasons */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              3 Reasons for this Assessment:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold block">1. Velocity & Retention</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {feat && feat.pass_through_ratio > 0.85
                    ? `Account empties ${(feat.pass_through_ratio * 100).toFixed(0)}% of incoming funds within minutes.`
                    : 'Account maintains normal balance retention over multiple days.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold block">2. Network Association</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {matchedAccount.fraud_ring_id
                    ? `Linked directly to coordinated money mule ring ${matchedAccount.fraud_ring_id}.`
                    : 'No links detected to known fraudulent syndicates or cyclical payment loops.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold block">3. Profile Match</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {feat && feat.income_mismatch_ratio > 3
                    ? `Incoming volume is ${feat.income_mismatch_ratio}x higher than declared economic profile.`
                    : 'Transaction velocity matches expected peer-to-peer consumer activity.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : searchedUpi ? (
        <div className="p-8 text-center text-slate-500 font-mono text-xs bg-slate-900/50 rounded-2xl border border-slate-800">
          No matching account found for &quot;{searchedUpi}&quot;.
        </div>
      ) : null}
    </div>
  );
};
