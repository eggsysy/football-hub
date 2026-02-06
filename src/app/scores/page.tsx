"use client"
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ChevronLeft, ChevronRight, Bell } from 'lucide-react'; // Added Bell icon

// --- TYPE DEFINITIONS ---
interface APIFixture {
  fixture: { 
    id: number; 
    status: { elapsed: number; short: string; long: string }; // Added 'long' status
    date: string;
    venue: { name: string | null; city: string | null; };
  };
  league: { id: number; name: string; logo: string; round: string };
  teams: { 
    home: { name: string; logo: string; winner: boolean | null }; 
    away: { name: string; logo: string; winner: boolean | null } 
  };
  goals: { home: number | null; away: number | null };
}

interface GroupedMatches {
  [leagueId: string]: {
    leagueName: string;
    leagueLogo: string;
    matches: APIFixture[];
  };
}

type ViewType = 'live' | 'results' | 'upcoming'; // Reintroduced 'live'

// --- HELPER FUNCTIONS ---
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getRelativeDateText = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};

const parseIsoDate = (value: string): Date | null => {
  if (!value) return null;
  const safe = value.includes('T') ? value : `${value}T00:00:00`;
  const date = new Date(safe);
  return Number.isNaN(date.getTime()) ? null : date;
};

// --- MAIN COMPONENT ---
export default function ScoresPage() {
  const [fixtures, setFixtures] = useState<APIFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewType>('live'); // Default to 'live'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const router = useRouter();
  const requestIdRef = useRef(0);

  const fetchFixtures = useCallback(async () => {
    setLoading(true);
    const requestId = ++requestIdRef.current;
    let url = `/api/fixtures?view=${view}`;
    if (view === 'results') {
      url += `&date=${formatDate(selectedDate)}`;
    }
    
    try {
      const res = await fetch(url, {
        method: 'GET',
      });
      const text = await res.text();
      let data: { response?: APIFixture[] } | null = null;
      try {
        data = JSON.parse(text);
      } catch {
        data = { response: [] };
      }
      if (requestId !== requestIdRef.current) return;
      setFixtures(data?.response || []);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      console.error("Fetch Error:", error);
      setFixtures([]); // Clear fixtures on error
    } finally {
      if (requestId !== requestIdRef.current) return;
      setLoading(false);
    }
  }, [view, selectedDate, setLoading, setFixtures]); // Dependencies for useCallback

  useEffect(() => {
    // Refetch when view changes or selectedDate changes (only for 'results' view)
    fetchFixtures();
  }, [fetchFixtures]); // Now fetchFixtures is a dependency itself // Added router to dependencies because it's used inside fetchFixtures (indirectly via onClick) and to avoid lint warning.

  // Group by league for 'results' view
  const groupedFixturesByLeague = useMemo<GroupedMatches>(() => {
    if (view === 'upcoming') return {}; // Only group by date for upcoming

    return fixtures.reduce((acc, fixture) => {
      // Filter out non-finished/live matches for 'results' if needed,
      // but 'date' query parameter should already handle the scope.
      // Explicitly show only FT or Live matches for a clean 'results' view
      if (view === 'results') {
        const isFinished =
          fixture.fixture.status.short === 'FT' ||
          fixture.fixture.status.short === 'AET' ||
          fixture.fixture.status.short === 'PEN';
        if (!isFinished) return acc;
      }

      const leagueId = fixture.league.id.toString();
      if (!acc[leagueId]) {
        acc[leagueId] = {
          leagueName: fixture.league.name,
          leagueLogo: fixture.league.logo,
          matches: [],
        };
      }
      acc[leagueId].matches.push(fixture);
      return acc;
    }, {} as GroupedMatches);
  }, [fixtures, view]);

  // Group by date for 'upcoming' view
  const groupedFixturesByDate = useMemo(() => {
    if (view !== 'upcoming') return {};

    const groups: { [date: string]: APIFixture[] } = {};
    fixtures.forEach(fixture => {
      const rawDate = fixture.fixture?.date || '';
      const dateKey = rawDate.includes('T') ? rawDate.split('T')[0] : rawDate;
      const safeKey = dateKey || 'TBD';
      if (!groups[safeKey]) {
        groups[safeKey] = [];
      }
      groups[safeKey].push(fixture);
    });

    // Sort dates (safely)
    const sortedDates = Object.keys(groups).sort((a, b) => {
      const dateA = parseIsoDate(a);
      const dateB = parseIsoDate(b);
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return dateA.getTime() - dateB.getTime();
    });
    const sortedGroups: { [date: string]: APIFixture[] } = {};
    sortedDates.forEach(date => {
      sortedGroups[date] = groups[date];
    });

    return sortedGroups;
  }, [fixtures, view]);

  const handleDateChange = (daysToAdd: number) => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + daysToAdd);
      return newDate;
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-1 bg-[#F63049] animate-pulse"></div>
          <div className="text-white font-black text-xs uppercase tracking-[0.3em] animate-pulse">
            Fetching Data...
          </div>
        </div>
      );
    }
    
    // Determine which set of matches to check for emptiness
    const displayGroups = view === 'upcoming' ? groupedFixturesByDate : groupedFixturesByLeague;
    const isEmpty =
      view === 'upcoming'
        ? fixtures.length === 0
        : Object.keys(displayGroups).length === 0;

    if (isEmpty) {
      return (
        <div className="h-[40vh] flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-none text-center"> {/* Changed to rounded-none */}
            <p className="text-slate-400 font-bold italic text-lg">
              {view === 'results' && "No matches found for this date."}
              {view === 'live' && "No live matches right now."}
              {view === 'upcoming' && "No upcoming matches found for the selected teams/season."}
            </p>
            <p className="text-slate-500 mt-2 text-sm">Check back soon or select a different view/date.</p>
        </div>
      );
    }

    if (view === 'upcoming') {
      return (
        <div className="space-y-12">
          {Object.entries(groupedFixturesByDate).map(([date, matches]) => (
            <section key={date}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold uppercase tracking-wider text-white">
                  {(() => {
                    const parsed = parseIsoDate(date);
                    return parsed ? getRelativeDateText(parsed) : date;
                  })()}{" "}
                  -{" "}
                  {(() => {
                    const parsed = parseIsoDate(date);
                    return parsed
                      ? parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : date;
                  })()}
                </h2>
                <div className="flex-grow h-[1px] bg-white/10 ml-4"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {matches.map((m: APIFixture) => (
                  <div 
                    key={m.fixture.id} 
                    onClick={() => router.push(`/match/${m.fixture.id}`)}
                    className="bg-[#15233b] border border-white/10 p-4 transition-all cursor-pointer group hover:border-[#F63049] hover:bg-[#1a2944] rounded-none" // Changed to rounded-none
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex flex-col items-center text-center pr-3">
                        <img src={m.teams.home.logo || '/file.svg'} alt={m.teams.home.name} className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-xs text-white leading-tight">{m.teams.home.name}</span>
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <span className="text-cyan-400 font-bold text-xs mb-1 uppercase">
                          {m.league.name}
                        </span>
                        <div className="text-3xl font-black text-white">
                          {(() => {
                            const parsed = parseIsoDate(m.fixture.date);
                            return parsed
                              ? parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : 'TBD';
                          })()}
                        </div>
                        <button className="mt-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-[#F63049]/20 text-[#F63049] hover:bg-[#F63049] hover:text-white px-3 py-1.5 transition-all rounded-none">
                            <Bell size={12} /> Remind Me
                        </button>
                      </div>

                      <div className="flex-1 flex flex-col items-center text-center pl-3">
                        <img src={m.teams.away.logo || '/file.svg'} alt={m.teams.away.name} className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-xs text-white leading-tight">{m.teams.away.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-12">
        {Object.entries(groupedFixturesByLeague).map(([leagueId, { leagueName, leagueLogo, matches }]) => (
          <section key={leagueId}>
            <div className="flex items-center gap-4 mb-6">
              <img src={leagueLogo || '/file.svg'} alt={leagueName} className="w-8 h-8 bg-white rounded-full p-1"/>
              <h2 className="text-2xl font-bold uppercase tracking-wider text-white">{leagueName}</h2>
              <div className="flex-grow h-[1px] bg-white/10 ml-4"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {matches.map((m: APIFixture) => (
                <div 
                  key={m.fixture.id} 
                  onClick={() => router.push(`/match/${m.fixture.id}`)}
                  className="bg-[#15233b] border border-white/10 p-4 transition-all cursor-pointer group hover:border-[#F63049] hover:bg-[#1a2944] rounded-none" // Changed to rounded-none
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex flex-col items-center text-center pr-3">
                      <img src={m.teams.home.logo || '/file.svg'} alt={m.teams.home.name} className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                      <span className={`font-bold text-xs text-white leading-tight ${m.teams.home.winner ? 'text-green-400' : ''}`}>{m.teams.home.name}</span>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      {(view === 'live') && ( // Display live status for 'live' view
                        <div className="flex items-center gap-1.5 text-[#F63049] font-black text-xs mb-1 uppercase animate-pulse">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            LIVE
                        </div>
                      )}
                      {(view === 'results') && ( // Display final/time for 'results' view
                        <span className="text-[#F63049] font-black text-xs mb-1 uppercase">
                          {m.fixture.status.short === 'FT' ? 'FINAL' : m.fixture.status.short === 'HT' ? 'HALF TIME' : `${m.fixture.status.elapsed}'`}
                        </span>
                      )}
                      <div className="text-3xl font-black tabular-nums tracking-tighter text-white">
                        {m.goals.home ?? '-'} : {m.goals.away ?? '-'}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1.5 font-mono truncate max-w-[120px]">{m.fixture.venue.name || 'TBD'}</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center text-center pl-3">
                      <img src={m.teams.away.logo || '/file.svg'} alt={m.teams.away.name} className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                      <span className={`font-bold text-xs text-white leading-tight ${m.teams.away.winner ? 'text-green-400' : ''}`}>{m.teams.away.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  };
  
  return (
    <main className="min-h-screen px-6 md:px-8 pb-24 bg-[#111F35]">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex items-end justify-between my-12 border-b border-white/10 pb-6">
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
            Match Center <span className="text-[#F63049]">.</span>
          </h1>
        </header>

        <div className="mb-8">
          {/* Tabs */}
          <div className="flex items-center border-b border-white/10">
            {['live', 'results', 'upcoming'].map((v: string) => ( // Reverted tabs to include 'live'
              <button
                key={v}
                onClick={() => setView(v as ViewType)}
                className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                  view === v
                    ? 'text-white border-b-2 border-[#F63049]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {v.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Date Navigator for Results */}
          {(view === 'results') && (
            <div className="bg-[#0f1c30] p-3 flex items-center justify-center gap-6 text-white">
              <button onClick={() => handleDateChange(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors"><ChevronLeft size={20} /></button>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-[#F63049]" />
                <span className="font-bold text-lg">{getRelativeDateText(selectedDate)}</span>
              </div>
              <button onClick={() => handleDateChange(1)} className="p-2 rounded-full hover:bg-white/10 transition-colors"><ChevronRight size={20} /></button>
            </div>
          )}
        </div>
        
        {renderContent()}
      </div>
    </main>
  );
}
