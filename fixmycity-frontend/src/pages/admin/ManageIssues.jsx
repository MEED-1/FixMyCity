import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { issueService } from '../../services/issueService';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import CustomDropdown from '../../components/common/CustomDropdown';
import {
    CheckCircleIcon,
    XCircleIcon,
    TrashIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const STATUS_COLORS = {
    reported: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    approved: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    in_progress: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

function ManageIssues() {
    const { t } = useTranslation();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => { fetchIssues(); }, [filter]);

    const fetchIssues = async () => {
        setLoading(true);
        try {
            const params = filter !== 'all' ? { status: filter } : {};
            const data = await issueService.getAll(params);
            setIssues(data.data || []);
        } catch {
            toast.error('Failed to fetch issues');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (issueId, status) => {
        try {
            await adminService.updateIssueStatus(issueId, status);
            toast.success(`Issue ${status}`);
            fetchIssues();
        } catch {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async () => {
        try {
            await adminService.deleteIssue(deleteId);
            toast.success('Issue deleted');
            setDeleteId(null);
            fetchIssues();
        } catch {
            toast.error('Failed to delete issue');
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('manageIssues.title')}</h1>
                        <p className="text-gray-500 dark:text-gray-400">{t('manageIssues.subtitle')}</p>
                    </div>

                    <div className="w-full sm:w-56">
                        <CustomDropdown
                            value={filter}
                            onChange={(val) => setFilter(val)}
                            options={[
                                { value: 'all', label: t('manageIssues.allStatuses') },
                                { value: 'reported', label: t('manageIssues.reported') },
                                { value: 'approved', label: t('manageIssues.approved') },
                                { value: 'in_progress', label: t('manageIssues.inProgress') },
                                { value: 'resolved', label: t('manageIssues.resolved') },
                                { value: 'rejected', label: t('manageIssues.rejected') },
                            ]}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : issues.length === 0 ? (
                    <div className="text-center py-20 glass-panel rounded-2xl">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">{t('manageIssues.noIssues')}</h3>
                    </div>
                ) : (
                    <div className="card-3d overflow-hidden p-1">
                        <div className="rounded-xl overflow-x-auto ring-1 ring-gray-100 dark:ring-slate-800">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50/80 dark:bg-slate-800/80 backdrop-blur-sm">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('manageIssues.issue')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">{t('manageIssues.category')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('manageIssues.status')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">{t('manageIssues.reporter')}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('common.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {issues.map((issue) => (
                                        <tr key={issue.id || issue._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link
                                                    to={`/urban-issues/${issue._id || issue.id}`}
                                                    className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary transition-colors"
                                                >
                                                    {issue.title}
                                                </Link>
                                                <div className="text-xs text-foreground/70">{t(`reportIssue.categories.${issue.category?.toLowerCase()}`, issue.category)}</div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[250px]">
                                                    {issue.description?.substring(0, 60)}…
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[issue.status] || 'bg-gray-100 text-gray-800'}`}>
                                                    {t(`issues.status.${issue.status}`, issue.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                                                {issue.user?.name || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        to={`/urban-issues/${issue._id || issue.id}`}
                                                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 hover:text-primary transition-colors"
                                                        title="View"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                    </Link>
                                                    {issue.status === 'reported' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusChange(issue._id || issue.id, 'approved')}
                                                                className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 transition-colors"
                                                                title="Approve"
                                                            >
                                                                <CheckCircleIcon className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusChange(issue._id || issue.id, 'rejected')}
                                                                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 transition-colors"
                                                                title="Reject"
                                                            >
                                                                <XCircleIcon className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => setDeleteId(issue._id || issue.id)}
                                                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-surface rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                        <TrashIcon className="w-12 h-12 mx-auto text-red-500 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('manageIssues.deleteIssue')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{t('common.actionCannotBeUndone')}</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                {t('common.cancel')}
                            </button>
                            <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium shadow-lg shadow-red-500/25 hover:bg-red-600 transition-all">
                                {t('common.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default ManageIssues;
