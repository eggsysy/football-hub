"use client" // Required for state and interaction

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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

export default function Home() {
  const [matches, setMatches] = useState<APIFixture[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Fetch Auth State and Football Data on Mount
  useEffect(() => {
    async function initPage() {
      // Check user session
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Fetch scores
      const footballData = await fetchFootballScores();
      setMatches(footballData);
      setLoading(false);
    }

    initPage();
  }, []);

  // 2. Fetch Logic (Moved inside for Client Component use)
  async function fetchFootballScores(): Promise<APIFixture[]> {
    try {
      const res = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
        method: 'GET',
        headers: {
          'x-apisports-key': process.env.NEXT_PUBLIC_FOOTBALL_API_KEY || '', // Ensure this is NEXT_PUBLIC if calling from client
        },
        next: { revalidate: 60 },
      });

      const data = await res.json();
      if (data.errors && Object.keys(data.errors).length > 0) return [];
      return data.response || [];
    } catch (error) {
      console.error("Network Error:", error);
      return [];
    }
  }

  // 3. Logout Handler
  const handleLogout = async () => {
  // 1. Tell Supabase to end the session
  await supabase.auth.signOut();
  
  // 2. Clear the local state so the UI updates
  setUser(null);
  
  // 3. Force the browser to go to the login page
  router.push('/login');
  
  // 4. (Optional) Refresh the router to ensure all server-side data is wiped
  router.refresh();
};

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-900">
      <header className="max-w-5xl mx-auto mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black italic text-blue-800 tracking-tighter">
            GOALSTRKR
          </h1>
          <p className="text-slate-500 font-medium">Live Football Dashboard</p>
        </div>

        {/* Dynamic Auth Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 bg-white p-2 pl-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-600 hidden md:block">
                {user.email}
              </span>
              <button 
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => router.push('/login')} 
                className="text-blue-800 font-bold text-sm px-4 hover:bg-slate-100 py-2 rounded-xl transition"
              >
                Log In
              </button>
              <button 
                onClick={() => router.push('/signup')} 
                className="bg-blue-800 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-blue-900 transition active:scale-95"
              >
                Join
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
          Live Scores
        </h2>

        <div className="grid gap-6">
          {loading ? (
             <div className="text-center p-20 text-slate-400 animate-pulse font-bold">LOADING MATCHES...</div>
          ) : matches.length > 0 ? (
            matches.map((m) => (
              <div key={m.fixture.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex-1 flex flex-col items-center">
                  <img src={m.teams.home.logo} alt="" className="w-12 h-12 mb-2" />
                  <span className="font-bold text-center text-sm">{m.teams.home.name}</span>
                </div>

                <div className="flex flex-col items-center px-6">
                  <span className="text-red-600 font-black text-xs mb-1">
                    {m.fixture.status.short === 'HT' ? 'HALF TIME' : `${m.fixture.status.elapsed}'`}
                  </span>
                  <div className="text-4xl font-black tabular-nums">
                    {m.goals.home ?? 0} : {m.goals.away ?? 0}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 font-bold uppercase">{m.league.name}</span>
                </div>

                <div className="flex-1 flex flex-col items-center">
                  <img src={m.teams.away.logo} alt="" className="w-12 h-12 mb-2" />
                  <span className="font-bold text-center text-sm">{m.teams.away.name}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-semibold italic">
                No live matches found. Check the terminal for errors.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}