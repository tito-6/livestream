import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import { BiTimeFive, BiUser, BiInfoCircle } from 'react-icons/bi';
import 'video.js/dist/video-js.css';

interface LiveSportsViewProps {
    category: string;
    lang?: 'ar' | 'en';
}

interface OwncastStatus {
    online: boolean;
    viewerCount: number;
    streamTitle: string;
    streamDescription: string; // Will contain Markdown with Banner Image
    lastConnectTime: string;
}

const LiveSportsView: React.FC<LiveSportsViewProps> = ({ category, lang = 'ar' }) => {
    const [status, setStatus] = useState<OwncastStatus | null>(null);
    const [loading, setLoading] = useState(true);

    const translations = {
        ar: {
            offlineTitle: 'البث غير متاح حالياً',
            offlineMessage: `لا توجد مباريات مباشرة في قسم ${category} حالياً`,
            waiting: 'في انتظار البث...',
            viewers: 'مشاهد',
            started: 'بدأ منذ',
        },
        en: {
            offlineTitle: 'Stream Currently Offline',
            offlineMessage: `No live matches in ${category} section at the moment`,
            waiting: 'Waiting for stream...',
            viewers: 'viewers',
            started: 'Started',
        }
    };

    const t = translations[lang];

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                // Fetch from Owncast API (using proxy or direct if CORS allowed, assuming proxy for now or localhost)
                const res = await fetch('http://localhost:8081/api/status');
                const data = await res.json();
                setStatus(data);
            } catch (error) {
                console.error('Failed to fetch stream status', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    // Helper to extract image from description if present (simple regex)
    const getBannerImage = (md: string) => {
        const match = md?.match(/!\[.*?\]\((.*?)\)/);
        return match ? match[1] : null;
    };

    // Helper to remove image markdown from description for text display
    const getCleanDescription = (md: string) => {
        return md?.replace(/!\[.*?\]\((.*?)\)/g, '').trim();
    };

    const isRelevantCategory = (title: string) => {
        // Simple check: does the title contain the category (English or Arabic)?
        // Or if admin set generic title. For now, show if online.
        // In a real scenario, check if title.toLowerCase().includes(category.toLowerCase())
        return true;
    };

    if (loading) return <Layout lang={lang}><div className="min-h-screen pt-24 text-center text-white">{t.waiting}</div></Layout>;

    // Offline State or Not Relevant
    if (!status?.online || !isRelevantCategory(status.streamTitle)) {
        return (
            <Layout lang={lang}>
                <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center text-center">

                    {/* Last Known State / Results if in description */}
                    {(status?.streamDescription) && (
                        <div className="mb-12 max-w-2xl w-full bg-cosmic-navy/50 p-6 rounded-2xl border border-white/10">
                            <h3 className="text-xl font-bold text-emerald-energy mb-4">
                                {lang === 'ar' ? 'آخر النتائج / معلومات' : 'Last Results / Info'}
                            </h3>
                            {getBannerImage(status.streamDescription) && (
                                <div className="mb-4 rounded-xl overflow-hidden aspect-video relative">
                                    <img src={getBannerImage(status.streamDescription)!} alt="Match Banner" className="object-cover w-full h-full" />
                                </div>
                            )}
                            <div className="text-white/80 whitespace-pre-wrap">
                                {getCleanDescription(status.streamDescription)}
                            </div>
                        </div>
                    )}

                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <BiTimeFive className="text-4xl text-white/40" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">{t.offlineTitle}</h1>
                    <p className="text-white/60">{t.offlineMessage}</p>
                </div>
            </Layout>
        );
    }

    // Online State
    return (
        <Layout lang={lang}>
            <div className="min-h-screen pt-24 pb-12 px-4">
                <div className="container mx-auto max-w-6xl">

                    {/* Header / Banner extracted from Description */}
                    {getBannerImage(status.streamDescription) && (
                        <div className="w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-8 relative shadow-2xl geometric-border">
                            <img
                                src={getBannerImage(status.streamDescription)!}
                                alt="Match Banner"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-midnight-black via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                                    {status.streamTitle}
                                </h1>
                            </div>
                        </div>
                    )}

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Video Player */}
                        <div className="lg:col-span-2">
                            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group">
                                {/* Iframe to Owncast Embed or HLS Player. Using Embed for simplicity and native features */}
                                <iframe
                                    src="http://localhost:8081/embed/video"
                                    title="Live Stream"
                                    className="w-full h-full"
                                    allowFullScreen
                                    allow="autoplay; fullscreen"
                                />
                            </div>

                            {/* Stream Info Bar */}
                            <div className="mt-6 flex items-center justify-between bg-white/5 p-4 rounded-xl backdrop-blur-sm">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-emerald-energy">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                        </span>
                                        <span className="font-bold uppercase tracking-wider">LIVE</span>
                                    </div>
                                    <div className="h-4 w-px bg-white/10" />
                                    <div className="flex items-center gap-2 text-white/80">
                                        <BiUser />
                                        <span>{status.viewerCount} {t.viewers}</span>
                                    </div>
                                </div>
                                <div className="text-white/50 text-sm">
                                    {t.started} {new Date(status.lastConnectTime).toLocaleTimeString(lang === 'ar' ? 'ar-AE' : 'en-US')}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Chat / Info */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* Match Details Card */}
                            <div className="bg-cosmic-navy/50 p-6 rounded-2xl border border-white/10 geometric-border">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <BiInfoCircle className="text-emerald-energy" />
                                    {lang === 'ar' ? 'تفاصيل المباراة' : 'Match Details'}
                                </h3>
                                <div className="prose prose-invert prose-sm text-white/80">
                                    {/* Render clean description here (results, lineups, etc) */}
                                    <div className="whitespace-pre-wrap font-sans">
                                        {getCleanDescription(status.streamDescription) || (lang === 'ar' ? 'لا توجد تفاصيل إضافية' : 'No additional details available')}
                                    </div>
                                </div>
                            </div>

                            {/* Chat Embed (Optional) */}
                            <div className="h-[400px] bg-cosmic-navy/50 rounded-2xl overflow-hidden border border-white/10">
                                <iframe
                                    src="http://localhost:8081/embed/chat/readwrite"
                                    className="w-full h-full"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default LiveSportsView;
