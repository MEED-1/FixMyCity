import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { toast } from 'react-toastify';
import { helpService } from '../../services/helpService';
import DonationModal from '../payment/DonationModal';
import TranslateButton from '../common/TranslateButton';
import { useTranslateContent } from '../../hooks/useTranslateContent';

function HelpCard({ request, isOwner }) {
    const { user, isAuthenticated } = useAuthStore();
    const isAdmin = user?.role === 'admin';
    const actualIsOwner = isOwner || (isAuthenticated && user?.id && (request.user_id === user.id || request.user?.id === user.id));
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

    const percentage = request.target_amount > 0
        ? Math.min(100, (request.current_amount / request.target_amount) * 100)
        : 0;

    const { displayFields, isTranslating, isTranslated, toggleTranslation } = useTranslateContent({
        title: request.title || '',
        description: request.description || '',
    });

    const getBoostBadge = (level) => {
        switch (level) {
            case 'basic': return '🟠';
            case 'premium': return '🔥';
            case 'super': return '💎';
            default: return null;
        }
    };

    const isActivelyBoosted = request.current_boost_level &&
        request.boost_expires_at &&
        new Date(request.boost_expires_at) > new Date();

    const isApproved = request.status !== 'pending';

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!window.confirm('Delete this request?')) return;
        try {
            toast.info('Delete functionality to be implemented');
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <>
            <div className={`card-3d group flex flex-col h-full hover:shadow-lg transition-all duration-300 p-3 bg-white dark:bg-[#121212] ${isActivelyBoosted ? 'ring-2 ring-amber-400 dark:ring-amber-500/50 shadow-amber-500/20' : ''}`}>

                {}
                <div className="relative h-40 bg-muted shrink-0 overflow-hidden rounded-2xl mb-3">
                    {request.photos && request.photos.length > 0 ? (
                        <img
                            src={request.photos[0]}
                            alt={request.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground bg-muted">
                            <span className="text-[10px] font-semibold tracking-widest uppercase opacity-40">No Image</span>
                        </div>
                    )}

                    {}
                    <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md bg-white/80 dark:bg-black/60 shadow-sm ${request.category === 'donation' ? 'text-purple-600' : 'text-blue-600'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1 ${request.category === 'donation' ? 'bg-purple-500' : 'bg-blue-500'
                                }`} />
                            {request.category}
                        </span>

                        {isActivelyBoosted && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-md animate-pulse">
                                {getBoostBadge(request.current_boost_level)} Boosted
                            </span>
                        )}
                    </div>
                </div>

                {}
                <div className="flex flex-col flex-1 px-0.5">
                    <h3 className="text-base font-bold text-foreground leading-snug mb-1.5 line-clamp-2 flex items-center gap-1">
                        <Link to={`/community-help/${request.id}`} className="hover:text-primary transition-colors flex-1">
                            {displayFields.title}
                        </Link>
                        <TranslateButton
                            onClick={toggleTranslation}
                            isTranslated={isTranslated}
                            isTranslating={isTranslating}
                            compact
                        />
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {displayFields.description}
                    </p>

                    {request.category === 'donation' ? (
                        <div className="mt-auto mb-3 bg-muted rounded-xl p-3">
                            <div className="flex justify-between text-xs font-semibold mb-2">
                                <span className="text-foreground">${request.current_amount || 0} raised</span>
                                <span className="text-muted-foreground">Goal: ${request.target_amount}</span>
                            </div>
                            <div className="w-full bg-border rounded-full h-1.5">
                                <div
                                    className="bg-primary h-1.5 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="mt-auto mb-3 flex items-center justify-between bg-muted rounded-xl p-3">
                            <span className="text-xs font-semibold text-foreground">Volunteer</span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Nearby</span>
                        </div>
                    )}

                    {}
                    {isAdmin ? (
                        <button onClick={handleDelete} className="w-full py-2 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 font-semibold rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-xs">
                            Delete
                        </button>
                    ) : actualIsOwner ? (
                        <div className="flex gap-2">
                            <Link to={`/community-help/edit/${request.id}`} className="flex-1 py-2 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 font-semibold rounded-xl hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors text-xs text-center flex items-center justify-center">
                                Edit
                            </Link>
                            <button onClick={handleDelete} className="flex-1 py-2 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 font-semibold rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-xs flex items-center justify-center">
                                Delete
                            </button>
                        </div>
                    ) : request.category === 'donation' ? (
                        <button
                            onClick={() => {
                                if (!isAuthenticated) return toast.info("Please log in.");
                                setIsDonationModalOpen(true);
                            }}
                            disabled={!isApproved}
                            className={`w-full py-2 font-semibold rounded-xl transition-opacity text-xs ${!isApproved ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:opacity-90'}`}
                        >
                            {!isApproved ? 'Pending Approval' : 'Donate Now'}
                        </button>
                    ) : (
                        <button
                            disabled={!isApproved}
                            onClick={() => {
                                if (isApproved) window.location.href = `/community-help/${request.id}`;
                            }}
                            className={`w-full py-2 font-semibold rounded-xl transition-opacity text-xs text-center items-center justify-center flex ${!isApproved ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:opacity-90'}`}
                        >
                            {!isApproved ? 'Pending Approval' : 'Volunteer'}
                        </button>
                    )}
                </div>
            </div>

            <DonationModal
                isOpen={isDonationModalOpen}
                onClose={() => setIsDonationModalOpen(false)}
                helpRequestId={request.id}
                helpRequestTitle={request.title}
            />
        </>
    );
}

export default HelpCard;
