import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export default function PaymentSuccess() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            toast.success(t('payment.success', 'Payment successful! Thank you.'));
        }
    }, [sessionId, t]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full bg-surface border border-border/10 rounded-3xl p-8 text-center shadow-xl">
                <div className="mx-auto w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircleIcon className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Payment Successful!</h2>
                <p className="text-muted-foreground mb-8">
                    Your transaction has been securely processed. Thank you for your contribution to the community.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="w-full py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
                >
                    Return to Homepage
                </button>
            </div>
        </div>
    );
}
