import React, { useState } from 'react';
import { Share2, Download, Info, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { useAnalysisStore } from '../../store/analysisStore';
import { useDatasetStore } from '../../store/datasetStore';
import { useInvestigationStore } from '../../store/investigationStore';
import { CytoscapeGraph } from '../../components/graph/CytoscapeGraph';
import { exportDatasetToJson } from '../../data/csvHandler';

export const NetworkExplorerPage: React.FC = () => {
  const { graph, rings, riskResults } = useAnalysisStore();
  const { accounts, transactions } = useDatasetStore();
  const { selectedRingId } = useInvestigationStore();
  const [activeHighlightRing, setActiveHighlightRing] = useState<string | null>(selectedRingId);

  const handleExportGraph = () => {
    const jsonStr = exportDatasetToJson(accounts, transactions);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `muletrace_network_graph_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-4 max-w-[1600px] mx-auto h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-bold text-white tracking-tight">
              Interactive Network Explorer
            </h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Graph Engine (Cytoscape.js)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Directed money flow graph representing accounts as vertices and transactions as weighted payment edges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick ring highlight dropdown */}
          <select
            value={activeHighlightRing || 'ALL'}
            onChange={e => setActiveHighlightRing(e.target.value === 'ALL' ? null : e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Isolate Fraud Ring...</option>
            {rings.map(r => (
              <option key={r.ring_id} value={r.ring_id}>
                {r.ring_id} ({r.dominant_patterns[0]})
              </option>
            ))}
          </select>

          <button
            onClick={handleExportGraph}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Graph</span>
          </button>
        </div>
      </div>

      {/* Main Graph Canvas */}
      <div className="flex-1 w-full relative min-h-0">
        <CytoscapeGraph
          accounts={accounts}
          transactions={transactions}
          graph={graph}
          highlightRingId={activeHighlightRing}
        />
      </div>
    </div>
  );
};
