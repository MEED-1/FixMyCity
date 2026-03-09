import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

function AdminDashboard() {
    const { t } = useTranslation();
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
                    <h1 className="text-3xl font-bold gradient-text">{t('adminDashboard.title')}</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('adminDashboard.subtitle')}</p>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-gray-500">{t('adminDashboard.loadingStats')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {}
                        <div className="card-3d p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-primary/10 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                            <div className="relative z-10">
                                <dt className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('adminDashboard.totalUsers')}</dt>
                                <dd className="mt-2 text-4xl font-extrabold text-primary">{stats?.users_count || 0}</dd>
                                <div className="mt-4 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <span>👥 {t('adminDashboard.citizensAgents')}</span>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="card-3d p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-primary/10 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                            <div className="relative z-10">
                                <dt className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('adminDashboard.totalIssues')}</dt>
                                <dd className="mt-2 text-4xl font-extrabold text-primary">{stats?.issues_count || 0}</dd>
                                <div className="mt-4 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <span>🏙️ {t('adminDashboard.reportsFiled')}</span>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="card-3d p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-yellow-100 dark:bg-yellow-900/40 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                            <div className="relative z-10">
                                <dt className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('adminDashboard.pendingIssues')}</dt>
                                <dd className="mt-2 text-4xl font-extrabold text-yellow-600 dark:text-yellow-400">{stats?.issues_pending || 0}</dd>
                                <div className="mt-4 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <span>⚠️ {t('adminDashboard.awaitingAction')}</span>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="card-3d p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-purple-100 dark:bg-purple-900/40 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                            <div className="relative z-10">
                                <dt className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('adminDashboard.helpRequests')}</dt>
                                <dd className="mt-2 text-4xl font-extrabold text-purple-600 dark:text-purple-400">{stats?.help_requests_count || 0}</dd>
                                <div className="mt-4 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <span>🤝 {t('adminDashboard.communityRequests')}</span>
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
