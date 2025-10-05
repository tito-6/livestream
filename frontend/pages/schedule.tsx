import React, { useState } from 'react';
import Layout from '../components/Layout';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { GiSoccerBall, GiBasketballBall, GiTennisRacket, GiBoxingGlove } from 'react-icons/gi';
import { MdNotificationsActive } from 'react-icons/md';

interface ScheduledMatch {
  id: string;
  title: string;
  sport: string;
  sportIcon: any;
  league: string;
  date: string;
  time: string;
  venue: string;
  teams: { home: string; away: string };
  thumbnail: string;
  broadcaster: string;
}

export default function SchedulePage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [selectedDate, setSelectedDate] = useState<string>('today');

  const translations = {
    ar: {
      title: 'جدول المباريات',
      subtitle: 'لا تفوت مبارياتك المفضلة',
      today: 'اليوم',
      tomorrow: 'غداً',
      thisWeek: 'هذا الأسبوع',
      setReminder: 'تذكير',
      reminded: 'تم التذكير',
      venue: 'الملعب',
      time: 'الوقت',
      broadcaster: 'القناة الناقلة',
      vs: 'ضد',
    },
    en: {
      title: 'Match Schedule',
      subtitle: 'Don\'t miss your favorite matches',
      today: 'Today',
      tomorrow: 'Tomorrow',
      thisWeek: 'This Week',
      setReminder: 'Set Reminder',
      reminded: 'Reminded',
      venue: 'Venue',
      time: 'Time',
      broadcaster: 'Broadcaster',
      vs: 'vs',
    }
  };

  const t = translations[lang];

  const matches: ScheduledMatch[] = [
    {
      id: '1',
      title: lang === 'ar' ? 'الهلال ضد النصر' : 'Al-Hilal vs Al-Nassr',
      sport: 'football',
      sportIcon: GiSoccerBall,
      league: lang === 'ar' ? 'دوري روشن السعودي' : 'Saudi Pro League',
      date: '2025-10-05',
      time: '20:00',
      venue: lang === 'ar' ? 'استاد الملك فهد الدولي' : 'King Fahd International Stadium',
      teams: { 
        home: lang === 'ar' ? 'الهلال' : 'Al-Hilal',
        away: lang === 'ar' ? 'النصر' : 'Al-Nassr'
      },
      thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
      broadcaster: lang === 'ar' ? 'قناة الرياضة' : 'Sports Channel',
    },
    {
      id: '2',
      title: lang === 'ar' ? 'ليكرز ضد بوسطن' : 'Lakers vs Boston',
      sport: 'basketball',
      sportIcon: GiBasketballBall,
      league: 'NBA',
      date: '2025-10-05',
      time: '03:00',
      venue: 'Staples Center',
      teams: { 
        home: 'Lakers',
        away: 'Boston Celtics'
      },
      thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80',
      broadcaster: 'ESPN',
    },
    {
      id: '3',
      title: lang === 'ar' ? 'نهائي ويمبلدون' : 'Wimbledon Finals',
      sport: 'tennis',
      sportIcon: GiTennisRacket,
      league: 'ATP',
      date: '2025-10-06',
      time: '18:00',
      venue: 'Centre Court, Wimbledon',
      teams: { 
        home: lang === 'ar' ? 'نادال' : 'Nadal',
        away: lang === 'ar' ? 'ديوكوفيتش' : 'Djokovic'
      },
      thumbnail: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&q=80',
      broadcaster: lang === 'ar' ? 'قناة التنس' : 'Tennis Channel',
    },
    {
      id: '4',
      title: lang === 'ar' ? 'ريال مدريد ضد برشلونة' : 'Real Madrid vs Barcelona',
      sport: 'football',
      sportIcon: GiSoccerBall,
      league: 'El Clásico',
      date: '2025-10-06',
      time: '21:00',
      venue: 'Santiago Bernabéu',
      teams: { 
        home: lang === 'ar' ? 'ريال مدريد' : 'Real Madrid',
        away: lang === 'ar' ? 'برشلونة' : 'Barcelona'
      },
      thumbnail: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80',
      broadcaster: 'beIN Sports',
    },
    {
      id: '5',
      title: lang === 'ar' ? 'نزال الملاكمة' : 'Boxing Championship',
      sport: 'boxing',
      sportIcon: GiBoxingGlove,
      league: 'WBC',
      date: '2025-10-07',
      time: '05:00',
      venue: 'MGM Grand Arena',
      teams: { 
        home: lang === 'ar' ? 'البطل' : 'Champion',
        away: lang === 'ar' ? 'المنافس' : 'Challenger'
      },
      thumbnail: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&q=80',
      broadcaster: lang === 'ar' ? 'قناة القتال' : 'Fight Channel',
    },
  ];

  const dateFilters = [
    { id: 'today', label: t.today },
    { id: 'tomorrow', label: t.tomorrow },
    { id: 'thisWeek', label: t.thisWeek },
  ];

  const [reminders, setReminders] = useState<string[]>([]);

  const toggleReminder = (matchId: string) => {
    if (reminders.includes(matchId)) {
      setReminders(reminders.filter(id => id !== matchId));
    } else {
      setReminders([...reminders, matchId]);
    }
  };

  return (
    <Layout lang={lang}>
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FiCalendar className="text-4xl text-emerald-energy" />
              <h1 className="h1 text-gradient-oasis">{t.title}</h1>
            </div>
            <p className="text-white/70 text-lg">{t.subtitle}</p>
          </div>

          {/* Date Filters */}
          <div className="flex justify-center gap-4 mb-12">
            {dateFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedDate(filter.id)}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  selectedDate === filter.id
                    ? 'bg-gradient-oasis text-midnight-black shadow-glow-emerald'
                    : 'glass-panel text-white hover:border-emerald-energy'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Matches Timeline */}
          <div className="space-y-6">
            {matches.map((match, index) => {
              const SportIcon = match.sportIcon;
              const hasReminder = reminders.includes(match.id);

              return (
                <div key={match.id} className="glass-panel p-6 rounded-xl hover:border-emerald-energy transition-all">
                  <div className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Match Image */}
                    <div className="lg:w-1/3">
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <img 
                          src={match.thumbnail}
                          alt={match.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-midnight-black/80 to-transparent" />
                        
                        {/* Sport Icon */}
                        <div className="absolute top-3 left-3 w-12 h-12 rounded-full bg-emerald-energy/20 backdrop-blur-sm flex items-center justify-center border-2 border-emerald-energy">
                          <SportIcon className="text-2xl text-emerald-energy" />
                        </div>
                      </div>
                    </div>

                    {/* Match Details */}
                    <div className="lg:w-2/3 flex flex-col justify-between">
                      <div>
                        {/* League & Date */}
                        <div className="flex flex-wrap items-center gap-4 mb-3">
                          <span className="px-3 py-1 bg-cosmic-navy rounded-full text-emerald-energy text-sm font-semibold">
                            {match.league}
                          </span>
                          <div className="flex items-center gap-2 text-white/70">
                            <FiCalendar />
                            <span>{new Date(match.date).toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-US')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/70">
                            <FiClock />
                            <span>{match.time}</span>
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
                          <div className="text-white/70">
                            <span className="text-white/90">{t.broadcaster}:</span> {match.broadcaster}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => toggleReminder(match.id)}
                          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                            hasReminder
                              ? 'bg-emerald-energy text-midnight-black'
                              : 'glass-panel-subtle text-white hover:border-emerald-energy'
                          }`}
                        >
                          <MdNotificationsActive className="text-xl" />
                          {hasReminder ? t.reminded : t.setReminder}
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

