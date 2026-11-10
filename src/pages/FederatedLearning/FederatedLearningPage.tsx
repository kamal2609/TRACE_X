import React, { useState } from 'react';
import { Network, Play, RotateCcw, ArrowRight, ShieldCheck, Lock, CheckCircle2, Cpu } from 'lucide-react';
import { useDatasetStore } from '../../store/datasetStore';
import { simulateFederatedLearningRound, FederatedRoundResult } from '../../engine/federatedSimulation';

import { CrossBankAlertSharing } from '../../components/investigation/CrossBankAlertSharing';

export const FederatedLearningPage: React.FC = () => {
  const { accounts } = useDatasetStore();
  const [currentRound, setCurrentRound] = useState(1);
  const [activeStep, setActiveStep] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);

  const fedResult: FederatedRoundResult = React.useMemo(() => {
    return simulateFederatedLearningRound(accounts, currentRound);
  }, [accounts, currentRound]);

  const handleNextStep = () => {
    if (activeStep < 5) {
      setActiveStep(prev => prev + 1);
    } else {
      setActiveStep(1);
      setCurrentRound(r => r + 1);
    }
  };

  const steps = [
    { num: 1, title: 'Local Training', desc: 'Each bank trains isolated models on local customer transactions' },
    { num: 2, title: 'Weight Extraction', desc: 'Feature gradient parameters computed locally without identity data' },
    { num: 3, title: 'Encrypted Sharing', desc: 'Only mathematical model weight vectors submitted to coordinator' },
    { num: 4, title: 'FedAvg Aggregation', desc: 'Central server aggregates weights: w_global = sum((n_k/N) * w_k)' },
    { num: 5, title: 'Global Model Broadcast', desc: 'Unified robust model redistributed back to all 3 participating banks' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-bold text-white tracking-tight">
              Privacy-Preserving Federated Learning Simulation
            </h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              FedAvg Multi-Bank Protocol
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrating how Indian banks can collaborate to defeat cross-bank mule rings without exposing confidential customer accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveStep(1);
              setCurrentRound(1);
            }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title="Reset simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextStep}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition"
          >
            <span>{activeStep < 5 ? `Execute Step ${activeStep + 1}` : 'Start Round ' + (currentRound + 1)}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Progress Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {steps.map(s => {
          const isDone = s.num < activeStep;
          const isCurrent = s.num === activeStep;
          return (
            <div
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              className={`p-3 rounded-xl border cursor-pointer transition ${
                isCurrent
                  ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-950/30'
                  : isDone
                  ? 'bg-slate-900/60 border-emerald-500/40 text-slate-300'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] font-bold uppercase">Step {s.num}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'}`} />
                )}
              </div>
              <h4 className="font-bold text-xs truncate">{s.title}</h4>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* 3 Virtual Banks Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {fedResult.banks.map((bank, idx) => (
          <div
            key={idx}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-white">{bank.bankName}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {bank.sampleCount} Accounts
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <span className="text-[10px] uppercase text-slate-500 block">Local Parameter Weights:</span>
              {Object.entries(bank.localWeights).map(([key, val]) => (
                <div key={key} className="flex justify-between text-[11px] text-slate-300">
                  <span className="truncate max-w-[150px]">{key.replace(/_/g, ' ')}:</span>
                  <span className="text-cyan-400 font-bold">{val.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-center font-mono">
              <div className="p-2 rounded-lg bg-slate-950">
                <span className="text-[10px] text-slate-500 block">Isolated Prec</span>
                <span className="text-sm font-bold text-slate-300">{(bank.localPrecision * 100).toFixed(0)}%</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950">
                <span className="text-[10px] text-slate-500 block">Isolated Rec</span>
                <span className="text-sm font-bold text-slate-300">{(bank.localRecall * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Central Aggregator & Global Model Performance */}
      <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-6 space-y-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-heading font-bold text-white">
                Global FedAvg Aggregator (Round {currentRound})
              </h3>
              <p className="text-xs text-slate-400">
                Aggregated cross-bank intelligence without data centralization or cross-border privacy breaches.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-center font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40">
              <span className="text-[10px] uppercase text-slate-500 block">Global Precision</span>
              <span className="text-xl font-bold text-emerald-400">{(fedResult.globalPrecision * 100).toFixed(1)}%</span>
              <span className="text-[10px] text-emerald-500 block">+12% vs single bank</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/40">
              <span className="text-[10px] uppercase text-slate-500 block">Global Recall</span>
              <span className="text-xl font-bold text-cyan-400">{(fedResult.globalRecall * 100).toFixed(1)}%</span>
              <span className="text-[10px] text-cyan-500 block">+16% cross-ring catch</span>
            </div>
          </div>
        </div>

        {/* FedAvg Mathematical Aggregation Weights */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <span className="text-[11px] font-mono text-cyan-300 font-bold uppercase tracking-wider block">
            Aggregated FedAvg Parameter Vector:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            {Object.entries(fedResult.aggregatedWeights).map(([key, val]) => (
              <div key={key} className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block truncate">{key.replace(/_/g, ' ')}</span>
                <span className="text-base font-bold text-white">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Note */}
        <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-xs text-slate-300 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-sans">{fedResult.privacyPreservedNotes}</p>
        </div>
      </div>

      {/* Feature H: Cross-Bank Cryptographic Hash Sharing */}
      <CrossBankAlertSharing />
    </div>
  );
};
