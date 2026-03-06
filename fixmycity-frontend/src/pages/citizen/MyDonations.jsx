import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { paymentService } from '../../services/paymentService';
import { toast } from 'react-toastify';

function MyDonations() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyDonations();
    }, []);

    const fetchMyDonations = async () => {
        try {
            const data = await paymentService.getMyDonations();
            setDonations(data || []);
        } catch (error) {
            console.error('Failed to fetch my donations', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Donations</h1>
                    <p className="text-gray-500 dark:text-gray-400">Thank you for your generosity! Here is a history of your contributions.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : donations.length === 0 ? (
                    <div className="text-center py-20 glass-panel rounded-2xl">
                        <div className="text-6xl mb-4">🎁</div>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">No donations found.</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Support a cause today!</p>
                        <Link to="/community" className="mt-6 inline-block btn-primary-3d px-6 py-2 rounded-xl font-bold">
                            Browse Community
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                            {donations.map((donation) => (
                                <li key={donation._id}>
                                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-primary truncate">
                                                {donation.help_request?.title || 'Unknown Cause'}
                                            </p>
                                            <div className="ml-2 shrink-0 flex">
                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                                                    ${donation.amount}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    {donation.is_anonymous ? 'Anonymous Donation' : 'Public Donation'}
                                                </p>
                                                {donation.message && (
                                                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                        "{donation.message}"
                                                    </p>
                                                )}
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <p>
                                                    {new Date(donation.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default MyDonations;
