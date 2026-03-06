import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import IssueCard from '../../components/issues/IssueCard';
import { issueService } from '../../services/issueService';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/useAuthStore';
import { useTranslation } from 'react-i18next';

function MyIssues() {
    const { user } = useAuthStore();
    const { t } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyIssues();
    }, []);

    const fetchMyIssues = async () => {
        try {
            const data = await issueService.getAll({ mine: true });
            setIssues(data.data || []);
        } catch (error) {
            console.error('Failed to fetch my issues', error);
            toast.error('Failed to load your issues');
        } finally {
            setLoading(false);
        }
    };

    const handleUpvote = async (id) => {
        try {
            await issueService.upvote(id);
            toast.success("Upvoted!");
            fetchMyIssues();
        } catch (error) {
            toast.error("Failed to upvote");
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('dashboard.myReports', 'My Reported Issues')}</h1>
                    <Link
                        to="/report"
                        className="btn-primary-3d px-6 py-2 rounded-xl text-sm font-bold flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        {t('dashboard.quickActions.reportIssue', 'Report New')}
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : issues.length === 0 ? (
                    <div className="text-center py-20 glass-panel rounded-2xl">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">{t('issues.noReportedIssues', "You haven't reported any issues yet.")}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">{t('issues.spottedSomething', 'Spotted something? Let us know!')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {issues.map((issue, index) => (
                            <IssueCard key={issue._id || index} issue={issue} onUpvote={handleUpvote} isOwner={true} />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default MyIssues;
