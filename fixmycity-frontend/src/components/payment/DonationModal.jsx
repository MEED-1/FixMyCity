import React, { useState } from 'react';
import { paymentService } from '../../services/paymentService';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

function DonationModal({ isOpen, onClose, helpRequestId, helpRequestTitle }) {
    const { t } = useTranslation();
    const [amount, setAmount] = useState(50);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleDonate = async (e) => {
        e.preventDefault();
        if (amount < 10) {
            toast.error(t('donation.minAmountError'));
            return;
        }

        setLoading(true);
        try {
            const { url } = await paymentService.createDonationSession({
                help_request_id: helpRequestId,
                amount: parseFloat(amount),
                is_anonymous: isAnonymous,
                message: message,
            });
            window.location.href = url;
        } catch (error) {
            console.error(error);
            toast.error(t('donation.error'));
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <form onSubmit={handleDonate}>
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                            <span className="text-2xl">💖</span>
                        </div>
                        <div className="mt-3 text-center sm:mt-5">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                {t('donation.title', { title: helpRequestTitle })}
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    {t('donation.subtitle')}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">{t('donation.amountLabel')}</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">DH</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="amount"
                                        id="amount"
                                        className="focus:ring-primary focus:border-primary block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                                        placeholder="0.00"
                                        min="10"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">{t('donation.messageLabel')}</label>
                                <div className="mt-1">
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={3}
                                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border border-gray-300 rounded-md"
                                        placeholder={t('donation.messagePlaceholder')}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="anonymous"
                                    name="anonymous"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                />
                                <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-900">
                                    {t('donation.anonymousLabel')}
                                </label>
                            </div>
                        </div>

                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:col-start-2 sm:text-sm"
                                disabled={loading}
                            >
                                {loading ? t('donation.processing') : t('donation.submitBtn', { amount })}
                            </button>
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:col-start-1 sm:text-sm"
                                onClick={onClose}
                                disabled={loading}
                            >
                                {t('donation.cancel')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DonationModal;
