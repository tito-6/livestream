import React from 'react';
import { GiTrophy, GiSoccerBall, GiBasketballBall, GiTennisRacket, GiBoxingGlove, GiVolleyballBall } from 'react-icons/gi';
import { IoFootball, IoBasketball } from 'react-icons/io5';
import { MdSportsBasketball, MdSportsTennis, MdSportsVolleyball } from 'react-icons/md';

interface CategoriesSectionProps {
  lang: 'ar' | 'en';
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ lang }) => {
  const translations = {
    ar: {
      title: 'استكشف الرياضات',
      subtitle: 'اختر رياضتك المفضلة',
    },
    en: {
      title: 'Explore Sports',
      subtitle: 'Choose Your Favorite Sport',
    }
  };

  const categories = [
    {
      id: 'football',
      icon: GiSoccerBall,
      name: { ar: 'كرة القدم', en: 'Football' },
      color: 'emerald',
      streamCount: 245,
      viewerCount: 125000,
    },
    {
      id: 'basketball',
      icon: GiBasketballBall,
      name: { ar: 'كرة السلة', en: 'Basketball' },
      color: 'sultan',
      streamCount: 180,
      viewerCount: 98000,
    },
    {
      id: 'tennis',
      icon: GiTennisRacket,
      name: { ar: 'التنس', en: 'Tennis' },
      color: 'gold',
      streamCount: 95,
      viewerCount: 42000,
    },
    {
      id: 'volleyball',
      icon: GiVolleyballBall,
      name: { ar: 'الكرة الطائرة', en: 'Volleyball' },
      color: 'emerald',
      streamCount: 87,
      viewerCount: 38000,
    },
    {
      id: 'boxing',
      icon: GiBoxingGlove,
      name: { ar: 'الملاكمة', en: 'Boxing' },
      color: 'sultan',
      streamCount: 130,
      viewerCount: 67000,
    },
    {
      id: 'all',
      icon: GiTrophy,
      name: { ar: 'جميع الرياضات', en: 'All Sports' },
      color: 'gold',
      streamCount: 737,
      viewerCount: 370000,
    },
  ];

  const t = translations[lang];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="h2 text-gradient-oasis mb-3">{t.title}</h2>
          <p className="text-white/60">{t.subtitle}</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const colorClasses = {
              emerald: 'from-emerald-energy/20 to-emerald-energy/5 border-emerald-energy/30 hover:border-emerald-energy',
              sultan: 'from-sultan-blue/20 to-sultan-blue/5 border-sultan-blue/30 hover:border-sultan-blue',
              gold: 'from-gold-burnished/20 to-gold-burnished/5 border-gold-burnished/30 hover:border-gold-burnished',
            };

            const iconColorClasses = {
              emerald: 'text-emerald-energy',
              sultan: 'text-sultan-blue',
              gold: 'text-gold-burnished',
            };

            return (
              <div
                key={category.id}
                className={`relative group cursor-pointer rounded-xl border-2 transition-all duration-300 
                           overflow-hidden bg-gradient-to-br ${colorClasses[category.color as keyof typeof colorClasses]}
                           hover:scale-105 hover:shadow-2xl`}
              >
                {/* Content */}
                <div className="p-6 relative z-10">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`text-5xl ${iconColorClasses[category.color as keyof typeof iconColorClasses]} 
                                    group-hover:scale-110 transition-transform duration-300`}>
                      <Icon />
                    </div>
                    <h3 className="font-bold text-white text-lg">
                      {category.name[lang]}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="text-white/80">
                        {category.streamCount} {lang === 'ar' ? 'بث' : 'live'}
                      </div>
                      <div className="text-white/60">
                        {(category.viewerCount / 1000).toFixed(0)}K {lang === 'ar' ? 'مشاهد' : 'viewers'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-black/50 to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CategoriesSection;

