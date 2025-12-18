import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { MdSportsSoccer, MdSportsBasketball, MdSportsTennis, MdSportsMma } from 'react-icons/md';

interface Stream {
  id: number;
  title: string;
  sport_category: string;
  is_live: boolean;
  thumbnail_url: string;
  viewer_count: number;
}

export default function SportsPage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('http://192.168.1.171:8080/api/streams')
      .then(res => res.json())
      .then(json => {
        if (json.data) setStreams(json.data);
      })
      .catch(err => console.error(err));
  }, []);

  const categories = ['All', 'Football', 'Basketball', 'Tennis', 'Combat'];

  const filteredStreams = filter === 'All'
    ? streams
    : streams.filter(s => s.sport_category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <Layout lang="ar">
      <div className="min-h-screen pt-24 pb-20 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="h1 text-gradient-oasis">Sports Center</h1>
            <p className="text-gray-400">Browse all live and upcoming sports events</p>
          </div>

          <div className="flex gap-2 bg-gray-900 p-1 rounded-lg overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${filter === cat ? 'bg-emerald-energy text-midnight-black' : 'text-gray-400 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStreams.map(stream => (
            <div key={stream.id} className="glass-panel group rounded-xl overflow-hidden hover:border-emerald-energy transition-all">
              <div className="relative aspect-video bg-gray-800">
                <img src={stream.thumbnail_url || 'https://via.placeholder.com/400'} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white">
                  {stream.sport_category}
                </div>
                {stream.is_live && (
                  <div className="absolute top-2 right-2 bg-red-600 px-2 py-1 rounded text-xs font-bold text-white animate-pulse">
                    LIVE
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white text-lg truncate">{stream.title}</h3>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                  <span>{stream.is_live ? `${stream.viewer_count} watching` : 'Offline'}</span>
                  <button className="text-emerald-energy hover:underline">Watch</button>
                </div>
              </div>
            </div>
          ))}
          {filteredStreams.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-500">
              No sports content found for this category.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

