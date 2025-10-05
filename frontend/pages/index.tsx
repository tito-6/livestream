import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import LiveStreamsSection from '../components/LiveStreamsSection';
import CategoriesSection from '../components/CategoriesSection';
import TournamentsSection from '../components/TournamentsSection';

export default function HomePage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  return (
    <Layout lang={lang}>
      {/* Hero Section - The Oasis Gateway */}
      <HeroSection lang={lang} />

      {/* Live Now - The Main Stage */}
      <LiveStreamsSection lang={lang} />

      {/* Categories - The Grand Bazaar */}
      <CategoriesSection lang={lang} />

      {/* Tournaments - The Arena */}
      <TournamentsSection lang={lang} />
    </Layout>
  );
}
