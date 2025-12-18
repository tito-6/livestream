import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

interface Event {
    id: number;
    title: string;
    team_home: string;
    team_away: string;
    start_time: string;
    venue: string;
    sport: string;
    league: string;
}

const SchedulePage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<Partial<Event>>({
        sport: 'football',
        start_time: new Date().toISOString()
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch('http://192.168.1.171:8080/api/events');
            const data = await res.json();
            if (data.data) setEvents(data.data);
        } catch (err) { console.error(err); }
    };

    const deleteEvent = async (id: number) => {
        if (!confirm("Delete this event?")) return;
        try {
            await fetch(`http://192.168.1.171:8080/api/events/${id}`, { method: 'DELETE' });
            setEvents(events.filter(e => e.id !== id));
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = isEditing && form.id
            ? `http://192.168.1.171:8080/api/events/${form.id}`
            : 'http://192.168.1.171:8080/api/events';

        const method = isEditing && form.id ? 'PUT' : 'POST';

        try {
            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            setForm({ sport: 'football', start_time: new Date().toISOString() });
            setIsEditing(false);
            fetchEvents();
        } catch (err) { console.error(err); }
    };

    const handleEdit = (event: Event) => {
        setForm(event);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setForm({ sport: 'football', start_time: new Date().toISOString() });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Schedule Manager</h2>
                    <p className="text-gray-400">Plan upcoming matches and events</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="glass-panel p-6 rounded-2xl h-fit">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
                            {isEditing ? 'Edit Event' : 'Add Event'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400">Home Team</label>
                                    <input className="input-field w-full bg-midnight-black p-2 rounded border border-gray-700 text-white"
                                        value={form.team_home || ''}
                                        onChange={e => setForm({ ...form, team_home: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400">Away Team</label>
                                    <input className="input-field w-full bg-midnight-black p-2 rounded border border-gray-700 text-white"
                                        value={form.team_away || ''}
                                        onChange={e => setForm({ ...form, team_away: e.target.value })} required />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400">Venue</label>
                                <input className="input-field w-full bg-midnight-black p-2 rounded border border-gray-700 text-white"
                                    value={form.venue || ''}
                                    onChange={e => setForm({ ...form, venue: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400">Date/Time</label>
                                    <input type="datetime-local" className="input-field w-full bg-midnight-black p-2 rounded border border-gray-700 text-white"
                                        value={form.start_time ? new Date(form.start_time).toISOString().slice(0, 16) : ''}
                                        onChange={e => setForm({ ...form, start_time: new Date(e.target.value).toISOString() })} required />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400">League</label>
                                    <input className="input-field w-full bg-midnight-black p-2 rounded border border-gray-700 text-white"
                                        value={form.league || ''}
                                        onChange={e => setForm({ ...form, league: e.target.value })} />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 btn-primary py-2 flex justify-center items-center gap-2">
                                    <Save size={16} /> Save
                                </button>
                                {isEditing && (
                                    <button type="button" onClick={cancelEdit} className="btn-secondary py-2 px-3">
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Event List */}
                    <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-800/50 text-left text-gray-400 text-sm">
                                <tr>
                                    <th className="p-4">Matchup</th>
                                    <th className="p-4">Time</th>
                                    <th className="p-4">Venue</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {events.map(event => (
                                    <tr key={event.id} className="hover:bg-gray-800/30">
                                        <td className="p-4">
                                            <div className="font-bold text-white">{event.team_home} <span className="text-emerald-energy">vs</span> {event.team_away}</div>
                                            <div className="text-xs text-gray-500">{event.league} | {event.sport}</div>
                                        </td>
                                        <td className="p-4 text-gray-300 text-sm">
                                            <div className="flex items-center gap-2"><Calendar size={14} /> {new Date(event.start_time).toLocaleDateString()}</div>
                                            <div className="flex items-center gap-2 mt-1"><Clock size={14} /> {new Date(event.start_time).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">{event.venue}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(event)} className="p-2 text-blue-400 hover:bg-blue-900/20 rounded"><Edit2 size={16} /></button>
                                                <button onClick={() => deleteEvent(event.id)} className="p-2 text-red-400 hover:bg-red-900/20 rounded"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {events.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-500">No scheduled events</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default SchedulePage;

