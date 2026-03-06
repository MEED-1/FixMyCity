import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import Sidebar from '../common/Sidebar';
import ThemeToggle from '../common/ThemeToggle';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DashboardLayout = ({ children }) => {
    const { user } = useAuthStore();
    const { t, i18n } = useTranslation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    const isRTL = i18n.language === 'ar';

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) {
                setMobileSidebarOpen(false);
                setMobileNavOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sidebarWidth = isMobile ? 0 : (sidebarCollapsed ? 80 : 240);

    const marginStyle = isMobile
        ? {}
        : isRTL
            ? { marginRight: `${sidebarWidth}px` }
            : { marginLeft: `${sidebarWidth}px` };

    return (
        <div className="min-h-screen bg-background text-foreground flex font-sans transition-colors duration-500 animate-fade-in">
            {}
            <Sidebar
                isOpen={isMobile ? mobileSidebarOpen : true}
                setIsOpen={setMobileSidebarOpen}
                isMobile={isMobile}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {}
            {isMobile && mobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}

            {}
            <div
                className="flex-1 flex flex-col min-w-0 transition-all duration-300"
                style={marginStyle}
            >
                {}
                <header className={`h-16 bg-surface/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 lg:px-12 sticky top-0 z-40 transition-colors duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {}
                        {isMobile && (
                            <button
                                onClick={() => {
                                    setMobileNavOpen(!mobileNavOpen);
                                    setMobileSidebarOpen(false);
                                }}
                                className={`p-2 ${isRTL ? '-mr-2' : '-ml-2'} text-muted-foreground hover:bg-muted rounded-xl transition-colors`}
                            >
                                {mobileNavOpen ? (
                                    <XMarkIcon className="w-6 h-6" />
                                ) : (
                                    <Bars3Icon className="w-6 h-6" />
                                )}
                            </button>
                        )}

                        {}
                        {isMobile && (
                            <span className="text-xl font-bold tracking-tight text-foreground">
                                FixMyCity
                            </span>
                        )}

                        {}
                        {!isMobile && (
                            <nav className={`flex items-center space-x-8 ${isRTL ? 'mr-8 space-x-reverse' : 'ml-8'}`}>
                                <Link to="/issues" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                    {t('header.issuesList', 'Issues List')}
                                </Link>
                                <Link to="/community" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                    {t('header.communityHelp', 'Community Help')}
                                </Link>
                                <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                    {t('header.aboutUs', 'About Us')}
                                </Link>
                            </nav>
                        )}
                    </div>

                    <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                        {}
                        {isMobile && (
                            <button
                                onClick={() => {
                                    setMobileSidebarOpen(!mobileSidebarOpen);
                                    setMobileNavOpen(false);
                                }}
                                className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                </svg>
                            </button>
                        )}
                        <ThemeToggle />
                        <LanguageSwitcher />
                        <Link to="/profile" className={`flex items-center gap-3 ${isRTL ? 'pr-4 border-r flex-row-reverse' : 'pl-4 border-l'} border-border hover:opacity-80 transition-opacity`}>
                            <span className="hidden sm:block text-sm font-medium text-foreground">
                                {user?.name}
                            </span>
                            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shadow-sm ring-1 ring-primary/20">
                                {user?.name?.charAt(0)}
                            </div>
                        </Link>
                    </div>
                </header>

                {}
                {isMobile && mobileNavOpen && (
                    <div className={`bg-surface border-b border-border px-6 py-4 space-y-2 animate-slide-up ${isRTL ? 'text-right' : ''}`}>
                        <Link to="/issues" onClick={() => setMobileNavOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                            {t('header.issuesList', 'Issues List')}
                        </Link>
                        <Link to="/community" onClick={() => setMobileNavOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                            {t('header.communityHelp', 'Community Help')}
                        </Link>
                        <Link to="/about" onClick={() => setMobileNavOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                            {t('header.aboutUs', 'About Us')}
                        </Link>
                    </div>
                )}

                {}
                <main className="flex-1 p-6 lg:px-12 lg:py-10 pb-20 lg:pb-32 animate-slide-up w-full max-w-[1600px] mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
