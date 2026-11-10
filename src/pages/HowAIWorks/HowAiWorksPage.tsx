import React from 'react';
import { BookOpen, Share2, Cpu, ShieldCheck, HelpCircle, Network, ArrowRight } from 'lucide-react';

export const HowAiWorksPage: React.FC = () => {
  const sections = [
    {
      num: '01',
      title: 'What is a Money Mule Account?',
      desc: 'A money mule account is a bank or UPI account used by cybercriminals to receive fraudulent proceeds and quickly disperse them into subsequent accounts or cash-out channels. Many mules in India are college students, gig workers, or rural job seekers lured by fraudulent work-from-home or commission offers, while others are shell accounts created with forged KYC.',
      keyTakeaway: 'The mule is rarely the mastermind; they are the logistical conduit.'
    },
    {
      num: '02',
      title: 'Why Traditional Transaction Rules Fail',
      desc: 'Traditional bank AML rules look at single transactions in isolation (e.g. "Flag any transfer exceeding ₹50,000"). Criminals easily bypass this through structuring (smurfing)—splitting ₹5,00,000 into ten ₹49,200 transfers. Because each transfer is below the alert threshold, individual rule-based filters see only normal activity.',
      keyTakeaway: 'Isolated transactions look innocent; the network topology exposes the coordination.'
    },
    {
      num: '03',
      title: 'Graph Analytics: Connecting Payment Vertices',
      desc: 'MuleTrace models the entire banking system as a directed, weighted graph G = (V, E). Nodes (V) represent bank accounts; directed edges (E) represent payment flows with amounts and timestamps. Graph algorithms calculate in-degree/out-degree ratios, detect directed cycles (A -> B -> C -> A), trace multi-hop shortest paths, and cluster accounts using label propagation.',
      keyTakeaway: 'Graph features expose fan-in aggregators and circular layering.'
    },
    {
      num: '04',
      title: 'Unsupervised Anomaly Detection: Isolation Forest',
      desc: 'Because fraudsters constantly invent new patterns, supervised models trained only on past fraud miss zero-day schemes. Isolation Forest (Liu et al.) isolates anomalies by recursively splitting features with random cuts. Anomalous points with extreme velocity, low dwell time, or unusual night ratios are isolated near the root with short average path length h(x).',
      keyTakeaway: 'No ground truth labels required during live inference; anomalies isolate quickly.'
    },
    {
      num: '05',
      title: 'Transparent Explainable AI (XAI) & SHAP Scoring',
      desc: 'Black-box neural networks cannot be audited in bank regulatory environments. MuleTrace uses a transparent additive scoring model with SHAP-inspired feature attribution breakdowns. Every flagged score shows exactly which factors increased risk (+24 pts for 98% pass-through, +18 pts for < 10 min dwell time) and which mitigated risk (-30 pts for verified merchant KYC).',
      keyTakeaway: 'Every score has a human-readable "Why?" and counterfactual advice.'
    },
    {
      num: '06',
      title: 'Simulated Federated Learning: Inter-Bank Defense',
      desc: 'Criminals deliberately route money across multiple competing banks (e.g. HDFC -> SBI -> ICICI) knowing banks cannot legally share raw customer transaction records. Federated Learning allows each bank to compute local model parameter gradients on its own servers, sharing only encrypted mathematical updates (FedAvg) to create a superior global defense.',
      keyTakeaway: 'Cooperation without data centralization or DPDP privacy violations.'
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-bold text-white tracking-tight">
              How MuleTrace AI Works — Technical Architecture & Concepts
            </h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Academic Primer
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            A comprehensive, non-black-box explanation of graph intelligence, Isolation Forests, and explainable scoring for academic evaluators.
          </p>
        </div>
      </div>

      {/* Concept Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sections.map((s, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl hover:border-cyan-500/40 transition flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                  SECTION {s.num}
                </span>
                <span className="text-[10px] font-mono text-slate-500">MuleTrace AI Core</span>
              </div>
              <h3 className="text-base font-bold text-white font-heading">{s.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{s.desc}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-cyan-300 font-mono flex items-center gap-2">
              <span className="text-cyan-400 font-bold shrink-0">Insight:</span>
              <span className="truncate">{s.keyTakeaway}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
