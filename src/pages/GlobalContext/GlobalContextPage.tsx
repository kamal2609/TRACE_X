import React from 'react';
import { Globe, ExternalLink, ShieldCheck, Landmark, CheckCircle, ArrowRight } from 'lucide-react';

export const GlobalContextPage: React.FC = () => {
  const indianInitiatives = [
    {
      title: 'RBI MuleHunter.AI',
      org: 'Reserve Bank Innovation Hub (RBIH)',
      desc: 'Collaborative AI initiative between RBI Innovation Hub and leading Indian banks to detect mule accounts across the banking ecosystem using predictive machine learning models.',
      url: 'https://docs.rbihub.in/mule-hunter',
      tag: 'AI/ML Mule Detection'
    },
    {
      title: 'DoT Financial Fraud Risk Indicator (FFRI)',
      org: 'Department of Telecommunications & DIP',
      desc: 'Classifies mobile numbers linked to financial accounts into Medium, High, and Very High risk using intelligence inputs from NCRP and telecom analytics via Digital Intelligence Platform.',
      url: 'https://www.dot.gov.in/',
      tag: 'SIM/Telecom Risk Scoring'
    },
    {
      title: 'I4C Suspect Registry & Helpline 1930',
      org: 'Indian Cyber Crime Coordination Centre (MHA)',
      desc: 'National citizen cybercrime helpline (1930) and central suspect registry enabling rapid golden-hour fund freezing coordination between law enforcement and 300+ banks.',
      url: 'https://cybercrime.gov.in/',
      tag: 'Citizen Helpline & Interdiction'
    },
    {
      title: 'NPCI UPI Safety & Friction Signals',
      org: 'National Payments Corporation of India',
      desc: 'Real-time payment risk checks, risk scoring at transaction initiation, and payer warning prompts on suspect beneficiary VPA handles across UPI apps.',
      url: 'https://www.npci.org.in/',
      tag: 'UPI Ecosystem Safeguards'
    }
  ];

  const internationalInitiatives = [
    {
      country: 'South Korea',
      title: 'ASAP (Anti-phishing Sharing & Analysis)',
      org: 'Financial Services Commission (FSC)',
      desc: 'Interbank real-time sharing platform where suspected mule account IDs and phishing telephone numbers are broadcast instantly across all financial institutions to freeze exit nodes.',
      lesson: 'Low-latency automated inter-bank indicator broadcasting.'
    },
    {
      country: 'United Kingdom',
      title: 'Confirmation of Payee & APP Reimbursement',
      org: 'Payment Systems Regulator (PSR)',
      desc: 'Mandatory pre-transfer beneficiary name matching (CoP) combined with mandatory split reimbursement between sending and receiving banks for authorized push payment fraud.',
      lesson: 'Incentivizes receiving banks to eliminate mule recruitment on their rails.'
    },
    {
      country: 'Singapore',
      title: 'Shared Responsibility Framework (SRF)',
      org: 'Monetary Authority of Singapore (MAS)',
      desc: 'Defines transparent liability apportionment between financial institutions, telecom operators, and customers for unauthorized phishing scams.',
      lesson: 'Multi-stakeholder accountability bridging telecom and banking.'
    },
    {
      country: 'Australia',
      title: 'Scam-Safe Accord & NASC',
      org: 'Australian Banking Association (ABA)',
      desc: 'Unified banking intelligence accord deploying cross-bank payee verification, high-risk payment delays, and biometrics to choke scam proceeds.',
      lesson: 'Standardized payment friction on first-time high-risk transfers.'
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-bold text-white tracking-tight">
              Indian Regulatory Context & Global Fraud Intelligence
            </h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Institutional Research
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Analysis of real-world regulatory frameworks: RBIH MuleHunter.AI, DoT FFRI/DIP, I4C 1930, and foreign best practices.
          </p>
        </div>
      </div>

      {/* Indian Initiatives Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white font-heading flex items-center gap-2">
          <Landmark className="w-4 h-4 text-cyan-400" />
          <span>India&apos;s National Financial Crime Countermeasures</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {indianInitiatives.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 shadow-xl hover:border-cyan-500/40 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30">
                  {item.tag}
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-white transition flex items-center gap-1 text-[11px]"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <h4 className="text-sm font-bold text-white font-heading">{item.title}</h4>
              <p className="text-[11px] font-mono text-cyan-400">{item.org}</p>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Global Comparative Matrix */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white font-heading">
              International Fraud Intelligence Comparison Matrix
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Cross-Jurisdiction Policy Study</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4">Initiative & Agency</th>
                <th className="py-3 px-4">Core Mechanism</th>
                <th className="py-3 px-4">Key Takeaway for MuleTrace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {internationalInitiatives.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-mono font-bold text-white">{item.country}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-cyan-300 block">{item.title}</span>
                    <span className="text-[11px] text-slate-400 font-sans">{item.org}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans max-w-xs leading-relaxed">{item.desc}</td>
                  <td className="py-3 px-4 text-emerald-400 font-mono text-[11px]">{item.lesson}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
