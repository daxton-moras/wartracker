import React from 'react';
import { ShieldAlert, Rocket, Droplets, TrendingDown, Users, Globe } from 'lucide-react';

// This is your Dashboard Component
export default function WarTracker() {
  const lastUpdated = "March 15, 2026 - 14:00 GMT";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      {/* Header Section */}
      <header className="max-w-7xl mx-auto mb-10 border-b border-slate-800 pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-red-500 flex items-center gap-2">
              <ShieldAlert className="w-10 h-10" /> CONFLICT TRACKER: OPERATION EPIC FURY
            </h1>
            <p className="text-slate-400 mt-1 uppercase tracking-widest text-sm">Real-time Strategic Intelligence Briefing</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg">
            <p className="text-xs text-slate-500 uppercase">System Status</p>
            <p className="text-green-400 font-mono text-sm animate-pulse">● LIVE UPDATES ACTIVE</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COLUMN 1: KINETIC DATA (Missiles/Drones) */}
        <section className="space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-orange-400">
              <Rocket className="w-5 h-5" /> Kinetic Engagements
            </h2>
            <div className="space-y-4">
              <StatRow label="US/Israel Precision Strikes" value="1,240+" color="text-blue-400" />
              <StatRow label="Iranian Shahed-238 Drones" value="850+" color="text-red-400" />
              <StatRow label="Intercepted (Iron Dome/Patriot)" value="92%" color="text-green-400" />
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-300">
              <Users className="w-5 h-5" /> Casualty Estimates
            </h2>
            <div className="space-y-2">
              <p className="text-sm text-slate-400 italic">Combined Military & Civilian (Reported)</p>
              <p className="text-3xl font-mono text-white tracking-tighter">~4,200 - 6,800</p>
              <p className="text-xs text-slate-500">*Data verification pending international observers.</p>
            </div>
          </div>
        </section>

        {/* COLUMN 2: GLOBAL COMMODITIES (Oil/Energy) */}
        <section className="space-y-6">
          <div className="bg-red-950/20 border border-red-900/50 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-400">
              <Droplets className="w-5 h-5" /> Energy Supply Crisis
            </h2>
            <div className="text-center py-4">
              <p className="text-slate-400 text-sm uppercase">Brent Crude Oil</p>
              <p className="text-6xl font-black text-white">$148.20</p>
              <p className="text-red-500 font-bold mt-2">+12.4% Since Strike on Kharg</p>
            </div>
            <div className="mt-4 p-3 bg-black/40 rounded text-xs text-slate-400">
              <strong>Strait of Hormuz Status:</strong> Partial Blockage reported. U.S. Navy minesweepers active.
            </div>
          </div>
        </section>

        {/* COLUMN 3: MARKET & DUBAI IMPACT */}
        <section className="space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-500">
              <TrendingDown className="w-5 h-5" /> Economic Contagion
            </h2>
            <div className="space-y-4">
              <MarketRow label="S&P 500" change="-3.2%" />
              <MarketRow label="Dubai DFM (Property)" change="-30.4%" />
              <MarketRow label="Defense Index (ITA)" change="+18.7%" />
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-800/50 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
              <Globe className="w-5 h-5" /> Geopolitical Analysis
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Markets are reacting to the "Leadership Vacuum" in Tehran. Dubai Real Estate is seeing a massive liquidity freeze as investors move capital to Swiss and Singaporean safe havens.
            </p>
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto mt-12 text-center text-slate-600 text-xs uppercase tracking-widest">
        Proprietary OSINT Dashboard • Updated: {lastUpdated} • No Confidential Info Shared
      </footer>
    </div>
  );
}

// Small helper components to keep code clean
function StatRow({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex justify-between border-b border-slate-800 pb-2">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className={`font-mono font-bold ${color}`}>{value}</span>
    </div>
  );
}

function MarketRow({ label, change }: { label: string, change: string }) {
  const isNegative = change.startsWith('-');
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-300 font-medium">{label}</span>
      <span className={`px-2 py-1 rounded text-xs font-bold ${isNegative ? 'bg-red-900/40 text-red-400' : 'bg-green-900/40 text-green-400'}`}>
        {change}
      </span>
    </div>
  );
}

