import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DonationModal from '../../components/payment/DonationModal';
import useAuthStore from '../../store/useAuthStore';
import { helpService } from '../../services/helpService';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import TranslateButton from '../../components/common/TranslateButton';
import { useTranslateContent } from '../../hooks/useTranslateContent';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function HelpRequestDetails() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();
    const isAdmin = user?.role === 'admin';
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

    const { displayFields, isTranslating, isTranslated, toggleTranslation, error: translateError } = useTranslateContent({
        title: request?.title || '',
        description: request?.description || '',
    });

    const actualIsOwner = isAuthenticated && user?.id && (request?.user_id === user.id || request?.user?.id === user.id);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this help request? This cannot be undone.')) return;
        try {
            await helpService.delete(id);
            toast.success('Help request deleted successfully.');
            navigate('/help/mine');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete');
        }
    };

    useEffect(() => {
        fetchRequestDetails();
    }, [id]);

    const fetchRequestDetails = async () => {
        try {
            const data = await helpService.getById(id);
            setRequest(data);
        } catch (error) {
            console.error('Failed to fetch request details', error);
            toast.error('Failed to load help request details');
        } finally {
            setLoading(false);
        }
    };

    const ContentWrapper = ({ children }) => {
        if (isAuthenticated) {
            return <DashboardLayout>{children}</DashboardLayout>;
        }
        return (
            <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <Navbar />
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <ContentWrapper>
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
                    <p className="text-sm text-muted-foreground">{t('common.loading', 'Loading...')}</p>
                </div>
            </ContentWrapper>
        );
    }

    if (!request) {
        return (
            <ContentWrapper>
                <div className="flex flex-col items-center justify-center py-20">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('community.notFound', 'Help request not found')}</h2>
                    <Link to="/community" className="text-primary hover:underline font-medium">
                        {t('community.backToFeed', 'Back to Community Feed')}
                    </Link>
                </div>
            </ContentWrapper>
        );
    }

    const percentage = request.target_amount > 0
        ? Math.min(100, (request.current_amount / request.target_amount) * 100)
        : 0;

    return (
        <ContentWrapper>
            <div className="max-w-6xl mx-auto">
                {}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {}
                    <div className="lg:col-span-2 space-y-6">

                        {}
                        <div className="card-standard overflow-hidden">
                            <div className="relative h-72 sm:h-80 bg-muted">
                                {request.photos && request.photos.length > 0 ? (
                                    <img
                                        src={request.photos[0]}
                                        alt={request.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <span className="text-5xl opacity-30">📷</span>
                                            <p className="text-xs text-muted-foreground mt-2">No Image Provided</p>
                                        </div>
                                    </div>
                                )}

                                {}
                                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                                {}
                                <div className="absolute top-4 left-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ring-1 backdrop-blur-md ${request.category === 'donation' ? 'bg-purple-500/15 text-purple-300 ring-purple-500/30' : 'bg-teal-500/15 text-teal-300 ring-teal-500/30'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${request.category === 'donation' ? 'bg-purple-400' : 'bg-teal-400'}`} />
                                        {request.category.toUpperCase()}
                                    </span>
                                </div>

                                {}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-lg mb-2">
                                        {displayFields.title}
                                    </h1>
                                    <p className="text-sm text-white/80 font-medium">
                                        {t('community.postedBy', 'Posted by')} {request.user?.name || 'Anonymous'} • {new Date(request.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="card-standard p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    {t('community.description', 'Description')}
                                </h2>
                                <TranslateButton
                                    onClick={toggleTranslation}
                                    isTranslated={isTranslated}
                                    isTranslating={isTranslating}
                                    error={translateError}
                                />
                            </div>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base">
                                {displayFields.description}
                            </p>
                        </div>
                    </div>

                    {}
                    <div className="space-y-6">

                        {request.category === 'donation' && (
                            <div className="card-standard p-6">
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                                    {t('community.progress', 'Fundraising Progress')}
                                </h3>

                                <div className="mb-4">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-3xl font-bold text-foreground">${request.current_amount || 0}</span>
                                        <span className="text-sm font-medium text-muted-foreground mb-1">raised of ${request.target_amount}</span>
                                    </div>
                                    <div className="w-full bg-border rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className="bg-primary h-full transition-all duration-1000 ease-out relative"
                                            style={{ width: `${percentage}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 w-full h-full skeleton-shimmer"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {}
                        <div className="card-standard p-6">
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                                Actions
                            </h3>

                            <div className="flex flex-col gap-3">
                                {isAdmin ? (
                                    <button
                                        onClick={handleDelete}
                                        className="w-full btn-danger"
                                    >
                                        Delete Request
                                    </button>
                                ) : actualIsOwner ? (
                                    <div className="flex flex-col gap-1">
                                        {(request.current_amount > 0 || request.donations_count > 0 || !['active', 'pending', 'approved'].includes(request.status)) ? (
                                            <div className="text-[10px] text-center text-muted-foreground p-1.5 bg-muted/50 rounded-lg">
                                                {(request.current_amount > 0 || request.donations_count > 0)
                                                    ? "Cannot edit or delete an item that has received donations"
                                                    : "Cannot edit or delete this request at its current status"}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-2">
                                                <Link
                                                    to={`/community-help/edit/${request.id}`}
                                                    className="w-full py-2.5 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 font-bold rounded-xl hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors text-sm flex items-center justify-center shadow-sm"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={handleDelete}
                                                    className="w-full py-2.5 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-sm flex items-center justify-center shadow-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : request.category === 'donation' ? (
                                    <button
                                        onClick={() => {
                                            if (!isAuthenticated) return toast.info("Please log in to make a donation.");
                                            setIsDonationModalOpen(true);
                                        }}
                                        className="w-full btn-primary-3d py-3"
                                    >
                                        {t('community.donateBtn', 'Donate Now')}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            if (!isAuthenticated) return toast.info("Please log in to volunteer.");
                                            toast.info(t('community.volunteerToast', 'Volunteer request sent!'));
                                        }}
                                        className="w-full btn-primary-3d py-3"
                                    >
                                        {t('community.volunteerBtn', 'Volunteer')}
                                    </button>
                                )}
                            </div>
                        </div>

                        {}
                        <div className="card-standard p-6">
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                                {t('community.location', 'Location')}
                            </h3>
                            <div className="h-48 w-full rounded-xl overflow-hidden border border-border mt-2 shadow-inner">
                                {request.location && request.location.coordinates ? (
                                    <MapContainer
                                        center={[request.location.coordinates[1], request.location.coordinates[0]]}
                                        zoom={15}
                                        style={{ height: '100%', width: '100%' }}
                                        dragging={false}
                                        scrollWheelZoom={false}
                                    >
                                        <TileLayer
                                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                        />
                                        <Marker position={[request.location.coordinates[1], request.location.coordinates[0]]}>
                                            <Popup>{request.title}</Popup>
                                        </Marker>
                                    </MapContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-muted text-muted-foreground text-sm">
                                        No location specified
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DonationModal
                isOpen={isDonationModalOpen}
                onClose={() => {
                    setIsDonationModalOpen(false);
                    fetchRequestDetails(); // Refresh data after donation
                }}
                helpRequestId={request._id}
                helpRequestTitle={request.title}
            />
        </ContentWrapper>
    );
}

export default HelpRequestDetails;
