import React from 'react';
import { BiTimeFive } from 'react-icons/bi';
import Layout from './Layout';
import Link from 'next/link';

interface ComingSoonProps {
    category?: string;
    lang?: 'ar' | 'en';
}

const ComingSoon: React.FC<ComingSoonProps> = ({ category, lang = 'ar' }) => {
    const content = {
        ar: {
            title: 'قريباً',
            message: `نحن نعمل بجد لإطلاق قسم ${category || 'الرياضة'}`,
            back: 'العودة للرئيسية'
        },
        en: {
            title: 'Coming Soon',
            message: `We are working hard to launch the ${category || 'Sports'} section`,
            back: 'Back to Home'
        }
    };

    const t = content[lang];

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <div className="w-24 h-24 rounded-full bg-emerald-energy/10 flex items-center justify-center mb-6 animate-bounce">
                <BiTimeFive className="text-5xl text-emerald-energy" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">{t.title}</h1>
            <p className="text-white/60 text-xl mb-8">{t.message}</p>
            <Link href="/" className="btn-primary px-8 py-3 rounded-full">
                {t.back}
            </Link>
        </div>
    );
};

export default ComingSoon;
