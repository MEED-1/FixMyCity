import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BoostModal from '../payment/BoostModal';
import useAuthStore from '../../store/useAuthStore';
import { toast } from 'react-toastify';
import { issueService } from '../../services/issueService';
import TranslateButton from '../common/TranslateButton';
import { useTranslateContent } from '../../hooks/useTranslateContent';
import { useTranslation } from 'react-i18next';

function IssueCard({ issue, onUpvote, isOwner }) {
    const { user, isAuthenticated } = useAuthStore();
    const isAdmin = user?.role === 'admin';
    const actualIsOwner = isOwner || (isAuthenticated && user && issue && (user.id == issue.user_id || user.id == issue.user?.id || user.id == issue.reporter_id));
    const { t } = useTranslation();
    const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);

    const { displayFields, isTranslating, isTranslated, toggleTranslation } = useTranslateContent({
        title: issue.title || '',
        description: issue.description || '',
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'reported': return 'bg-yellow-100 text-yellow-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'resolved': return 'bg-primary/10 text-primary';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getBoostBadge = (level) => {
        switch (level) {
            case 'basic': return '🟠';
            case 'premium': return '🔥';
            case 'super': return '💎';
            default: return null;
        }
    };

    const isActivelyBoosted = issue.current_boost_level &&
        issue.boost_expires_at &&
        new Date(issue.boost_expires_at) > new Date();

    const isApproved = issue.status !== 'reported';

    const handleDelete = async (e) => {
        e.preventDefault(); // Prevent link navigation
        if (!window.confirm('Are you sure you want to delete this issue? This cannot be undone.')) return;
        try {
            await issueService.delete(issue.id || issue._id);
            toast.success('Issue deleted successfully');
            if (window.location.pathname.includes('/issues/mine')) {
                window.location.reload(); // Simple way to refresh the list
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete');
        }
    };

    return (
        <>
            <div className={`card-standard group flex flex-col h-full hover:shadow-lg transition-all duration-300 p-3 bg-white dark:bg-[#121212] ${isActivelyBoosted ? 'ring-2 ring-amber-400 dark:ring-amber-500/50 shadow-amber-500/20' : ''}`}>

                {}
                <div className="relative h-40 bg-muted shrink-0 overflow-hidden rounded-2xl mb-3">
                    {issue.photos && issue.photos.length > 0 ? (
                        <img
                            src={issue.photos[0]}
                            alt={issue.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground bg-muted">
                            <span className="text-[10px] font-semibold tracking-widest uppercase opacity-40">{t('issueCard.noImage', 'No Image')}</span>
                        </div>
                    )}

                    {}
                    {actualIsOwner && !isActivelyBoosted && isApproved && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsBoostModalOpen(true);
                            }}
                            className="absolute top-2.5 right-2.5 bg-primary/95 hover:bg-primary text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110 z-10 border border-white/20"
                            title={t('issueCard.boostMyPost', 'Boost my post')}
                        >
                            <svg className="w-4 h-4 text-amber-300 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </button>
                    )}

                    {}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md bg-white/80 dark:bg-black/60 shadow-sm ${issue.status === 'resolved' ? 'text-primary' :
                            issue.status === 'in_progress' ? 'text-blue-600' : 'text-amber-600'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1 ${issue.status === 'resolved' ? 'bg-primary' :
                                issue.status === 'in_progress' ? 'bg-blue-500' : 'bg-amber-500'
                                }`} />
                            {t(`dashboard.status.${issue.status}`, issue.status.replace('_', ' '))}
                        </span>

                        {isActivelyBoosted && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-md animate-pulse">
                                {getBoostBadge(issue.current_boost_level)} Boosted
                            </span>
                        )}
                    </div>
                </div>

                {}
                <div className="flex flex-col flex-1 px-0.5">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        {t(`reportIssue.categories.${issue.category}`, issue.category)} · {issue.user?.name || t('issueDetails.anonymous', 'Anonymous')}
                    </p>

                    <h3 className="text-base font-bold text-foreground leading-snug mb-1.5 line-clamp-2 flex items-center gap-1">
                        <Link to={`/urban-issues/${issue.id}`} className="hover:text-primary transition-colors flex-1">
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

                    {}
                    <div className="flex items-center gap-2 mb-3 mt-auto">
                        <div className="flex-1 bg-muted rounded-xl py-1.5 px-2 text-center">
                            <span className="text-[10px] text-muted-foreground block">{t('issueCard.upvotes', 'Upvotes')}</span>
                            <span className="text-sm font-bold text-foreground">{issue.upvotes || 0}</span>
                        </div>
                        <div className="flex-1 bg-muted rounded-xl py-1.5 px-2 text-center">
                            <span className="text-[10px] text-muted-foreground block">{t('issueCard.boost', 'Boost')}</span>
                            <span className="text-sm font-bold text-foreground">{isActivelyBoosted ? getBoostBadge(issue.current_boost_level) : '—'}</span>
                        </div>
                    </div>

                    {}
                    {isAdmin ? (
                        <button onClick={handleDelete} className="w-full py-2 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 font-semibold rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-xs">
                            {t('issueCard.delete', 'Delete')}
                        </button>
                    ) : actualIsOwner ? (
                        <div className="flex flex-col gap-1">
                            {(isActivelyBoosted || ['in_progress', 'resolved'].includes(issue.status)) ? (
                                <div className="text-[10px] text-center text-muted-foreground p-1.5 bg-muted/50 rounded-lg">
                                    {isActivelyBoosted
                                        ? "Cannot edit a boosted issue"
                                        : "Cannot edit after work has started"}
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Link to={`/urban-issues/edit/${issue.id}`} className="flex-1 py-2 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 font-semibold rounded-xl hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors text-xs text-center flex items-center justify-center">
                                        {t('issueCard.edit', 'Edit')}
                                    </Link>
                                    <button onClick={handleDelete} className="flex-1 py-2 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 font-semibold rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-xs flex items-center justify-center">
                                        {t('issueCard.delete', 'Delete')}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    if (!isAuthenticated) return toast.info(t('issueCard.loginRequired', 'Please log in.'));
                                    setIsBoostModalOpen(true);
                                }}
                                disabled={isActivelyBoosted || !isApproved}
                                className={`flex-1 py-2 font-semibold rounded-xl transition-opacity text-xs ${(isActivelyBoosted || !isApproved) ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:opacity-90'}`}
                            >
                                {!isApproved
                                    ? t('issueCard.pending', 'Pending')
                                    : isActivelyBoosted
                                        ? t('issueCard.boosted', 'Boosted')
                                        : t('issueCard.boost', 'Boost')}
                            </button>
                            <button
                                onClick={() => {
                                    if (!isAuthenticated) return toast.info(t('issueCard.loginRequired', 'Please log in.'));
                                    onUpvote(issue.id);
                                }}
                                className="flex-1 py-2 bg-muted text-foreground font-semibold rounded-xl hover:bg-border transition-colors text-xs"
                            >
                                ▲ {t('issueCard.upvote', 'Upvote')}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <BoostModal
                isOpen={isBoostModalOpen}
                onClose={() => setIsBoostModalOpen(false)}
                itemId={issue.id}
                itemType="urban_issue"
            />
        </>
    );
}

export default IssueCard;
