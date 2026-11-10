import React, { useEffect, useRef, useState, useMemo } from 'react';
import cytoscape, { Core, EventObject } from 'cytoscape';
import { 
  ZoomIn, ZoomOut, Maximize2, RefreshCw, Eye, 
  Filter, Search, Layers, ShieldAlert 
} from 'lucide-react';
import { Account, Transaction, RiskBand } from '../../types';
import { DirectedGraph } from '../../engine/graphBuilder';
import { useInvestigationStore } from '../../store/investigationStore';
import { useAnalysisStore } from '../../store/analysisStore';
import { useUiStore } from '../../store/uiStore';

interface CytoscapeGraphProps {
  accounts: Account[];
  transactions: Transaction[];
  graph: DirectedGraph | null;
  highlightRingId?: string | null;
  onSelectNode?: (accountId: string) => void;
}

export const CytoscapeGraph: React.FC<CytoscapeGraphProps> = ({
  accounts,
  transactions,
  graph,
  highlightRingId,
  onSelectNode
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  const { riskResults, rings } = useAnalysisStore();
  const { selectAccount } = useInvestigationStore();
  const { setDrawerOpen } = useUiStore();

  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH' | 'REVIEW' | 'LOW'>('ALL');
  const [selectedRingFilter, setSelectedRingFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLabels, setShowLabels] = useState(false);
  const [minAmountFilter, setMinAmountFilter] = useState<number>(0);

  // Filter accounts based on user selections
  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      const res = riskResults.get(acc.account_id);
      if (riskFilter !== 'ALL') {
        if (!res || res.riskBand !== riskFilter) return false;
      }
      if (selectedRingFilter !== 'ALL') {
        if (acc.fraud_ring_id !== selectedRingFilter) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = acc.account_id.toLowerCase().includes(q) ||
                      acc.holder_name.toLowerCase().includes(q) ||
                      acc.upi_id.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [accounts, riskResults, riskFilter, selectedRingFilter, searchQuery]);

  const filteredAccountIds = useMemo(() => {
    return new Set(filteredAccounts.map(a => a.account_id));
  }, [filteredAccounts]);

  // Build cytoscape elements
  useEffect(() => {
    if (!containerRef.current || !graph) return;

    // Build elements
    const elements: any[] = [];

    // Nodes
    filteredAccounts.forEach(acc => {
      const res = riskResults.get(acc.account_id);
      const riskBand = res?.riskBand || 'LOW';
      const score = res?.finalScore || 20;

      let nodeColor = '#10b981'; // emerald
      if (riskBand === 'HIGH') nodeColor = '#ef4444'; // rose/vermilion
      else if (riskBand === 'REVIEW') nodeColor = '#f59e0b'; // amber

      // Size scaled by total incoming/outgoing volume
      const outDegree = graph.adjacencyOut.get(acc.account_id)?.size || 0;
      const inDegree = graph.adjacencyIn.get(acc.account_id)?.size || 0;
      const nodeSize = Math.min(36, Math.max(12, 10 + (inDegree + outDegree) * 2));

      elements.push({
        data: {
          id: acc.account_id,
          label: acc.account_id,
          name: acc.holder_name,
          riskBand,
          score,
          color: nodeColor,
          size: nodeSize,
          ringId: acc.fraud_ring_id || 'NONE'
        }
      });
    });

    // Edges
    const addedEdges = new Set<string>();
    transactions.forEach(t => {
      if (!filteredAccountIds.has(t.from_account) || !filteredAccountIds.has(t.to_account)) {
        return;
      }
      if (minAmountFilter > 0 && t.amount < minAmountFilter) {
        return;
      }

      const edgeKey = `${t.from_account}->${t.to_account}`;
      if (!addedEdges.has(edgeKey)) {
        addedEdges.add(edgeKey);
        const edgeData = graph.edges.get(edgeKey);
        const amount = edgeData?.totalAmount || t.amount;
        const isSuspicious = t.is_suspicious;

        elements.push({
          data: {
            id: edgeKey,
            source: t.from_account,
            target: t.to_account,
            amount,
            isSuspicious: !!isSuspicious,
            width: Math.min(6, Math.max(1, Math.log10(amount + 1) - 2)),
            color: isSuspicious ? '#ef4444' : '#1e3a5f'
          }
        });
      }
    });

    // Initialize Cytoscape
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      boxSelectionEnabled: false,
      autounselectify: false,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'width': 'data(size)',
            'height': 'data(size)',
            'label': showLabels ? 'data(label)' : '',
            'color': '#cbd5e1',
            'font-size': '9px',
            'font-family': 'JetBrains Mono, monospace',
            'text-valign': 'bottom',
            'text-margin-y': 4,
            'border-width': 1.5,
            'border-color': '#0f172a',
            'transition-property': 'background-color, width, height, border-color',
            'transition-duration': 0.2
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 3,
            'border-color': '#38bdf8'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 'data(width)',
            'line-color': 'data(color)',
            'target-arrow-color': 'data(color)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 0.7,
            'opacity': 0.65
          }
        },
        {
          selector: 'edge[?isSuspicious]',
          style: {
            'line-color': '#f43f5e',
            'target-arrow-color': '#f43f5e',
            'opacity': 0.9,
            'line-style': 'dashed'
          }
        }
      ],
      layout: {
        name: 'cose',
        animate: false,
        randomize: false,
        componentSpacing: 60,
        nodeOverlap: 20,
        idealEdgeLength: 60,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 400
      }
    });

    // Node click handler
    cy.on('tap', 'node', (evt: EventObject) => {
      const node = evt.target;
      const accountId = node.id();
      if (onSelectNode) {
        onSelectNode(accountId);
      } else {
        selectAccount(accountId);
        setDrawerOpen(true);
      }
    });

    // Highlight community/ring if specified
    if (highlightRingId && highlightRingId !== 'ALL') {
      cy.batch(() => {
        cy.nodes().forEach(n => {
          if (n.data('ringId') === highlightRingId) {
            n.style({ 'border-color': '#38bdf8', 'border-width': 4 });
          } else {
            n.style({ opacity: 0.2 });
          }
        });
        cy.edges().forEach(e => {
          const s = e.source().data('ringId');
          const t = e.target().data('ringId');
          if (s === highlightRingId && t === highlightRingId) {
            e.style({ 'line-color': '#38bdf8', 'target-arrow-color': '#38bdf8', opacity: 1 });
          } else {
            e.style({ opacity: 0.1 });
          }
        });
      });
    }

    cyRef.current = cy;

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, [filteredAccounts, filteredAccountIds, transactions, graph, riskResults, showLabels, highlightRingId, minAmountFilter, onSelectNode, selectAccount, setDrawerOpen]);

  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit(undefined, 30);
  const handleResetLayout = () => {
    cyRef.current?.layout({ name: 'cose', animate: true, animationDuration: 500 }).run();
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden flex flex-col">
      {/* Top Filter & Search Bar */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 z-10 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2">
          {/* Risk Band Filter */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            {(['ALL', 'HIGH', 'REVIEW', 'LOW'] as const).map(b => (
              <button
                key={b}
                onClick={() => setRiskFilter(b)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition ${
                  riskFilter === b
                    ? b === 'HIGH'
                      ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40'
                      : b === 'REVIEW'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Ring Filter */}
          <select
            value={selectedRingFilter}
            onChange={e => setSelectedRingFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Rings (6 Active)</option>
            {rings.map(r => (
              <option key={r.ring_id} value={r.ring_id}>
                {r.ring_id} ({r.dominant_patterns[0]})
              </option>
            ))}
          </select>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter graph node..."
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono w-40"
            />
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-mono flex items-center gap-1 transition ${
              showLabels
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Labels
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleFit}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
            title="Fit to view"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetLayout}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
            title="Rearrange graph layout"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cytoscape Canvas Container */}
      <div className="relative flex-1 w-full h-full min-h-[440px]">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Graph Legend Floating Box */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl backdrop-blur-md text-[11px] font-mono space-y-1.5 pointer-events-none select-none">
          <div className="text-[10px] uppercase font-bold text-slate-400">Network Legend</div>
          <div className="flex items-center gap-2 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> High Risk Mule Account
          </div>
          <div className="flex items-center gap-2 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Review Candidate
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low Risk Account
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-4 h-0.5 bg-rose-500 border-dashed" /> Flagged Money Transfer
          </div>
        </div>

        {/* Node stats count pill */}
        <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-full text-[11px] font-mono text-slate-400 backdrop-blur-md">
          {filteredAccounts.length} nodes rendered
        </div>
      </div>
    </div>
  );
};
