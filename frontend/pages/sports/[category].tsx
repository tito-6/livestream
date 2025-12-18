import React from 'react';
import { useRouter } from 'next/router';
import LiveSportsView from '../../components/LiveSportsView';
import ComingSoon from '../../components/ComingSoon';
import Layout from '../../components/Layout';

export default function SportCategoryPage() {
    const router = useRouter();
    const { category } = router.query;

    // Default to Arabic for now, could catch from router or context
    const lang = 'ar';

    // Guard against undefined query during hydration
    if (!category) return <Layout lang={lang}><div /></Layout>;

    const normalizedCat = Array.isArray(category) ? category[0].toLowerCase() : category.toLowerCase();

    // Logic: Only Football and Basketball go to Live View
    const liveSports = ['football', 'basketball'];

    if (liveSports.includes(normalizedCat)) {
        return <LiveSportsView category={normalizedCat} lang={lang} />;
    }

    // Others go to Coming Soon
    return (
        <Layout lang={lang}>
            <div className="pt-24 min-h-screen">
                <ComingSoon category={typeof category === 'string' ? category : 'Sport'} lang={lang} />
            </div>
        </Layout>
    );
}
