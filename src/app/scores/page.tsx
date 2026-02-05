"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface APIFixture {
  fixture: { id: number; status: { elapsed: number; short: string } };
  league: { name: string; logo: string };
  teams: { 
    home: { name: string; logo: string }; 
    away: { name: string; logo: string } 
  };
  goals: { home: number | null; away: number | null };
}

export default function ScoresPage() {
  const [matches, setMatches] = useState<APIFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchFootballScores() {
      try {
        const res = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
          method: 'GET',
          headers: {
            'x-apisports-key': process.env.NEXT_PUBLIC_FOOTBALL_API_KEY || '',
          },
        });
        const data = await res.json();
        setMatches(data.response || []);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFootballScores();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black italic text-blue-900 tracking-tighter">LIVE SCORES</h1>
            <p className="text-slate-500 font-medium">Real-time match data from around the globe.</p>
          </div>
          <div className="bg-red-600 text-white px-4 py-1 rounded-full text-[10px] font-black animate-pulse">
            LIVE NOW
          </div>
        </header>

        <div className="grid gap-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white h-32 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : matches.length > 0 ? (
            matches.map((m) => (
              <div 
                key={m.fixture.id} 
                onClick={() => router.push(`/match/${m.fixture.id}`)}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="flex-1 flex flex-col items-center">
                  <img src={m.teams.home.logo} alt="" className="w-16 h-16 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-center text-sm">{m.teams.home.name}</span>
                </div>

                <div className="flex flex-col items-center px-8 border-x border-slate-100">
                  <span className="text-red-600 font-black text-xs mb-2">
                    {m.fixture.status.short === 'HT' ? 'HALF TIME' : `${m.fixture.status.elapsed}'`}
                  </span>
                  <div className="text-5xl font-black tabular-nums tracking-tighter">
                    {m.goals.home ?? 0} : {m.goals.away ?? 0}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-3 font-bold uppercase">{m.league.name}</span>
                </div>

                <div className="flex-1 flex flex-col items-center">
                  <img src={m.teams.away.logo} alt="" className="w-16 h-16 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-center text-sm">{m.teams.away.name}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold italic">No live matches currently in play.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}