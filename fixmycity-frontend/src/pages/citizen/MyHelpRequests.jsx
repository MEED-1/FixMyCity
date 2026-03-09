import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import HelpCard from '../../components/community/HelpCard';
import { helpService } from '../../services/helpService';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

function MyHelpRequests() {
    const { t } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const fetchMyRequests = async () => {
        try {
            const data = await helpService.getAll({ mine: true });
            setRequests(data.data || []);
        } catch (error) {
            console.error('Failed to fetch my requests', error);
            toast.error('Failed to load your help requests');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (deletedId) => {
        setRequests(prev => prev.filter(r => (r._id || r.id) !== deletedId));
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('community.myRequests')}</h1>
                    <Link
                        to="/community/request"
                        className="btn-primary-3d px-6 py-2 rounded-xl text-sm font-bold flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        {t('community.requestHelp')}
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-20 glass-panel rounded-2xl">
                        <div className="text-6xl mb-4">🤝</div>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">{t('community.noRequests')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">{t('community.noRequestsSub')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {requests.map((req) => (
                            <HelpCard key={req._id} request={req} isOwner={true} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default MyHelpRequests;
