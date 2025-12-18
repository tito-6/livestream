import React, { useState, useEffect } from 'react';
import { Activity, Users, Signal, Play, Square, Wifi } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    subtext: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, subtext }) => (
    <div className="bg-midnight-black/40 border border-white/10 p-6 rounded-2xl">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
                <Icon className={`${color}`} size={24} />
            </div>
        </div>
        {subtext && <p className="text-xs text-gray-500 mt-4">{subtext}</p>}
    </div>
);

const AdminDashboard = () => {
    const [isLive, setIsLive] = useState(false);
    const [stats, setStats] = useState({
        viewers: 0,
        bitrate: '0 kbps',
        cpu_usage: '0%',
        ingest_status: 'offline'
    });
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://192.168.1.171:8080/api/stats');
                const data = await res.json();
                setStats(data);
                setIsLive(data.ingest_status === 'online');
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    const toggleStream = () => {
        // Mock toggle for visual feedback
        setIsLive(!isLive);
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Live Viewers"
                        value={stats.viewers}
                        icon={Users}
                        color="text-blue-500"
                        subtext="Real-time count"
                    />
                    <StatCard
                        title="Bitrate"
                        value={stats.bitrate}
                        icon={Signal}
                        color="text-emerald-energy"
                        subtext="Ingest Quality"
                    />
                    <StatCard
                        title="Server Health"
                        value={stats.cpu_usage || "0%"}
                        icon={Activity}
                        color="text-purple-500"
                        subtext="CPU Usage"
                    />
                    <StatCard
                        title="Ingest Status"
                        value={stats.ingest_status === 'online' ? "Online" : "Offline"}
                        icon={Wifi}
                        color={stats.ingest_status === 'online' ? "text-emerald-energy" : "text-gray-500"}
                        subtext="RTMP Server"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Player / Live Monitor */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-panel rounded-2xl overflow-hidden shadow-deep">
                            <div className="border-b border-white/10 p-4 flex justify-between items-center bg-white/5">
                                <h3 className="font-semibold text-gray-200 flex items-center gap-2">
                                    <Signal size={16} className={isLive ? "text-emerald-energy" : "text-gray-500"} />
                                    Live Monitor
                                </h3>
                                {isLive && <span className="text-xs font-mono text-red-500 animate-pulse">● LIVE</span>}
                            </div>

                            <div className="aspect-video bg-black flex items-center justify-center relative group">
                                {isLive ? (
                                    <div className="text-gray-500">
                                        <p className="text-center">Video Feed Active</p>
                                        <p className="text-xs text-center font-mono opacity-50">rtmp://localhost/live</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Wifi size={48} className="mx-auto text-gray-700 mb-2" />
                                        <p className="text-gray-600 font-medium">Stream Offline</p>
                                        <p className="text-gray-700 text-sm">Waiting for OBS connection...</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-midnight-black/50 flex justify-between items-center">
                                <div>
                                    <h4 className="text-white font-medium">Main Broadcast Feed</h4>
                                    <p className="text-gray-500 text-sm">Target: 1080p @ 60fps</p>
                                </div>

                                <button
                                    onClick={toggleStream}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${isLive
                                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-900/20'
                                        : 'bg-emerald-energy hover:bg-emerald-dark text-midnight-black shadow-glow-emerald'
                                        }`}
                                >
                                    {isLive ? <><Square size={20} fill="currentColor" /> Stop Ingest</> : <><Play size={20} fill="currentColor" /> Start Ingest</>}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity / Logs */}
                    <div className="lg:col-span-1">
                        <div className="glass-panel rounded-2xl h-full flex flex-col">
                            <div className="p-5 border-b border-white/10">
                                <h3 className="font-semibold text-gray-200">System Logs</h3>
                            </div>
                            <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[500px]">
                                {logs.length > 0 ? (
                                    logs.map((log, i) => (
                                        <div key={i} className="text-sm text-gray-300">{log}</div>
                                    ))
                                ) : (
                                    <div className="text-gray-500 text-sm italic text-center mt-10">No recent activity</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;

