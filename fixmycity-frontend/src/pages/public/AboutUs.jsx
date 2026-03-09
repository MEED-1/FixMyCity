import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/common/Navbar';
import useAuthStore from '../../store/useAuthStore';
import DashboardLayout from '../../components/layout/DashboardLayout';

const AboutUs = () => {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuthStore();

    const Content = () => (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                    <span className="block">{t('about.title', 'About FixMyCity')}</span>
                    <span className="block text-primary mt-2">{t('about.subtitle', 'Empowering Citizens')}</span>
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
                    {t('about.description', 'We bridge the gap between citizens and local administration to build better cities together.')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
                    <img
                        src="/assets/images/about.png"
                        alt="Modern City Planning"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-primary/40 to-amber-700/40 opacity-90 flex items-center justify-center">
                        <span className="text-white text-6xl font-bold drop-shadow-lg">FixMyCity</span>
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        {t('about.missionTitle', 'Our Mission')}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                        {t('about.missionText', 'To provide a transparent, efficient, and collaborative platform for reporting and resolving urban issues. We believe in the power of community engagement to transform our living spaces.')}
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-surface p-6 rounded-xl shadow-sm border border-gray-100 dark:border-border">
                            <div className="text-3xl font-bold text-primary mb-2">100+</div>
                            <div className="text-gray-600 dark:text-gray-400">{t('about.stat1', 'Cities')}</div>
                        </div>
                        <div className="bg-white dark:bg-surface p-6 rounded-xl shadow-sm border border-gray-100 dark:border-border">
                            <div className="text-3xl font-bold text-primary mb-2">50k+</div>
                            <div className="text-gray-600 dark:text-gray-400">{t('about.stat2', 'Issues Resolved')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (isAuthenticated) {
        return (
            <DashboardLayout>
                <Content />
            </DashboardLayout>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background transition-colors duration-300">
            <Navbar />
            <Content />
        </div>
    );
};

export default AboutUs;
