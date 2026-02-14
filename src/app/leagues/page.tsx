"use client";
import React, { useState, useEffect } from "react";
import { Sora, Manrope } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { getStandings } from "../actions"; 

// --- FONTS ---
const headingFont = Sora({ subsets: ["latin"], weight: ["600", "700", "800"] });
const bodyFont = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// --- CONFIGURATION ---
const LEAGUES = [
  { id: "PL", name: "Premier League", country: "England", color: "from-purple-600 to-blue-600", accent: "text-purple-400" },
  { id: "PD", name: "La Liga", country: "Spain", color: "from-orange-500 to-red-600", accent: "text-orange-400" },
  { id: "BL1", name: "Bundesliga", country: "Germany", color: "from-red-600 to-yellow-500", accent: "text-red-400" },
  { id: "SA", name: "Serie A", country: "Italy", color: "from-blue-500 to-cyan-400", accent: "text-blue-400" },
  { id: "FL1", name: "Ligue 1", country: "France", color: "from-blue-700 to-yellow-400", accent: "text-yellow-400" },
];

export default function Page() {
  const [selectedLeague, setSelectedLeague] = useState(LEAGUES[0]);
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      // Ensure getStandings is correctly imported from your actions file
      const data = await getStandings(selectedLeague.id);
      
      if (data && data.length > 0) {
        setStandings(data);
      } else {
        setError("Unable to retrieve live data.");
      }
      setLoading(false);
    };

    loadData();
  }, [selectedLeague]);

  // Helper to determine row status color (UCL vs Relegation)
  const getRankStyle = (rank: number) => {
    if (rank <= 4) return "border-l-4 border-green-400 bg-green-400/5"; // Champions League
    if (rank >= 18) return "border-l-4 border-red-500 bg-red-500/5";   // Relegation
    return "border-l-4 border-transparent hover:bg-white/5";
  };

  return (
    <main className={`min-h-screen bg-[#050a14] text-white selection:bg-[#F63049] selection:text-white ${bodyFont.className}`}>
      
      {/* BACKGROUND AMBIENCE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className={`absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br ${selectedLeague.color} opacity-20 blur-[120px] transition-colors duration-700`} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-900/20 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 md:px-8">
        
        {/* --- HEADER SECTION --- */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className={`text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 ${headingFont.className}`}>
              LEAGUES<span className="text-[#F63049]">.</span>
            </h1>
            <p className="mt-2 text-slate-400 font-medium">Live Season Standings & Stats</p>
          </div>
          
          {/* League Selector (Glass Pill) */}
          <div className="flex overflow-x-auto gap-1 p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            {LEAGUES.map((league) => (
              <button
                key={league.id}
                onClick={() => setSelectedLeague(league)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap
                  ${selectedLeague.id === league.id 
                    ? `bg-gradient-to-r ${league.color} text-white shadow-lg` 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {league.name}
              </button>
            ))}
          </div>
        </header>

        {/* --- MAIN CONTENT CARD --- */}
        <div className="min-h-[600px] rounded-[2.5rem] border border-white/10 bg-[#0f172a]/60 backdrop-blur-xl shadow-2xl overflow-hidden relative">
            
            {/* Table Header Banner */}
            <div className={`h-32 bg-gradient-to-r ${selectedLeague.color} relative overflow-hidden flex items-center px-8 md:px-12`}>
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
                <div className="relative z-10">
                    <h2 className={`text-3xl md:text-4xl font-bold text-white ${headingFont.className}`}>{selectedLeague.name}</h2>
                    <p className="text-white/80 text-sm font-medium uppercase tracking-widest">{selectedLeague.country}</p>
                </div>
                {/* Decorative Big Letter */}
                <h2 className="absolute -right-6 -bottom-12 text-[10rem] font-black text-white opacity-10 select-none">
                    {selectedLeague.id}
                </h2>
            </div>

            {/* LOADING STATE */}
            {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f172a]/80 z-20 backdrop-blur-sm">
                    <div className="w-12 h-12 border-4 border-white/10 border-t-[#F63049] rounded-full animate-spin mb-4"/>
                    <p className="text-slate-400 text-xs uppercase tracking-widest animate-pulse">Syncing Data...</p>
                </div>
            )}

            {/* ERROR STATE */}
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
                        <p className="text-red-400 font-bold mb-2">Data Unavailable</p>
                        <p className="text-xs text-red-300/70">{error}</p>
                    </div>
                </div>
            )}

            {/* THE TABLE */}
            {!loading && !error && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                                <th className="py-5 pl-8 w-16 text-center">#</th>
                                <th className="py-5">Club</th>
                                <th className="py-5 text-center hidden md:table-cell">MP</th>
                                <th className="py-5 text-center hidden md:table-cell">W</th>
                                <th className="py-5 text-center hidden md:table-cell">D</th>
                                <th className="py-5 text-center hidden md:table-cell">L</th>
                                <th className="py-5 text-center">GD</th>
                                <th className="py-5 pr-8 text-right">Pts</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium text-slate-300">
                            <AnimatePresence mode="popLayout">
                                {standings.map((s: any, i) => (
                                    <motion.tr 
                                        key={s.team.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: i * 0.03 }}
                                        className={`group border-b border-white/5 transition-all duration-200 ${getRankStyle(s.position)}`}
                                    >
                                        <td className={`py-4 pl-8 text-center font-bold ${i < 3 ? 'text-white text-lg' : 'text-slate-500'}`}>
                                            {s.position}
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-white/10 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <img src={s.team.crest} alt={s.team.name} className="relative h-8 w-8 object-contain drop-shadow-md" />
                                                </div>
                                                <span className={`font-bold transition-colors ${i < 3 ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                                                    {s.team.shortName || s.team.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-center hidden md:table-cell">{s.playedGames}</td>
                                        <td className="py-4 text-center hidden md:table-cell text-white/60">{s.won}</td>
                                        <td className="py-4 text-center hidden md:table-cell text-white/60">{s.draw}</td>
                                        <td className="py-4 text-center hidden md:table-cell text-white/60">{s.lost}</td>
                                        <td className={`py-4 text-center font-bold ${s.goalDifference > 0 ? 'text-green-400' : s.goalDifference < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                                            {s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}
                                        </td>
                                        <td className="py-4 pr-8 text-right">
                                            <span className={`inline-block min-w-[2rem] text-center font-black text-lg ${i === 0 ? 'text-[#F63049]' : 'text-white'}`}>
                                                {s.points}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </div>
    </main>
  );
}