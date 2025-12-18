import React, { useState, useEffect } from 'react';
import { Image, Search, Plus, Save, Edit2, X } from 'lucide-react'; // Imports fixed
import AdminLayout from '../../components/AdminLayout';
import ImageUpload from '../../components/ImageUpload';

interface Banner {
    id?: number;
    title_ar: string;
    title_en: string;
    subtitle_ar: string;
    subtitle_en: string;
    image_url: string;
    is_active: boolean;
}

const ContentPage = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<Banner>({
        title_ar: '', title_en: '',
        subtitle_ar: '', subtitle_en: '',
        image_url: '', is_active: true
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const res = await fetch('http://192.168.1.171:8080/api/content/banners');
            const data = await res.json();
            if (data.data) setBanners(data.data);
        } catch (err) { console.error(err); }
    };

    const handleEdit = (banner: Banner) => {
        setForm(banner);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setForm({
            title_ar: '', title_en: '',
            subtitle_ar: '', subtitle_en: '',
            image_url: '', is_active: true
        });
        setIsEditing(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://192.168.1.171:8080/api/content/banners', {
                method: 'POST', // Backend handles update if ID exists
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                fetchBanners();
                cancelEdit();
            }
        } catch (err) { console.error(err); }
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Content CMS</h2>
                    <p className="text-gray-400">Manage homepage hero banners and featured content</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="glass-panel p-6 rounded-2xl h-fit">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
                            {isEditing ? 'Edit Banner' : 'New Banner'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Title (English)</label>
                                <input
                                    className="w-full bg-midnight-black border border-gray-700 rounded-lg p-2 text-white"
                                    value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Title (Arabic)</label>
                                <input
                                    className="w-full bg-midnight-black border border-gray-700 rounded-lg p-2 text-white text-right"
                                    value={form.title_ar} onChange={e => setForm({ ...form, title_ar: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Subtitle (English)</label>
                                <input
                                    className="w-full bg-midnight-black border border-gray-700 rounded-lg p-2 text-white"
                                    value={form.subtitle_en} onChange={e => setForm({ ...form, subtitle_en: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Subtitle (Arabic)</label>
                                <input
                                    className="w-full bg-midnight-black border border-gray-700 rounded-lg p-2 text-white text-right"
                                    value={form.subtitle_ar} onChange={e => setForm({ ...form, subtitle_ar: e.target.value })}
                                />
                            </div>

                            {/* Image Upload Component */}
                            <ImageUpload
                                value={form.image_url}
                                onChange={(url) => setForm({ ...form, image_url: url })}
                            />

                            <div className="flex gap-2 pt-2">
                                <button className="flex-1 btn-primary py-2.5 flex justify-center items-center gap-2">
                                    <Save size={18} /> {isEditing ? 'Update' : 'Save'}
                                </button>
                                {isEditing && (
                                    <button type="button" onClick={cancelEdit} className="btn-secondary px-3">
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Banner List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-lg font-bold text-white mb-4">Active Banners</h3>
                        <div className="grid gap-4">
                            {banners.map((banner) => (
                                <div key={banner.id} className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex gap-4 items-center group relative hover:border-emerald-energy transition-all">
                                    <div className="w-24 h-16 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                                        <img src={banner.image_url} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white">{banner.title_en}</h4>
                                        <p className="text-sm text-gray-400">{banner.subtitle_en}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {banner.is_active && (
                                            <span className="bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-900/50">
                                                ACTIVE
                                            </span>
                                        )}
                                        <button
                                            onClick={() => handleEdit(banner)}
                                            className="p-2 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {banners.length === 0 && <div className="text-center text-gray-500 py-10">No banners created yet.</div>}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ContentPage;

