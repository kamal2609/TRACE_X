import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Play, Pause, Square, Zap, 
  ArrowUpRight, ArrowDownLeft, ShieldAlert, BellRing 
} from 'lucide-react';
import { useDatasetStore } from '../../store/datasetStore';
import { useAnalysisStore } from '../../store/analysisStore';
import { useInvestigationStore } from '../../store/investigationStore';
import { useUiStore } from '../../store/uiStore';
import { Transaction, ChannelType } from '../../types';

export const LiveMonitoringPage: React.FC = () => {
  const { accounts, addLiveTransaction, metadata } = useDatasetStore();
  const { recalculateSingleAccount, riskResults } = useAnalysisStore();
  const { selectAccount } = useInvestigationStore();
  const { addToast, setDrawerOpen } = useUiStore();

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamSpeedMs, setStreamSpeedMs] = useState(1000); // 1 transaction per second
  const [liveStreamEvents, setLiveStreamEvents] = useState<Transaction[]>([]);
  const [crossoverCount, setCrossoverCount] = useState(0);

  const streamTimerRef = useRef<any>(null);

  // Streaming generator loop
  useEffect(() => {
    if (isStreaming) {
      streamTimerRef.current = setInterval(() => {
        // Randomly pick accounts or simulate an incoming burst
        const isSuspiciousBurst = Math.random() < 0.25;
        const fromIdx = Math.floor(Math.random() * accounts.length);
        let toIdx = Math.floor(Math.random() * accounts.length);
        while (toIdx === fromIdx) {
          toIdx = Math.floor(Math.random() * accounts.length);
        }

        const fromAcc = accounts[fromIdx];
        const toAcc = accounts[toIdx];

        const amount = isSuspiciousBurst
          ? Math.floor(Math.random() * 4 + 1) * 49000 // Structuring amounts!
          : Math.floor(Math.random() * 5000 + 200);

        const channel: ChannelType = isSuspiciousBurst ? 'IMPS' : 'UPI';

        const liveTxn: Transaction = {
          txn_id: `LIVE-TXN-${Date.now().toString().slice(-6)}`,
          timestamp: new Date().toISOString(),
          from_account: fromAcc.account_id,
          to_account: toAcc.account_id,
          amount,
          channel,
          transaction_status: 'COMPLETED',
          transaction_note: isSuspiciousBurst ? 'Urgent tranche transfer' : 'Routine UPI payment',
          reference_id: `REF${Math.floor(Math.random() * 90000000 + 10000000)}`,
          is_suspicious: isSuspiciousBurst
        };

        // Add to global store
        addLiveTransaction(liveTxn);
        setLiveStreamEvents(prev => [liveTxn, ...prev.slice(0, 40)]);

        // Recalculate recipient risk score
        const priorScore = riskResults.get(toAcc.account_id)?.finalScore || 20;
        const newResult = recalculateSingleAccount(toAcc);

        if (newResult && newResult.finalScore >= 66 && priorScore < 66) {
          // Crossed into HIGH risk band!
          setCrossoverCount(c => c + 1);
          addToast(
            'danger',
            'Live Risk Crossover Alert',
            `Account ${toAcc.account_id} crossed into HIGH risk band (${newResult.finalScore}/100) following ₹${amount.toLocaleString('en-IN')} inflow.`
          );
        }
      }, streamSpeedMs);
    } else {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    }

    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, [isStreaming, streamSpeedMs, accounts, addLiveTransaction, recalculateSingleAccount, riskResults, addToast]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-bold text-white tracking-tight">
              Live Monitoring Stream Simulation
            </h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-rose-500 animate-ping' : 'bg-slate-500'}`} />
              {isStreaming ? 'STREAMING ACTIVE' : 'STREAM IDLE'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Streaming transaction ingestion with continuous feature recomputation and automatic High-Risk alerts.
          </p>
        </div>

        {/* Live Stream Controls */}
        <div className="flex items-center gap-2">
          {!isStreaming ? (
            <button
              onClick={() => setIsStreaming(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition"
            >
              <Play className="w-4 h-4" /> Start Live Feed
            </button>
          ) : (
            <button
              onClick={() => setIsStreaming(false)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-rose-950/40 transition"
            >
              <Pause className="w-4 h-4" /> Pause Stream
            </button>
          )}

          <select
            value={streamSpeedMs}
            onChange={e => setStreamSpeedMs(Number(e.target.value))}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300"
          >
            <option value={1500}>0.7x (1.5s)</option>
            <option value={1000}>1.0x (1.0s)</option>
            <option value={500}>2.0x (0.5s)</option>
          </select>
        </div>
      </div>

      {/* Live Stream Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-500">Live Ingested Transactions</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{liveStreamEvents.length}</div>
          <span className="text-[11px] text-slate-400 font-mono">Total DB: {metadata.transactionCount}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-500">Crossover Alerts Triggered</span>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">{crossoverCount}</div>
          <span className="text-[11px] text-slate-400 font-mono">Accounts crossing &gt;= 66 High</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-500">Ingestion Latency</span>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">&lt; 12 ms</div>
          <span className="text-[11px] text-slate-400 font-mono">Local in-browser re-indexing</span>
        </div>
      </div>

      {/* Real-time Streaming Transaction Log */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="font-heading font-bold text-white text-sm">Streaming Event Feed</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Auto-scrolling buffer</span>
        </div>

        <div className="max-h-[440px] overflow-y-auto divide-y divide-slate-800/60 p-2">
          {liveStreamEvents.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs font-mono">
              Click &quot;Start Live Feed&quot; above to simulate continuous UPI/IMPS payments.
            </div>
          ) : (
            liveStreamEvents.map(txn => (
              <div
                key={txn.txn_id}
                className="p-2.5 rounded-xl hover:bg-slate-800/40 transition flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${
                    txn.is_suspicious ? 'bg-rose-950/60 text-rose-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {txn.is_suspicious ? <ShieldAlert className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{txn.txn_id}</span>
                      <span className="text-[10px] font-mono px-1.5 rounded bg-slate-800 text-cyan-300">
                        {txn.channel}
                      </span>
                      {txn.is_suspicious && (
                        <span className="text-[10px] font-mono px-1.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                          Structuring Pattern
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {txn.from_account} &rarr; {txn.to_account} • {txn.transaction_note}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-sm text-white block">
                    ₹{txn.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(txn.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
