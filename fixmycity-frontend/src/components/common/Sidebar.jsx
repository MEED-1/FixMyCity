import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { useTranslation } from 'react-i18next';
import {
    HomeIcon,
    ListBulletIcon,
    PlusCircleIcon,
    UserGroupIcon,
    UserCircleIcon,
    BellIcon,
    ArrowRightOnRectangleIcon,
    BanknotesIcon,
    ShieldCheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    DocumentChartBarIcon,
    TagIcon,
    BuildingOffice2Icon,
    HeartIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, setIsOpen, isMobile, collapsed = false, onToggleCollapse }) => {
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuthStore();
    const isAdmin = user?.role === 'admin';
    const isAgent = user?.role === 'agent';
    const isRTL = i18n.language === 'ar';

    const citizenNavigation = [
        { name: t('sidebar.dashboard', 'Overview'), path: '/dashboard', icon: HomeIcon },
        { name: t('sidebar.myIssues', 'My Reports'), path: '/issues/mine', icon: ListBulletIcon },
        { name: t('sidebar.myHelp', 'My Help Requests'), path: '/community', icon: UserGroupIcon },
    ];

    const agentNavigation = [
        { name: t('sidebar.dashboard', 'Overview'), path: '/agent/dashboard', icon: HomeIcon },
        { name: t('sidebar.reports', 'Monthly Reports'), path: '/agent/reports', icon: DocumentChartBarIcon },
    ];

    const adminNavigation = [
        { name: t('admin.dashboard', 'Admin Dashboard'), path: '/admin/dashboard', icon: HomeIcon },
        { name: t('admin.allIssues', 'All Issues'), path: '/admin/issues', icon: ShieldCheckIcon },
        { name: t('admin.transactions', 'Transactions'), path: '/admin/transactions', icon: BanknotesIcon },
        { name: t('admin.users', 'Users'), path: '/admin/users', icon: UserGroupIcon },
        { name: t('admin.categories', 'Categories'), path: '/admin/categories', icon: TagIcon },
        { name: t('admin.municipalities', 'Municipalities'), path: '/admin/municipalities', icon: BuildingOffice2Icon },
        { name: t('admin.helpRequests', 'Help Requests'), path: '/admin/community-help', icon: HeartIcon },
    ];

    const navigation = isAdmin ? adminNavigation : (isAgent ? agentNavigation : citizenNavigation);

    const sidebarWidth = isMobile ? 'w-64' : (collapsed ? 'w-20' : 'w-60');

    const CollapseIcon = isRTL
        ? (collapsed ? ChevronLeftIcon : ChevronRightIcon)
        : (collapsed ? ChevronRightIcon : ChevronLeftIcon);

    const getMobileTransform = () => {
        if (!isMobile) return 'translate-x-0';
        if (isOpen) return 'translate-x-0';
        return isRTL ? 'translate-x-full' : '-translate-x-full';
    };

    const activeBorder = isRTL ? 'border-r-[3px]' : 'border-l-[3px]';

    return (
        <aside
            className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 ${sidebarWidth} bg-surface/95 backdrop-blur-xl ${isRTL ? 'border-l' : 'border-r'} border-border flex-col transition-all duration-300 ${getMobileTransform()} flex`}
        >
            {}
            <div className={`h-20 flex items-center px-6 ${isRTL ? 'flex-row-reverse' : ''} justify-between`}>
                <div className={`flex items-center gap-2 overflow-hidden ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shrink-0">
                        F
                    </div>
                    {!collapsed && (
                        <span className="text-xl font-bold tracking-tight text-foreground whitespace-nowrap">
                            FixMyCity
                        </span>
                    )}
                </div>

                {}
                {!isMobile && onToggleCollapse && (
                    <button
                        onClick={onToggleCollapse}
                        className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
                        title={collapsed ? 'Expand' : 'Collapse'}
                    >
                        <CollapseIcon className="w-4 h-4" />
                    </button>
                )}

                {}
                {isMobile && (
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        {isRTL ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />}
                    </button>
                )}
            </div>

            {}
            <nav className="flex-1 px-3 py-8 space-y-2 overflow-y-auto scrollbar-hide">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => isMobile && setIsOpen(false)}
                        title={collapsed ? item.name : undefined}
                        className={({ isActive }) =>
                            `flex items-center gap-3 ${collapsed && !isMobile ? 'justify-center px-2' : 'px-4'} ${isRTL ? 'flex-row-reverse text-right' : ''} py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                ? `bg-primary/5 text-primary font-bold shadow-sm ring-1 ring-border/50`
                                : `text-muted-foreground hover:bg-muted/50 hover:text-foreground border-transparent`
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 shrink-0" />
                        {(!collapsed || isMobile) && item.name}
                    </NavLink>
                ))}
            </nav>

            {}
            <div className="p-3 border-t border-border space-y-2">
                <NavLink
                    to="/profile"
                    onClick={() => isMobile && setIsOpen(false)}
                    title={collapsed ? t('sidebar.profile', 'Profile') : undefined}
                    className={({ isActive }) =>
                        `flex items-center gap-3 ${collapsed && !isMobile ? 'justify-center px-2' : 'px-4'} ${isRTL ? 'flex-row-reverse text-right' : ''} py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                            ? `bg-primary/15 text-primary font-semibold ${activeBorder} border-primary`
                            : `text-muted-foreground hover:bg-muted hover:text-foreground ${activeBorder} border-transparent`
                        }`
                    }
                >
                    <UserCircleIcon className="w-5 h-5 shrink-0" />
                    {(!collapsed || isMobile) && t('sidebar.profile', 'Profile')}
                </NavLink>

                <NavLink
                    to="/notifications"
                    onClick={() => isMobile && setIsOpen(false)}
                    title={collapsed ? t('sidebar.notifications', 'Notifications') : undefined}
                    className={({ isActive }) =>
                        `flex items-center gap-3 ${collapsed && !isMobile ? 'justify-center px-2' : 'px-4'} ${isRTL ? 'flex-row-reverse text-right' : ''} py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                            ? `bg-primary/15 text-primary font-semibold ${activeBorder} border-primary`
                            : `text-muted-foreground hover:bg-muted hover:text-foreground ${activeBorder} border-transparent`
                        }`
                    }
                >
                    <BellIcon className="w-5 h-5 shrink-0" />
                    {(!collapsed || isMobile) && t('sidebar.notifications', 'Notifications')}
                </NavLink>

                <button
                    onClick={logout}
                    title={collapsed ? t('sidebar.logout', 'Log out') : undefined}
                    className={`w-full flex items-center gap-3 ${collapsed && !isMobile ? 'justify-center px-2' : 'px-4'} ${isRTL ? 'flex-row-reverse text-right' : ''} py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200`}
                >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 shrink-0" />
                    {(!collapsed || isMobile) && t('sidebar.logout', 'Log out')}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
