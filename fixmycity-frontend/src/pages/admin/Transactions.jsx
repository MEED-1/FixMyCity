import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

function Transactions() {
    const { t } = useTranslation();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const data = await adminService.getTransactions();
            const txnArray = Array.isArray(data) ? data : (data.data || []);
            setTransactions(txnArray);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('transactions.title')}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{t('transactions.subtitle')}</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 shadow-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-slate-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('transactions.date')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('transactions.user')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('transactions.type')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('transactions.amount')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('transactions.status')}</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                                {t('transactions.noTransactions')}
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.map((txn) => (
                                            <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(txn.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{txn.user?.name || 'Unknown'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-medium shadow-sm border ${
                                                        txn.type === 'boost' ? 'bg-primary/5 text-primary border-primary/10' :
                                                        txn.type === 'donation' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                        'bg-gray-50 text-gray-700 border-gray-100'
                                                    }`}>
                                                        {t(`community.${txn.type}`, txn.type)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                                                    {txn.currency?.toUpperCase()} {txn.amount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                                                        txn.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        txn.status === 'failed' ? 'bg-red-100 text-red-700' :
                                                        'bg-primary/10 text-primary'
                                                    }`}>
                                                        {t(`transactions.${txn.status}`, txn.status)}
                                                    </span>
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
        </DashboardLayout>
    );
}

export default Transactions;
