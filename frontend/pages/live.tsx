import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { MdLiveTv } from 'react-icons/md';
import { FiEye, FiFilter } from 'react-icons/fi';
import { GiSoccerBall, GiBasketballBall, GiTennisRacket, GiBoxingGlove } from 'react-icons/gi';
import Link from 'next/link';

interface LiveMatch {
  id: string;
  title: string;
  sport: string;
  league: string;
  viewers: number;
  thumbnail: string;
  broadcaster: string;
  isLive: boolean;
}

export default function LivePage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [matches, setMatches] = useState<LiveMatch[]>([]);

  const translations = {
    ar: {
      title: 'المباريات المباشرة',
      subtitle: 'شاهد جميع المباريات المباشرة الآن',
      liveNow: 'مباشر الآن',
      viewers: 'مشاهد',
      filterBy: 'تصفية حسب',
      all: 'الكل',
      football: 'كرة القدم',
      basketball: 'كرة السلة',
      tennis: 'التنس',
      boxing: 'الملاكمة',
      noMatches: 'لا توجد مباريات مباشرة حالياً',
    },
    en: {
      title: 'Live Matches',
      subtitle: 'Watch all live matches now',
      liveNow: 'Live Now',
      viewers: 'viewers',
      filterBy: 'Filter by',
      all: 'All',
      football: 'Football',
      basketball: 'Basketball',
      tennis: 'Tennis',
      boxing: 'Boxing',
      noMatches: 'No live matches at the moment',
    }
  };

  const t = translations[lang];

  const sportFilters = [
    { id: 'all', name: t.all, icon: null },
    { id: 'football', name: t.football, icon: GiSoccerBall },
    { id: 'basketball', name: t.basketball, icon: GiBasketballBall },
    { id: 'tennis', name: t.tennis, icon: GiTennisRacket },
    { id: 'boxing', name: t.boxing, icon: GiBoxingGlove },
  ];

  useEffect(() => {
    // Mock data
    const allMatches: LiveMatch[] = [
      {
        id: '1',
        title: lang === 'ar' ? 'الهلال ضد النصر' : 'Al-Hilal vs Al-Nassr',
        sport: 'football',
        league: lang === 'ar' ? 'دوري روشن السعودي' : 'Saudi Pro League',
        viewers: 85234,
        thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
        broadcaster: lang === 'ar' ? 'قناة الرياضة' : 'Sports Channel',
        isLive: true,
      },
      {
        id: '2',
        title: lang === 'ar' ? 'ليكرز ضد ووريورز' : 'Lakers vs Warriors',
        sport: 'basketball',
        league: 'NBA',
        viewers: 62100,
        thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80',
        broadcaster: lang === 'ar' ? 'قناة NBA' : 'NBA Channel',
        isLive: true,
      },
      {
        id: '3',
        title: lang === 'ar' ? 'نهائي ويمبلدون' : 'Wimbledon Finals',
        sport: 'tennis',
        league: 'ATP',
        viewers: 48500,
        thumbnail: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&q=80',
        broadcaster: lang === 'ar' ? 'قناة التنس' : 'Tennis Channel',
        isLive: true,
      },
      {
        id: '4',
        title: lang === 'ar' ? 'ريال مدريد ضد برشلونة' : 'Real Madrid vs Barcelona',
        sport: 'football',
        league: 'La Liga',
        viewers: 125800,
        thumbnail: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80',
        broadcaster: lang === 'ar' ? 'قناة الدوري الإسباني' : 'La Liga TV',
        isLive: true,
      },
      {
        id: '5',
        title: lang === 'ar' ? 'نزال الملاكمة' : 'Boxing Match',
        sport: 'boxing',
        league: 'WBC',
        viewers: 95600,
        thumbnail: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&q=80',
        broadcaster: lang === 'ar' ? 'قناة القتال' : 'Fight Channel',
        isLive: true,
      },
      {
        id: '6',
        title: lang === 'ar' ? 'الاتحاد ضد الأهلي' : 'Al-Ittihad vs Al-Ahli',
        sport: 'football',
        league: lang === 'ar' ? 'دوري روشن السعودي' : 'Saudi Pro League',
        viewers: 72000,
        thumbnail: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&q=80',
        broadcaster: lang === 'ar' ? 'قناة الرياضة 2' : 'Sports Channel 2',
        isLive: true,
      },
    ];

    const filtered = selectedSport === 'all' 
      ? allMatches 
      : allMatches.filter(m => m.sport === selectedSport);

    setMatches(filtered);
  }, [selectedSport, lang]);

  return (
    <Layout lang={lang}>
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-3 h-3 bg-emerald-energy rounded-full animate-pulse-live" />
              <h1 className="h1 text-gradient-oasis">{t.title}</h1>
              <div className="w-3 h-3 bg-emerald-energy rounded-full animate-pulse-live" />
            </div>
            <p className="text-white/70 text-lg">{t.subtitle}</p>
            
            {/* Live Stats */}
            <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 glass-panel rounded-full">
              <MdLiveTv className="text-emerald-energy text-2xl" />
              <span className="text-white font-bold">{matches.length}</span>
              <span className="text-white/60">{t.liveNow}</span>
            </div>
          </div>

          {/* Sport Filters */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FiFilter className="text-emerald-energy" />
              <span className="text-white font-semibold">{t.filterBy}:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {sportFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedSport(filter.id)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      selectedSport === filter.id
                        ? 'bg-gradient-oasis text-midnight-black shadow-glow-emerald'
                        : 'glass-panel text-white hover:border-emerald-energy'
                    }`}
                  >
                    {Icon && <Icon className="text-xl" />}
                    {filter.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Matches Grid */}
          {matches.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <Link href={`/stream/${match.id}`} key={match.id}>
                  <div className="stream-card glass-panel group cursor-pointer h-full">
                    {/* Live Badge & Viewers */}
                    <div className="relative">
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1 bg-emerald-energy rounded-lg">
                        <MdLiveTv className="text-midnight-black animate-pulse-live" />
                        <span className="text-xs font-bold text-midnight-black uppercase">{t.liveNow}</span>
                      </div>

                      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-3 py-1 glass-panel-subtle rounded-lg">
                        <FiEye className="text-emerald-energy text-sm" />
                        <span className="text-xs font-semibold text-white">
                          {match.viewers.toLocaleString()}
                        </span>
                      </div>

                      {/* Thumbnail */}
                      <div className="aspect-video rounded-t-lg overflow-hidden bg-cosmic-navy">
                        <img 
                          src={match.thumbnail}
                          alt={match.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    {/* Match Info */}
                    <div className="p-4 space-y-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-energy transition-colors">
                        {match.title}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-sm text-white/80">{match.league}</p>
                        <p className="text-sm text-white/60">{match.broadcaster}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-white mb-2">{t.noMatches}</h3>
              <p className="text-white/60">Check back later for live sports action!</p>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}

