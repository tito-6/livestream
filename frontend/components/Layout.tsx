import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  lang?: 'ar' | 'en';
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Sport Events | The Home of Live Sports',
  description = 'منصة البث المباشر الرائدة للرياضة في العالم العربي - شاهد جميع المباريات المباشرة',
  lang = 'ar'
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.svg" />

        {/* Performance Optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:locale" content={lang === 'ar' ? 'ar_AE' : 'en_US'} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>

      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang} className="min-h-screen relative">
        {/* Geometric Background Pattern */}
        <div className="geometric-pattern" />

        {/* Main Content */}
        <div className="relative z-10">
          <Navbar lang={lang} />
          <main className="min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;

