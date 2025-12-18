import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import { getStreamStatus, StreamStatus } from '../lib/api';
import { MdLiveTv, MdArticle } from 'react-icons/md';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string;
  category: string;
  created_at: string;
}

export default function HomePage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [status, setStatus] = useState<StreamStatus | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchData() {
      const statusData = await getStreamStatus();
      setStatus(statusData);

      // Fetch posts
      try {
        const res = await fetch('http://192.168.1.171:8080/api/posts');
        const json = await res.json();
        if (json.data) setPosts(json.data.slice(0, 3)); // Show top 3
      } catch (err) { console.error(err); }
    }
    fetchData();
  }, []);

  return (
    <Layout lang={lang}>
      {/* Hero Section */}
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

      {/* Latest News / Posts */}
      <div className="container mx-auto px-4 lg:px-8 py-20">
        <div className="flex items-center gap-3 mb-8">
          <MdArticle className="text-3xl text-emerald-energy" />
          <h2 className="text-3xl font-bold text-white">
            {lang === 'ar' ? 'أحدث الأخبار' : 'Latest News'}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post.id} className="glass-panel group rounded-xl overflow-hidden hover:border-emerald-energy transition-all">
              <div className="h-48 bg-gray-800 overflow-hidden relative">
                <img src={post.image_url || 'https://via.placeholder.com/400'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={post.title} />
                <div className="absolute top-3 left-3 bg-midnight-black/80 backdrop-blur px-2 py-1 rounded text-xs text-emerald-energy font-bold uppercase tracking-wider">
                  {post.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-energy transition-colors">{post.title}</h3>
                <p className="text-white/60 text-sm line-clamp-3 mb-4">{post.content}</p>
                <span className="text-xs text-white/40">{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="col-span-3 text-center text-white/50 py-10">No news updates available.</div>
          )}
        </div>
      </div>

    </Layout>
  );
}

