import React from 'react';
import { FiPlay, FiTrendingUp } from 'react-icons/fi';
import { MdLiveTv } from 'react-icons/md';

interface HeroSectionProps {
  lang: 'ar' | 'en';
}

const HeroSection: React.FC<HeroSectionProps> = ({ lang }) => {
  const translations = {
    ar: {
      title: 'واحة الرياضة',
      subtitle: 'مستقبل البث المباشر الرياضي في العالم العربي',
      description: 'شاهد أفضل المباريات، تابع فرقك المفضلة، وعش تجربة رياضية فريدة',
      watchNow: 'شاهد الآن',
      trending: 'الأكثر رواجاً',
      liveNow: 'مباشر الآن',
      viewers: 'مشاهد',
    },
    en: {
      title: 'The Sports Oasis',
      subtitle: 'The Future of Sports Live Streaming in the Arab World',
      description: 'Watch the best matches, follow your favorite teams, and experience sports like never before',
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
            {/* Platform Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-panel-subtle rounded-full">
              <div className="w-2 h-2 bg-emerald-energy rounded-full animate-pulse-live" />
              <span className="text-sm text-emerald-energy font-semibold">{t.liveNow}</span>
            </div>

            {/* Main Title */}
            <h1 className="h1 text-gradient-oasis leading-tight">
              {t.title}
            </h1>

            {/* Subtitle */}
            <h2 className="text-2xl md:text-3xl font-bold text-white/90">
              {t.subtitle}
            </h2>

            {/* Description */}
            <p className="text-lg text-white/70 max-w-2xl mx-auto lg:mx-0">
              {t.description}
            </p>

            {/* CTA Buttons */}
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

            {/* Live Stats */}
            <div className="flex gap-8 justify-center lg:justify-end pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient-oasis">250K+</div>
                <div className="text-sm text-white/60">{t.viewers}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient-gold">150+</div>
                <div className="text-sm text-white/60">{lang === 'ar' ? 'قناة' : 'Channels'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient-oasis">24/7</div>
                <div className="text-sm text-white/60">{lang === 'ar' ? 'بث مباشر' : 'Live'}</div>
              </div>
            </div>
          </div>

          {/* Featured Stream Card */}
          <div className="relative">
            <div className="stream-card glass-panel p-4 group">
              {/* Live Badge */}
              <div className="absolute top-6 right-6 z-10 flex items-center gap-2 px-3 py-1 bg-emerald-energy rounded-lg">
                <MdLiveTv className="text-midnight-black" />
                <span className="text-xs font-bold text-midnight-black uppercase">{t.liveNow}</span>
              </div>

              {/* Stream Thumbnail */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-cosmic-navy mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80" 
                  alt="Featured Stream"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-black/80 to-transparent" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-20 h-20 rounded-full bg-emerald-energy/20 backdrop-blur-sm flex items-center justify-center glow-emerald">
                    <FiPlay className="text-4xl text-emerald-energy translate-x-1" />
                  </div>
                </div>
              </div>

              {/* Stream Info */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-energy transition-colors">
                  {lang === 'ar' ? 'نهائي كأس الخليج - مباراة حاسمة' : 'Gulf Cup Final - Decisive Match'}
                </h3>
                
                <div className="flex items-center gap-3">
                  <img 
                    src="https://i.pravatar.cc/100?img=12" 
                    alt="Streamer"
                    className="w-10 h-10 rounded-full border-2 border-emerald-energy"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-white">{lang === 'ar' ? 'قناة الرياضة' : 'Sports Channel'}</div>
                    <div className="text-sm text-white/60">{lang === 'ar' ? 'البث الرياضي المباشر' : 'Live Sports Broadcasting'}</div>
                  </div>
                </div>

                {/* Viewer Count */}
                <div className="flex items-center gap-2 text-emerald-energy">
                  <div className="w-2 h-2 bg-emerald-energy rounded-full animate-pulse-live" />
                  <span className="font-semibold">45,234 {t.viewers}</span>
                </div>

                {/* Sport Tags */}
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 text-xs bg-cosmic-navy rounded-full text-white/80">
                    {lang === 'ar' ? 'كرة القدم' : 'Football'}
                  </span>
                  <span className="px-3 py-1 text-xs bg-cosmic-navy rounded-full text-white/80">
                    {lang === 'ar' ? 'بطولة' : 'Championship'}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-emerald-energy rounded-full flex justify-center">
          <div className="w-1 h-3 bg-emerald-energy rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

