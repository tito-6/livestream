import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { MdLiveTv } from 'react-icons/md';
import { FiEye } from 'react-icons/fi';
import Link from 'next/link';
import { getOwncastStatus, getOwncastConfig, OwncastStatus, OwncastConfig } from '../lib/owncast';

export default function LivePage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [status, setStatus] = useState<OwncastStatus | null>(null);
  const [config, setConfig] = useState<OwncastConfig | null>(null);

  const translations = {
    ar: {
      title: 'المباريات المباشرة',
      subtitle: 'شاهد البث المباشر الآن',
      liveNow: 'مباشر الآن',
      viewers: 'مشاهد',
      offline: 'البث غير متاح حالياً',
      checkBack: 'تحقق مرة أخرى لاحقاً',
    },
    en: {
      title: 'Live Stream',
      subtitle: 'Watch the live stream now',
      liveNow: 'Live Now',
      viewers: 'viewers',
      offline: 'Stream is currently offline',
      checkBack: 'Check back later',
    }
  };

  const t = translations[lang];

  useEffect(() => {
    async function fetchData() {
      const statusData = await getOwncastStatus();
      const configData = await getOwncastConfig();
      setStatus(statusData);
      setConfig(configData);
    }
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout lang={lang}>
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">

          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${status?.online ? 'bg-emerald-energy animate-pulse-live' : 'bg-gray-500'}`} />
              <h1 className="h1 text-gradient-oasis">{config?.name || t.title}</h1>
              <div className={`w-3 h-3 rounded-full ${status?.online ? 'bg-emerald-energy animate-pulse-live' : 'bg-gray-500'}`} />
            </div>
            <p className="text-white/70 text-lg">{config?.summary || t.subtitle}</p>

            {/* Live Stats */}
            {status?.online && (
              <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 glass-panel rounded-full">
                <MdLiveTv className="text-emerald-energy text-2xl" />
                <span className="text-white font-bold">{status.viewerCount}</span>
                <span className="text-white/60">{t.liveNow}</span>
              </div>
            )}
          </div>

          {/* Live Stream Card */}
          {status?.online ? (
            <div className="max-w-4xl mx-auto">
              <Link href="/stream/owncast">
                <div className="stream-card glass-panel group cursor-pointer">
                  {/* Live Badge & Viewers */}
                  <div className="relative">
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1 bg-emerald-energy rounded-lg">
                      <MdLiveTv className="text-midnight-black animate-pulse-live" />
                      <span className="text-xs font-bold text-midnight-black uppercase">{t.liveNow}</span>
                    </div>

                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-3 py-1 glass-panel-subtle rounded-lg">
                      <FiEye className="text-emerald-energy text-sm" />
                      <span className="text-xs font-semibold text-white">
                        {status.viewerCount.toLocaleString()}
                      </span>
                    </div>

                    {/* Thumbnail */}
                    <div className="aspect-video rounded-t-lg overflow-hidden bg-cosmic-navy">
                      <img
                        src="http://localhost:8080/thumbnail.jpg"
                        alt={status.streamTitle || 'Live Stream'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80';
                        }}
                      />
                    </div>
                  </div>

                  {/* Stream Info */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-2xl font-bold text-white group-hover:text-emerald-energy transition-colors">
                      {status.streamTitle || config?.name || 'Live Stream'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {config?.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-cosmic-navy rounded text-xs text-emerald-energy border border-emerald-energy/20">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">💤</div>
              <h3 className="text-2xl font-bold text-white mb-2">{t.offline}</h3>
              <p className="text-white/60">{t.checkBack}</p>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
