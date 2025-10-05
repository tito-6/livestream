import React, { useState } from 'react';
import { FiHeart, FiShare2, FiFlag } from 'react-icons/fi';
import { BiJoystick } from 'react-icons/bi';

interface StreamInfoProps {
  streamId: string;
  lang: 'ar' | 'en';
}

const StreamInfo: React.FC<StreamInfoProps> = ({ streamId, lang }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [likes, setLikes] = useState(8542);

  const translations = {
    ar: {
      follow: 'متابعة',
      following: 'متابع',
      share: 'مشاركة',
      report: 'إبلاغ',
      about: 'حول البث',
      game: 'اللعبة',
      category: 'الفئة',
      tags: 'الوسوم',
    },
    en: {
      follow: 'Follow',
      following: 'Following',
      share: 'Share',
      report: 'Report',
      about: 'About',
      game: 'Game',
      category: 'Category',
      tags: 'Tags',
    }
  };

  const t = translations[lang];

  const streamData = {
    title: lang === 'ar' ? 'بطولة الشرق الأوسط الكبرى - نهائيات مثيرة!' : 'Middle East Grand Championship - Exciting Finals!',
    streamer: {
      name: 'ProGamer123',
      avatar: 'https://i.pravatar.cc/150?img=12',
      followers: 125000,
      verified: true,
    },
    game: 'Action Arena 2025',
    category: lang === 'ar' ? 'أكشن' : 'Action',
    description: lang === 'ar' 
      ? 'انضموا إلينا في البث المباشر لنهائيات بطولة الشرق الأوسط الكبرى! أفضل اللاعبين يتنافسون على جوائز قيمة. لا تفوتوا هذا الحدث التاريخي!'
      : 'Join us live for the Middle East Grand Championship Finals! The best players competing for valuable prizes. Don\'t miss this historic event!',
    tags: [
      lang === 'ar' ? 'بطولة' : 'Tournament',
      lang === 'ar' ? 'محترف' : 'Professional',
      lang === 'ar' ? 'تنافسي' : 'Competitive',
    ],
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleLike = () => {
    setLikes(prev => isFollowing ? prev - 1 : prev + 1);
  };

  return (
    <div className="mt-6 space-y-6">
      
      {/* Title and Actions */}
      <div className="glass-panel p-6 rounded-xl">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {streamData.title}
        </h1>

        {/* Streamer Info and Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Streamer Info */}
          <div className="flex items-center gap-4">
            <img 
              src={streamData.streamer.avatar}
              alt={streamData.streamer.name}
              className="w-16 h-16 rounded-full border-2 border-emerald-energy"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{streamData.streamer.name}</h3>
                {streamData.streamer.verified && (
                  <div className="w-5 h-5 rounded-full bg-gradient-oasis flex items-center justify-center">
                    <span className="text-midnight-black text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-white/60">
                {streamData.streamer.followers.toLocaleString()} {lang === 'ar' ? 'متابع' : 'followers'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleFollow}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                isFollowing
                  ? 'bg-cosmic-navy border-2 border-emerald-energy text-emerald-energy'
                  : 'bg-gradient-oasis text-midnight-black hover:shadow-glow-emerald'
              }`}
            >
              {isFollowing ? t.following : t.follow}
            </button>

            <button
              onClick={handleLike}
              className="w-12 h-12 rounded-lg glass-panel-subtle hover:glass-panel flex items-center justify-center 
                       transition-all hover:scale-110 group"
            >
              <FiHeart className={`text-xl ${isFollowing ? 'text-emerald-energy fill-current' : 'text-white'} 
                                 group-hover:text-emerald-energy transition-colors`} />
            </button>

            <button className="w-12 h-12 rounded-lg glass-panel-subtle hover:glass-panel flex items-center justify-center 
                             transition-all hover:scale-110 group">
              <FiShare2 className="text-xl text-white group-hover:text-sultan-blue transition-colors" />
            </button>

            <button className="w-12 h-12 rounded-lg glass-panel-subtle hover:glass-panel flex items-center justify-center 
                             transition-all hover:scale-110 group">
              <FiFlag className="text-xl text-white group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <FiHeart className="text-emerald-energy" />
            <span className="text-white">{likes.toLocaleString()} {lang === 'ar' ? 'إعجاب' : 'likes'}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiShare2 className="text-sultan-blue" />
            <span className="text-white">1,234 {lang === 'ar' ? 'مشاركة' : 'shares'}</span>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="glass-panel p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4">{t.about}</h3>
        
        {/* Game Info */}
        <div className="flex items-center gap-3 mb-4 p-4 bg-cosmic-navy rounded-lg">
          <BiJoystick className="text-3xl text-emerald-energy" />
          <div>
            <div className="text-sm text-white/60">{t.game}</div>
            <div className="font-bold text-white">{streamData.game}</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/80 leading-relaxed mb-4">
          {streamData.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {streamData.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-4 py-2 bg-cosmic-navy border border-emerald-energy/20 rounded-lg 
                       text-sm text-white hover:border-emerald-energy transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};

export default StreamInfo;

