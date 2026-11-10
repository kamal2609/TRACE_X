import React, { useState } from 'react';
import { Share2, Lock, ShieldCheck, CheckCircle2, ArrowRight, Database, Hash } from 'lucide-react';
import { useAnalysisStore } from '../../store/analysisStore';
import { useDatasetStore } from '../../store/datasetStore';

interface SharedMuleHash {
  hashToken: string;
  sourceBank: string;
  patternType: string;
  timestamp: string;
  riskRating: 'CRITICAL' | 'HIGH';
  matchedAtBankBeta: boolean;
  matchedAccountId?: string;
}

export const CrossBankAlertSharing: React.FC = () => {
  const { accounts } = useDatasetStore();
  const { rings } = useAnalysisStore();

  const [sharedHashes, setSharedHashes] = useState<SharedMuleHash[]>([
    {
      hashToken: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      sourceBank: 'HDFC Bank (Bank Alpha)',
      patternType: 'FAN_IN_FAN_OUT Aggregator',
      timestamp: '10 mins ago',
      riskRating: 'CRITICAL',
      matchedAtBankBeta: true,
      matchedAccountId: 'AC-1357'
    },
    {
      hashToken: 'SHA256:1b4f0e985197199f49cbd2074e616ea3314e7a0290f372e898226b4f4b1236b6',
      sourceBank: 'State Bank of India (Bank Beta)',
      patternType: 'LAYERING_CHAIN Hop 2',
      timestamp: '25 mins ago',
      riskRating: 'HIGH',
      matchedAtBankBeta: true,
      matchedAccountId: 'AC-1362'
    },
    {
      hashToken: 'SHA256:6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
      sourceBank: 'Axis Bank',
      patternType: 'SHARED_DEVICE DEV-FRAUD-99',
      timestamp: '42 mins ago',
      riskRating: 'CRITICAL',
      matchedAtBankBeta: true,
      matchedAccountId: 'AC-1378'
    }
  ]);

  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastCount, setBroadcastCount] = useState(3);

  const handleSimulateBroadcast = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      const newHash: SharedMuleHash = {
        hashToken: `SHA256:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        sourceBank: 'ICICI Bank (Bank Gamma)',
        patternType: 'STRUCTURING Sub-Threshold Smurf',
        timestamp: 'Just now',
        riskRating: 'HIGH',
        matchedAtBankBeta: true,
        matchedAccountId: 'AC-1369'
      };
      setSharedHashes(prev => [newHash, ...prev]);
      setBroadcastCount(c => c + 1);
      setIsBroadcasting(false);
    }, 400);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-950 border border-indigo-500/40 text-indigo-400">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white text-sm">
              Cross-Bank Hash Intelligence Sharing (DIP / ASAP Paradigm)
            </h3>
            <p className="text-[11px] text-slate-400">
              Banks broadcast cryptographic token hashes of confirmed mules; peer institutions intercept coordinated rings with zero PII exposure.
            </p>
          </div>
        </div>

        <button
          onClick={handleSimulateBroadcast}
          disabled={isBroadcasting}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition self-start sm:self-auto disabled:opacity-50 shadow-md shadow-indigo-950/40"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{isBroadcasting ? 'Broadcasting...' : 'Broadcast Cryptographic Mule Hash'}</span>
        </button>
      </div>

      {/* Shared Hashes Ledger */}
      <div className="space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 flex justify-between">
          <span>Active Inter-Bank Hash Signals ({sharedHashes.length})</span>
          <span>Zero Customer Records Disclosed</span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto">
          {sharedHashes.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-400 font-bold text-[11px] truncate max-w-xs sm:max-w-md">
                    {item.hashToken}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                    {item.riskRating}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                  <span>Source: {item.sourceBank}</span>
                  <span>&bull;</span>
                  <span>Pattern: {item.patternType}</span>
                  <span>&bull;</span>
                  <span>{item.timestamp}</span>
                </div>
              </div>

              {item.matchedAtBankBeta && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Intercepted at Bank Beta ({item.matchedAccountId})</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

