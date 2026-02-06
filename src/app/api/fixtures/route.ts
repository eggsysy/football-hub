import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://v3.football.api-sports.io';
const SPORTSDB_BASE = 'https://www.thesportsdb.com/api/v1/json';
const UPCOMING_FALLBACK_DAYS = 7;
const TEAM_ID_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const FAMOUS_TEAMS = [
  { name: 'Manchester City', country: 'England' },
  { name: 'Liverpool', country: 'England' },
  { name: 'Real Madrid', country: 'Spain' },
  { name: 'Bayern Munich', country: 'Germany' },
  { name: 'Barcelona', country: 'Spain' },
  { name: 'Arsenal', country: 'England' },
  { name: 'Manchester United', country: 'England' },
  { name: 'Chelsea', country: 'England' },
  { name: 'Paris Saint-Germain', country: 'France' },
  { name: 'Juventus', country: 'Italy' },
  { name: 'AC Milan', country: 'Italy' },
];

type SportsDbTeam = {
  idTeam: string;
  strTeam: string;
  strCountry?: string | null;
  strTeamBadge?: string | null;
};

type SportsDbEvent = {
  idEvent: string;
  dateEvent: string;
  strTime?: string | null;
  strHomeTeam: string;
  strAwayTeam: string;
  idHomeTeam?: string | null;
  idAwayTeam?: string | null;
  idLeague?: string | null;
  strLeague?: string | null;
  intHomeScore?: string | null;
  intAwayScore?: string | null;
  strVenue?: string | null;
  strCity?: string | null;
};

type Fixture = {
  fixture: {
    id: number;
    status: { elapsed: number; short: string; long: string };
    date: string;
    venue: { name: string | null; city: string | null };
  };
  league: { id: number; name: string; logo: string; round: string };
  teams: {
    home: { name: string; logo: string; winner: boolean | null };
    away: { name: string; logo: string; winner: boolean | null };
  };
  goals: { home: number | null; away: number | null };
};

const teamIdCache = new Map<string, { id: string; badge?: string | null; ts: number }>();

const apiKey = () =>
  process.env.FOOTBALL_API_KEY || process.env.NEXT_PUBLIC_FOOTBALL_API_KEY || '';

const sportsDbKey = () => process.env.SPORTSDB_API_KEY || '123';

const isCacheFreshSportsDb = (entry: { id: string; ts: number } | undefined): boolean => {
  if (!entry) return false;
  return Date.now() - entry.ts < TEAM_ID_CACHE_TTL_MS;
};

const safeJson = async (res: Response) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: 'Invalid JSON', raw: text.slice(0, 200) };
  }
};

const apiFetch = async (path: string) => {
  const key = apiKey();
  if (!key) {
    return { error: 'Missing API key' };
  }
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'GET',
      headers: { 'x-apisports-key': key },
      cache: 'no-store',
    });
    const data = await safeJson(res);
    if (!res.ok) {
      return { error: `API-Football ${res.status}`, details: data };
    }
    return data;
  } catch (error) {
    return { error: 'API-Football fetch failed', details: String(error) };
  }
};

const sportsDbFetch = async (path: string) => {
  const key = sportsDbKey();
  try {
    const res = await fetch(`${SPORTSDB_BASE}/${key}/${path}`, {
      method: 'GET',
      cache: 'no-store',
    });
    const data = await safeJson(res);
    if (!res.ok) {
      return { error: `SportsDB ${res.status}`, details: data };
    }
    return data;
  } catch (error) {
    return { error: 'SportsDB fetch failed', details: String(error) };
  }
};

const normalizeBadgeUrl = (url?: string | null): string => {
  if (!url) return '';
  return url.startsWith('http://') ? url.replace('http://', 'https://') : url;
};

const resolveSportsDbTeam = async (
  teamName: string,
  teamCountry?: string
): Promise<{ id: string; badge?: string | null } | null> => {
  const cached = teamIdCache.get(teamName);
  if (isCacheFreshSportsDb(cached)) {
    return { id: cached.id, badge: cached.badge };
  }

  const data = await sportsDbFetch(`searchteams.php?t=${encodeURIComponent(teamName)}`);
  const results: SportsDbTeam[] = data?.teams || [];
  if (!results.length) return null;

  const lowerName = teamName.toLowerCase();
  const lowerCountry = teamCountry?.toLowerCase();
  const exact = results.find(r => r.strTeam?.toLowerCase() === lowerName);
  const exactWithCountry = results.find(
    r =>
      r.strTeam?.toLowerCase() === lowerName &&
      (!!lowerCountry ? r.strCountry?.toLowerCase() === lowerCountry : true)
  );
  const chosen = exactWithCountry || exact || results[0];
  if (!chosen?.idTeam) return null;

  teamIdCache.set(teamName, {
    id: chosen.idTeam,
    badge: normalizeBadgeUrl(chosen.strTeamBadge),
    ts: Date.now(),
  });

  return { id: chosen.idTeam, badge: normalizeBadgeUrl(chosen.strTeamBadge) };
};

