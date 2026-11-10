import React, { useState } from 'react';
import { UserPlus, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Smartphone, ShieldCheck } from 'lucide-react';

export const OnboardingRiskPage: React.FC = () => {
  const [ageGroup, setAgeGroup] = useState<'18-25' | '26-35' | '36-50' | '51+'>('18-25');
  const [declaredIncome, setDeclaredIncome] = useState(18000);
  const [kycLevel, setKycLevel] = useState<'FULL' | 'MINIMUM' | 'SIMPLIFIED'>('MINIMUM');
  const [deviceIdStatus, setDeviceIdStatus] = useState<'NEW' | 'SHARED_PREVIOUSLY'>('SHARED_PREVIOUSLY');
  const [accountType, setAccountType] = useState('SAVINGS');

  // Calculate pre-opening risk score
  const score = React.useMemo(() => {
    let pts = 10;
    if (ageGroup === '18-25') pts += 15;
    if (declaredIncome < 25000) pts += 15;
    if (kycLevel === 'MINIMUM') pts += 25;
    else if (kycLevel === 'SIMPLIFIED') pts += 15;
    if (deviceIdStatus === 'SHARED_PREVIOUSLY') pts += 35;
    return Math.min(100, pts);
  }, [ageGroup, declaredIncome, kycLevel, deviceIdStatus]);

  const riskBand = score >= 66 ? 'HIGH' : score >= 35 ? 'REVIEW' : 'LOW';

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
          <UserPlus className="w-4 h-4" /> Pre-Account Opening Defense
        </div>
        <h1 className="text-2xl font-bold font-heading text-white tracking-tight">
          Applicant Onboarding Risk Profiler
        </h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Score prospective account applications prior to debit card issuance to prevent synthetic identity rings and recruited student mule accounts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Inputs */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl text-xs font-sans">
          <h3 className="font-heading font-bold text-white text-sm">Application Attributes</h3>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase">Age Group:</label>
            <select
              value={ageGroup}
              onChange={e => setAgeGroup(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
            >
              <option value="18-25">18-25 (High Recruitment Risk)</option>
              <option value="26-35">26-35 Years</option>
              <option value="36-50">36-50 Years</option>
              <option value="51+">51+ Years</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase">Declared Monthly Income (₹):</label>
            <input
              type="number"
              value={declaredIncome}
              onChange={e => setDeclaredIncome(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase">KYC Verification Tier:</label>
            <select
              value={kycLevel}
              onChange={e => setKycLevel(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
            >
              <option value="FULL">Full Biometric / Video KYC (Lowest Risk)</option>
              <option value="MINIMUM">Minimum OTP KYC (High Risk)</option>
              <option value="SIMPLIFIED">Simplified KYC (Moderate Risk)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase">Device Hardware Fingerprint:</label>
            <select
              value={deviceIdStatus}
              onChange={e => setDeviceIdStatus(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
            >
              <option value="SHARED_PREVIOUSLY">Shared Hardware with Existing Flagged Mules (DEV-SHARED)</option>
              <option value="NEW">Unique Unseen Hardware Fingerprint</option>
            </select>
          </div>
        </div>

        {/* Prediction Output */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 shadow-xl ${
          riskBand === 'HIGH' ? 'bg-rose-950/20 border-rose-500/40' : riskBand === 'REVIEW' ? 'bg-amber-950/20 border-amber-500/40' : 'bg-emerald-950/20 border-emerald-500/40'
        }`}>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Onboarding Vulnerability Assessment</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className={`text-2xl font-bold font-heading ${
                riskBand === 'HIGH' ? 'text-rose-400' : riskBand === 'REVIEW' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {riskBand === 'HIGH' ? 'ELEVATED ONBOARDING RISK' : riskBand === 'REVIEW' ? 'MODERATE ONBOARDING RISK' : 'LOW ONBOARDING RISK'}
              </h3>
              <span className="text-3xl font-mono font-bold text-white">{score}/100</span>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-300 font-sans">
              <span className="font-mono text-[10px] font-bold text-slate-400 uppercase block">Recommended Underwriting Safeguards:</span>
              {riskBand === 'HIGH' ? (
                <ul className="space-y-1.5 list-disc list-inside text-rose-200">
                  <li>Enforce mandatory in-person biometric / Video KYC prior to activation.</li>
                  <li>Impose ₹25,000 daily outgoing UPI limit for initial 30 days.</li>
                  <li>Activate 24-hour cooling period on first-time incoming credits &gt; ₹50,000.</li>
                </ul>
              ) : (
                <p className="text-slate-300">
                  Standard account opening parameters approved. No anomalous device cluster or demographic risk spike observed.
                </p>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
            Complies with RBI KYC/AML master directives and synthetic customer onboarding protocols.
          </div>
        </div>
      </div>
    </div>
  );
};
