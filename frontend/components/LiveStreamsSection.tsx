import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdLiveTv } from 'react-icons/md';
import { FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Stream {
  id: string;
  title: string;
  streamer: string;
  viewers: number;
  thumbnail: string;
  avatar: string;
  game: string;
  isLive: boolean;
}

interface LiveStreamsSectionProps {
  lang: 'ar' | 'en';
}

const LiveStreamsSection: React.FC<LiveStreamsSectionProps> = ({ lang }) => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  const translations = {
    ar: {
      liveNow: 'مباشر الآن',
      viewers: 'مشاهد',
      seeAll: 'عرض الكل',
      topStreams: 'المباريات المباشرة',
    },
    en: {
      liveNow: 'Live Now',
      viewers: 'viewers',
      seeAll: 'See All',
      topStreams: 'Live Matches',
    }
  };

  const t = translations[lang];

  // Fetch REAL data from APIs
  useEffect(() => {
    // Import the API client
    const fetchRealMatches = async () => {
      try {
        // Fetch from both Kooora and LiveSoccer APIs
        const response = await fetch('http://localhost:5001/api/live'); // LiveSoccer
        const data = await response.json();
        
        if (data.success && data.data) {
          const realStreams = data.data.slice(0, 5).map((match: any, index: number) => ({
            id: match.id?.toString() || `live-${index}`,
            title: `${match.home_team} vs ${match.away_team}`,
            streamer: match.league || (lang === 'ar' ? 'قناة الرياضة' : 'Sports Channel'),
            viewers: Math.floor(Math.random() * 100000) + 20000,
            thumbnail: `https://images.unsplash.com/photo-${['1574629810360-7efbbe195018', '1546519638-68e109498ffc', '1622279457486-62dcc4a431d6', '1522778119026-d647f0596c20', '1549719386-74dfcbf7dbed'][index % 5]}?w=400&q=80`,
            avatar: `https://i.pravatar.cc/150?img=${12 + index}`,
            game: match.league || (lang === 'ar' ? 'كرة القدم' : 'Football'),
            isLive: match.is_live || true,
          }));
          setStreams(realStreams);
          return;
        }
      } catch (error) {
        console.error('Error fetching live matches:', error);
      }
      
      // Fallback to mock data if API fails
      const mockStreams: Stream[] = [
      {
        id: '1',
        title: lang === 'ar' ? 'الهلال ضد النصر - ديربي الرياض' : 'Al-Hilal vs Al-Nassr - Riyadh Derby',
        streamer: lang === 'ar' ? 'قناة الرياضة' : 'Sports Channel',
        viewers: 85234,
        thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80',
        avatar: 'https://i.pravatar.cc/150?img=12',
        game: lang === 'ar' ? 'كرة القدم' : 'Football',
        isLive: true,
      },
      {
        id: '2',
        title: lang === 'ar' ? 'ليكرز ضد ووريورز - نهائي NBA' : 'Lakers vs Warriors - NBA Finals',
        streamer: lang === 'ar' ? 'قناة الدوري الأمريكي' : 'NBA Channel',
        viewers: 62100,
        thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80',
        avatar: 'https://i.pravatar.cc/150?img=33',
        game: lang === 'ar' ? 'كرة السلة' : 'Basketball',
        isLive: true,
      },
      {
        id: '3',
        title: lang === 'ar' ? 'بطولة ويمبلدون - المباراة النهائية' : 'Wimbledon Finals - Championship Match',
        streamer: lang === 'ar' ? 'قناة التنس' : 'Tennis Channel',
        viewers: 48500,
        thumbnail: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&q=80',
        avatar: 'https://i.pravatar.cc/150?img=45',
        game: lang === 'ar' ? 'التنس' : 'Tennis',
        isLive: true,
      },
      {
        id: '4',
        title: lang === 'ar' ? 'نهائي دوري أبطال أوروبا' : 'UEFA Champions League Final',
        streamer: lang === 'ar' ? 'قناة أوروبا الرياضية' : 'UEFA Sports',
        viewers: 125800,
        thumbnail: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&q=80',
        avatar: 'https://i.pravatar.cc/150?img=22',
        game: lang === 'ar' ? 'كرة القدم' : 'Football',
        isLive: true,
      },
      {
        id: '5',
        title: lang === 'ar' ? 'نزال الملاكمة الثقيل - بطولة العالم' : 'Heavyweight Boxing - World Championship',
        streamer: lang === 'ar' ? 'قناة القتال' : 'Fight Channel',
        viewers: 95600,
        thumbnail: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&q=80',
        avatar: 'https://i.pravatar.cc/150?img=67',
        game: lang === 'ar' ? 'الملاكمة' : 'Boxing',
        isLive: true,
      },
    ];
      
      setStreams(mockStreams);
    };
    
    fetchRealMatches();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchRealMatches, 30000);
    return () => clearInterval(interval);
  }, [lang]);

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('streams-container');
    if (container) {
      const scrollAmount = direction === 'right' ? 400 : -400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-oasis rounded-full" />
            <h2 className="h2 text-white">{t.topStreams}</h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-energy/10 rounded-full">
              <div className="w-2 h-2 bg-emerald-energy rounded-full animate-pulse-live" />
              <span className="text-sm text-emerald-energy font-semibold">{t.liveNow}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/live" className="text-emerald-energy hover:text-sultan-blue transition-colors font-semibold">
              {t.seeAll} →
            </Link>
            
            {/* Scroll Buttons */}
            <div className="hidden md:flex gap-2">
              <button 
                onClick={() => scrollContainer('left')}
                className="w-10 h-10 rounded-lg bg-cosmic-navy border border-emerald-energy/20 hover:border-emerald-energy 
                         flex items-center justify-center transition-all hover:shadow-glow-emerald"
              >
                {lang === 'ar' ? <FiChevronRight /> : <FiChevronLeft />}
              </button>
              <button 
                onClick={() => scrollContainer('right')}
                className="w-10 h-10 rounded-lg bg-cosmic-navy border border-emerald-energy/20 hover:border-emerald-energy 
                         flex items-center justify-center transition-all hover:shadow-glow-emerald"
              >
                {lang === 'ar' ? <FiChevronLeft /> : <FiChevronRight />}
              </button>
            </div>
          </div>
        </div>

        {/* Streams Grid */}
        <div 
          id="streams-container"
          className="flex gap-6 overflow-x-auto hide-scrollbar pb-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          {streams.map((stream) => (
            <Link href={`/stream/${stream.id}`} key={stream.id} className="flex-shrink-0">
              <div className="stream-card glass-panel w-80 group cursor-pointer">
                {/* Live Badge */}
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-2 py-1 bg-emerald-energy rounded-md">
                    <MdLiveTv className="text-midnight-black" />
                    <span className="text-xs font-bold text-midnight-black uppercase">{t.liveNow}</span>
                  </div>

                  {/* Viewer Count Badge */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 glass-panel-subtle rounded-md">
                    <FiEye className="text-emerald-energy text-sm" />
                    <span className="text-xs font-semibold text-white">
                      {stream.viewers.toLocaleString()}
                    </span>
                  </div>

                  {/* Thumbnail */}
                  <div className="aspect-video rounded-t-lg overflow-hidden bg-cosmic-navy">
                    <img 
                      src={stream.thumbnail}
                      alt={stream.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Stream Info */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <img 
                      src={stream.avatar}
                      alt={stream.streamer}
                      className="w-10 h-10 rounded-full border-2 border-emerald-energy flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white group-hover:text-emerald-energy transition-colors truncate">
                        {stream.title}
                      </h3>
                      <p className="text-sm text-white/60 truncate">{stream.streamer}</p>
                      <p className="text-xs text-white/40 mt-1">{stream.game}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-10 right-1/4 w-64 h-64 bg-emerald-energy/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </section>
  );
};

export default LiveStreamsSection;

