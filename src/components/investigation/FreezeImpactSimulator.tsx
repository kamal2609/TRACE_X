import React, { useState, useMemo } from 'react';
import { Sliders, ShieldAlert, AlertTriangle, CheckCircle, IndianRupee, Users } from 'lucide-react';
import { useAnalysisStore } from '../../store/analysisStore';
import { useDatasetStore } from '../../store/datasetStore';

export const FreezeImpactSimulator: React.FC = () => {
  const { riskResults, features } = useAnalysisStore();
  const { accounts } = useDatasetStore();

  const [threshold, setThreshold] = useState<number>(66);

  const simulation = useMemo(() => {
    let trueMulesFrozen = 0;
    let falsePositivesFrozen = 0;
    let fraudMoneyIntercepted = 0;
    let legitimateDepositsLocked = 0;

    accounts.forEach(acc => {
      const score = riskResults.get(acc.account_id)?.finalScore || 0;
      const feat = features.get(acc.account_id);
      const incoming = feat?.total_incoming || 50000;

      if (score >= threshold) {
        if (acc.ground_truth_label === 'MULE') {
          trueMulesFrozen++;
          // ~70% of mule balance caught before ATM cashout
          fraudMoneyIntercepted += Math.round(incoming * 0.7);
        } else {
          falsePositivesFrozen++;
          legitimateDepositsLocked += incoming;
        }
      }
    });

    const netTradeoff = legitimateDepositsLocked > 0 
      ? Number((fraudMoneyIntercepted / legitimateDepositsLocked).toFixed(2)) 
      : 99.9;

    return {
      trueMulesFrozen,
      falsePositivesFrozen,
      fraudMoneyIntercepted,
      legitimateDepositsLocked,
      netTradeoff
    };
  }, [accounts, riskResults, features, threshold]);

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white text-sm">
              Freeze Impact Simulator & Policy Tuning
            </h3>
            <p className="text-[11px] text-slate-400">
              Model trade-off between intercepted fraud proceeds vs genuine customer deposits locked.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="text-xs text-slate-400">Intervention Cutoff:</span>
          <span className="px-2.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-white font-bold text-xs">
            {threshold} / 100
          </span>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-1.5">
        <input
          type="range"
          min={30}
          max={90}
          value={threshold}
          onChange={e => setThreshold(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>Aggressive (30): Max Recall, High FP</span>
          <span>Balanced Threshold (66)</span>
          <span>Conservative (90): Zero False Freezes</span>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
        <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30">
          <span className="text-[10px] text-slate-500 uppercase block">Fraud Intercepted</span>
          <span className="text-base font-bold text-emerald-400 mt-0.5 block">
            ₹{(simulation.fraudMoneyIntercepted / 100000).toFixed(1)} Lakhs
          </span>
          <span className="text-[10px] text-slate-400">{simulation.trueMulesFrozen} Mules Frozen</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/30">
          <span className="text-[10px] text-slate-500 uppercase block">Genuine Deposits Locked</span>
          <span className="text-base font-bold text-rose-400 mt-0.5 block">
            ₹{(simulation.legitimateDepositsLocked / 100000).toFixed(1)} Lakhs
          </span>
          <span className="text-[10px] text-slate-400">{simulation.falsePositivesFrozen} False Freezes</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30">
          <span className="text-[10px] text-slate-500 uppercase block">Efficiency Ratio</span>
          <span className="text-base font-bold text-cyan-300 mt-0.5 block">
            {simulation.netTradeoff}:1
          </span>
          <span className="text-[10px] text-slate-400">Saved per ₹1 locked</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-indigo-500/30">
          <span className="text-[10px] text-slate-500 uppercase block">Policy Recommendation</span>
          <span className="text-xs font-bold text-indigo-300 mt-1 block">
            {threshold >= 65 ? 'OPTIMAL AML' : 'TOO AGGRESSIVE'}
          </span>
          <span className="text-[10px] text-slate-400">RBI KYC Guidance</span>
        </div>
      </div>
    </div>
  );
};

