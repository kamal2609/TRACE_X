import React, { useState } from 'react';
import { 
  Search, Play, RefreshCw, Bell, Terminal, 
  Upload, Download, ShieldCheck, Database
} from 'lucide-react';
import { CsvUploadModal } from '../investigation/CsvUploadModal';
import { useAnalysisStore } from '../../store/analysisStore';
import { useDatasetStore } from '../../store/datasetStore';
import { useInvestigationStore } from '../../store/investigationStore';
import { useUiStore } from '../../store/uiStore';
import { translations } from '../../i18n';

export const Topbar: React.FC = () => {
  const { runAnalysis, isAnalyzing, lastAnalyzedAt } = useAnalysisStore();
  const { accounts, transactions, regenerate, metadata } = useDatasetStore();
  const { alerts, selectAccount } = useInvestigationStore();
  const { language, setCopilotOpen, setDrawerOpen, addToast } = useUiStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  const t = translations[language];
  const unreadAlerts = alerts.filter(a => a.status === 'OPEN').length;

  const handleRunAnalysis = () => {
    runAnalysis(accounts, transactions);
    addToast('info', 'AI Analysis Initiated', `Scanning ${accounts.length} accounts and ${transactions.length} payment vectors.`);
  };

  const handleRegenerate = () => {
    regenerate();
    addToast('info', 'Dataset Regenerated', 'New deterministic synthetic scenario created with ~400 accounts.');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    const found = accounts.find(
      a => a.account_id.toLowerCase().includes(query) ||
           a.holder_name.toLowerCase().includes(query) ||
           a.upi_id.toLowerCase().includes(query)
    );

    if (found) {
      selectAccount(found.account_id);
      setDrawerOpen(true);
      addToast('success', 'Account Located', `Viewing forensic file for ${found.account_id} (${found.holder_name})`);
    } else {
      addToast('warning', 'Not Found', `No synthetic account matched query '${searchQuery}'`);
    }
  };

  return (
    <header className="h-14 bg-slate-950/90 border-b border-slate-800/80 px-4 flex items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={t.actions.search}
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
        />
      </form>

      {/* Dataset & Execution Stats */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>Vol: ₹{(metadata.totalVolume / 10000000).toFixed(2)} Cr</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lastAnalyzedAt ? 'AI Calibrated' : 'Ready'}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
          className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-950/40 transition disabled:opacity-50"
        >
          <Play className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Analyzing...' : t.actions.runAnalysis}</span>
        </button>

        <button
          onClick={handleRegenerate}
          className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1 transition"
          title="Regenerate synthetic dataset"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          onClick={() => setIsCsvModalOpen(true)}
          className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1 transition"
          title="Import custom CSV"
        >
          <Upload className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          onClick={() => setCopilotOpen(true)}
          className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 rounded-lg text-xs transition"
          title="Open AI Investigation Copilot"
        >
          <Terminal className="w-4 h-4" />
        </button>

        {unreadAlerts > 0 && (
          <div className="relative">
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-1 animate-ping" />
            <button
              onClick={() => {}}
              className="p-1.5 bg-slate-900 border border-slate-800 text-rose-400 rounded-lg text-xs"
              title={`${unreadAlerts} active alerts`}
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <CsvUploadModal isOpen={isCsvModalOpen} onClose={() => setIsCsvModalOpen(false)} />
    </header>
  );
};
