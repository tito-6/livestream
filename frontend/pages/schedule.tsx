import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { GiSoccerBall, GiBasketballBall, GiTennisRacket } from 'react-icons/gi';
import { MdNotificationsActive } from 'react-icons/md';

interface ScheduledMatch {
  id: number;
  title: string;
  sport: string;
  league: string;
  date: string; // ISO string
  time: string; // "HH:MM"
  venue: string;
  teams: { home: string; away: string };
  broadcaster?: string;
}

export default function SchedulePage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [matches, setMatches] = useState<ScheduledMatch[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('all');

  const translations = {
    ar: {
      title: 'جدول المباريات',
      subtitle: 'لا تفوت مبارياتك المفضلة',
      all: 'الكل',
      venue: 'الملعب',
      broadcaster: 'القناة الناقلة',
      vs: 'ضد',
    },
    en: {
      title: 'Match Schedule',
      subtitle: 'Don\'t miss your favorite matches',
      all: 'All',
      venue: 'Venue',
      broadcaster: 'Broadcaster',
      vs: 'vs',
    }
  };
  const t = translations[lang];

  useEffect(() => {
    fetch('http://192.168.1.171:8080/api/events')
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          // Transform backend event format to frontend format
          const events = json.data.map((e: any) => ({
            id: e.id,
            title: e.title || `${e.team_home} vs ${e.team_away}`,
            sport: e.sport,
            league: e.league || 'Tournament',
            date: e.start_time, // Keep ISO for parsing
            time: new Date(e.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            venue: e.venue,
            teams: { home: e.team_home, away: e.team_away },
            broadcaster: e.broadcaster || 'StreamCast'
          }));
          setMatches(events);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const getSportIcon = (sport: string) => {
    switch (sport.toLowerCase()) {
      case 'basketball': return GiBasketballBall;
      case 'tennis': return GiTennisRacket;
      default: return GiSoccerBall;
    }
  };

  return (
    <Layout lang={lang}>
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">

          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FiCalendar className="text-4xl text-emerald-energy" />
              <h1 className="h1 text-gradient-oasis">{t.title}</h1>
            </div>
            <p className="text-white/70 text-lg">{t.subtitle}</p>
          </div>

          <div className="space-y-6">
            {matches.length === 0 ? (
              <div className="text-center text-gray-500 py-10">No upcoming matches scheduled. Check back later!</div>
            ) : matches.map((match) => {
              const SportIcon = getSportIcon(match.sport);
              return (
                <div key={match.id} className="glass-panel p-6 rounded-xl hover:border-emerald-energy transition-all">
                  <div className="flex flex-col lg:flex-row gap-6">

                    <div className="lg:w-1/3">
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-cosmic-navy flex items-center justify-center">
                        <SportIcon className="text-6xl text-emerald-energy/20" />
                        <div className="absolute top-3 left-3 w-12 h-12 rounded-full bg-emerald-energy/20 backdrop-blur-sm flex items-center justify-center border-2 border-emerald-energy">
                          <SportIcon className="text-2xl text-emerald-energy" />
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-2/3 flex flex-col justify-between">
                      <div>
                        {/* League & Date */}
                        <div className="flex flex-wrap items-center gap-4 mb-3">
                          <span className="px-3 py-1 bg-cosmic-navy rounded-full text-emerald-energy text-sm font-semibold">
                            {match.league}
                          </span>
                          <div className="flex items-center gap-2 text-white/70">
                            <FiCalendar />
                            <span>{new Date(match.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/70">
                            <FiClock />
                            <span>{new Date(match.date).toLocaleTimeString()}</span>
                          </div>
                        </div>

                        {/* Match Title / Teams */}
                        <h3 className="text-2xl font-bold text-white mb-4">
                          {match.teams.home} <span className="text-emerald-energy">{t.vs}</span> {match.teams.away}
                        </h3>

                        {/* Additional Info */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-white/70">
                            <FiMapPin className="text-emerald-energy" />
                            <span>{match.venue}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-4">
                        <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold bg-emerald-energy text-midnight-black hover:bg-emerald-400 transition-colors">
                          <MdNotificationsActive className="text-xl" />
                          Remind Me
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </Layout>
  );
}

