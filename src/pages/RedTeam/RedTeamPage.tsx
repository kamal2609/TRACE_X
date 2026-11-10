import React, { useState } from 'react';
import { Flame, Sliders, ShieldAlert, ArrowRight, TrendingDown, Clock, ShieldCheck } from 'lucide-react';

export const RedTeamPage: React.FC = () => {
  const [dwellDelayHours, setDwellDelayHours] = useState(2); // Fraudsters slowing down
  const [trancheSplitCount, setTrancheSplitCount] = useState(8); // Fraudsters splitting smaller
  const [deviceRotation, setDeviceRotation] = useState(true);

  // Calculate evasion score & fraudster friction cost
  const evasionScore = React.useMemo(() => {
    let score = 92; // Baseline mule ring score
    if (dwellDelayHours >= 4) score -= 18;
    else if (dwellDelayHours >= 2) score -= 10;

    if (trancheSplitCount >= 10) score -= 12;
    if (deviceRotation) score -= 15;

    return Math.max(38, score);
  }, [dwellDelayHours, trancheSplitCount, deviceRotation]);

  // Economic cost to criminals: each hour of delay increases probability that victim contacts 1930 / bank to freeze funds!
  const victimInterceptionProb = Math.min(95, Math.round(25 + dwellDelayHours * 16));

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-semibold">
          <Flame className="w-4 h-4" /> Adversarial Counter-Forensics
        </div>
        <h1 className="text-2xl font-bold font-heading text-white tracking-tight">
          Red-Team Fraudster Evasion Simulator
        </h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Simulate how organized money laundering rings attempt to evade graph detection by altering payment cadence, splitting amounts, and rotating hardware.
        </p>
      </div>

      {/* Simulator Controls & Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl text-xs font-sans">
          <h3 className="font-heading font-bold text-white text-sm">Adversarial Evasion Knobs</h3>

          <div className="space-y-2">
            <div className="flex justify-between font-mono text-slate-300">
              <span>Artificial Dwell Delay:</span>
              <strong className="text-cyan-400">{dwellDelayHours} hours</strong>
            </div>
            <input
              type="range"
              min={0}
              max={12}
              value={dwellDelayHours}
              onChange={e => setDwellDelayHours(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <span className="text-[10px] text-slate-500 block">Criminals wait longer between hops to mimic normal dwell time.</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between font-mono text-slate-300">
              <span>Tranche Splitting:</span>
              <strong className="text-cyan-400">{trancheSplitCount} micro-transfers</strong>
            </div>
            <input
              type="range"
              min={2}
              max={16}
              value={trancheSplitCount}
              onChange={e => setTrancheSplitCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <span className="text-[10px] text-slate-500 block">Splitting larger amounts into tiny &lt; ₹10,000 tranches.</span>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-mono text-slate-300 block font-bold">Rotate Device Fingerprints</span>
              <span className="text-[10px] text-slate-500">Use disposable emulator hardware per transaction</span>
            </div>
            <button
              onClick={() => setDeviceRotation(!deviceRotation)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition ${
                deviceRotation ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {deviceRotation ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>

        {/* Evasion Dynamics Results */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Evasion Trade-off Impact</span>

            <div className="grid grid-cols-2 gap-3 text-center font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Model Detection Score</span>
                <span className={`text-3xl font-bold mt-1 block ${evasionScore > 65 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {evasionScore}/100
                </span>
                <span className="text-[10px] text-slate-500 block">{evasionScore > 65 ? 'STILL FLAGGED' : 'DROPS TO REVIEW'}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Interception Risk (1930)</span>
                <span className="text-3xl font-bold text-emerald-400 mt-1 block">
                  {victimInterceptionProb}%
                </span>
                <span className="text-[10px] text-emerald-500 block">Victim Reporting Window</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-xs text-slate-300 space-y-1.5 font-sans leading-relaxed">
              <span className="font-semibold text-cyan-300 font-mono text-[11px] block uppercase">
                The Criminal&apos;s Dilemma (Graph Analytics vs Time):
              </span>
              <p>
                To lower their graph anomaly score from 92 to {evasionScore}, criminals must delay transfers by {dwellDelayHours} hours. However, delaying transfers widens the Golden Hour window, increasing the likelihood that the victim reports the fraud to Helpline 1930 and freezes the money before cashout!
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-500 text-center">
            Adversarial game-theoretic simulation of fraudster operational friction.
          </div>
        </div>
      </div>
    </div>
  );
};
