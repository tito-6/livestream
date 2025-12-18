import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import ImageUpload from '../../components/ImageUpload';

interface Post {
    id: number;
    title: string;
    content: string;
    image_url: string;
    category: string;
    created_at: string;
}

const PostsPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<Partial<Post>>({
        title: '', content: '', image_url: '', category: 'News'
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('http://192.168.1.171:8080/api/posts');
            const data = await res.json();
            if (data.data) setPosts(data.data);
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete post?")) return;
        await fetch(`http://192.168.1.171:8080/api/posts/${id}`, { method: 'DELETE' });
        setPosts(posts.filter(p => p.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEditing && form.id
            ? `http://192.168.1.171:8080/api/posts/${form.id}`
            : 'http://192.168.1.171:8080/api/posts';

        const method = isEditing && form.id ? 'PUT' : 'POST';

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        setForm({ title: '', content: '', image_url: '', category: 'News' });
        setIsEditing(false);
        fetchPosts();
    };

    const handleEdit = (post: Post) => {
        setForm(post);
        setIsEditing(true);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">News & Posts</h2>
                        <p className="text-gray-400">Manage homepage articles and updates</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="glass-panel p-6 rounded-2xl h-fit">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
                            {isEditing ? 'Edit Post' : 'New Post'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400">Title</label>
                                <input className="input-field w-full bg-midnight-black p-2 rounded border border-gray-700 text-white"
                                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400">Category</label>
                                <select className="input-field w-full bg-midnight-black p-2 rounded border border-gray-700 text-white"
                                    value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                    <option>News</option>
                                    <option>Highlight</option>
                                    <option>Announcement</option>
                                </select>
                            </div>

                            <ImageUpload
                                value={form.image_url || ''}
                                onChange={(url) => setForm({ ...form, image_url: url })}
                                label="Featured Image"
                            />

                            <div>
                                <label className="text-xs text-gray-400">Content</label>
                                <textarea className="input-field w-full bg-midnight-black p-2 rounded border border-gray-700 text-white h-32"
                                    value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 btn-primary py-2 flex justify-center items-center gap-2">
                                    <Save size={16} /> Save
                                </button>
                                {isEditing && (
                                    <button type="button" onClick={() => { setIsEditing(false); setForm({ title: '', content: '', image_url: '', category: 'News' }); }}
                                        className="btn-secondary py-2 px-3">
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* List */}
                    <div className="lg:col-span-2 space-y-4">
                        {posts.map(post => (
                            <div key={post.id} className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex gap-4 group hover:border-emerald-energy transition-colors">
                                <div className="w-32 h-24 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                                    <img src={post.image_url || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs text-emerald-energy bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-900/50 mb-2 inline-block">
                                                {post.category}
                                            </span>
                                            <h4 className="text-lg font-bold text-white">{post.title}</h4>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(post)} className="p-2 text-blue-400 hover:bg-blue-900/20 rounded"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(post.id)} className="p-2 text-red-400 hover:bg-red-900/20 rounded"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{post.content}</p>
                                    <p className="text-gray-600 text-xs mt-2">{new Date(post.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default PostsPage;

