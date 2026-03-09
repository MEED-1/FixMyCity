import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import CustomDropdown from '../../components/common/CustomDropdown';
import { useTranslation } from 'react-i18next';
import {
    TrashIcon,
} from '@heroicons/react/24/outline';

const ROLE_COLORS = {
    admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    agent: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    citizen: 'bg-primary/10 text-primary',
};

function ManageUsers() {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [municipalities, setMunicipalities] = useState([]);
    const [showMunicipalityModal, setShowMunicipalityModal] = useState(false);
    const [pendingRoleChange, setPendingRoleChange] = useState(null);

    useEffect(() => { 
        fetchUsers(); 
        fetchMunicipalities();
    }, [roleFilter]);

    const fetchMunicipalities = async () => {
        try {
            const data = await adminService.getMunicipalities();
            setMunicipalities(data || []);
        } catch (err) {
            console.error('Failed to fetch municipalities', err);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await adminService.getUsers(roleFilter);
            const usersArray = Array.isArray(data) ? data : (data.data || data.users || []);
            setUsers(usersArray);
        } catch {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (newRole === 'agent') {
            setPendingRoleChange({ userId, role: newRole });
            setShowMunicipalityModal(true);
            return;
        }
        try {
            await adminService.updateUserRole(userId, newRole);
            toast.success(t('manageUsers.roleUpdated'));
            fetchUsers();
        } catch {
            toast.error(t('manageUsers.updateRoleFailed'));
        }
    };

    const confirmAgentRole = async (municipalityName) => {
        if (!pendingRoleChange) return;
        try {
            await adminService.updateUserRole(pendingRoleChange.userId, pendingRoleChange.role, municipalityName);
            toast.success(t('manageUsers.roleUpdated'));
            setShowMunicipalityModal(false);
            setPendingRoleChange(null);
            fetchUsers();
        } catch {
            toast.error(t('manageUsers.updateRoleFailed'));
        }
    };

    const handleDelete = async () => {
        try {
            await adminService.deleteUser(deleteId);
            toast.success('User deleted');
            setDeleteId(null);
            fetchUsers();
        } catch {
            toast.error('Failed to delete user');
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('manageUsers.title')}</h1>
                        <p className="text-gray-500 dark:text-gray-400">{t('manageUsers.subtitle')}</p>
                    </div>

                    <div className="w-full sm:w-56">
                        <CustomDropdown
                            value={roleFilter || 'all'}
                            onChange={(val) => setRoleFilter(val === 'all' ? '' : val)}
                            options={[
                                { value: 'all', label: t('manageUsers.allRoles') },
                                { value: 'citizen', label: t('manageUsers.citizen') },
                                { value: 'agent', label: t('manageUsers.agent') },
                                { value: 'admin', label: t('manageUsers.admin') },
                            ]}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="card-3d overflow-hidden p-1">
                        <div className="rounded-xl overflow-x-auto ring-1 ring-gray-100 dark:ring-slate-800">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50/80 dark:bg-slate-800/80 backdrop-blur-sm">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('manageUsers.user')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">{t('manageUsers.email')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('manageUsers.role')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">{t('manageUsers.municipality')}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('common.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{t('manageUsers.noUsers')}</h3>
                                                <p className="text-sm">{t('manageUsers.noUsersFoundMatchingFilter')}</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user._id || user.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                                {user.name?.charAt(0).toUpperCase() || '?'}
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user._id || user.id, e.target.value)}
                                                        className={`px-2.5 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-primary/30 outline-none transition ${ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-800'}`}
                                                    >
                                                        <option value="citizen">{t('common.roles.citizen')}</option>
                                                        <option value="agent">{t('common.roles.agent')}</option>
                                                        <option value="admin">{t('common.roles.admin')}</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                                                    {user.municipality || '—'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => setDeleteId(user._id || user.id)}
                                                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
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
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('manageUsers.deleteUser')}</h3>
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

            {showMunicipalityModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-surface rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('manageUsers.assignMunicipality')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{t('manageUsers.selectMunicipality')}</p>
                        
                        <div className="space-y-2 max-h-60 overflow-y-auto mb-6 pr-2">
                            {municipalities.map(m => (
                                <button
                                    key={m._id || m.id}
                                    onClick={() => confirmAgentRole(m.name)}
                                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors border border-transparent hover:border-primary/20 text-sm font-medium"
                                >
                                    {m.name}
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={() => {
                                setShowMunicipalityModal(false);
                                setPendingRoleChange(null);
                            }} 
                            className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            {t('common.cancel')}
                        </button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default ManageUsers;
