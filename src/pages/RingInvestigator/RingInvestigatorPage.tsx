import React, { useState } from 'react';
import { Layers, ArrowRight, ShieldAlert, GitFork, Dna, CheckCircle2, Share2, Info } from 'lucide-react';
import { useAnalysisStore } from '../../store/analysisStore';
import { useInvestigationStore } from '../../store/investigationStore';
import { useUiStore } from '../../store/uiStore';
import { MuleRing } from '../../types';

export const RingInvestigatorPage: React.FC = () => {
  const { rings, ringDnas } = useAnalysisStore();
  const { selectRing, selectAccount } = useInvestigationStore();
  const { setActivePage, setDrawerOpen } = useUiStore();

  const [compareRingA, setCompareRingA] = useState<string>(rings[0]?.ring_id || 'RING-01');
  const [compareRingB, setCompareRingB] = useState<string>(rings[1]?.ring_id || 'RING-02');

  const dnaA = ringDnas.get(compareRingA);
  const dnaB = ringDnas.get(compareRingB);

  const handleIsolateInGraph = (ringId: string) => {
    selectRing(ringId);
    setActivePage('network');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-bold text-white tracking-tight">
              Mule Ring Investigator & Community Profiler
            </h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {rings.length} Active Syndicates
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Graph community detection & topology extraction revealing multi-account coordination rings.
          </p>
        </div>
      </div>

      {/* Ring Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rings.map(ring => {
          const moneyInNetworkLakh = (ring.money_currently_in_network / 100000).toFixed(1);
          const moneyMovedOutLakh = (ring.money_moved_out / 100000).toFixed(1);

          return (
            <div
              key={ring.ring_id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/50 transition-all shadow-xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">{ring.ring_id}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                      Risk {ring.ring_risk_score}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{ring.member_accounts.length} Accounts</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {ring.dominant_patterns.map((pat, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    >
                      {pat.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {ring.evidence_summary}
                </p>

                {/* Financial Flow Breakdown */}
                <div className="mt-4 grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">In Network</span>
                    <span className="text-emerald-400 font-bold text-sm">₹{moneyInNetworkLakh}L</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Dispersed Out</span>
                    <span className="text-rose-400 font-bold text-sm">₹{moneyMovedOutLakh}L</span>
                  </div>
                </div>

                {/* Account Pills */}
                <div className="mt-3">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Coordinated Accounts:</span>
                  <div className="flex flex-wrap gap-1">
                    {ring.member_accounts.slice(0, 6).map(accId => (
                      <button
                        key={accId}
                        onClick={() => {
                          selectAccount(accId);
                          setDrawerOpen(true);
                        }}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition"
                      >
                        {accId}
                      </button>
                    ))}
                    {ring.member_accounts.length > 6 && (
                      <span className="text-[10px] font-mono px-1 text-slate-500">
                        +{ring.member_accounts.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleIsolateInGraph(ring.ring_id)}
                className="w-full mt-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 rounded-xl text-xs font-medium font-mono flex items-center justify-center gap-2 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Isolate in Network Explorer</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Scam Ring DNA Comparison Tool */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400">
              <Dna className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white font-heading">
                Scam Ring DNA Comparator
              </h3>
              <p className="text-xs text-slate-400">
                Compare structural modus operandi between distinct syndicates to identify common operational fingerprints.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={compareRingA}
              onChange={e => setCompareRingA(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-cyan-300"
            >
              {rings.map(r => (
                <option key={r.ring_id} value={r.ring_id}>
                  {r.ring_id}
                </option>
              ))}
            </select>
            <span className="text-slate-500 font-mono text-xs">vs</span>
            <select
              value={compareRingB}
              onChange={e => setCompareRingB(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-amber-300"
            >
              {rings.map(r => (
                <option key={r.ring_id} value={r.ring_id}>
                  {r.ring_id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {dnaA && dnaB && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-cyan-500/30 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-cyan-300">{dnaA.ringId} DNA Fingerprint</span>
                <span className="font-mono text-[10px] text-slate-500">{dnaA.fingerprintHash}</span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
                <div className="flex justify-between"><span>Node Topology Size:</span> <span className="text-white">{dnaA.nodeCount} Accounts</span></div>
                <div className="flex justify-between"><span>Payment Edges:</span> <span className="text-white">{dnaA.edgeCount} Transactions</span></div>
                <div className="flex justify-between"><span>Pass-Through Ratio:</span> <span className="text-rose-400">{(dnaA.avgPassThrough * 100).toFixed(0)}%</span></div>
                <div className="flex justify-between"><span>Cycle Membership:</span> <span className="text-white">{dnaA.hasCycle ? 'YES (Circular Loop)' : 'NO'}</span></div>
                <div className="flex justify-between"><span>Shared Device Ratio:</span> <span className="text-amber-400">{(dnaA.sharedDeviceRatio * 100).toFixed(0)}%</span></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-amber-500/30 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-amber-300">{dnaB.ringId} DNA Fingerprint</span>
                <span className="font-mono text-[10px] text-slate-500">{dnaB.fingerprintHash}</span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
                <div className="flex justify-between"><span>Node Topology Size:</span> <span className="text-white">{dnaB.nodeCount} Accounts</span></div>
                <div className="flex justify-between"><span>Payment Edges:</span> <span className="text-white">{dnaB.edgeCount} Transactions</span></div>
                <div className="flex justify-between"><span>Pass-Through Ratio:</span> <span className="text-rose-400">{(dnaB.avgPassThrough * 100).toFixed(0)}%</span></div>
                <div className="flex justify-between"><span>Cycle Membership:</span> <span className="text-white">{dnaB.hasCycle ? 'YES (Circular Loop)' : 'NO'}</span></div>
                <div className="flex justify-between"><span>Shared Device Ratio:</span> <span className="text-amber-400">{(dnaB.sharedDeviceRatio * 100).toFixed(0)}%</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
