import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { getDashboardPath } from '../../utils/roleUtils';

function Navbar() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white/80 dark:bg-background/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center gap-6 lg:gap-10">
                        {}
                        <Link to="/" className="shrink-0 flex items-center gap-2">
                            <span className="text-2xl font-bold text-primary dark:text-primary">FixMyCity</span>
                        </Link>

                        {}
                        <div className="hidden md:flex md:gap-8">
                            <Link to="/issues" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                {t('navbar.browseIssues')}
                            </Link>
                            <Link to="/community" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                {t('navbar.communityHelp')}
                            </Link>
                            <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                {t('navbar.about')}
                            </Link>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <div className="flex items-center space-x-4 border-r border-gray-200 dark:border-border pr-6">
                            <LanguageSwitcher />
                            <ThemeToggle />
                        </div>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <Link to={getDashboardPath(user?.role)} className="text-gray-700 dark:text-gray-200 font-medium hover:text-primary">
                                    {t('navbar.dashboard')}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    {t('navbar.logout')}
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-600 dark:text-gray-300 font-medium hover:text-primary transition-colors">
                                    {t('navbar.login')}
                                </Link>
                                <Link to="/signup" className="btn-primary-3d px-6 py-2.5 rounded-xl text-sm font-bold">
                                    {t('navbar.signup')}
                                </Link>
                            </div>
                        )}
                    </div>

                    {}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-background border-t border-gray-100 dark:border-gray-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/issues" className="text-gray-600 dark:text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">{t('navbar.browseIssues')}</Link>
                        <Link to="/community" className="text-gray-600 dark:text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">{t('navbar.communityHelp')}</Link>
                        <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">{t('navbar.about')}</Link>
                    </div>
                    <div className="pt-4 pb-4 border-t border-gray-200 dark:border-border">
                        <div className="flex items-center px-4 justify-between mb-4">
                            <LanguageSwitcher />
                            <ThemeToggle />
                        </div>
                        {isAuthenticated ? (
                            <div className="px-4 space-y-3">
                                <div className="text-base font-medium text-gray-800 dark:text-gray-200">{t('navbar.signedInAs')} {user?.name}</div>
                                <Link to={getDashboardPath(user?.role)} className="block w-full text-center bg-primary text-white px-4 py-2 rounded-lg font-bold">{t('navbar.dashboard')}</Link>
                                <button onClick={handleLogout} className="block w-full text-center border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg font-medium">{t('navbar.logout')}</button>
                            </div>
                        ) : (
                            <div className="px-4 space-y-3">
                                <Link to="/login" className="block w-full text-center border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg font-medium">{t('navbar.login')}</Link>
                                <Link to="/signup" className="block w-full text-center bg-primary text-white px-4 py-2 rounded-lg font-bold">{t('navbar.signup')}</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
