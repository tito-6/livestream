import React, { useEffect, useState } from 'react';
import { FiPlay, FiTrendingUp } from 'react-icons/fi';
import { MdLiveTv } from 'react-icons/md';

interface HeroSectionProps {
  lang: 'ar' | 'en';
}

const HeroSection: React.FC<HeroSectionProps> = ({ lang }) => {
  const [data, setData] = useState({
    title: lang === 'ar' ? 'Sport Events' : 'The Sports Oasis',
    subtitle: lang === 'ar' ? 'مستقبل البث المباشر' : 'The Future of Sports Live Streaming',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80'
  });

  useEffect(() => {
    // Fetch dynamic content from CMS
    fetch('http://192.168.1.171:8080/api/content/active-banner')
      .then(res => res.json())
      .then(json => {
        if (json.data && json.data.image_url) {
          setData({
            title: lang === 'ar' ? json.data.title_ar : json.data.title_en,
            subtitle: lang === 'ar' ? json.data.subtitle_ar : json.data.subtitle_en,
            image: json.data.image_url
          });
        }
      })
      .catch(err => console.error("CMS Fetch Error:", err));
  }, [lang]);

  const translations = {
    ar: {
      watchNow: 'شاهد الآن',
      trending: 'الأكثر رواجاً',
      liveNow: 'مباشر الآن',
      viewers: 'مشاهد',
    },
    en: {
      watchNow: 'Watch Now',
      trending: 'Trending',
      liveNow: 'Live Now',
      viewers: 'viewers',
    }
  };

  const t = translations[lang];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-cosmic opacity-80" />

      {/* Geometric Accent Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-emerald-energy/5 rounded-full blur-3xl animate-pulse-live" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-sultan-blue/5 rounded-full blur-3xl animate-pulse-live"
        style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div className="text-center lg:text-right space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-panel-subtle rounded-full">
              <div className="w-2 h-2 bg-emerald-energy rounded-full animate-pulse-live" />
              <span className="text-sm text-emerald-energy font-semibold">{t.liveNow}</span>
            </div>

            <h1 className="h1 text-gradient-oasis leading-tight">
              {data.title}
            </h1>

            <h2 className="text-2xl md:text-3xl font-bold text-white/90">
              {data.subtitle}
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end pt-4">
              <button className="btn-primary flex items-center justify-center gap-2 group">
                <FiPlay className="group-hover:scale-110 transition-transform" />
                {t.watchNow}
              </button>
              <button className="btn-secondary flex items-center justify-center gap-2 group">
                <FiTrendingUp className="group-hover:scale-110 transition-transform" />
                {t.trending}
              </button>
            </div>
          </div>

          {/* Featured Stream Card */}
          <div className="relative">
            <div className="stream-card glass-panel p-4 group">
              {/* Stream Thumbnail */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-cosmic-navy mb-4">
                <img
                  src={data.image}
                  alt="Featured Stream"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-black/80 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-20 h-20 rounded-full bg-emerald-energy/20 backdrop-blur-sm flex items-center justify-center glow-emerald">
                    <FiPlay className="text-4xl text-emerald-energy translate-x-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;

