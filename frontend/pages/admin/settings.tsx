import React, { useState } from 'react';
import { Save, Server, Globe, Shield } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const SettingsPage = () => {
    const [config, setConfig] = useState({
        siteName: 'StreamCast Platform',
        adminEmail: 'admin@streamcast.com',
        maintenanceMode: false,
        allowRegistration: true
    });

    const handleSave = () => {
        alert('Settings saved (Mock)');
        // In a real app, POST to /api/settings
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Platform Settings</h2>
                    <p className="text-gray-400">Configure global system parameters</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* General Settings */}
                    <div className="glass-panel p-6 rounded-2xl space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Globe className="text-emerald-energy" />
                            <h3 className="text-lg font-bold text-white">General Configuration</h3>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Site Name</label>
                            <input
                                value={config.siteName}
                                onChange={e => setConfig({ ...config, siteName: e.target.value })}
                                className="w-full bg-midnight-black border border-gray-700 rounded-lg p-3 text-white focus:border-emerald-energy transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Admin Email</label>
                            <input
                                value={config.adminEmail}
                                onChange={e => setConfig({ ...config, adminEmail: e.target.value })}
                                className="w-full bg-midnight-black border border-gray-700 rounded-lg p-3 text-white focus:border-emerald-energy transition-colors"
                            />
                        </div>
                    </div>

                    {/* System Controls */}
                    <div className="glass-panel p-6 rounded-2xl space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="text-emerald-energy" />
                            <h3 className="text-lg font-bold text-white">System Controls</h3>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-800">
                            <div>
                                <h4 className="text-white font-medium">Maintenance Mode</h4>
                                <p className="text-xs text-gray-500">Disable public access to the site</p>
                            </div>
                            <button
                                onClick={() => setConfig({ ...config, maintenanceMode: !config.maintenanceMode })}
                                className={`w-12 h-6 rounded-full transition-colors relative ${config.maintenanceMode ? 'bg-emerald-energy' : 'bg-gray-700'}`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${config.maintenanceMode ? 'translate-x-6' : ''}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-800">
                            <div>
                                <h4 className="text-white font-medium">User Registration</h4>
                                <p className="text-xs text-gray-500">Allow new users to sign up</p>
                            </div>
                            <button
                                onClick={() => setConfig({ ...config, allowRegistration: !config.allowRegistration })}
                                className={`w-12 h-6 rounded-full transition-colors relative ${config.allowRegistration ? 'bg-emerald-energy' : 'bg-gray-700'}`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${config.allowRegistration ? 'translate-x-6' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button onClick={handleSave} className="btn-primary px-8 py-3 flex items-center gap-2">
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default SettingsPage;
