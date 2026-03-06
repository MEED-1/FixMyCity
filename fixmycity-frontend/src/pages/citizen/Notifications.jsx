import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { toast } from 'react-toastify';
import { BellIcon, CheckCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import notificationService from '../../services/notificationService';

function Notifications() {
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await notificationService.getAll();
            setNotifications(res.data);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read_at: new Date().toISOString() } : n));
            toast.success(t('notifications.markAsRead'));
        } catch (err) {
            toast.error('Failed to mark as read');
        }
    };

    const markAllAsRead = async () => {
        try {
            const unread = notifications.filter(n => !n.read_at);
            await Promise.all(unread.map(n => notificationService.markAsRead(n._id)));
            setNotifications(notifications.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
            toast.success(t('notifications.success'));
        } catch (err) {
            toast.error('Failed to mark all as read');
        }
    };

    const deleteNotification = async (id) => {
        try {
            await notificationService.delete(id);
            setNotifications(notifications.filter(n => n._id !== id));
            toast.success(t('notifications.removed'));
        } catch (err) {
            toast.error('Failed to delete notification');
        }
    };

    const getIconByType = (type) => {
        switch (type) {
            case 'issue_status_changed': return <CheckCircleIcon className="h-6 w-6 text-primary" />;
            case 'donation_received': return <CheckCircleIcon className="h-6 w-6 text-emerald-500" />;
            case 'new_comment': return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
            default: return <BellIcon className="h-6 w-6 text-gray-400" />;
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('notifications.title')}</h1>
                        <p className="text-gray-500 dark:text-gray-400">{t('notifications.subtitle')}</p>
                    </div>
                    <button
                        onClick={markAllAsRead}
                        className="text-sm font-medium text-primary hover:text-primary/70 transition-colors"
                    >
                        {t('notifications.markAllRead')}
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-20 card-3d">
                        <div className="text-6xl mb-4">🔕</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('notifications.emptyState')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">{t('notifications.emptyStateSub')}</p>
                    </div>
                ) : (
                    <div className="card-3d overflow-hidden divide-y divide-gray-100 dark:divide-gray-800/60 p-1">
                        <div className="rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                            {notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`p-6 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/80 flex items-start space-x-4 ${!notification.read_at ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
                                >
                                    <div className="shrink-0 pt-0.5">
                                        {getIconByType(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p className={`text-sm font-medium ${!notification.read_at ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                                {notification.data?.message || notification.type}
                                            </p>
                                            <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                                                {new Date(notification.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex space-x-4">
                                            {!notification.read_at && (
                                                <button
                                                    onClick={() => markAsRead(notification._id)}
                                                    className="text-xs font-medium text-primary hover:text-primary/70 transition-colors"
                                                >
                                                    {t('notifications.markAsRead')}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(notification._id)}
                                                className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                {t('notifications.delete')}
                                            </button>
                                        </div>
                                    </div>
                                    {!notification.read_at && (
                                        <div className="shrink-0 self-center">
                                            <span className="inline-block h-2 w-2 rounded-full bg-primary ring-2 ring-white dark:ring-slate-900"></span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default Notifications;
