import React, { useState, useEffect } from 'react';
import { 
  GitFork, Play, Pause, RotateCcw, ArrowRight, 
  ShieldAlert, Clock, IndianRupee, AlertTriangle, CheckCircle 
} from 'lucide-react';
import { useAnalysisStore } from '../../store/analysisStore';
import { useDatasetStore } from '../../store/datasetStore';
import { useInvestigationStore } from '../../store/investigationStore';
import { useUiStore } from '../../store/uiStore';
import { traceMoneyPath, TraceResult } from '../../engine/pathTracing';

export const FollowTheMoneyPage: React.FC = () => {
  const { graph } = useAnalysisStore();
  const { transactions, accounts } = useDatasetStore();
  const { traceSourceId, traceTargetId, setTraceEndpoints, simulateFreeze, selectAccount } = useInvestigationStore();
  const { setDrawerOpen, addToast } = useUiStore();

  const [sourceId, setSourceId] = useState(traceSourceId || 'AC-1001');
  const [targetId, setTargetId] = useState(traceTargetId || 'AC-CASHOUT-ATM');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentHopIndex, setCurrentHopIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000); // 1 sec per hop
  const [freezeSimulationHop, setFreezeSimulationHop] = useState<number>(1);

  // Trace calculation
  const trace: TraceResult = React.useMemo(() => {
    if (!graph) {
      return {
        sourceAccount: sourceId,
        targetAccount: targetId,
        found: false,
        pathNodes: [],
        hops: [],
        totalPathAmount: 0,
        totalTimeMinutes: 0,
        suggestedFreezePoint: null,
        freezeExplanation: 'Graph engine not initialized.'
      };
    }
    return traceMoneyPath(graph, sourceId, targetId, transactions);
  }, [graph, sourceId, targetId, transactions]);

  // Money Flow Playback Timer
  useEffect(() => {
    let interval: any;
    if (isPlaying && trace.hops.length > 0) {
      interval = setInterval(() => {
        setCurrentHopIndex(prev => {
          if (prev >= trace.hops.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, trace.hops.length, playbackSpeed]);

  const handleSimulateFreezeAction = (accId: string) => {
    simulateFreeze(accId);
    addToast('danger', 'Simulated Debit Hold Enforced', `Hypothetical freeze placed on ${accId}. Intercepted downstream flow.`);
  };

  // Golden Hour metrics
  const activeHop = trace.hops[currentHopIndex] || trace.hops[0];
  const moneyRecoverable = activeHop ? activeHop.remainingRecoverableAmount : 0;
  const elapsedMinutes = trace.hops.slice(0, currentHopIndex + 1).reduce((acc, h) => acc + h.timeFromPreviousMinutes, 0);
  const goldenHourRemainingMinutes = Math.max(0, 60 - elapsedMinutes);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-bold text-white tracking-tight">
              Follow the Money — Multi-Hop Forensic Tracer
            </h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Hop Pathfinder
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Trace fraudulent payment dispersal from original victim account through intermediary mules to cash-out exit.
          </p>
        </div>
      </div>

      {/* Source & Target Account Selector */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Source Account (Victim/Aggregator):</label>
            <input
              type="text"
              value={sourceId}
              onChange={e => setSourceId(e.target.value.toUpperCase())}
              placeholder="e.g. AC-1001"
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-300 w-44"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Target Account (Cashout/Exit):</label>
            <input
              type="text"
              value={targetId}
              onChange={e => setTargetId(e.target.value.toUpperCase())}
              placeholder="e.g. AC-CASHOUT-ATM"
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-rose-300 w-44"
            />
          </div>

          <div className="flex items-end self-end">
            <button
              onClick={() => {
                // Preset to Layering Chain (Ring 2)
                const r2Mules = accounts.filter(a => a.fraud_ring_id === 'RING-02');
                if (r2Mules.length >= 2) {
                  setSourceId(r2Mules[0].account_id);
                  setTargetId('AC-CASHOUT-ATM');
                  setCurrentHopIndex(0);
                  setIsPlaying(false);
                }
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 rounded-lg transition"
            >
              Load Ring 2 Layering Path
            </button>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCurrentHopIndex(0);
              setIsPlaying(false);
            }}
            className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
            title="Reset to hop 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Play Flow'}</span>
          </button>
          <select
            value={playbackSpeed}
            onChange={e => setPlaybackSpeed(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs font-mono text-slate-300"
          >
            <option value={1500}>0.7x Speed</option>
            <option value={1000}>1.0x Speed</option>
            <option value={500}>2.0x Speed</option>
          </select>
        </div>
      </div>

      {/* Innovation A: Golden Hour Clock & Interception Dashboard */}
      {trace.found && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Golden Hour Countdown</span>
              <div className="text-2xl font-bold font-mono text-cyan-300 mt-0.5">
                {goldenHourRemainingMinutes > 0 ? `${goldenHourRemainingMinutes} mins` : 'Lapsed (> 60m)'}
              </div>
              <p className="text-[11px] text-slate-400">Window before cashout dissipation</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Money Still Recoverable</span>
              <div className="text-2xl font-bold font-mono text-emerald-300 mt-0.5">
                ₹{moneyRecoverable.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-400">Estimated intact balance at current step</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/40 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Optimal Freeze Point</span>
              <div className="text-2xl font-bold font-mono text-rose-300 mt-0.5">
                {trace.suggestedFreezePoint || 'None'}
              </div>
              <p className="text-[11px] text-slate-400">Intersects max downstream path</p>
            </div>
          </div>
        </div>
      )}

      {/* Path Sequence Timeline */}
      {trace.found ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white font-heading">
              Transaction Sequence Pathway ({trace.hops.length} Hops)
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Total Elapsed Time: {trace.totalTimeMinutes} minutes
            </span>
          </div>

          {/* Hop Steps Cards */}
          <div className="relative space-y-4">
            {trace.hops.map((hop, idx) => {
              const isCurrent = idx === currentHopIndex;
              const isPassed = idx < currentHopIndex;
              const isFreezePoint = hop.toAccount === trace.suggestedFreezePoint;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-950/40'
                      : isFreezePoint
                      ? 'bg-rose-950/30 border-rose-500/60'
                      : 'bg-slate-950/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                        isCurrent
                          ? 'bg-cyan-500 text-slate-950 animate-pulse'
                          : isFreezePoint
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {hop.hopNumber}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              selectAccount(hop.fromAccount);
                              setDrawerOpen(true);
                            }}
                            className="font-mono text-sm font-bold text-cyan-300 hover:underline"
                          >
                            {hop.fromAccount}
                          </button>
                          <ArrowRight className="w-4 h-4 text-slate-500" />
                          <button
                            onClick={() => {
                              selectAccount(hop.toAccount);
                              setDrawerOpen(true);
                            }}
                            className="font-mono text-sm font-bold text-rose-300 hover:underline"
                          >
                            {hop.toAccount}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                          {hop.channel} • +{hop.timeFromPreviousMinutes} min delay from prior transfer
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-sm font-mono font-bold text-white block">
                          ₹{hop.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          ₹{hop.remainingRecoverableAmount.toLocaleString('en-IN')} recoverable
                        </span>
                      </div>

                      <button
                        onClick={() => handleSimulateFreezeAction(hop.toAccount)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                          isFreezePoint
                            ? 'bg-rose-600 hover:bg-rose-500 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isFreezePoint ? 'Simulate Freeze Here' : 'Hold Node'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Smart Freeze Point Simulator Explanation */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-semibold font-mono text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Smart Freeze Point Assessment</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">{trace.freezeExplanation}</p>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-500 text-xs">
          No direct path found between {sourceId} and {targetId}. Try clicking "Load Ring 2 Layering Path" above.
        </div>
      )}
    </div>
  );
};
