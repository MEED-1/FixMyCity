import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { DocumentChartBarIcon, ArrowDownTrayIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { agentService } from '../../services/agentService';

function AgentReports() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        lifetime_resolved: 0,
        avg_resolution_days: 0,
        current_month_progress: 0,
        history: [],
        tasks_per_category: {},
    });

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const data = await agentService.getReports();
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch reports', err);
            toast.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center card-3d px-6 py-4 gap-4">
                <div>
                    <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
                        <DocumentChartBarIcon className="w-8 h-8 text-primary" />
                        Monthly Reports
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Review your performance history</p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto space-y-6">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        {}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="card-standard p-6 bg-linear-to-br from-primary/5 to-transparent border-primary/20">
                                <p className="text-sm font-bold text-muted-foreground mb-1">Lifetime Resolved</p>
                                <p className="text-4xl font-black text-foreground">{stats.lifetime_resolved}</p>
                            </div>
                            <div className="card-standard p-6">
                                <p className="text-sm font-bold text-muted-foreground mb-1">Avg Resolution Time</p>
                                <p className="text-4xl font-black text-foreground">{stats.avg_resolution_days}<span className="text-lg font-medium text-muted-foreground ml-1">Days</span></p>
                            </div>
                            <div className="card-standard p-6">
                                <p className="text-sm font-bold text-muted-foreground mb-1">Current Month Progress</p>
                                <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{stats.current_month_progress}<span className="text-lg font-medium text-muted-foreground ml-1">Issues</span></p>
                            </div>
                        </div>

                        {}
                        <div className="card-3d overflow-hidden">
                            <div className="px-6 py-5 border-b border-border bg-muted/30">
                                <h2 className="text-lg font-bold">Report History</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-slate-800">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Report Period</th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Issues Resolved</th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg Resolution Time</th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Period End</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
                                        {stats.history.map((report, index) => (
                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <DocumentChartBarIcon className="w-5 h-5 text-gray-400 mr-3" />
                                                        <span className="font-bold text-foreground">{report.month}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {report.total_resolved}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {report.avg_resolution_time}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {report.date_generated}
                                                </td>
                                            </tr>
                                        ))}
                                        {stats.history.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                    No report history available yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </DashboardLayout>
    );
}

export default AgentReports;
