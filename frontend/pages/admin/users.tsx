import React, { useState, useEffect } from 'react';
import { User, Shield, Ban, CheckCircle } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

interface UserData {
    id: number;
    username: string;
    role: string;
    is_banned: boolean;
    created_at: string;
}

const UsersPage = () => {
    const [users, setUsers] = useState<UserData[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://192.168.1.171:8080/api/users');
            const data = await res.json();
            if (data.data) setUsers(data.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    };

    const toggleBan = async (id: number) => {
        try {
            const res = await fetch(`http://192.168.1.171:8080/api/users/${id}/ban`, { method: 'POST' });
            if (res.ok) {
                setUsers(users.map(u => u.id === id ? { ...u, is_banned: !u.is_banned } : u));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">User Management</h2>
                        <p className="text-gray-400">Manage platform users and permissions</p>
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-800 bg-gray-900/50">
                                <th className="p-5 text-gray-400 font-medium text-sm">User</th>
                                <th className="p-5 text-gray-400 font-medium text-sm">Role</th>
                                <th className="p-5 text-gray-400 font-medium text-sm">Status</th>
                                <th className="p-5 text-gray-400 font-medium text-sm">Joined</th>
                                <th className="p-5 text-gray-400 font-medium text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-cosmic-navy flex items-center justify-center text-emerald-energy">
                                                <User size={16} />
                                            </div>
                                            <span className="font-medium text-gray-200">{user.username}</span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-900/50 text-purple-400 border border-purple-800' : 'bg-gray-800 text-gray-400'}`}>
                                            {user.role || 'User'}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        {user.is_banned ? (
                                            <span className="text-red-400 text-sm flex items-center gap-1"><Ban size={14} /> Banned</span>
                                        ) : (
                                            <span className="text-emerald-500 text-sm flex items-center gap-1"><CheckCircle size={14} /> Active</span>
                                        )}
                                    </td>
                                    <td className="p-5 text-gray-500 text-sm">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-5 text-right">
                                        <button
                                            onClick={() => toggleBan(user.id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${user.is_banned
                                                    ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
                                                    : 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                                                }`}
                                        >
                                            {user.is_banned ? 'Unban User' : 'Ban Access'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default UsersPage;

