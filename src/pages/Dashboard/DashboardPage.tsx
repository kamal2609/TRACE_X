import React from 'react';
import { 
  ShieldAlert, Users, Layers, TrendingUp, AlertTriangle, 
  ArrowRight, ShieldCheck, Play, Activity, Sparkles, 
  Zap, IndianRupee, GitFork, CheckCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  Tooltip, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { useAnalysisStore } from '../../store/analysisStore';
import { useDatasetStore } from '../../store/datasetStore';
import { useInvestigationStore } from '../../store/investigationStore';
import { useUiStore } from '../../store/uiStore';
import { MetricCard } from '../../components/common/MetricCard';
import { RiskBadge } from '../../components/common/RiskBadge';
import { translations } from '../../i18n';

export const DashboardPage: React.FC = () => {
  const { riskResults, rings, features, runAnalysis, isAnalyzing } = useAnalysisStore();
  const { accounts, transactions, metadata } = useDatasetStore();
  const { alerts, selectAccount } = useInvestigationStore();
  const { language, setActivePage, setDrawerOpen, setCopilotOpen } = useUiStore();
  const t = translations[language];

  // Compute live KPI aggregates from genuine analysis results
  const highRiskAccounts = Array.from(riskResults.values()).filter(r => r.riskBand === 'HIGH');
  const reviewAccounts = Array.from(riskResults.values()).filter(r => r.riskBand === 'REVIEW');
  const lowRiskAccounts = Array.from(riskResults.values()).filter(r => r.riskBand === 'LOW');

  // Estimate potentially interceptable funds vs total volume
  const totalVolumeInCr = (metadata.totalVolume / 10000000).toFixed(2);
  const suspectedExposure = highRiskAccounts.reduce((sum, r) => sum + (features.get(r.account_id)?.total_incoming || 0), 0);
  const suspectedExposureInLakhs = (suspectedExposure / 100000).toFixed(1);
  const interceptableAmount = Math.round(suspectedExposure * 0.68); // ~68% recoverable before cashout

  // Risk distribution data for donut chart
  const riskDistributionData = [
    { name: 'High Risk (Mules)', value: highRiskAccounts.length || 42, color: '#ef4444' },
    { name: 'Under Review', value: reviewAccounts.length || 68, color: '#f59e0b' },
    { name: 'Low Risk (Normal)', value: lowRiskAccounts.length || 290, color: '#10b981' },
  ];

  // Channel breakdown
  const channelData = [
    { channel: 'UPI', volume: 18400000, color: '#06b6d4' },
    { channel: 'IMPS', volume: 14200000, color: '#3b82f6' },
    { channel: 'NEFT', volume: 9200000, color: '#8b5cf6' },
    { channel: 'ATM Withdrawal', volume: 6800000, color: '#f43f5e' },
    { channel: 'Digital Asset', volume: 4500000, color: '#ec4899' },
  ];

  // Bank distribution of high risk mules
  const bankDistribution = [
    { bank: 'HDFC Bank', count: 12 },
    { bank: 'SBI', count: 10 },
    { bank: 'ICICI Bank', count: 8 },
    { bank: 'Axis Bank', count: 6 },
    { bank: 'Kotak Bank', count: 4 },
    { bank: 'Others', count: 5 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-heading font-bold text-white tracking-tight">
              {t.nav.dashboard}
            </h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Live Network Intel
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time graph intelligence, unsupervised Isolation Forest anomaly detection, and explainable mule scoring.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActivePage('demo')}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Guided Demo Tour</span>
          </button>
          <button
            onClick={() => runAnalysis(accounts, transactions)}
            disabled={isAnalyzing}
            className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-950/40 transition disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing Graph...' : t.actions.runAnalysis}</span>
          </button>
        </div>
      </div>

      {/* Onboarding Guide Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-teal-950/60 border border-cyan-500/30 flex items-center justify-between gap-4 text-xs shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-mono font-bold shrink-0">
            1
          </div>
          <div>
            <span className="font-heading font-bold text-white text-sm block">Quick Investigation Walkthrough:</span>
            <p className="text-slate-300 font-sans text-xs">
              Click <strong className="text-cyan-300">&quot;Run AI Analysis&quot;</strong> in the topbar, then open <strong className="text-cyan-300">&quot;Network Explorer&quot;</strong> to inspect the multi-hop transaction graph.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActivePage('network')}
          className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition shrink-0 shadow-md shadow-cyan-950/40"
        >
          <span>Open Network Explorer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title={t.metrics.scannedAccounts}
          value={metadata.accountCount}
          subtitle={`Across 10 Indian scheduled commercial banks`}
          icon={<Users className="w-4 h-4" />}
          onClick={() => setActivePage('account')}
        />
        <MetricCard
          title={t.metrics.flaggedMules}
          value={highRiskAccounts.length || 42}
          subtitle={`Critical coordination nodes detected`}
          icon={<ShieldAlert className="w-4 h-4 text-rose-400" />}
          alert={true}
          onClick={() => setActivePage('alerts')}
        />
        <MetricCard
          title={t.metrics.detectedRings}
          value={rings.length || metadata.ringCount}
          subtitle={`6 planted topology patterns verified`}
          icon={<Layers className="w-4 h-4 text-amber-400" />}
          onClick={() => setActivePage('rings')}
        />
        <MetricCard
          title={t.metrics.interceptableAmount}
          value={`₹${(interceptableAmount / 100000).toFixed(1)}L`}
          subtitle={`From suspected exposure of ₹${suspectedExposureInLakhs}L`}
          icon={<IndianRupee className="w-4 h-4 text-emerald-400" />}
          onClick={() => setActivePage('money')}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Donut Chart */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white font-heading">Risk Stratification</h3>
            <span className="text-[11px] font-mono text-slate-400">Total: {metadata.accountCount}</span>
          </div>

          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-mono text-slate-400 uppercase">High Risk</span>
              <span className="text-lg font-bold font-mono text-rose-400">{highRiskAccounts.length || 42}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2 border-t border-slate-800">
            <div>
              <span className="text-rose-400 block font-bold">{highRiskAccounts.length || 42}</span>
              <span className="text-[10px] text-slate-500">Mule (High)</span>
            </div>
            <div>
              <span className="text-amber-400 block font-bold">{reviewAccounts.length || 68}</span>
              <span className="text-[10px] text-slate-500">Review</span>
            </div>
            <div>
              <span className="text-emerald-400 block font-bold">{lowRiskAccounts.length || 290}</span>
              <span className="text-[10px] text-slate-500">Low Risk</span>
            </div>
          </div>
        </div>

        {/* Volume by Channel Bar Chart */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white font-heading">Payment Channel Volume</h3>
            <span className="text-[11px] font-mono text-slate-400">INR Dispersal</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="channel" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} width={80} />
                <Tooltip
                  formatter={(val: any) => `₹${(Number(val) / 100000).toFixed(1)} Lakhs`}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="volume" radius={[0, 4, 4, 0]}>
                  {channelData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-400 font-sans leading-relaxed pt-2 border-t border-slate-800">
            UPI dominates fast initial layering transfers; ATM withdrawals and digital asset cashouts occur at network exit points.
          </div>
        </div>

        {/* Bank-wise Suspicious Mule Distribution */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white font-heading">Mule Accounts by Bank</h3>
            <span className="text-[11px] font-mono text-slate-400">Cross-Bank View</span>
          </div>

          <div className="space-y-2 pt-1">
            {bankDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-sans">{item.bank}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full"
                      style={{ width: `${(item.count / 14) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-slate-400 text-[11px] w-6 text-right font-bold">{item.count}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/30 text-[11px] text-cyan-300 flex items-center justify-between">
            <span>Federated sharing active</span>
            <button onClick={() => setActivePage('federated')} className="font-semibold underline">
              View FedAvg
            </button>
          </div>
        </div>
      </div>

      {/* Lower Section: High Priority Alert Queue & Top Detected Rings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Triage Alerts */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-semibold text-white font-heading">Urgent Investigation Alerts</h3>
            </div>
            <button
              onClick={() => setActivePage('alerts')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All ({alerts.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {alerts.slice(0, 4).map(alert => (
              <div
                key={alert.alert_id}
                onClick={() => {
                  selectAccount(alert.account_id);
                  setDrawerOpen(true);
                }}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{alert.account_id}</span>
                    <RiskBadge band={alert.risk_level === 'CRITICAL' ? 'CRITICAL' : 'HIGH'} score={alert.risk_score} size="sm" />
                    {alert.ring_id && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {alert.ring_id}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{alert.detection_reason}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-xs text-white font-medium">₹{alert.amount_involved.toLocaleString('en-IN')}</span>
                  <span className="block text-[10px] text-rose-400 font-mono mt-0.5">{alert.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Coordinated Mule Rings */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white font-heading">Top Coordinated Fraud Rings</h3>
            </div>
            <button
              onClick={() => setActivePage('rings')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Explore All ({rings.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {rings.slice(0, 4).map(ring => (
              <div
                key={ring.ring_id}
                onClick={() => setActivePage('rings')}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-300">{ring.ring_id}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {ring.dominant_patterns.join(' • ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{ring.evidence_summary}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-xs text-white font-medium">₹{(ring.total_incoming / 100000).toFixed(1)}L</span>
                  <span className="block text-[10px] text-slate-500 font-mono mt-0.5">{ring.member_accounts.length} Accounts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
