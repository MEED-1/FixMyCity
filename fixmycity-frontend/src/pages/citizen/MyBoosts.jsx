import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { paymentService } from '../../services/paymentService';
import { toast } from 'react-toastify';

function MyBoosts() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [boosts, setBoosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBoosts = async () => {
            try {
                const data = await paymentService.getMyBoosts();
                setBoosts(data || []);
            } catch (error) {
                console.error('Failed to fetch boosts', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBoosts();
    }, []);

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Boosts & Promotions</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track the impact of your promoted issues.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : boosts.length === 0 ? (
                    <div className="text-center py-20 glass-panel rounded-2xl">
                        <div className="text-6xl mb-4">🚀</div>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">No active boosts.</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Boost your issues to get faster resolution!</p>
                        <Link to="/issues/mine" className="mt-6 inline-block btn-primary-3d px-6 py-2 rounded-xl font-bold">
                            Boost an Issue
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {boosts.map((boost) => (
                            <div key={boost.id} className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="text-6xl">🚀</span>
                                </div>
                                <h3 className="font-bold text-lg mb-2 truncate pr-8">{boost.issue?.title || 'Unknown Issue'}</h3>
                                <div className="flex justify-between items-center mb-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${boost.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-800'}
                                        }`}>
                                        {boost.status}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(boost.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                    <div className="flex justify-between">
                                        <span>Level:</span>
                                        <span className="font-medium">{boost.level}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Expires:</span>
                                        <span className="font-medium">{new Date(boost.expires_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex justify-between items-center">
                                            <span>Views</span>
                                            <span className="font-bold">{boost.views || 0}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="mt-4 w-full py-2 bg-primary/10 text-primary rounded-lg font-bold hover:bg-primary/20 transition-colors">
                                    Extend Boost
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default MyBoosts;
