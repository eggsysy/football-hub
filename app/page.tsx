import React from 'react';

interface APIFixture {
  fixture: { id: number; status: { elapsed: number; short: string } };
  league: { name: string; logo: string };
  teams: { 
    home: { name: string; logo: string }; 
    away: { name: string; logo: string } 
  };
  goals: { home: number | null; away: number | null };
}

async function getLiveScores(): Promise<APIFixture[]> {
  const apiKey = process.env.FOOTBALL_API_KEY;

  // 1. Check if the API key is actually loaded
  if (!apiKey) {
    console.error("❌ ERROR: FOOTBALL_API_KEY is missing from .env.local!");
    return [];
  }

  try {
    // 2. Fetch data (Date filter is better for testing if no live games are on)
    const res = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
      method: 'GET',
      headers: {
        'x-apisports-key': apiKey,
      },
      next: { revalidate: 60 },
    });

    // 3. If API responds with an error (e.g., 401 Unauthorized or 403 Forbidden)
    if (!res.ok) {
      console.error(`❌ API Error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();

    // 4. API-Sports returns errors INSIDE the JSON sometimes
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error("❌ API Logic Error:", data.errors);
      return [];
    }

    return data.response || [];
  } catch (error) {
    console.error("❌ Network Error: Could not connect to API-Sports.");
    return [];
  }
}

export default async function Home() {
  const matches = await getLiveScores();

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-900">
      <header className="max-w-5xl mx-auto mb-12">
        <h1 className="text-4xl font-black italic text-blue-800 tracking-tighter">
          GOALSTRKR
        </h1>
        <p className="text-slate-500 font-medium">Live Football Dashboard</p>
      </header>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
          Live Scores
        </h2>

        <div className="grid gap-6">
          {matches && matches.length > 0 ? (
            matches.map((m) => (
              <div key={m.fixture.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center justify-between">
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