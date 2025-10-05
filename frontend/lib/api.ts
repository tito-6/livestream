/**
 * API Client for Sports Oasis
 * Integrates with:
 * - Kooora API (Arabic sports data)
 * - LiveSoccer API (Live scores)
 */

const KOOORA_API = process.env.NEXT_PUBLIC_KOOORA_API || 'http://localhost:5000';
const LIVESOCCER_API = process.env.NEXT_PUBLIC_LIVESOCCER_API || 'http://localhost:5001';

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number | null;
  awayScore?: number | null;
  league: string;
  leagueId?: string;
  time: string;
  date?: string;
  status: string;
  isLive: boolean;
  source?: string;
}

export interface League {
  id: string;
  name: string;
  country?: string;
  matchCount?: number;
}

/**
 * Fetch live matches from both APIs
 */
export async function getLiveMatches(): Promise<Match[]> {
  const matches: Match[] = [];
  
  try {
    // Fetch from LiveSoccer API (priority for live scores)
    const liveSoccerResponse = await fetch(`${LIVESOCCER_API}/api/live`);
    if (liveSoccerResponse.ok) {
      const data = await liveSoccerResponse.json();
      if (data.success && data.data) {
        const liveSoccerMatches = data.data.map((m: any) => ({
          id: `ls-${m.id}`,
          homeTeam: m.home_team,
          awayTeam: m.away_team,
          homeScore: m.home_score,
          awayScore: m.away_score,
          league: m.league,
          leagueId: m.league_id?.toString(),
          time: m.time,
          status: m.status,
          isLive: m.is_live,
          source: 'LiveSoccer'
        }));
        matches.push(...liveSoccerMatches);
      }
    }
  } catch (error) {
    console.error('Error fetching from LiveSoccer:', error);
  }
  
  try {
    // Fetch from Kooora API (Arabic content)
    const kooora Response = await fetch(`${KOOORA_API}/api/matches/today`);
    if (kooora Response.ok) {
      const data = await kooora Response.json();
      if (data.success && data.data) {
        const kooora Matches = data.data
          .filter((m: any) => m.is_live || m.status === 'live')
          .map((m: any) => ({
            id: `k-${m.id}`,
            homeTeam: m.home_team,
            awayTeam: m.away_team,
            homeScore: m.home_score,
            awayScore: m.away_score,
            league: m.league_name,
            leagueId: m.league_id,
            time: m.time,
            date: m.date,
            status: m.status,
            isLive: m.is_live,
            source: 'Kooora'
          }));
        matches.push(...kooora Matches);
      }
    }
  } catch (error) {
    console.error('Error fetching from Kooora:', error);
  }
  
  return matches;
}

/**
 * Fetch today's fixtures
 */
export async function getTodayFixtures(): Promise<Match[]> {
  const matches: Match[] = [];
  
  try {
    const response = await fetch(`${KOOORA_API}/api/matches/today`);
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        const formattedMatches = data.data.map((m: any) => ({
          id: `k-${m.id}`,
          homeTeam: m.home_team,
          awayTeam: m.away_team,
          homeScore: m.home_score,
          awayScore: m.away_score,
          league: m.league_name,
          leagueId: m.league_id,
          time: m.time,
          date: m.date,
          status: m.status,
          isLive: m.is_live,
          source: 'Kooora'
        }));
        matches.push(...formattedMatches);
      }
    }
  } catch (error) {
    console.error('Error fetching today fixtures:', error);
  }
  
  return matches;
}

/**
 * Fetch tomorrow's fixtures
 */
export async function getTomorrowFixtures(): Promise<Match[]> {
  const matches: Match[] = [];
  
  try {
    const response = await fetch(`${KOOORA_API}/api/matches/tomorrow`);
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        const formattedMatches = data.data.map((m: any) => ({
          id: `k-${m.id}`,
          homeTeam: m.home_team,
          awayTeam: m.away_team,
          league: m.league_name,
          leagueId: m.league_id,
          time: m.time,
          date: m.date,
          status: m.status,
          isLive: false,
          source: 'Kooora'
        }));
        matches.push(...formattedMatches);
      }
    }
  } catch (error) {
    console.error('Error fetching tomorrow fixtures:', error);
  }
  
  return matches;
}

/**
 * Fetch active leagues
 */
export async function getActiveLeagues(): Promise<League[]> {
  const leagues: League[] = [];
  
  try {
    // From Kooora
    const kooora Response = await fetch(`${KOOORA_API}/api/leagues/active`);
    if (kooora Response.ok) {
      const data = await kooora Response.json();
      if (data.success && data.data) {
        const kooora Leagues = data.data.map((l: any) => ({
          id: `k-${l.id}`,
          name: l.name,
          matchCount: l.match_count,
          source: 'Kooora'
        }));
        leagues.push(...kooora Leagues);
      }
    }
  } catch (error) {
    console.error('Error fetching Kooora leagues:', error);
  }
  
  try {
    // From LiveSoccer
    const liveResponse = await fetch(`${LIVESOCCER_API}/api/leagues`);
    if (liveResponse.ok) {
      const data = await liveResponse.json();
      if (data.success && data.data) {
        const liveLeagues = data.data.slice(0, 20).map((l: any) => ({
          id: `ls-${l.id}`,
          name: l.name,
          country: l.country,
          source: 'LiveSoccer'
        }));
        leagues.push(...liveLeagues);
      }
    }
  } catch (error) {
    console.error('Error fetching LiveSoccer leagues:', error);
  }
  
  return leagues;
}

/**
 * Search for teams/matches
 */
export async function searchSports(query: string): Promise<any[]> {
  const results: any[] = [];
  
  try {
    const response = await fetch(`${LIVESOCCER_API}/api/search/team?q=${encodeURIComponent(query)}`);
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        results.push(...data.data);
      }
    }
  } catch (error) {
    console.error('Error searching:', error);
  }
  
  return results;
}

/**
 * Fetch match details
 */
export async function getMatchDetails(matchId: string): Promise<any | null> {
  try {
    // Determine which API to use based on ID prefix
    if (matchId.startsWith('ls-')) {
      const id = matchId.replace('ls-', '');
      const response = await fetch(`${LIVESOCCER_API}/api/match/${id}`);
      if (response.ok) {
        const data = await response.json();
        return data.success ? data.data : null;
      }
    } else if (matchId.startsWith('k-')) {
      const id = matchId.replace('k-', '');
      const response = await fetch(`${KOOORA_API}/api/match/${id}`);
      if (response.ok) {
        const data = await response.json();
        return data.success ? data.data : null;
      }
    }
  } catch (error) {
    console.error('Error fetching match details:', error);
  }
  
  return null;
}

