import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Copy, Eye, EyeOff, Save, X } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import ImageUpload from '../../components/ImageUpload';

interface Stream {
    id: number;
    title: string;
    description: string;
    sport_category: string;
    is_live: boolean;
    stream_key: string;
    banner_url: string;
    thumbnail_url: string;
    pre_match_details: string;
    post_match_details: string;
}

const Streams = () => {
    const [streams, setStreams] = useState<Stream[]>([]);
    const [showKey, setShowKey] = useState<{ [key: number]: boolean }>({});
    const [editingStream, setEditingStream] = useState<Stream | null>(null);

    useEffect(() => {
        fetchStreams();
    }, []);

    const fetchStreams = async () => {
        try {
            const res = await fetch('http://192.168.1.171:8080/api/streams');
            const data = await res.json();
            if (data.data) setStreams(data.data);
        } catch (err) { console.error(err); }
    };

    const createStream = async () => {
        const newStream = { title: "New Championship Event " + (streams.length + 1), sport_category: "Football" };
        try {
            const res = await fetch('http://192.168.1.171:8080/api/streams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStream),
            });
            const data = await res.json();
            if (data.data) setStreams([...streams, data.data]);
        } catch (err) { console.error(err); }
    };

    const deleteStream = async (id: number) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await fetch(`http://192.168.1.171:8080/api/streams/${id}`, { method: 'DELETE' });
            setStreams(streams.filter(s => s.id !== id));
        } catch (err) { console.error(err); }
    };

    const updateStream = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStream) return;
        try {
            const res = await fetch(`http://192.168.1.171:8080/api/streams/${editingStream.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingStream),
            });
            const data = await res.json();
            if (data.data) {
                setStreams(streams.map(s => s.id === editingStream.id ? data.data : s));
                setEditingStream(null);
            }
        } catch (err) { console.error(err); }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    const toggleKey = (id: number) => setShowKey(prev => ({ ...prev, [id]: !prev[id] }));

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Live Streams</h2>
                        <p className="text-gray-400">Manage broadcast keys and event details</p>
                    </div>
                    <button onClick={createStream} className="btn-primary px-5 py-2.5 flex items-center gap-2">
                        <Plus size={18} /> Create New Stream
                    </button>
                </div>

                {/* OBS Connection Info Box */}
                <div className="bg-gradient-oasis p-1 rounded-2xl">
                    <div className="bg-midnight-black rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-900/30 rounded-lg text-emerald-energy">
                                <Copy size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">OBS Connection Settings</h3>
                                <p className="text-gray-400 text-sm">Use these details to stream from OBS Studio</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <div className="bg-black/50 border border-gray-700 rounded-lg px-4 py-2 flex items-center justify-between min-w-[250px]">
                                <div>
                                    <span className="text-xs text-gray-500 block uppercase">Server (RTMP URL)</span>
                                    <code className="text-emerald-400 font-mono">rtmp://192.168.1.171:1935/live</code>
                                </div>
                                <button onClick={() => copyToClipboard("rtmp://192.168.1.171:1935/live")} className="text-gray-400 hover:text-white p-2">
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Modal */}
                {editingStream && (
                    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Edit Stream Details</h3>
                                <button onClick={() => setEditingStream(null)} className="text-gray-400 hover:text-white"><X /></button>
                            </div>
                            <form onSubmit={updateStream} className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-400">Title</label>
                                    <input className="input-field w-full bg-midnight-black p-2 rounded border border-gray-700 text-white"
                                        value={editingStream.title} onChange={e => setEditingStream({ ...editingStream, title: e.target.value })} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-400">Category</label>
                                        <input className="input-field w-full bg-midnight-black p-2 rounded border border-gray-700 text-white"
                                            value={editingStream.sport_category} onChange={e => setEditingStream({ ...editingStream, sport_category: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400">Is Live?</label>
                                        <select className="input-field w-full bg-midnight-black p-2 rounded border border-gray-700 text-white"
                                            value={editingStream.is_live ? "true" : "false"}
                                            onChange={e => setEditingStream({ ...editingStream, is_live: e.target.value === 'true' })}>
                                            <option value="false">OFFLINE</option>
                                            <option value="true">LIVE ON AIR</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <ImageUpload
                                            value={editingStream.banner_url || ''}
                                            onChange={(url) => setEditingStream({ ...editingStream, banner_url: url })}
                                            label="Stream Banner"
                                        />
                                    </div>
                                    <div>
                                        <ImageUpload
                                            value={editingStream.thumbnail_url || ''}
                                            onChange={(url) => setEditingStream({ ...editingStream, thumbnail_url: url })}
                                            label="Thumbnail"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400">Pre-Match / Intro Details</label>
                                    <textarea className="input-field w-full bg-midnight-black p-2 rounded border border-gray-700 text-white h-20"
                                        value={editingStream.pre_match_details || ''} onChange={e => setEditingStream({ ...editingStream, pre_match_details: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400">Post-Match / Analysis Details</label>
                                    <textarea className="input-field w-full bg-midnight-black p-2 rounded border border-gray-700 text-white h-20"
                                        value={editingStream.post_match_details || ''} onChange={e => setEditingStream({ ...editingStream, post_match_details: e.target.value })} />
                                </div>
                                <button className="w-full btn-primary py-3 flex justify-center items-center gap-2 font-bold text-lg">
                                    <Save size={20} /> Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-800 bg-gray-900/50">
                                <th className="p-5 text-gray-400">Status</th>
                                <th className="p-5 text-gray-400">Title</th>
                                <th className="p-5 text-gray-400">Stream Key (Secret)</th>
                                <th className="p-5 text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {streams.map((stream) => (
                                <tr key={stream.id} className="hover:bg-gray-800/50 group">
                                    <td className="p-5">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${stream.is_live ? 'bg-green-500/20 text-green-500' : 'bg-gray-700 text-gray-400'}`}>
                                            {stream.is_live ? 'LIVE' : 'OFFLINE'}
                                        </span>
                                    </td>
                                    <td className="p-5 text-white font-medium">{stream.title}</td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2">
                                            <code className="text-sm font-mono text-emerald-400 bg-black/50 px-3 py-1.5 rounded border border-gray-800 min-w-[150px]">
                                                {showKey[stream.id] ? stream.stream_key : "••••••••••••••••"}
                                            </code>
                                            <button onClick={() => toggleKey(stream.id)} className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded transition-colors" title="Toggle Visibility">
                                                {showKey[stream.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                            <button onClick={() => copyToClipboard(stream.stream_key)} className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded transition-colors" title="Copy Key">
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <button onClick={() => setEditingStream(stream)} className="p-2 text-blue-400 hover:bg-blue-900/20 rounded mr-2"><Edit2 size={16} /></button>
                                        <button onClick={() => deleteStream(stream.id)} className="p-2 text-red-400 hover:bg-red-900/20 rounded"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Streams;

