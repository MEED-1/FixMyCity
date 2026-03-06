import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import { toast } from 'react-toastify';
import { XMarkIcon, BoltIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const BOOST_LEVELS = [
    {
        id: 'basic',
        name: 'Basic Boost',
        price: 5,
        duration: '24 hours',
        description: 'Standard visibility increase in your local area.',
        badge: '🟠',
        bgGradient: 'from-orange-500/10 to-transparent',
        borderColor: 'border-orange-500',
        textColor: 'text-orange-600 dark:text-orange-400',
        dotColor: 'bg-orange-500'
    },
    {
        id: 'premium',
        name: 'Premium Boost',
        price: 10,
        duration: '48 hours',
        description: 'High priority visibility across adjacent neighborhoods.',
        badge: '🔥',
        bgGradient: 'from-amber-500/10 to-transparent',
        borderColor: 'border-amber-500',
        textColor: 'text-amber-600 dark:text-amber-400',
        dotColor: 'bg-amber-500',
        popular: true
    },
    {
        id: 'super',
        name: 'Super Boost',
        price: 20,
        duration: '72 hours',
        description: 'Maximum visibility city-wide with urgent notifications.',
        badge: '💎',
        bgGradient: 'from-purple-500/10 to-transparent',
        borderColor: 'border-purple-500',
        textColor: 'text-purple-600 dark:text-purple-400',
        dotColor: 'bg-purple-500'
    },
];

function BoostModal({ isOpen, onClose, itemId, itemType }) {
    const { t } = useTranslation();
    const [selectedLevel, setSelectedLevel] = useState('premium');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBoost = async () => {
        setLoading(true);
        try {
            const { url } = await paymentService.createBoostSession({
                boosted_item_id: itemId,
                boosted_item_type: itemType,
                boost_level: selectedLevel,
            });
            window.location.href = url;
        } catch (error) {
            console.error(error);
            toast.error(t('boostModal.error', 'Failed to initialize payment'));
            setLoading(false);
        }
    };

    const selectedOption = BOOST_LEVELS.find(l => l.id === selectedLevel);

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
                onClick={!loading ? onClose : undefined}
            ></div>

            {}
            <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0a0a] border border-border/10 rounded-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 outline-none flex flex-col max-h-[90vh]">

                {}
                <div className="px-6 py-5 border-b border-border/5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <BoltIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground" id="modal-title">
                                {t('boostModal.title', 'Boost this Post')}
                            </h3>
                            <p className="text-xs text-muted-foreground font-medium mt-0.5">
                                {t('boostModal.subtitle', 'Increase visibility and reach more people.')}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="w-8 h-8 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {}
                <div className="p-6 overflow-y-auto scrollbar-hide">
                    <div className="space-y-3">
                        {BOOST_LEVELS.map((level) => {
                            const isSelected = selectedLevel === level.id;

                            return (
                                <div
                                    key={level.id}
                                    onClick={() => !loading && setSelectedLevel(level.id)}
                                    className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${isSelected
                                        ? `${level.borderColor} bg-gradient-to-r ${level.bgGradient} shadow-md scale-[1.02]`
                                        : 'border-border/10 hover:border-border/30 bg-surface dark:bg-black/20'
                                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {level.popular && (
                                        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl tracking-widest uppercase shadow-sm">
                                            Most Popular
                                        </div>
                                    )}

                                    {}
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? level.borderColor : 'border-muted-foreground/30'
                                        }`}>
                                        {isSelected && <div className={`w-2.5 h-2.5 rounded-full ${level.dotColor}`} />}
                                    </div>

                                    {}
                                    <div className="text-2xl shrink-0 drop-shadow-sm">{level.badge}</div>

                                    {}
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h4 className={`text-sm font-bold ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>
                                                {level.name}
                                            </h4>
                                            <span className="text-base font-extrabold text-foreground shrink-0">
                                                {level.price} <span className="text-[10px] font-semibold text-muted-foreground">DH</span>
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{level.description}</p>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-1.5 ${isSelected ? level.textColor : 'text-muted-foreground/50'}`}>
                                            {level.duration} Visibility
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {}
                <div className="p-6 bg-muted/30 border-t border-border/5 shrink-0">
                    <button
                        onClick={handleBoost}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 transition-all focus:outline-none focus:ring-4 focus:ring-primary/20 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>{t('boostModal.processing', 'Processing Secure Payment...')}</span>
                            </>
                        ) : (
                            <>
                                <CheckCircleIcon className="w-5 h-5" />
                                <span>{t('boostModal.pay', 'Pay')} {selectedOption.price} DH {t('boostModal.securely', 'Securely')}</span>
                            </>
                        )}
                    </button>
                    <p className="text-[10px] font-medium text-center text-muted-foreground mt-3 flex items-center justify-center gap-1.5 uppercase tracking-wider">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                        </svg>
                        Secured by Stripe
                    </p>
                </div>
            </div>
        </div>
    );
}

export default BoostModal;
