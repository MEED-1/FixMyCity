import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export default function PaymentCancel() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full bg-surface border border-border/10 rounded-3xl p-8 text-center shadow-xl">
                <div className="mx-auto w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <XCircleIcon className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Payment Cancelled</h2>
                <p className="text-muted-foreground mb-8">
                    Your transaction was cancelled and you have not been charged.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 py-3 px-4 bg-muted text-muted-foreground font-bold rounded-xl hover:bg-muted/80 transition-colors"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
                    >
                        Homepage
                    </button>
                </div>
            </div>
        </div>
    );
}
