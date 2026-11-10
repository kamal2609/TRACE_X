import React, { useState, useEffect } from 'react';
import { Search, LayoutDashboard, Share2, Layers, GitFork, BellRing, User, X } from 'lucide-react';
import { useUiStore, PageId } from '../../store/uiStore';
import { useDatasetStore } from '../../store/datasetStore';
import { useInvestigationStore } from '../../store/investigationStore';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen, setActivePage, setDrawerOpen } = useUiStore();
  const { accounts } = useDatasetStore();
  const { selectAccount, selectRing } = useInvestigationStore();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredAccounts = accounts.filter(
    a => a.account_id.toLowerCase().includes(query.toLowerCase()) ||
         a.holder_name.toLowerCase().includes(query.toLowerCase()) ||
         a.upi_id.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);

  const allPages: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'network', label: 'Network Explorer', icon: <Share2 className="w-4 h-4" /> },
    { id: 'rings', label: 'Mule Ring Investigator', icon: <Layers className="w-4 h-4" /> },
    { id: 'money', label: 'Follow the Money Path Tracing', icon: <GitFork className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alert Queue', icon: <BellRing className="w-4 h-4" /> },
    { id: 'model', label: 'Model Performance Lab', icon: <Search className="w-4 h-4" /> },
    { id: 'safetopay', label: 'Safe-to-Pay Checker', icon: <Search className="w-4 h-4" /> },
    { id: 'onboarding', label: 'Onboarding Risk Check', icon: <Search className="w-4 h-4" /> },
    { id: 'redteam', label: 'Red-Team Simulator', icon: <Search className="w-4 h-4" /> },
    { id: 'cashout', label: 'Cash-out Hotspots Map', icon: <Search className="w-4 h-4" /> },
  ];
  const pages = allPages.filter(p => p.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelectPage = (page: PageId) => {
    setActivePage(page);
    setCommandPaletteOpen(false);
  };

  const handleSelectAccount = (accId: string) => {
    selectAccount(accId);
    setDrawerOpen(true);
    setCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-100">
        <div className="p-3 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search accounts by ID (AC-xxxx), name or UPI..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 text-slate-500 hover:text-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-3 text-xs">
          {/* Navigation Pages */}
          {pages.length > 0 && (
            <div>
              <span className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Pages & Workspaces
              </span>
              <div className="mt-1 space-y-0.5">
                {pages.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPage(p.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:bg-cyan-500/15 hover:text-cyan-300 transition text-left"
                  >
                    <span className="text-cyan-400">{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Accounts */}
          {filteredAccounts.length > 0 && (
            <div>
              <span className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Accounts ({filteredAccounts.length})
              </span>
              <div className="mt-1 space-y-0.5">
                {filteredAccounts.map(a => (
                  <button
                    key={a.account_id}
                    onClick={() => handleSelectAccount(a.account_id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="font-mono text-cyan-300 font-medium">{a.account_id}</span>
                        <span className="ml-2 text-slate-400">{a.holder_name}</span>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500">{a.bank}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {pages.length === 0 && filteredAccounts.length === 0 && (
            <div className="p-6 text-center text-slate-500">
              No matching pages or synthetic accounts found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
