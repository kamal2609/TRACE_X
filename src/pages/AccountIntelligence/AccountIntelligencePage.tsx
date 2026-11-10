import React, { useState, useMemo } from 'react';
import { Search, Filter, UserCheck, ShieldAlert, Download, Eye, ArrowUpDown } from 'lucide-react';
import { useDatasetStore } from '../../store/datasetStore';
import { useAnalysisStore } from '../../store/analysisStore';
import { useInvestigationStore } from '../../store/investigationStore';
import { useUiStore } from '../../store/uiStore';
import { RiskBadge } from '../../components/common/RiskBadge';
import { exportAccountsToCsv } from '../../data/csvHandler';

export const AccountIntelligencePage: React.FC = () => {
  const { accounts } = useDatasetStore();
  const { riskResults, features } = useAnalysisStore();
  const { selectAccount } = useInvestigationStore();
  const { setDrawerOpen } = useUiStore();

  const [search, setSearch] = useState('');
  const [bankFilter, setBankFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [recruitmentOnly, setRecruitmentOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'risk' | 'income' | 'age'>('risk');

  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      const res = riskResults.get(acc.account_id);
      if (recruitmentOnly && !res?.isRecruitmentSuspect) return false;
      if (riskFilter !== 'ALL' && res?.riskBand !== riskFilter) return false;
      if (bankFilter !== 'ALL' && !acc.bank.includes(bankFilter)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return acc.account_id.toLowerCase().includes(q) ||
               acc.holder_name.toLowerCase().includes(q) ||
               acc.upi_id.toLowerCase().includes(q);
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'risk') {
        const scoreA = riskResults.get(a.account_id)?.finalScore || 0;
        const scoreB = riskResults.get(b.account_id)?.finalScore || 0;
        return scoreB - scoreA;
      } else if (sortBy === 'income') {
        return (b.declared_monthly_income || 0) - (a.declared_monthly_income || 0);
      } else {
        return a.account_age_days - b.account_age_days;
      }
    });
  }, [accounts, riskResults, search, bankFilter, riskFilter, sortBy]);

  const handleExportCsv = () => {
    const csvStr = exportAccountsToCsv(filteredAccounts);
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `muletrace_accounts_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-bold text-white tracking-tight">
              Account Forensic Intelligence
            </h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {filteredAccounts.length} Filtered Records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Full account directory with calculated dwell time, pass-through ratio, and fused AI risk classification.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search account ID, name, or UPI..."
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans w-64"
            />
          </div>

          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Risk Bands</option>
            <option value="HIGH">High Risk (Mules)</option>
            <option value="REVIEW">Under Review</option>
            <option value="LOW">Low Risk (Normal)</option>
          </select>

          <select
            value={bankFilter}
            onChange={e => setBankFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Banks</option>
            <option value="HDFC">HDFC Bank</option>
            <option value="State Bank">State Bank of India</option>
            <option value="ICICI">ICICI Bank</option>
            <option value="Axis">Axis Bank</option>
            <option value="Kotak">Kotak Mahindra</option>
            <option value="Punjab">Punjab National Bank</option>
          </select>

          <button
            onClick={() => setRecruitmentOnly(!recruitmentOnly)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium transition ${
              recruitmentOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {recruitmentOnly ? '✓ Recruited Mules Filtered' : 'Filter Recruited Mules'}
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="risk">Mule Risk Score</option>
            <option value="income">Declared Income</option>
            <option value="age">Account Age (Newest)</option>
          </select>
        </div>
      </div>

      {/* Account Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Account ID</th>
                <th className="py-3 px-4">Holder & Bank</th>
                <th className="py-3 px-4">KYC & Age</th>
                <th className="py-3 px-4">Income Discrepancy</th>
                <th className="py-3 px-4">Pass-Through</th>
                <th className="py-3 px-4">Dwell Time</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAccounts.slice(0, 40).map(acc => {
                const res = riskResults.get(acc.account_id);
                const feat = features.get(acc.account_id);
                const score = res?.finalScore || 20;
                const band = res?.riskBand || 'LOW';
                const passThrough = feat ? (feat.pass_through_ratio * 100).toFixed(0) : '0';
                const dwellMinutes = feat?.min_dwell_time_minutes ?? 1440;

                return (
                  <tr
                    key={acc.account_id}
                    onClick={() => {
                      selectAccount(acc.account_id);
                      setDrawerOpen(true);
                    }}
                    className="hover:bg-slate-800/40 cursor-pointer transition"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                      {acc.account_id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200">{acc.holder_name}</div>
                      <div className="text-[11px] text-slate-400 font-sans">{acc.bank} • {acc.city}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <span className="text-slate-300">{acc.kyc_level}</span>
                      <span className="text-slate-500 block">{acc.account_age_days} days old</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <span className={feat && feat.income_mismatch_ratio > 3 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {feat ? `${feat.income_mismatch_ratio}x` : '1.0x'}
                      </span>
                      <span className="text-slate-500 block">₹{(acc.declared_monthly_income / 1000).toFixed(0)}k/mo</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <span className={Number(passThrough) > 85 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {passThrough}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <span className={dwellMinutes < 20 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                        {dwellMinutes < 60 ? `${dwellMinutes}m` : `${Math.round(dwellMinutes / 60)}h`}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge band={band} score={score} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          selectAccount(acc.account_id);
                          setDrawerOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition"
                        title="Inspect account file"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
