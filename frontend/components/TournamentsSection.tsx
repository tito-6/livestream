import React from 'react';
import { GiTrophy } from 'react-icons/gi';
import { FiCalendar, FiUsers } from 'react-icons/fi';

interface TournamentsSectionProps {
  lang: 'ar' | 'en';
}

const TournamentsSection: React.FC<TournamentsSectionProps> = ({ lang }) => {
  const translations = {
    ar: {
      title: 'البطولات والمسابقات',
      subtitle: 'لا تفوت أكبر الأحداث الرياضية',
      prizePool: 'جائزة البطولة',
      teams: 'فريق',
      starting: 'يبدأ في',
      register: 'اشترك الآن',
      watchLive: 'شاهد مباشرة',
    },
    en: {
      title: 'Tournaments & Championships',
      subtitle: 'Don\'t Miss the Biggest Sports Events',
      prizePool: 'Prize Pool',
      teams: 'Teams',
      starting: 'Starting',
      register: 'Register Now',
      watchLive: 'Watch Live',
    }
  };

  const tournaments = [
    {
      id: '1',
      name: { ar: 'كأس العالم للأندية FIFA', en: 'FIFA Club World Cup' },
      game: lang === 'ar' ? 'كرة القدم' : 'Football',
      prizePool: '$20,000,000',
      teams: 32,
      startDate: '2025-10-15',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
      status: 'upcoming',
    },
    {
      id: '2',
      name: { ar: 'دوري أبطال آسيا', en: 'AFC Champions League' },
      game: lang === 'ar' ? 'كرة القدم' : 'Football',
      prizePool: '$12,000,000',
      teams: 24,
      startDate: '2025-10-20',
      image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80',
      status: 'live',
    },
    {
      id: '3',
      name: { ar: 'بطولة الخليج العربي لكرة السلة', en: 'Gulf Basketball Championship' },
      game: lang === 'ar' ? 'كرة السلة' : 'Basketball',
      prizePool: '$5,000,000',
      teams: 16,
      startDate: '2025-10-25',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
      status: 'upcoming',
    },
  ];

  const t = translations[lang];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-burnished/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GiTrophy className="text-5xl text-gold-burnished" />
          </div>
          <h2 className="h2 text-gradient-gold mb-3">{t.title}</h2>
          <p className="text-white/60">{t.subtitle}</p>
        </div>

        {/* Tournaments Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="geometric-border group cursor-pointer">
              <div className="geometric-border-inner overflow-hidden">
                
                {/* Tournament Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={tournament.image}
                    alt={tournament.name[lang]}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Status Badge */}
                  {tournament.status === 'live' && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-emerald-energy rounded-lg">
                      <div className="w-2 h-2 bg-midnight-black rounded-full animate-pulse-live" />
                      <span className="text-xs font-bold text-midnight-black uppercase">{t.watchLive}</span>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-black via-midnight-black/50 to-transparent" />
                  
                  {/* Prize Pool */}
                  <div className="absolute bottom-4 right-4">
                    <div className="glass-panel px-4 py-2">
                      <div className="text-xs text-white/60 mb-1">{t.prizePool}</div>
                      <div className="text-xl font-bold text-gradient-gold">{tournament.prizePool}</div>
                    </div>
                  </div>
                </div>

                {/* Tournament Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-gold-burnished transition-colors mb-2">
                      {tournament.name[lang]}
                    </h3>
                    <p className="text-sm text-white/60">{tournament.game}</p>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-white/80">
                      <FiUsers className="text-gold-burnished" />
                      <span>{tournament.teams} {t.teams}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <FiCalendar className="text-gold-burnished" />
                      <span>{new Date(tournament.startDate).toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-US')}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className={tournament.status === 'live' ? 'btn-primary w-full' : 'btn-gold w-full'}>
                    {tournament.status === 'live' ? t.watchLive : t.register}
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TournamentsSection;

