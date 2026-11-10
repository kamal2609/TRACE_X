import React, { useState } from 'react';
import { Terminal, X, Send, Bot, User, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useAnalysisStore } from '../../store/analysisStore';
import { useDatasetStore } from '../../store/datasetStore';
import { useInvestigationStore } from '../../store/investigationStore';

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  actionPayload?: { type: 'selectAccount'; accountId: string } | { type: 'selectRing'; ringId: string };
}

export const CopilotModal: React.FC = () => {
  const { isCopilotOpen, setCopilotOpen, setDrawerOpen } = useUiStore();
  const { riskResults, features, rings, graph } = useAnalysisStore();
  const { accounts, transactions } = useDatasetStore();
  const { selectAccount, selectRing } = useInvestigationStore();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'copilot',
      text: 'Greetings Analyst. I am the MuleTrace Offline Intelligence Copilot. I can query currently loaded transactions, explain risk drivers, isolate rings, and identify optimal freeze points. Ask a question or click a prompt below.',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  if (!isCopilotOpen) return null;

  const quickPrompts = [
    'Show top 5 highest risk mule accounts',
    'Which ring moved the largest amount?',
    'Show false-positive merchant protection',
    'Which account has highest pass-through ratio?'
  ];

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Deterministic offline response logic
    setTimeout(() => {
      const qLower = query.toLowerCase();
      let responseText = '';
      let payload: ChatMessage['actionPayload'];

      if (qLower.includes('top') && (qLower.includes('risk') || qLower.includes('mule'))) {
        const sorted = Array.from(riskResults.values()).sort((a, b) => b.finalScore - a.finalScore).slice(0, 5);
        responseText = `Here are the top 5 highest risk accounts:\n` +
          sorted.map((r, i) => `${i + 1}. ${r.account_id}: Risk Score ${r.finalScore}/100 (${r.riskBand}) — ${r.explanationEn}`).join('\n\n');
        payload = { type: 'selectAccount', accountId: sorted[0].account_id };
      } else if (qLower.includes('largest ring') || (qLower.includes('ring') && qLower.includes('amount'))) {
        if (rings.length > 0) {
          const sortedRings = [...rings].sort((a, b) => b.total_incoming - a.total_incoming);
          const topRing = sortedRings[0];
          responseText = `Ring ${topRing.ring_id} moved the largest volume: ₹${topRing.total_incoming.toLocaleString('en-IN')} across ${topRing.member_accounts.length} member accounts with dominant patterns: ${topRing.dominant_patterns.join(', ')}. Evidence: ${topRing.evidence_summary}`;
          payload = { type: 'selectRing', ringId: topRing.ring_id };
        } else {
          responseText = 'No rings currently computed. Please run AI analysis first.';
        }
      } else if (qLower.includes('merchant') || qLower.includes('false positive')) {
        const merchant = accounts.find(a => a.ground_truth_label === 'MERCHANT_FALSE_POSITIVE');
        if (merchant) {
          const res = riskResults.get(merchant.account_id);
          responseText = `Identified legitimate lookalike: ${merchant.account_id} (${merchant.holder_name}) is a registered retail merchant. Despite high customer inflow, our merchant mitigation rule lowered risk to ${res?.finalScore || 22}/100 (${res?.riskBand || 'LOW'}), successfully preventing a wrongful account freeze.`;
          payload = { type: 'selectAccount', accountId: merchant.account_id };
        } else {
          responseText = 'No false positive merchant found in current dataset partition.';
        }
      } else if (qLower.includes('pass-through')) {
        let highestPassAcc = '';
        let highestRatio = -1;
        features.forEach((f, accId) => {
          if (f.pass_through_ratio > highestRatio && f.total_incoming > 50000) {
            highestRatio = f.pass_through_ratio;
            highestPassAcc = accId;
          }
        });
        const res = riskResults.get(highestPassAcc);
        responseText = `Account ${highestPassAcc} exhibits the highest pass-through ratio (${(highestRatio * 100).toFixed(1)}%). It rapidly disperses almost 100% of incoming funds within minutes. Risk Score: ${res?.finalScore}/100.`;
        payload = { type: 'selectAccount', accountId: highestPassAcc };
      } else if (qLower.includes('ac-') || qLower.includes('account')) {
        const match = qLower.match(/ac-\d+/);
        const accId = match ? match[0].toUpperCase() : null;
        if (accId && riskResults.has(accId)) {
          const res = riskResults.get(accId)!;
          const acc = accounts.find(a => a.account_id === accId);
          responseText = `Forensic assessment for ${accId} (${acc?.holder_name}):\n- Risk Band: ${res.riskBand} (${res.finalScore}/100)\n- Graph Behavior: ${res.graphBehaviorScore}/100\n- Isolation Forest Anomaly: ${res.anomalyScore}/100\n- Key Reason: ${res.explanationEn}\n- Recommended Action: ${res.recommendedAction}`;
          payload = { type: 'selectAccount', accountId: accId };
        } else {
          responseText = `Could not locate account. Please ensure the account ID follows format AC-xxxx.`;
        }
      } else {
        responseText = `Based on current network telemetry across ${accounts.length} accounts and ${transactions.length} transactions:\n` +
          `- Identified ${rings.length} coordinated mule rings\n` +
          `- Found ${Array.from(riskResults.values()).filter(r => r.riskBand === 'HIGH').length} high risk accounts\n` +
          `Try asking about a specific account (e.g. 'Why is AC-1001 flagged?'), 'largest ring', or 'show false-positive merchant'.`;
      }

      const copilotMsg: ChatMessage = {
        id: `copilot-${Date.now()}`,
        sender: 'copilot',
        text: responseText,
        timestamp: new Date().toLocaleTimeString(),
        actionPayload: payload
      };

      setMessages(prev => [...prev, copilotMsg]);
    }, 250);
  };

  const handleActionClick = (payload: ChatMessage['actionPayload']) => {
    if (!payload) return;
    if (payload.type === 'selectAccount') {
      selectAccount(payload.accountId);
      setDrawerOpen(true);
      setCopilotOpen(false);
    } else if (payload.type === 'selectRing') {
      selectRing(payload.ringId);
      setCopilotOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl h-[560px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-white text-sm tracking-wide">MuleTrace Intelligence Copilot</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  Offline Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Deterministic reasoning directly from current in-memory graph</p>
            </div>
          </div>
          <button
            onClick={() => setCopilotOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat message history */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white ${
                msg.sender === 'user' ? 'bg-cyan-600' : 'bg-slate-800 border border-slate-700 text-cyan-400'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] rounded-xl p-3.5 leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line'
              }`}>
                {msg.text}

                {msg.actionPayload && (
                  <button
                    onClick={() => handleActionClick(msg.actionPayload)}
                    className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] transition font-medium"
                  >
                    <span>Inspect {msg.actionPayload.type === 'selectAccount' ? msg.actionPayload.accountId : msg.actionPayload.ringId}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 flex items-center gap-1.5 overflow-x-auto">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 shrink-0 transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about accounts, rings, freeze points, or pass-through velocity..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white rounded-xl transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
