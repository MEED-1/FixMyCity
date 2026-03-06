import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import DashboardLayout from '../../components/layout/DashboardLayout';
import IssuesMap from '../../components/map/IssuesMap';
import { issueService } from '../../services/issueService';
import { useTranslation } from 'react-i18next';
import { PlusCircleIcon, ListBulletIcon, MapIcon, UserCircleIcon, CheckCircleIcon, WrenchIcon, BoltIcon, DocumentTextIcon, EyeIcon } from '@heroicons/react/24/outline';

function Dashboard() {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await issueService.getAll();
                setIssues(data.data || []);
            } catch (e) {
                console.error("Dashboard load failed", e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const userIssues = issues.filter(issue => issue.user_id === user?.id || issue.user?.id === user?.id || issue.reporter_id === user?.id);
    const inProgressCount = userIssues.filter(issue => issue.status === 'in_progress').length;
    const resolvedCount = userIssues.filter(issue => issue.status === 'resolved').length;

    const recentActivity = userIssues.slice(0, 5).map(issue => ({
        id: issue.id,
        icon: issue.status === 'resolved' ? '✅' : (issue.status === 'in_progress' ? '🚧' : '📍'),
        title: "Status Update",
        text: `Your issue "${issue.title}" is now ${issue.status?.replace('_', ' ')}`,
        time: "Recently",
        bg: issue.status === 'resolved' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'
    }));

    if (recentActivity.length === 0) {
        recentActivity.push({
            icon: '👋', title: "Welcome!", text: "You haven't reported any issues yet.", time: "Just now", bg: 'bg-primary/10 text-primary'
        });
    }

    return (
        <DashboardLayout>
            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">

                {}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[420px]">

                    {}
                    <div className="bg-surface/50 backdrop-blur-md rounded-3xl border border-border/10 p-6 flex flex-col shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-2xl font-bold shadow-md">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground">{user?.name}</h1>
                                <p className="text-sm font-medium text-muted-foreground">{t('dashboard.personalSummary', 'Personal Summary')}</p>
                            </div>
                            <Link to="/profile" className="ml-auto px-4 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-full transition-colors">
                                Manage
                            </Link>
                        </div>

                        <div className="flex-1 flex flex-col justify-around space-y-4">
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <DocumentTextIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-foreground">Total Reports</span>
                                </div>
                                <span className="text-2xl font-extrabold text-foreground">{userIssues.length}</span>
                            </div>

                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                        <WrenchIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-foreground">In Progress</span>
                                </div>
                                <span className="text-2xl font-extrabold text-foreground">{inProgressCount}</span>
                            </div>

                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                                        <CheckCircleIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-foreground">Resolved</span>
                                </div>
                                <span className="text-2xl font-extrabold text-foreground">{resolvedCount}</span>
                            </div>

                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                                        <BoltIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-foreground">Boosts Used</span>
                                </div>
                                <span className="text-2xl font-extrabold text-foreground">{user?.boosts_used || 0}</span>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="lg:col-span-2 bg-surface/50 backdrop-blur-md rounded-3xl border border-border/10 overflow-hidden relative p-1 shadow-sm flex flex-col h-[400px] lg:h-auto">
                        <div className="absolute top-5 left-5 right-5 z-10 flex items-center justify-between pointer-events-none">
                            <div className="bg-surface/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-sm border border-border/10 pointer-events-auto">
                                <span className="font-bold text-sm text-foreground flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    {t('dashboard.cityMap', 'Live City Map')}
                                </span>
                            </div>
                            <Link to="/map" className="bg-surface/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-sm border border-border/10 text-xs font-bold text-foreground hover:text-primary transition-colors pointer-events-auto flex items-center gap-2">
                                <MapIcon className="w-4 h-4" /> Expand
                            </Link>
                        </div>
                        <div className="w-full h-full flex-1 rounded-[1.4rem] overflow-hidden bg-muted relative">
                            {loading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-surface/20 backdrop-blur-sm z-20">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : (
                                <div className="h-full w-full pointer-events-none opacity-90 transition-opacity">
                                    <IssuesMap issues={issues.slice(0, 10)} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>



                {}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-12">

                    <Link to="/report" className="bg-linear-to-br from-primary/95 to-primary/80 text-primary-foreground rounded-3xl p-5 md:p-6 flex items-center gap-4 hover:shadow-lg hover:shadow-primary/20 transition-all group active:scale-95 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <PlusCircleIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm md:text-base font-bold">Report New Issue</h3>
                            <p className="text-[11px] md:text-xs text-primary-foreground/80 font-medium mt-0.5">Start a new report</p>
                        </div>
                    </Link>

                    <Link to="/issues/mine" className="bg-surface/50 backdrop-blur-md border border-border/10 rounded-3xl p-5 md:p-6 flex items-center gap-4 hover:bg-surface/80 transition-all group active:scale-95 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <ListBulletIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm md:text-base font-bold text-foreground">View My Issues</h3>
                            <p className="text-[11px] md:text-xs text-muted-foreground font-medium mt-0.5">See all your reports</p>
                        </div>
                    </Link>

                    <Link to="/issues/mine" className="bg-surface/50 backdrop-blur-md border border-border/10 rounded-3xl p-5 md:p-6 flex items-center gap-4 hover:bg-surface/80 transition-all group active:scale-95 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <EyeIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm md:text-base font-bold text-foreground">Track an Issue</h3>
                            <p className="text-[11px] md:text-xs text-muted-foreground font-medium mt-0.5">Find latest updates</p>
                        </div>
                    </Link>

                    <Link to="/profile" className="bg-surface/50 backdrop-blur-md border border-border/10 rounded-3xl p-5 md:p-6 flex items-center gap-4 hover:bg-surface/80 transition-all group active:scale-95 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-slate-500/10 text-slate-500 dark:text-slate-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <UserCircleIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm md:text-base font-bold text-foreground">Manage Account</h3>
                            <p className="text-[11px] md:text-xs text-muted-foreground font-medium mt-0.5">Settings & profile</p>
                        </div>
                    </Link>

                </div>
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;