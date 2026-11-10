import React from 'react';
import { 
  ShieldAlert, LayoutDashboard, Share2, UserCheck, 
  Layers, GitFork, BellRing, Activity, Cpu, Scale, 
  Network, Globe, BookOpen, FileCheck, PlaySquare, 
  CheckCircle, UserPlus, Flame, MapPin, Moon, Sun, 
  Languages, Terminal
} from 'lucide-react';
import { useUiStore, PageId } from '../../store/uiStore';
import { useDatasetStore } from '../../store/datasetStore';
import { useInvestigationStore } from '../../store/investigationStore';
import { translations, Language } from '../../i18n';

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, language, setLanguage, theme, toggleTheme, setCommandPaletteOpen, setCopilotOpen } = useUiStore();
  const { metadata } = useDatasetStore();
  const { alerts } = useInvestigationStore();
  const t = translations[language];

  const openAlertsCount = alerts.filter(a => a.status === 'OPEN').length;

  const navGroups: {
    title: string;
    items: { id: PageId; label: string; icon: React.ReactNode; badge?: number | string }[];
  }[] = [
    {
      title: 'Investigation Workspace',
      items: [
        { id: 'dashboard', label: t.nav.dashboard, icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'network', label: t.nav.networkExplorer, icon: <Share2 className="w-4 h-4" /> },
        { id: 'account', label: t.nav.accountIntel, icon: <UserCheck className="w-4 h-4" /> },
        { id: 'rings', label: t.nav.ringInvestigator, icon: <Layers className="w-4 h-4" />, badge: metadata.ringCount },
        { id: 'money', label: t.nav.followMoney, icon: <GitFork className="w-4 h-4" /> },
        { id: 'alerts', label: t.nav.alertQueue, icon: <BellRing className="w-4 h-4" />, badge: openAlertsCount > 0 ? openAlertsCount : undefined },
      ]
    },
    {
      title: 'Operational Detection',
      items: [
        { id: 'live', label: t.nav.liveMonitoring, icon: <Activity className="w-4 h-4" />, badge: 'LIVE' },
        { id: 'safetopay', label: t.nav.safeToPay, icon: <CheckCircle className="w-4 h-4" /> },
        { id: 'onboarding', label: t.nav.onboardingCheck, icon: <UserPlus className="w-4 h-4" /> },
        { id: 'redteam', label: t.nav.redTeam, icon: <Flame className="w-4 h-4" /> },
        { id: 'cashout', label: t.nav.cashoutMap, icon: <MapPin className="w-4 h-4" /> },
      ]
    },
    {
      title: 'AI Lab & Governance',
      items: [
        { id: 'model', label: t.nav.modelLab, icon: <Cpu className="w-4 h-4" /> },
        { id: 'fairness', label: t.nav.fairnessPrivacy, icon: <Scale className="w-4 h-4" /> },
        { id: 'federated', label: t.nav.federatedLearning, icon: <Network className="w-4 h-4" /> },
        { id: 'global', label: t.nav.globalContext, icon: <Globe className="w-4 h-4" /> },
        { id: 'howai', label: t.nav.howAiWorks, icon: <BookOpen className="w-4 h-4" /> },
        { id: 'reports', label: t.nav.reports, icon: <FileCheck className="w-4 h-4" /> },
        { id: 'demo', label: t.nav.demoLab, icon: <PlaySquare className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col h-screen shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-cyan-950/40">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-white text-base tracking-tight">MuleTrace</span>
              <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-500/30">AI</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Financial Crime Intel</p>
          </div>
        </div>
      </div>

      {/* Quick Copilot & Command Buttons */}
      <div className="p-2.5 border-b border-slate-800/60 grid grid-cols-2 gap-1.5">
        <button
          onClick={() => setCopilotOpen(true)}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 flex items-center justify-center gap-1.5 transition"
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Copilot
        </button>
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-400 flex items-center justify-center gap-1 transition"
        >
          <span>Ctrl+K</span>
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <h5 className="px-2.5 text-[10px] uppercase font-mono font-semibold tracking-wider text-slate-500">
              {group.title}
            </h5>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                        item.badge === 'LIVE'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                          : isActive
                          ? 'bg-cyan-500/30 text-cyan-200'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer System Controls */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950 space-y-2 text-xs">
        {/* Language & Theme Selectors */}
        <div className="flex items-center justify-between gap-1 text-slate-400">
          <div className="flex items-center gap-1">
            <Languages className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={language}
              onChange={e => setLanguage(e.target.value as Language)}
              className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[11px] text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="en">English (EN)</option>
              <option value="hi">हिंदी (HI)</option>
              <option value="kn">ಕನ್ನಡ (KN)</option>
            </select>
          </div>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Dataset telemetry */}
        <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>Seed: {metadata.seed}</span>
          <span>{metadata.accountCount} acc • {metadata.transactionCount} tx</span>
        </div>
      </div>
    </aside>
  );
};
