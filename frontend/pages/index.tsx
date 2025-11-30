import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import { getOwncastStatus, OwncastStatus } from '../lib/owncast';
import { MdLiveTv } from 'react-icons/md';
import Link from 'next/link';

export default function HomePage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [status, setStatus] = useState<OwncastStatus | null>(null);

  useEffect(() => {
    async function fetchData() {
      const statusData = await getOwncastStatus();
      setStatus(statusData);
    }
    fetchData();
  }, []);

  return (
    <Layout lang={lang}>
      {/* Hero Section - The Oasis Gateway */}
      <HeroSection lang={lang} />

      {/* Live Now Banner (if online) */}
      {status?.online && (
        <div className="container mx-auto px-4 lg:px-8 -mt-10 relative z-10">
          <Link href="/live">
            <div className="bg-gradient-oasis p-1 rounded-2xl shadow-glow-emerald cursor-pointer hover:scale-[1.02] transition-transform">
              <div className="bg-midnight-black rounded-xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-energy rounded-full flex items-center justify-center animate-pulse-live">
                    <MdLiveTv className="text-midnight-black text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {status.streamTitle || (lang === 'ar' ? 'بث مباشر الآن' : 'Live Stream Now')}
                    </h3>
                    <p className="text-emerald-energy font-semibold">
                      {status.viewerCount} {lang === 'ar' ? 'مشاهد' : 'viewers'}
                    </p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <span className="btn-primary">
                    {lang === 'ar' ? 'شاهد الآن' : 'Watch Now'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Simplified Content */}
      <div className="container mx-auto px-4 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          {lang === 'ar' ? 'مرحباً بك في واحة الرياضة' : 'Welcome to The Sports Oasis'}
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto text-lg">
          {lang === 'ar'
            ? 'منصتك الأولى للبث المباشر للرياضات الإلكترونية. استمتع بأفضل تجربة مشاهدة مع أحدث التقنيات.'
            : 'Your premier platform for eSports live streaming. Enjoy the best viewing experience with state-of-the-art technology.'}
        </p>
      </div>
    </Layout>
  );
}
