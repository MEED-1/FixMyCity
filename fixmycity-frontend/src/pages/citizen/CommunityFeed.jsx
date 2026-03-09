import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useAuthStore from '../../store/useAuthStore';
import CommunityMap from '../../components/map/CommunityMap';
import HelpCard from '../../components/community/HelpCard';
import { helpService } from '../../services/helpService';
import { toast } from 'react-toastify';
import { MapIcon, ListBulletIcon, PlusIcon, HandRaisedIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

function CommunityFeed() {
    const { isAuthenticated } = useAuthStore();
    const { t } = useTranslation();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await helpService.getAll();
            setRequests(data.data || []);
        } catch (error) {
            console.error('Failed to fetch requests', error);
            toast.error('Failed to load community requests');
        } finally {
            setLoading(false);
        }
    };

    const filteredRequests = requests.filter(req => {
        if (filter === 'all') return true;
        return req.category === filter;
    });

    const filters = ['all', 'volunteering', 'donation'];

    const renderContent = () => (
        <div>
            {}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">{t('communityFeed.title')}</h1>
                    <p className="mt-1 text-muted-foreground">{t('communityFeed.subtitle')}</p>
                </div>
                <Link
                    to="/community/request"
                    className="btn-primary-3d"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    {t('communityFeed.requestHelp')}
                </Link>
            </div>

            {}
            <div className="card-3d p-2 mb-8 flex flex-col sm:flex-row justify-between items-center gap-3">
                {}
                <div className="flex gap-2">
                    {filters.map((category) => (
                        <button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 capitalize ${filter === category
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            {t(`communityFeed.${category}`, category)}
                        </button>
                    ))}
                </div>

                {}
                <div className="flex items-center gap-2 bg-muted p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list'
                            ? 'bg-surface shadow-sm text-primary'
                            : 'text-muted-foreground hover:text-foreground'}`}
                        aria-label="List View"
                    >
                        <ListBulletIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'map'
                            ? 'bg-surface shadow-sm text-primary'
                            : 'text-muted-foreground hover:text-foreground'}`}
                        aria-label="Map View"
                    >
                        <MapIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <>
                    {viewMode === 'map' && (
                        <div className="mb-8 h-[600px] rounded-2xl overflow-hidden shadow-lg border border-border relative z-0">
                            <CommunityMap requests={filteredRequests} />
                        </div>
                    )}

                    {viewMode === 'list' && (
                        <>
                            {filteredRequests.length === 0 ? (
                                <div className="card-3d text-center py-20">
                                    <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                                        <HandRaisedIcon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground">{t('communityFeed.noRequests')}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">{t('communityFeed.noRequestsSub')}</p>
                                    <div className="mt-6">
                                        <Link
                                            to="/community/request"
                                            className="btn-primary-3d"
                                        >
                                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                            {t('communityFeed.newRequest')}
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredRequests.map(req => (
                                        <HelpCard key={req.id} request={req} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );

    if (isAuthenticated) {
        return (
            <DashboardLayout>
                {renderContent()}
            </DashboardLayout>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {renderContent()}
            </div>
        </div>
    );
}

export default CommunityFeed;
