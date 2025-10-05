import React, { useState } from 'react';
import Layout from '../components/Layout';
import { GiSoccerBall, GiBasketballBall, GiTennisRacket, GiBoxingGlove, GiVolleyballBall, GiAmericanFootballBall } from 'react-icons/gi';
import { MdSportsBaseball, MdSportsHandball } from 'react-icons/md';
import Link from 'next/link';

interface Sport {
  id: string;
  name: { ar: string; en: string };
  icon: any;
  description: { ar: string; en: string };
  liveCount: number;
  totalViewers: number;
  color: string;
  image: string;
  leagues: string[];
}

export default function SportsPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const translations = {
    ar: {
      title: 'جميع الرياضات',
      subtitle: 'اكتشف وشاهد رياضتك المفضلة',
      livematches: 'مباراة مباشرة',
      viewers: 'مشاهد',
      watchNow: 'شاهد الآن',
      explore: 'استكشف',
    },
    en: {
      title: 'All Sports',
      subtitle: 'Discover and watch your favorite sports',
      livematches: 'live matches',
      viewers: 'viewers',
      watchNow: 'Watch Now',
      explore: 'Explore',
    }
  };

  const t = translations[lang];

  const sports: Sport[] = [
    {
      id: 'football',
      name: { ar: 'كرة القدم', en: 'Football' },
      icon: GiSoccerBall,
      description: { 
        ar: 'شاهد أفضل مباريات كرة القدم من جميع أنحاء العالم',
        en: 'Watch the best football matches from around the world'
      },
      liveCount: 24,
      totalViewers: 450000,
      color: '#00FF7F',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
      leagues: ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Saudi Pro League']
    },
    {
      id: 'basketball',
      name: { ar: 'كرة السلة', en: 'Basketball' },
      icon: GiBasketballBall,
      description: { 
        ar: 'تابع أفضل مباريات NBA وبطولات كرة السلة العالمية',
        en: 'Follow the best NBA games and international basketball tournaments'
      },
      liveCount: 12,
      totalViewers: 280000,
      color: '#00FFFF',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
      leagues: ['NBA', 'EuroLeague', 'FIBA', 'NCAA']
    },
    {
      id: 'tennis',
      name: { ar: 'التنس', en: 'Tennis' },
      icon: GiTennisRacket,
      description: { 
        ar: 'شاهد بطولات التنس الكبرى والمباريات المثيرة',
        en: 'Watch Grand Slam tournaments and exciting tennis matches'
      },
      liveCount: 8,
      totalViewers: 150000,
      color: '#CCAA66',
      image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80',
      leagues: ['Wimbledon', 'US Open', 'Roland Garros', 'Australian Open', 'ATP Tour']
    },
    {
      id: 'boxing',
      name: { ar: 'الملاكمة', en: 'Boxing' },
      icon: GiBoxingGlove,
      description: { 
        ar: 'تابع أقوى نزالات الملاكمة وبطولات الوزن الثقيل',
        en: 'Follow the strongest boxing matches and heavyweight championships'
      },
      liveCount: 5,
      totalViewers: 180000,
      color: '#FF6B6B',
      image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80',
      leagues: ['WBC', 'WBA', 'IBF', 'WBO']
    },
    {
      id: 'volleyball',
      name: { ar: 'الكرة الطائرة', en: 'Volleyball' },
      icon: GiVolleyballBall,
      description: { 
        ar: 'استمتع بمباريات الكرة الطائرة الشاطئية والداخلية',
        en: 'Enjoy beach and indoor volleyball matches'
      },
      liveCount: 6,
      totalViewers: 95000,
      color: '#4ECDC4',
      image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80',
      leagues: ['FIVB', 'Beach Volleyball', 'CEV']
    },
    {
      id: 'americanfootball',
      name: { ar: 'كرة القدم الأمريكية', en: 'American Football' },
      icon: GiAmericanFootballBall,
      description: { 
        ar: 'شاهد مباريات NFL والبطولات الأمريكية المثيرة',
        en: 'Watch NFL games and exciting American football championships'
      },
      liveCount: 10,
      totalViewers: 320000,
      color: '#FF9F1C',
      image: 'https://images.unsplash.com/photo-1508890977999-534ce119ca04?w=800&q=80',
      leagues: ['NFL', 'NCAA Football', 'CFL']
    },
  ];

  return (
    <Layout lang={lang}>
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="h1 text-gradient-oasis mb-4">{t.title}</h1>
            <p className="text-white/70 text-xl">{t.subtitle}</p>
          </div>

          {/* Sports Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sports.map((sport) => {
              const Icon = sport.icon;
              return (
                <Link href={`/sports/${sport.id}`} key={sport.id}>
                  <div className="geometric-border group cursor-pointer h-full">
                    <div className="geometric-border-inner overflow-hidden h-full flex flex-col">
                      
                      {/* Sport Image */}
                      <div className="relative aspect-video overflow-hidden">
                        <img 
                          src={sport.image}
                          alt={sport.name[lang]}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-midnight-black via-midnight-black/70 to-transparent" />
                        
                        {/* Icon */}
                        <div 
                          className="absolute top-4 right-4 w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm"
                          style={{ backgroundColor: `${sport.color}20`, border: `2px solid ${sport.color}` }}
                        >
                          <Icon className="text-4xl" style={{ color: sport.color }} />
                        </div>

                        {/* Live Count */}
                        {sport.liveCount > 0 && (
                          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 glass-panel rounded-lg">
                            <div className="w-2 h-2 bg-emerald-energy rounded-full animate-pulse-live" />
                            <span className="text-white font-semibold">{sport.liveCount}</span>
                            <span className="text-white/60 text-sm">{t.livematches}</span>
                          </div>
                        )}
                      </div>

                      {/* Sport Info */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 
                          className="text-2xl font-bold mb-3 group-hover:scale-105 transition-transform"
                          style={{ color: sport.color }}
                        >
                          {sport.name[lang]}
                        </h3>
                        
                        <p className="text-white/70 mb-4 flex-1">
                          {sport.description[lang]}
                        </p>

                        {/* Stats */}
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white/60">{t.viewers}:</span>
                            <span className="text-white font-semibold">
                              {(sport.totalViewers / 1000).toFixed(0)}K
                            </span>
                          </div>
                        </div>

                        {/* Leagues */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {sport.leagues.slice(0, 3).map((league, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 text-xs bg-cosmic-navy rounded-full text-white/70"
                            >
                              {league}
                            </span>
                          ))}
                          {sport.leagues.length > 3 && (
                            <span className="px-3 py-1 text-xs bg-cosmic-navy rounded-full text-white/70">
                              +{sport.leagues.length - 3}
                            </span>
                          )}
                        </div>

                        {/* CTA Button */}
                        <button 
                          className="w-full py-3 rounded-lg font-bold transition-all"
                          style={{ 
                            backgroundColor: `${sport.color}20`,
                            border: `2px solid ${sport.color}`,
                            color: sport.color
                          }}
                        >
                          {t.watchNow}
                        </button>
                      </div>

                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </Layout>
  );
}

