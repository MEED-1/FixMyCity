import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await adminService.getStats();
            setStats(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch admin stats');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Platform overview and management</p>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading statistics...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {}
                        <div className="card-3d p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-blue-100 dark:bg-blue-900/40 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                            <div className="relative z-10">
                                <dt className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Users</dt>
                                <dd className="mt-2 text-4xl font-extrabold text-blue-600 dark:text-blue-400">{stats?.users_count || 0}</dd>
                                <div className="mt-4 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <span>👥 Citizens & Agents</span>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="card-3d p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-primary/10 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                            <div className="relative z-10">
                                <dt className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Issues</dt>
                                <dd className="mt-2 text-4xl font-extrabold text-primary">{stats?.issues_count || 0}</dd>
                                <div className="mt-4 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <span>🏙️ Reports Filed</span>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="card-3d p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-yellow-100 dark:bg-yellow-900/40 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                            <div className="relative z-10">
                                <dt className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pending Issues</dt>
                                <dd className="mt-2 text-4xl font-extrabold text-yellow-600 dark:text-yellow-400">{stats?.issues_pending || 0}</dd>
                                <div className="mt-4 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <span>⚠️ Awaiting Action</span>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="card-3d p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-purple-100 dark:bg-purple-900/40 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                            <div className="relative z-10">
                                <dt className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Refuges & Help</dt>
                                <dd className="mt-2 text-4xl font-extrabold text-purple-600 dark:text-purple-400">{stats?.help_requests_count || 0}</dd>
                                <div className="mt-4 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <span>🤝 Community Requests</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default AdminDashboard;
