import React, { useState } from 'react';
import { PlaySquare, Sparkles, ArrowRight, ShieldCheck, Layers, GitFork, UserCheck, Flame } from 'lucide-react';
import { useAnalysisStore } from '../../store/analysisStore';
import { useDatasetStore } from '../../store/datasetStore';
import { useInvestigationStore } from '../../store/investigationStore';
import { useUiStore } from '../../store/uiStore';
import { Transaction } from '../../types';

export const DemoLabPage: React.FC = () => {
  const { runAnalysis } = useAnalysisStore();
  const { accounts, transactions, addLiveTransaction } = useDatasetStore();
  const { selectAccount, selectRing } = useInvestigationStore();
  const { setActivePage, setDrawerOpen, addToast } = useUiStore();

  const [activeScenario, setActiveScenario] = useState<'fan' | 'layer' | 'merchant'>('fan');

  // Guided scenarios
  const scenarios = {
    fan: {
      id: 'fan',
      title: 'Scenario A: Fan-In / Fan-Out Coordination',
      subtitle: 'Victim aggregation & rapid multi-party dispersal',
      ringId: 'RING-01',
      aggregatorId: 'AC-1356', // Ring 1 aggregator
      desc: 'Multiple unsuspecting victim accounts transfer funds into a central aggregator mule account (AC-1356), which disperses 96% of the money to 4 distributor mules within 25 minutes.',
      steps: [
        '1. 8 victims pay ₹48,000–₹95,000 to Rohit Sharma (AC-1356).',
        '2. In-degree surges to 8 within 2 hours; pass-through ratio hits 96%.',
        '3. Aggregator splits ₹5,20,000 equally among 4 new distributor mules.',
        '4. AI flags aggregator with Risk Score 88/100 and alerts compliance.'
      ]
    },
    layer: {
      id: 'layer',
      title: 'Scenario B: Multi-Hop Layering Chain',
      subtitle: '5 hops under 45 minutes ending in ATM cashout',
      ringId: 'RING-02',
      aggregatorId: 'AC-1361',
      desc: 'Proceeds of cyber fraud are transferred sequentially across 5 intermediary mule accounts across 3 different banks, stripping small commissions at each hop and concluding in an ATM cash-out.',
      steps: [
        '1. Victim transfers ₹3,50,000 to first mule via NEFT at 11:00 PM.',
        '2. Money moves through 4 successive mules in < 8 minutes per hop.',
        '3. Average dwell time is under 12 minutes with 98.5% retention pass-through.',
        '4. Terminal hop cash-outs ₹3,15,000 at an ATM withdrawal point.'
      ]
    },
    merchant: {
      id: 'merchant',
      title: 'Scenario C: Legitimate Merchant False-Positive Protection',
      subtitle: 'High fan-in retail Kirana store with verified KYC',
      ringId: null,
      aggregatorId: 'AC-1011',
      desc: 'A genuine Kirana retail merchant receives 180+ small UPI QR payments daily from different consumers. Traditional rules would falsely flag this as a mule aggregator; MuleTrace AI applies registered merchant mitigations to keep it safely at Low Risk (24/100).',
      steps: [
        '1. Merchant receives ₹100–₹2,500 QR transactions continuously during business hours.',
        '2. High in-degree (> 150) resembles a fan-in mule aggregator topology.',
        '3. AI verifies Full KYC, registered business account type, normal balance retention, and daytime hours.',
        '4. Mitigating credit (-30 pts) prevents wrongful account freezing.'
      ]
    }
  };

  const handleLaunchScenario = (key: 'fan' | 'layer' | 'merchant') => {
    setActiveScenario(key);
    const scen = scenarios[key];

    if (scen.ringId) {
      selectRing(scen.ringId);
    }
    selectAccount(scen.aggregatorId);
    setDrawerOpen(true);
    addToast('info', `Scenario Loaded: ${scen.title}`, 'Inspecting key accounts and coordination patterns.');
  };

  // Fraud Scenario Lab Injection
  const [injectType, setInjectType] = useState('STRUCTURING');
  const [injectAmount, setInjectAmount] = useState(49200);

  const handleInjectScenario = () => {
    const fromAcc = accounts[0];
    const toAcc = accounts[1];
    const newTxn: Transaction = {
      txn_id: `INJECT-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      from_account: fromAcc.account_id,
      to_account: toAcc.account_id,
      amount: injectAmount,
      channel: 'UPI',
      transaction_status: 'COMPLETED',
      transaction_note: `Lab Injected ${injectType}`,
      reference_id: `REF${Math.floor(Math.random() * 90000000 + 10000000)}`,
      is_suspicious: true
    };

    addLiveTransaction(newTxn);
    runAnalysis(accounts, [...transactions, newTxn]);
    addToast('warning', 'Fraud Pattern Injected', `Injected ${injectType} transfer of ₹${injectAmount.toLocaleString('en-IN')}. Features recomputed.`);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-bold text-white tracking-tight">
              Guided Presentation & Fraud Scenario Lab
            </h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Interactive Demonstrator
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Step-by-step presentation walkthroughs demonstrating how the AI detects genuine mule syndicates while protecting legitimate merchants.
          </p>
        </div>
      </div>

      {/* Guided Scenarios Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(['fan', 'layer', 'merchant'] as const).map(key => {
          const s = scenarios[key];
          const isSelected = activeScenario === key;

          return (
            <div
              key={key}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-slate-900 border-amber-500 shadow-xl shadow-amber-950/20'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                  key === 'merchant'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {key === 'merchant' ? 'False-Positive Test' : 'Mule Syndicate'}
                </span>

                <h3 className="text-sm font-bold text-white font-heading mt-1">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{s.desc}</p>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-[11px] font-sans text-slate-300">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Investigation Sequence:</span>
                  {s.steps.map((st, i) => (
                    <div key={i} className="text-slate-300 leading-tight">&bull; {st}</div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleLaunchScenario(key)}
                className="w-full py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>Launch Interactive Walkthrough</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Fraud Scenario Lab: Manual Pattern Injection */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-950 border border-rose-500/40 text-rose-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-heading">
              Scenario Lab — Custom Suspicious Vector Injection
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Inject synthetic fraud patterns into the live graph to observe instantaneous model recalibration.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Pattern Type:</label>
            <select
              value={injectType}
              onChange={e => setInjectType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300"
            >
              <option value="STRUCTURING">Structuring (₹49,200 Sub-Threshold)</option>
              <option value="FAN_IN">Rapid Fan-In Burst</option>
              <option value="CIRCULAR">Circular Loop Payment</option>
              <option value="NIGHT_BURST">Unusual 3 AM Night Transfer</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Transaction Amount (₹):</label>
            <input
              type="number"
              value={injectAmount}
              onChange={e => setInjectAmount(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleInjectScenario}
              className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40"
            >
              <Flame className="w-4 h-4" /> Inject Pattern into Graph
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
