import React, { useState } from 'react';
import Link from 'next/link';
import { FiHome, FiTrendingUp, FiUser, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { BiJoystick } from 'react-icons/bi';
import { MdLiveTv } from 'react-icons/md';

interface NavbarProps {
  lang?: 'ar' | 'en';
}

const Navbar: React.FC<NavbarProps> = ({ lang = 'ar' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const translations = {
    ar: {
      home: 'الرئيسية',
      live: 'مباشر الآن',
      games: 'الرياضات',
      tournaments: 'البطولات',
      profile: 'الملف الشخصي',
      search: 'البحث...',
      platform: 'واحة الرياضة',
      schedule: 'الجدول',
    },
    en: {
      home: 'Home',
      live: 'Live Now',
      games: 'Sports',
      tournaments: 'Tournaments',
      profile: 'Profile',
      search: 'Search...',
      platform: 'The Sports Oasis',
      schedule: 'Schedule',
    }
  };

  const t = translations[lang];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-lg bg-gradient-oasis flex items-center justify-center glow-emerald group-hover:scale-110 transition-transform duration-300">
                <BiJoystick className="text-2xl text-midnight-black" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-energy rounded-full animate-pulse-live" />
            </div>
            <span className="text-xl font-bold text-gradient-oasis hidden md:block">
              {t.platform}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="nav-link group">
              <FiHome className="text-xl group-hover:text-emerald-energy transition-colors" />
              <span>{t.home}</span>
            </Link>
            
            <Link href="/live" className="nav-link group relative">
              <MdLiveTv className="text-xl group-hover:text-emerald-energy transition-colors" />
              <span>{t.live}</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-energy rounded-full animate-pulse-live" />
            </Link>
            
            <Link href="/sports" className="nav-link group">
              <BiJoystick className="text-xl group-hover:text-emerald-energy transition-colors" />
              <span>{t.games}</span>
            </Link>
            
            <Link href="/schedule" className="nav-link group">
              <FiTrendingUp className="text-xl group-hover:text-emerald-energy transition-colors" />
              <span>{t.schedule}</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 pr-10 bg-cosmic-navy border border-emerald-energy/20 rounded-lg 
                         focus:border-emerald-energy focus:outline-none focus:ring-2 focus:ring-emerald-energy/30
                         text-sm placeholder-gray-400 transition-all"
              />
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-energy" />
            </div>

            {/* Profile Button */}
            <Link href="/profile" className="btn-secondary px-4 py-2 text-sm flex items-center gap-2">
              <FiUser />
              <span>{t.profile}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-emerald-energy hover:bg-cosmic-navy rounded-lg transition-colors"
          >
            {isMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 space-y-3 animate-fade-in">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 bg-cosmic-navy border border-emerald-energy/20 rounded-lg 
                         focus:border-emerald-energy focus:outline-none text-sm"
              />
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-energy" />
            </div>

            <Link href="/" className="mobile-nav-link">
              <FiHome className="text-xl" />
              <span>{t.home}</span>
            </Link>
            
            <Link href="/live" className="mobile-nav-link">
              <MdLiveTv className="text-xl" />
              <span>{t.live}</span>
            </Link>
            
            <Link href="/sports" className="mobile-nav-link">
              <BiJoystick className="text-xl" />
              <span>{t.games}</span>
            </Link>
            
            <Link href="/schedule" className="mobile-nav-link">
              <FiTrendingUp className="text-xl" />
              <span>{t.schedule}</span>
            </Link>
            
            <Link href="/profile" className="mobile-nav-link">
              <FiUser className="text-xl" />
              <span>{t.profile}</span>
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #F5F5F5;
          font-weight: 500;
          transition: all 0.3s ease;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
        }

        .nav-link:hover {
          color: #00FF7F;
          background: rgba(0, 255, 127, 0.1);
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          color: #F5F5F5;
          font-weight: 500;
          background: rgba(10, 14, 39, 0.5);
          border-radius: 0.5rem;
          border: 1px solid rgba(0, 255, 127, 0.1);
          transition: all 0.3s ease;
        }

        .mobile-nav-link:hover {
          border-color: #00FF7F;
          background: rgba(0, 255, 127, 0.1);
          color: #00FF7F;
          transform: translateX(-4px);
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;