const toFixture = (
  event: SportsDbEvent,
  badgeById: Map<string, string>,
  badgeByName: Map<string, string>
): Fixture | null => {
  if (!event?.idEvent || !event?.dateEvent) return null;
  const time = event.strTime && event.strTime !== '' ? event.strTime : '00:00:00';
  const iso = `${event.dateEvent}T${time}`;

  const homeId = event.idHomeTeam || '';
  const awayId = event.idAwayTeam || '';
  const homeLogo =
    (homeId && badgeById.get(homeId)) ||
    badgeByName.get(event.strHomeTeam?.toLowerCase() || '') ||
    '';
  const awayLogo =
    (awayId && badgeById.get(awayId)) ||
    badgeByName.get(event.strAwayTeam?.toLowerCase() || '') ||
    '';

  return {
    fixture: {
      id: Number(event.idEvent),
      status: { elapsed: 0, short: 'NS', long: 'Not Started' },
      date: iso,
      venue: { name: event.strVenue || null, city: event.strCity || null },
    },
    league: {
      id: event.idLeague ? Number(event.idLeague) : 0,
      name: event.strLeague || 'Unknown League',
      logo: '',
      round: '',
    },
    teams: {
      home: { name: event.strHomeTeam, logo: homeLogo, winner: null },
      away: { name: event.strAwayTeam, logo: awayLogo, winner: null },
    },
    goals: {
      home: event.intHomeScore ? Number(event.intHomeScore) : null,
      away: event.intAwayScore ? Number(event.intAwayScore) : null,
    },
  };
};

const toDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const collectTeamIds = (events: SportsDbEvent[]) => {
  const ids = new Set<string>();
  events.forEach(event => {
    if (event.idHomeTeam) ids.add(event.idHomeTeam);
    if (event.idAwayTeam) ids.add(event.idAwayTeam);
  });
  return ids;
};

const ensureBadges = async (teamIds: Set<string>, badgeById: Map<string, string>) => {
  const missing = Array.from(teamIds).filter(id => !badgeById.has(id));
  if (missing.length === 0) return;

  const results = await Promise.all(
    missing.map(id => sportsDbFetch(`lookupteam.php?id=${id}`))
  );
  results.forEach(result => {
    const team = result?.teams?.[0] as SportsDbTeam | undefined;
    if (!team?.idTeam || !team?.strTeamBadge) return;
    badgeById.set(team.idTeam, normalizeBadgeUrl(team.strTeamBadge));
  });
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const view = searchParams.get('view') || 'live';

  if (view === 'upcoming') {
    const resolved = await Promise.all(
      FAMOUS_TEAMS.map(t => resolveSportsDbTeam(t.name, t.country))
    );

    const badgeById = new Map<string, string>();
    const badgeByName = new Map<string, string>();
    resolved.forEach(info => {
      if (!info?.id) return;
      if (info.badge) badgeById.set(info.id, info.badge);
    });
    FAMOUS_TEAMS.forEach((team, index) => {
      const info = resolved[index];
      if (info?.badge) {
        badgeByName.set(team.name.toLowerCase(), info.badge);
      }
    });

    const teamIds = Array.from(new Set(resolved.map(r => r?.id).filter(Boolean) as string[]));
    const eventsById = new Map<string, SportsDbEvent>();

    if (teamIds.length > 0) {
      const requests = teamIds.map(id => sportsDbFetch(`eventsnext.php?id=${id}`));
      const results = await Promise.all(requests);
      results.forEach(result => {
        const events: SportsDbEvent[] = result?.events || [];
        events.forEach(event => {
          if (event?.idEvent) eventsById.set(event.idEvent, event);
        });
      });
    }

    if (eventsById.size === 0) {
      // Fallback: search upcoming days and filter for famous clubs.
      const nameSet = new Set(FAMOUS_TEAMS.map(t => t.name.toLowerCase()));
      const dayRequests: Promise<any>[] = [];
      for (let i = 0; i < UPCOMING_FALLBACK_DAYS; i += 1) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dayRequests.push(
          sportsDbFetch(`eventsday.php?d=${toDateString(date)}&s=Soccer`)
        );
      }

      const dayResults = await Promise.all(dayRequests);
      dayResults.forEach(result => {
        const events: SportsDbEvent[] = result?.events || [];
        events.forEach(event => {
          const home = event.strHomeTeam?.toLowerCase() || '';
          const away = event.strAwayTeam?.toLowerCase() || '';
          if (!nameSet.has(home) && !nameSet.has(away)) return;
          if (event?.idEvent) eventsById.set(event.idEvent, event);
        });
      });
    }

    const teamIdsInEvents = collectTeamIds(Array.from(eventsById.values()));
    await ensureBadges(teamIdsInEvents, badgeById);

    const fixtures = Array.from(eventsById.values())
      .map(event => toFixture(event, badgeById, badgeByName))
      .filter(Boolean) as Fixture[];

    const sorted = fixtures.sort(
      (a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime()
    );

    return NextResponse.json({ response: sorted });
  }

  const key = apiKey();
  if (!key) {
    return NextResponse.json(
      { response: [], error: 'Missing API key' },
      { status: 500 }
    );
  }

  if (view === 'live') {
    const data = await apiFetch('/fixtures?live=all');
    return NextResponse.json(data);
  }

  if (view === 'results') {
    const date = searchParams.get('date');
    if (!date) {
      return NextResponse.json(
        { response: [], error: 'Missing date' },
        { status: 400 }
      );
    }
    const data = await apiFetch(`/fixtures?date=${date}&status=FT`);
    return NextResponse.json(data);
  }

  return NextResponse.json({ response: [], error: 'Unknown view' }, { status: 400 });
}
