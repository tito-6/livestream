import React, { useState } from 'react';
import Layout from '../components/Layout';
import { FiUser, FiMail, FiGlobe, FiSettings, FiBell, FiHeart, FiEye, FiClock } from 'react-icons/fi';
import { MdLiveTv } from 'react-icons/md';

export default function ProfilePage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'favorites' | 'history' | 'settings'>('overview');

  const translations = {
    ar: {
      title: 'الملف الشخصي',
      subtitle: 'إدارة حسابك وتفضيلاتك',
      overview: 'نظرة عامة',
      favorites: 'المفضلة',
      history: 'السجل',
      settings: 'الإعدادات',
      editProfile: 'تعديل الملف الشخصي',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      language: 'اللغة',
      notifications: 'الإشعارات',
      watchedMatches: 'المباريات التي شاهدتها',
      favoriteTeams: 'الفرق المفضلة',
      liveReminders: 'التذكيرات المباشرة',
      totalWatchTime: 'إجمالي وقت المشاهدة',
      hours: 'ساعة',
      save: 'حفظ التغييرات',
      logout: 'تسجيل الخروج',
    },
    en: {
      title: 'Profile',
      subtitle: 'Manage your account and preferences',
      overview: 'Overview',
      favorites: 'Favorites',
      history: 'History',
      settings: 'Settings',
      editProfile: 'Edit Profile',
      name: 'Name',
      email: 'Email',
      language: 'Language',
      notifications: 'Notifications',
      watchedMatches: 'Watched Matches',
      favoriteTeams: 'Favorite Teams',
      liveReminders: 'Live Reminders',
      totalWatchTime: 'Total Watch Time',
      hours: 'hours',
      save: 'Save Changes',
      logout: 'Logout',
    }
  };

  const t = translations[lang];

  const userStats = {
    watchedMatches: 145,
    favoriteTeams: 8,
    liveReminders: 12,
    watchTime: 384,
  };

  const tabs = [
    { id: 'overview', label: t.overview, icon: FiUser },
    { id: 'favorites', label: t.favorites, icon: FiHeart },
    { id: 'history', label: t.history, icon: FiClock },
    { id: 'settings', label: t.settings, icon: FiSettings },
  ];

  return (
    <Layout lang={lang}>
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="h1 text-gradient-oasis mb-2">{t.title}</h1>
            <p className="text-white/70">{t.subtitle}</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            
            {/* Sidebar - User Info */}
            <div className="lg:col-span-4">
              <div className="glass-panel p-8 rounded-xl text-center sticky top-32">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-oasis flex items-center justify-center text-4xl text-midnight-black font-bold">
                    {lang === 'ar' ? 'م' : 'U'}
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-energy rounded-full border-4 border-midnight-black flex items-center justify-center">
                    <div className="w-3 h-3 bg-midnight-black rounded-full" />
                  </div>
                </div>

                {/* User Info */}
                <h2 className="text-2xl font-bold text-white mb-2">
                  {lang === 'ar' ? 'مستخدم الواحة' : 'Oasis User'}
                </h2>
                <p className="text-white/60 mb-6">user@sportsoasis.com</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="glass-panel-subtle p-4 rounded-lg">
                    <div className="text-3xl font-bold text-gradient-oasis mb-1">
                      {userStats.watchedMatches}
                    </div>
                    <div className="text-xs text-white/60">{t.watchedMatches}</div>
                  </div>
                  <div className="glass-panel-subtle p-4 rounded-lg">
                    <div className="text-3xl font-bold text-gradient-gold mb-1">
                      {userStats.favoriteTeams}
                    </div>
                    <div className="text-xs text-white/60">{t.favoriteTeams}</div>
                  </div>
                  <div className="glass-panel-subtle p-4 rounded-lg">
                    <div className="text-3xl font-bold text-gradient-oasis mb-1">
                      {userStats.liveReminders}
                    </div>
                    <div className="text-xs text-white/60">{t.liveReminders}</div>
                  </div>
                  <div className="glass-panel-subtle p-4 rounded-lg">
                    <div className="text-3xl font-bold text-gradient-gold mb-1">
                      {userStats.watchTime}
                    </div>
                    <div className="text-xs text-white/60">{t.hours}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full btn-primary">
                    {t.editProfile}
                  </button>
                  <button className="w-full btn-secondary">
                    {t.logout}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8">
              
              {/* Tabs */}
              <div className="glass-panel p-2 rounded-xl mb-6 flex gap-2 overflow-x-auto hide-scrollbar">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id as any)}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                        selectedTab === tab.id
                          ? 'bg-gradient-oasis text-midnight-black'
                          : 'text-white hover:bg-cosmic-navy'
                      }`}
                    >
                      <Icon />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="glass-panel p-8 rounded-xl">
                
                {/* Overview Tab */}
                {selectedTab === 'overview' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-6">{t.overview}</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="glass-panel-subtle p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-4">
                          <MdLiveTv className="text-3xl text-emerald-energy" />
                          <div>
                            <div className="text-2xl font-bold text-white">{userStats.watchedMatches}</div>
                            <div className="text-sm text-white/60">{t.watchedMatches}</div>
                          </div>
                        </div>
                        <p className="text-white/70 text-sm">
                          {lang === 'ar' 
                            ? 'لقد شاهدت العديد من المباريات المثيرة!' 
                            : 'You\'ve watched many exciting matches!'}
                        </p>
                      </div>

                      <div className="glass-panel-subtle p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-4">
                          <FiClock className="text-3xl text-gold-burnished" />
                          <div>
                            <div className="text-2xl font-bold text-white">{userStats.watchTime} {t.hours}</div>
                            <div className="text-sm text-white/60">{t.totalWatchTime}</div>
                          </div>
                        </div>
                        <p className="text-white/70 text-sm">
                          {lang === 'ar' 
                            ? 'وقت رائع مع الرياضات المفضلة لديك' 
                            : 'Great time with your favorite sports'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Favorites Tab */}
                {selectedTab === 'favorites' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-6">{t.favorites}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {['Al-Hilal', 'Real Madrid', 'Lakers', 'Barcelona'].map((team, idx) => (
                        <div key={idx} className="glass-panel-subtle p-4 rounded-lg flex items-center justify-between group hover:border-emerald-energy transition-all cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-oasis flex items-center justify-center text-midnight-black font-bold">
                              {team.charAt(0)}
                            </div>
                            <span className="font-semibold text-white">{team}</span>
                          </div>
                          <FiHeart className="text-emerald-energy text-xl fill-current" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* History Tab */}
                {selectedTab === 'history' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-6">{t.history}</h3>
                    <div className="space-y-4">
                      {[1, 2, 3].map((_, idx) => (
                        <div key={idx} className="glass-panel-subtle p-4 rounded-lg flex items-center gap-4">
                          <div className="w-20 h-14 rounded bg-cosmic-navy flex items-center justify-center">
                            <FiEye className="text-emerald-energy text-2xl" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white mb-1">
                              {lang === 'ar' ? 'مباراة كرة القدم' : 'Football Match'}
                            </div>
                            <div className="text-sm text-white/60">
                              {new Date().toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-US')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {selectedTab === 'settings' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-6">{t.settings}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white mb-2 flex items-center gap-2">
                          <FiUser />
                          {t.name}
                        </label>
                        <input 
                          type="text"
                          defaultValue={lang === 'ar' ? 'مستخدم الواحة' : 'Oasis User'}
                          className="w-full px-4 py-3 bg-cosmic-navy border border-emerald-energy/20 rounded-lg focus:border-emerald-energy focus:outline-none text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-white mb-2 flex items-center gap-2">
                          <FiMail />
                          {t.email}
                        </label>
                        <input 
                          type="email"
                          defaultValue="user@sportsoasis.com"
                          className="w-full px-4 py-3 bg-cosmic-navy border border-emerald-energy/20 rounded-lg focus:border-emerald-energy focus:outline-none text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-white mb-2 flex items-center gap-2">
                          <FiGlobe />
                          {t.language}
                        </label>
                        <select 
                          value={lang}
                          onChange={(e) => setLang(e.target.value as 'ar' | 'en')}
                          className="w-full px-4 py-3 bg-cosmic-navy border border-emerald-energy/20 rounded-lg focus:border-emerald-energy focus:outline-none text-white"
                        >
                          <option value="ar">العربية</option>
                          <option value="en">English</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 glass-panel-subtle rounded-lg">
                        <div className="flex items-center gap-2">
                          <FiBell className="text-emerald-energy" />
                          <span className="text-white">{t.notifications}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-cosmic-navy peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-energy"></div>
                        </label>
                      </div>

                      <button className="w-full btn-primary mt-6">
                        {t.save}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
}

