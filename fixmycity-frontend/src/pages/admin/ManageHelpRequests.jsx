import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { helpService } from '../../services/helpService';
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

const VSTATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

const CATEGORY_COLORS = {
    volunteering: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    donation: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

function ManageHelpRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => { fetchRequests(); }, [filter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const params = filter !== 'all' ? { category: filter } : {};
            const data = await helpService.getAll(params);
            setRequests(data.data || []);
        } catch {
            toast.error('Failed to fetch help requests');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await adminService.updateHelpRequestStatus(id, status);
            toast.success(`Request ${status}`);
            fetchRequests();
        } catch {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async () => {
        try {
            await adminService.deleteHelpRequest(deleteId);
            toast.success('Help request deleted');
            setDeleteId(null);
            fetchRequests();
        } catch {
            toast.error('Failed to delete');
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Help Requests</h1>
                        <p className="text-gray-500 dark:text-gray-400">Oversee community volunteering and donations.</p>
                    </div>

                    <div className="w-full sm:w-56">
                        <CustomDropdown
                            value={filter}
                            onChange={(val) => setFilter(val)}
                            options={[
                                { value: 'all', label: 'All Categories' },
                                { value: 'volunteering', label: 'Volunteering' },
                                { value: 'donation', label: 'Donation' },
                                { value: 'other', label: 'Other' },
                            ]}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-20 glass-panel rounded-2xl">
                        <div className="text-6xl mb-4">🤝</div>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">No requests found.</h3>
                    </div>
                ) : (
                    <div className="card-3d overflow-hidden p-1">
                        <div className="rounded-xl overflow-x-auto ring-1 ring-gray-100 dark:ring-slate-800">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50/80 dark:bg-slate-800/80 backdrop-blur-sm">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Verification</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Posted by</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {requests.map((req) => (
                                        <tr key={req._id || req.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link
                                                    to={`/community-help/${req._id || req.id}`}
                                                    className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary transition-colors"
                                                >
                                                    {req.title}
                                                </Link>
                                                {req.category === 'donation' && req.target_amount > 0 && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                        ${req.current_amount || 0} / ${req.target_amount} raised
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${CATEGORY_COLORS[req.category] || CATEGORY_COLORS.other}`}>
                                                    {req.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${VSTATUS_COLORS[req.verification_status] || VSTATUS_COLORS.pending}`}>
                                                    {req.verification_status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                                                {req.user?.name || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        to={`/community-help/${req._id || req.id}`}
                                                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 hover:text-primary transition-colors"
                                                        title="View"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                    </Link>
                                                    {(!req.verification_status || req.verification_status === 'pending') && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusChange(req._id || req.id, 'approved')}
                                                                className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 transition-colors"
                                                                title="Approve"
                                                            >
                                                                <CheckCircleIcon className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusChange(req._id || req.id, 'rejected')}
                                                                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 transition-colors"
                                                                title="Reject"
                                                            >
                                                                <XCircleIcon className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => setDeleteId(req._id || req.id)}
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
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Help Request?</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium shadow-lg shadow-red-500/25 hover:bg-red-600 transition-all">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default ManageHelpRequests;
