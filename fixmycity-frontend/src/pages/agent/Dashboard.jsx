import React, { useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import { agentService } from '../../services/agentService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import DashboardLayout from '../../components/layout/DashboardLayout';
import { useTranslation } from 'react-i18next';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function AgentDashboard() {
    const { t } = useTranslation();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');


    const [resolveModalOpen, setResolveModalOpen] = useState(false);
    const [resolvingIssueId, setResolvingIssueId] = useState(null);
    const [resolveFiles, setResolveFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        try {
            const data = await agentService.getAssignedIssues();
            setIssues(data.data || []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch assigned issues');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await agentService.updateStatus(id, newStatus);
            toast.success(`Issue marked as ${newStatus.replace('_', ' ')}`);
            fetchIssues();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update status');
        }
    };

    const openResolveModal = (issueId) => {
        setResolvingIssueId(issueId);
        setResolveFiles([]);
        setResolveModalOpen(true);
    };

    const handleResolveSubmit = async (e) => {
        e.preventDefault();
        if (resolveFiles.length === 0) {
            toast.error("Please upload at least one resolution photo.");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('status', 'resolved');
            Array.from(resolveFiles).forEach(file => {
                formData.append('resolved_photos[]', file);
            });

            await agentService.updateStatusWithPhotos(resolvingIssueId, formData);
            toast.success("Issue marked as resolved!");
            setResolveModalOpen(false);
            fetchIssues();
        } catch (error) {
            toast.error(error.response?.data?.errors?.resolved_photos?.[0] || error.response?.data?.error || "Failed to resolve issue.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-8 flex justify-between items-center card-3d px-6 py-4">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">{t('agentDashboard.title')}</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('agentDashboard.subtitle')}</p>
                </div>
                <div className="flex items-center card-3d px-4 py-3 bg-primary/10 border border-primary/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <div>
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider">{t('agentDashboard.assigned')}</p>
                        <p className="text-xl font-bold text-foreground leading-none">{issues.length}</p>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center card-3d p-2 gap-4">
                    <div className="flex space-x-2 bg-gray-100 dark:bg-slate-700 p-1 rounded-xl w-full sm:w-auto">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow-sm text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
                        >
                            {t('agentDashboard.listView')}
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-white dark:bg-slate-600 shadow-sm text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
                        >
                            {t('agentDashboard.mapView')}
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-gray-500">{t('agentDashboard.loadingAssignments')}</p>
                    </div>
                ) : issues.length === 0 ? (
                    <div className="text-center py-20 card-3d">
                        <div className="text-6xl mb-4">✅</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('agentDashboard.allCaughtUp')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">{t('agentDashboard.noIssuesAssigned')}</p>
                    </div>
                ) : viewMode === 'list' ? (
                    <div className="card-3d overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-slate-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('agentDashboard.issue')}</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('agentDashboard.status')}</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('agentDashboard.priority')}</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('agentDashboard.reported')}</th>
                                        <th scope="col" className="relative px-6 py-4"><span className="sr-only">{t('common.actions')}</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
                                    {issues.map((issue) => (
                                        <tr key={issue.id || issue._id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="shrink-0 h-10 w-10">
                                                        {issue.photos && issue.photos.length > 0 ? (
                                                            <img className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm" src={issue.photos[0]} alt="" />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900 dark:text-white">{issue.title}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">{issue.category}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full 
                                                    ${issue.status === 'resolved' ? 'bg-primary/20 text-primary-foreground border border-primary/30 shadow-sm' :
                                                        issue.status === 'in_progress' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50' :
                                                            'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50'}`}>
                                                    {issue.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">
                                                {issue.priority.toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(issue.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-4">
                                                    {issue.status !== 'resolved' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                openResolveModal(issue.id || issue._id);
                                                            }}
                                                            className="text-primary hover:text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-lg font-bold transition-all border border-solid border-primary"
                                                        >
                                                            {t('agentDashboard.resolve')}
                                                        </button>
                                                    )}
                                                    {issue.status === 'reported' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleStatusUpdate(issue.id || issue._id, 'in_progress');
                                                            }}
                                                            className="text-amber-600 hover:text-amber-900 dark:text-amber-500 dark:hover:text-amber-400 font-bold transition-colors"
                                                        >
                                                            {t('agentDashboard.startWork')}
                                                        </button>
                                                    )}
                                                    {issue.status === 'in_progress' && (
                                                        <span className="text-amber-600 dark:text-amber-500 font-medium text-xs px-2 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-md">{t('agentDashboard.working')}</span>
                                                    )}
                                                    <Link to={`/urban-issues/${issue.id || issue._id}`} className="text-gray-500 hover:text-foreground dark:text-gray-400 ml-2 transition-colors flex items-center gap-1 group">
                                                        {t('agentDashboard.viewDetails')}
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="card-3d p-1 overflow-hidden h-[600px]">
                        <div className="h-full w-full rounded-xl overflow-hidden ring-1 ring-gray-200 dark:ring-slate-700">
                            <MapContainer
                                center={[30.4278, -9.5981]}
                                zoom={12}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='© OpenStreetMap contributors'
                                />
                                {issues.map(issue => (
                                    issue.location && issue.location.coordinates && (
                                        <Marker
                                            key={issue.id || issue._id}
                                            position={[issue.location.coordinates[1], issue.location.coordinates[0]]}
                                        >
                                            <Popup>
                                                <div className="w-48 text-gray-900">
                                                    <h3 className="font-bold">{issue.title}</h3>
                                                    <p className="text-xs text-gray-500 mb-2">{issue.status}</p>
                                                    <Link to={`/urban-issues/${issue.id || issue._id}`} className="text-primary text-sm hover:underline font-bold">
                                                        {t('agentDashboard.viewDetails')}
                                                    </Link>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    )
                                ))}
                            </MapContainer>
                        </div>
                    </div>
                )}
            </main>

            {}
            {resolveModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('agentDashboard.resolveIssue')}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                {t('agentDashboard.resolveDescription')}
                            </p>

                            <form onSubmit={handleResolveSubmit}>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        {t('agentDashboard.resolutionPhoto')} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => setResolveFiles(e.target.files)}
                                        className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer border border-gray-200 dark:border-slate-700 rounded-lg p-2"
                                        required
                                    />
                                    {resolveFiles.length > 0 && (
                                        <p className="mt-2 text-xs text-green-600 font-medium">{t('agentDashboard.filesSelected', { count: resolveFiles.length })}</p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setResolveModalOpen(false)}
                                        disabled={isSubmitting}
                                        className="px-4 py-2 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        {t('common.cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || resolveFiles.length === 0}
                                        className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm"
                                    >
                                        {isSubmitting ? t('agentDashboard.uploading') : t('agentDashboard.confirmResolution')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default AgentDashboard;
