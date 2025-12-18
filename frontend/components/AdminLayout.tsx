import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, Radio, Users, Settings, LogOut, Menu, Image, Calendar, FileText } from 'lucide-react';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const router = useRouter();

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Live Streams', path: '/admin/streams', icon: Radio },
        { name: 'CMS & Content', path: '/admin/content', icon: Image },
        { name: 'News & Posts', path: '/admin/posts', icon: FileText },
        { name: 'Schedule', path: '/admin/schedule', icon: Calendar },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-midnight-black text-soft-white font-cairo overflow-hidden relative">
            {/* Geometric Background Pattern */}
            <div className="geometric-pattern" />

            {/* Sidebar - Glassmorphism */}
            <aside className="w-64 glass-panel border-r border-white/10 hidden md:flex flex-col relative z-20">
                <div className="p-8 flex items-center justify-center border-b border-white/10">
                    <h1 className="text-3xl font-black tracking-tighter bg-gradient-oasis bg-clip-text text-transparent">
                        STREAMCAST
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = router.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                                    ? 'text-midnight-black font-bold shadow-glow-emerald'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {/* Active Background Gradient */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-oasis opacity-100" />
                                )}

                                {/* Hover Background */}
                                {!isActive && (
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}

                                <Icon size={22} className={`relative z-10 transition-colors ${isActive ? 'text-midnight-black' : 'text-emerald-energy'}`} />
                                <span className="relative z-10">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button className="flex items-center gap-3 w-full px-6 py-4 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
                {/* Mobile Header */}
                <header className="h-20 bg-midnight-black/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 md:hidden">
                    <span className="text-xl font-bold text-white">StreamCast</span>
                    <button className="text-emerald-energy"><Menu /></button>
                </header>

                {/* Top Bar (Desktop) - Glassmorphism */}
                <header className="hidden md:flex h-20 glass-panel border-b border-white/10 items-center justify-between px-8 mx-6 mt-4 rounded-xl">
                    <h2 className="text-2xl font-bold text-white tracking-wide">
                        {navItems.find(i => i.path === router.pathname)?.name || 'Admin'}
                    </h2>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-4 py-2 bg-cosmic-navy rounded-full border border-emerald-energy/30">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-energy animate-pulse shadow-glow-emerald"></div>
                            <span className="text-sm font-mono text-emerald-energy font-bold tracking-wider">SYSTEM ONLINE</span>
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-burnished-gold p-0.5 shadow-glow-gold">
                            <div className="w-full h-full rounded-full bg-cosmic-navy flex items-center justify-center">
                                <span className="font-bold text-burnished-gold">AD</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
