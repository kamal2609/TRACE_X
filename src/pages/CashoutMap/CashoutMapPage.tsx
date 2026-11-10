import React, { useState } from 'react';
import { MapPin, IndianRupee, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { useDatasetStore } from '../../store/datasetStore';

interface CityHotspot {
  city: string;
  region: string;
  atmVolume: number;
  cryptoVolume: number;
  flaggedCount: number;
  x: number; // SVG %
  y: number; // SVG %
}

export const CashoutMapPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityHotspot | null>(null);

  const hotspots: CityHotspot[] = [
    { city: 'Delhi / NCR', region: 'North', atmVolume: 3200000, cryptoVolume: 1800000, flaggedCount: 14, x: 42, y: 32 },
    { city: 'Mumbai', region: 'West', atmVolume: 4100000, cryptoVolume: 2400000, flaggedCount: 18, x: 28, y: 58 },
    { city: 'Bengaluru', region: 'South', atmVolume: 2800000, cryptoVolume: 3100000, flaggedCount: 12, x: 38, y: 76 },
    { city: 'Hyderabad', region: 'South', atmVolume: 1900000, cryptoVolume: 1200000, flaggedCount: 9, x: 45, y: 64 },
    { city: 'Kolkata', region: 'East', atmVolume: 1600000, cryptoVolume: 800000, flaggedCount: 8, x: 72, y: 48 },
    { city: 'Jaipur', region: 'North', atmVolume: 1400000, cryptoVolume: 600000, flaggedCount: 7, x: 34, y: 38 },
    { city: 'Surat', region: 'West', atmVolume: 2100000, cryptoVolume: 1100000, flaggedCount: 10, x: 29, y: 52 },
    { city: 'Pune', region: 'West', atmVolume: 1500000, cryptoVolume: 900000, flaggedCount: 6, x: 31, y: 62 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-bold text-white tracking-tight">
              Cash-Out Hotspot Geographic Intelligence Map
            </h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
              Schematic Vector Layout
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Geographic distribution of terminal ATM withdrawals and crypto desk cash-outs across Indian metropolitan corridors.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Schematic Map Canvas */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex items-center justify-center min-h-[480px] shadow-2xl">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* SVG Vector India Outline Map */}
          <svg viewBox="0 0 100 100" className="w-full h-full max-h-[440px] drop-shadow-2xl">
            {/* Schematic Outline */}
            <path
              d="M 38 12 Q 46 8 50 16 Q 52 24 60 28 Q 74 34 82 42 Q 78 54 70 56 Q 64 68 54 82 Q 46 94 44 98 Q 40 92 34 82 Q 24 68 22 56 Q 18 46 28 36 Z"
              fill="#0a192f"
              stroke="#1e3a5f"
              strokeWidth="0.8"
            />

            {/* City Hotspot Circles */}
            {hotspots.map((h, idx) => {
              const isSelected = selectedCity?.city === h.city;
              const radius = Math.max(3, Math.min(7, (h.atmVolume + h.cryptoVolume) / 800000));
              return (
                <g key={idx} onClick={() => setSelectedCity(h)} className="cursor-pointer group">
                  <circle
                    cx={h.x}
                    cy={h.y}
                    r={radius * 1.6}
                    fill="#ef4444"
                    opacity="0.18"
                    className="animate-ping"
                  />
                  <circle
                    cx={h.x}
                    cy={h.y}
                    r={radius}
                    fill={isSelected ? '#38bdf8' : '#ef4444'}
                    stroke="#ffffff"
                    strokeWidth="0.6"
                    className="transition group-hover:scale-125"
                  />
                  <text
                    x={h.x + 4}
                    y={h.y + 1.5}
                    fontSize="2.8"
                    fill="#cbd5e1"
                    fontFamily="JetBrains Mono"
                    fontWeight="600"
                    className="pointer-events-none"
                  >
                    {h.city}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Floating Instructions */}
          <div className="absolute bottom-4 left-4 bg-slate-950/90 border border-slate-800 p-2.5 rounded-xl text-[11px] font-mono text-slate-400 backdrop-blur-md">
            Click any hotspot marker to view city exit analytics.
          </div>
        </div>

        {/* Selected City Panel */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
          {selectedCity ? (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Selected Cash-Out Corridor</span>
                <h3 className="text-xl font-bold font-heading text-white mt-0.5">{selectedCity.city}</h3>
                <p className="text-xs text-cyan-400 font-mono">{selectedCity.region} Region &bull; {selectedCity.flaggedCount} Flagged Mule Terminals</p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">ATM Cash Withdrawal</span>
                    <strong className="text-rose-400 text-sm">₹{(selectedCity.atmVolume / 100000).toFixed(1)} Lakhs</strong>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-rose-500" />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Crypto Desk Cash-Out</span>
                    <strong className="text-indigo-400 text-sm">₹{(selectedCity.cryptoVolume / 100000).toFixed(1)} Lakhs</strong>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-indigo-400" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed">
                Terminal mule accounts in {selectedCity.city} correlate with rapid physical cash withdrawals within 45 minutes of primary cyber fraud transfers.
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
              <MapPin className="w-8 h-8 text-slate-600" />
              <p className="text-xs font-mono">Select a city marker on the map to inspect terminal withdrawal volumes.</p>
            </div>
          )}

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-500 text-center">
            Simulated vector geographic projection (Zero external map APIs used).
          </div>
        </div>
      </div>
    </div>
  );
};
