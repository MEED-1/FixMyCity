import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { issueService } from '../../services/issueService';
import { agentService } from '../../services/agentService';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/useAuthStore';
import BoostModal from '../../components/payment/BoostModal';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Navbar from '../../components/common/Navbar';
import TranslateButton from '../../components/common/TranslateButton';
import { useTranslateContent } from '../../hooks/useTranslateContent';
import { useTranslation } from 'react-i18next';
import {
    ArrowLeftIcon,
    MapPinIcon,
    CalendarDaysIcon,
    UserCircleIcon,
    TagIcon,
    ArrowUpIcon,
    BoltIcon,
    TrashIcon,
    ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';

function IssueDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();
    const { t } = useTranslation();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [resolvedPhotos, setResolvedPhotos] = useState(null);
    const [isResolving, setIsResolving] = useState(false);

    const isAdmin = user?.role === 'admin';
    const isAgent = user?.role === 'agent' || user?.role === 'admin';

    const { displayFields, isTranslating, isTranslated, toggleTranslation, error: translateError } = useTranslateContent({
        title: issue?.title || '',
        description: issue?.description || '',
    });

    useEffect(() => {
        fetchIssue();
    }, [id]);

    const fetchIssue = async () => {
        try {
            const data = await issueService.getById(id);
            setIssue(data);
        } catch (error) {
            console.error(error);
            toast.error(t('issueDetails.failedLoad', 'Failed to load issue details'));
            navigate('/issues');
        } finally {
            setLoading(false);
        }
    };

    const handleUpvote = async () => {
        if (!isAuthenticated) {
            toast.info(t('issueDetails.loginToUpvote', 'Please log in to upvote issues.'));
            return;
        }
        if (isAdmin) return;
        try {
            await issueService.upvote(id);
            toast.success(t('issueDetails.upvoted', 'Upvoted!'));
            fetchIssue();
        } catch (error) {
            toast.error(t('issueDetails.failedUpvote', 'Failed to upvote'));
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this issue? This cannot be undone.')) return;
        try {
            await issueService.delete(id);
            toast.success('Issue deleted successfully.');
            navigate('/issues/mine');
        } catch (error) {
            toast.error(error.response?.data?.error || t('issueDetails.failedDelete', 'Failed to delete'));
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.info(t('issueDetails.loginToUpvote', 'Please log in to comment.'));
            return;
        }
        if (!comment.trim()) return;

        setSubmittingComment(true);
        try {
            await issueService.addComment(id, comment);
            toast.success(t('issueDetails.commentAdded', 'Comment added!'));
            setComment('');
            fetchIssue();
        } catch (error) {
            toast.error(t('issueDetails.failedComment', 'Failed to post comment'));
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleResolveIssue = async () => {
        if (!resolvedPhotos || resolvedPhotos.length === 0) {
            toast.error(t('issueDetails.selectPhotosToResolve', 'Please select at least one photo to mark as resolved.'));
            return;
        }

        setIsResolving(true);
        try {
            const formData = new FormData();
            formData.append('status', 'resolved');
            Array.from(resolvedPhotos).forEach(file => {
                formData.append('resolved_photos[]', file);
            });

            await agentService.updateStatusWithPhotos(issue._id || issue.id, formData);
            toast.success(t('issueDetails.markedResolved', 'Issue marked as resolved!'));
            setResolvedPhotos(null);
            fetchIssue();
        } catch (error) {
            toast.error(t('issueDetails.failedToResolve', 'Failed to mark as resolved.'));
        } finally {
            setIsResolving(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'reported': return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/20';
            case 'in_progress': return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/20';
            case 'resolved': return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20';
            case 'rejected': return 'bg-red-500/15 text-red-600 dark:text-red-400 ring-red-500/20';
            default: return 'bg-muted text-muted-foreground ring-border';
        }
    };

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'critical': return 'text-red-500';
            case 'high': return 'text-orange-500';
            case 'medium': return 'text-yellow-500';
            default: return 'text-green-500';
        }
    };

    const ContentWrapper = ({ children }) => {
        if (isAuthenticated) {
            return <DashboardLayout>{children}</DashboardLayout>;
        }
        return (
            <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <Navbar />
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <ContentWrapper>
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
                    <p className="text-sm text-muted-foreground">{t('common.loading', 'Loading...')}</p>
                </div>
            </ContentWrapper>
        );
    }

    if (!issue) return null;

    return (
        <ContentWrapper>
            <div className="max-w-6xl mx-auto">
                {}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    {t('issueDetails.back', 'Back')}
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {}
                    <div className="lg:col-span-2 space-y-6">

                        {}
                        <div className="card-standard overflow-hidden">
                            <div className="relative h-72 sm:h-80 bg-muted">
                                {issue.photos && issue.photos.length > 0 ? (
                                    <img
                                        src={issue.photos[0]}
                                        alt={issue.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <span className="text-5xl opacity-30">📷</span>
                                            <p className="text-xs text-muted-foreground mt-2">{t('issueCard.noImage', 'No Image')}</p>
                                        </div>
                                    </div>
                                )}

                                {}
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                                {}
                                <div className="absolute top-4 left-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1 backdrop-blur-md ${getStatusStyle(issue.status)}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${issue.status === 'resolved' ? 'bg-emerald-500' :
                                            issue.status === 'in_progress' ? 'bg-amber-500' : 'bg-amber-500'
                                            }`} />
                                        {t(`dashboard.status.${issue.status}`, issue.status.replace('_', ' '))}
                                    </span>
                                </div>

                                {}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-lg">
                                        {displayFields.title}
                                    </h1>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="card-standard p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    {t('issueDetails.description', 'Description')}
                                </h2>
                                <TranslateButton
                                    onClick={toggleTranslation}
                                    isTranslated={isTranslated}
                                    isTranslating={isTranslating}
                                    error={translateError}
                                />
                            </div>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {displayFields.description}
                            </p>
                        </div>

                        {}
                        <div className="card-standard p-6">
                            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6">
                                <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-muted-foreground" />
                                {t('issueDetails.comments', 'Comments')}
                                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                                    {issue.comments?.length || 0}
                                </span>
                            </h2>

                            <div className="space-y-4 mb-6">
                                {issue.comments?.map((c, index) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="shrink-0">
                                            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm ring-1 ring-primary/20">
                                                {c.user?.name?.charAt(0) || c.user_name?.charAt(0) || '?'}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="bg-muted/50 rounded-2xl rounded-tl-md p-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-sm text-foreground">{c.user?.name || c.user_name || t('issueDetails.user', 'User')}</span>
                                                    <span className="text-[10px] text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{c.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!issue.comments || issue.comments.length === 0) && (
                                    <div className="text-center py-8">
                                        <ChatBubbleLeftEllipsisIcon className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
                                        <p className="text-sm text-muted-foreground">{t('issueDetails.noComments', 'No comments yet. Be the first to discuss this issue.')}</p>
                                    </div>
                                )}
                            </div>

                            {}
                            <form onSubmit={handleComment} className="relative">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder={t('issueDetails.addComment', 'Add a comment...')}
                                    className="w-full rounded-xl border border-border bg-muted/30 text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary p-4 pr-28 min-h-[80px] resize-none transition-colors placeholder:text-muted-foreground/50"
                                    required
                                ></textarea>
                                <button
                                    type="submit"
                                    disabled={submittingComment || !comment.trim()}
                                    className="absolute bottom-3 right-3 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold disabled:opacity-40 hover:opacity-90 transition-opacity"
                                >
                                    {submittingComment ? t('issueDetails.posting', 'Posting...') : t('issueDetails.postComment', 'Post Comment')}
                                </button>
                            </form>
                        </div>
                    </div>

                    {}
                    <div className="space-y-6">

                        {}
                        <div className="card-standard p-5 space-y-3">
                            {isAdmin ? (
                                <button
                                    onClick={handleDelete}
                                    className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 font-semibold py-3 rounded-xl text-sm transition-colors"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                    {t('issueDetails.deleteIssue', 'Delete Issue')}
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleUpvote}
                                        className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 font-semibold py-3 rounded-xl text-sm transition-colors"
                                    >
                                        <ArrowUpIcon className="w-4 h-4" />
                                        {t('issueCard.upvote', 'Upvote')} · {issue.upvotes || 0}
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!isAuthenticated) {
                                                toast.info(t('issueDetails.loginToBoost', 'Please log in to boost issues.'));
                                                return;
                                            }
                                            setIsBoostModalOpen(true);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 font-semibold py-3 rounded-xl text-sm transition-colors"
                                    >
                                        <BoltIcon className="w-4 h-4" />
                                        ⚡ {t('issueDetails.boost', 'Boost')}
                                    </button>
                                </>
                            )}

                            {}
                            {user?.role === 'citizen' && user?.id === issue?.user_id && (
                                <div className="pt-3 mt-3 border-t border-border">
                                    {(issue.boost_status === 'active' || ['in_progress', 'resolved'].includes(issue.status)) ? (
                                        <div className="text-xs text-center text-muted-foreground p-2 bg-muted/50 rounded-lg">
                                            {issue.boost_status === 'active'
                                                ? "Cannot edit or delete a boosted issue."
                                                : "Cannot edit or delete after work has started."}
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/urban-issues/edit/${issue._id || issue.id}`)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 font-semibold py-2.5 rounded-xl text-sm transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 font-semibold py-2.5 rounded-xl text-sm transition-colors"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {}
                        <div className="card-standard p-5">
                            <h3 className="text-sm font-bold text-foreground mb-4">{t('community.details', 'Details')}</h3>
                            <div className="space-y-4">
                                {}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <UserCircleIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Author</p>
                                        <p className="text-sm font-semibold text-foreground">{issue.user?.name || t('issueDetails.anonymous', 'Anonymous')}</p>
                                    </div>
                                </div>

                                {}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <TagIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{t('reportIssue.form.category', 'Category')}</p>
                                        <p className="text-sm font-semibold text-foreground">{t(`reportIssue.categories.${issue.category}`, issue.category)}</p>
                                    </div>
                                </div>

                                {}
                                {issue.priority && (
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 ${getPriorityStyle(issue.priority)}`}>
                                            <BoltIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{t('reportIssue.form.priority', 'Priority')}</p>
                                            <p className="text-sm font-semibold text-foreground">{t(`reportIssue.priorities.${issue.priority}`, issue.priority)}</p>
                                        </div>
                                    </div>
                                )}

                                {}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                                        <CalendarDaysIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{t('issueDetails.postedOn', 'Posted on')}</p>
                                        <p className="text-sm font-semibold text-foreground">{new Date(issue.createdAt || issue.created_at || Date.now()).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {}
                                {issue.location && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                                            <MapPinIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{t('community.location', 'Location')}</p>
                                            <p className="text-sm font-semibold text-foreground">
                                                {typeof issue.location === 'string'
                                                    ? issue.location
                                                    : issue.location?.coordinates
                                                        ? `${issue.location.coordinates[1]?.toFixed(4)}, ${issue.location.coordinates[0]?.toFixed(4)}`
                                                        : '—'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {}
                        {issue.boost_level > 0 && (
                            <div className="card-standard p-5 bg-linear-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">⚡ Boost Level</span>
                                    <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{issue.boost_level}</span>
                                </div>
                            </div>
                        )}

                        {}
                        {issue.photos && issue.photos.length > 1 && (
                            <div className="card-standard p-5">
                                <h3 className="text-sm font-bold text-foreground mb-3">{t('reportIssue.form.photos', 'Photos')}</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {issue.photos.map((photo, i) => (
                                        <img
                                            key={i}
                                            src={photo}
                                            alt={`${issue.title} ${i + 1}`}
                                            className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {}
                        {issue.status === 'resolved' && issue.resolved_photos && issue.resolved_photos.length > 0 && (
                            <div className="card-standard p-5 bg-linear-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-500/20 mt-6">
                                <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-3">{t('issueDetails.resolvedPictures', 'Resolved Pictures')}</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {issue.resolved_photos.map((photo, i) => (
                                        <img
                                            key={`resolved-${i}`}
                                            src={photo}
                                            alt={`${issue.title} resolved ${i + 1}`}
                                            className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {}
                        {isAgent && issue.status !== 'resolved' && (
                            <div className="card-standard p-5 mt-6 border-primary/20 bg-primary/5 dark:bg-primary/10">
                                <h3 className="text-sm font-bold text-primary mb-3">{t('issueDetails.markResolved', 'Mark as Resolved')}</h3>
                                <p className="text-xs text-muted-foreground mb-3">{t('issueDetails.uploadProof', 'Upload proof of resolution pictures.')}</p>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => setResolvedPhotos(e.target.files)}
                                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 mb-3"
                                />
                                <button
                                    onClick={handleResolveIssue}
                                    disabled={isResolving || !resolvedPhotos || resolvedPhotos.length === 0}
                                    className="w-full py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition disabled:opacity-50"
                                >
                                    {isResolving ? t('common.loading', 'Uploading...') : t('issueDetails.resolveIssueBtn', 'Resolve & Upload')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <BoostModal
                isOpen={isBoostModalOpen}
                onClose={() => setIsBoostModalOpen(false)}
                itemId={issue._id || issue.id}
                itemType="urban_issue"
            />
        </ContentWrapper>
    );
}

export default IssueDetails;
