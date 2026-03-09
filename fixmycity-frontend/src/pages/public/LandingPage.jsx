import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/common/Navbar';

function LandingPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen font-sans bg-gray-50 dark:bg-background transition-colors duration-500">
            <Navbar />

            <main>
                {}
                <section className="relative pt-16 pb-24 lg:pt-32 lg:pb-32 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center lg:text-start">
                        <div className="lg:w-1/2">
                            <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6 sm:text-6xl">
                                {t('landingPage.hero.titleLine1')} <br />
                                <span className="gradient-text">{t('landingPage.hero.titleLine2')}</span>
                            </h1>
                            <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                {t('landingPage.hero.description')}
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start rtl:lg:justify-start">
                                <Link
                                    to="/report"
                                    className="btn-primary-3d px-8 py-4 rounded-xl text-lg font-bold flex items-center justify-center transform hover:-translate-y-1 transition-all"
                                >
                                    {t('landingPage.hero.ctaReport')}
                                </Link>
                                <Link
                                    to="/about"
                                    className="px-8 py-4 rounded-xl text-lg font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-surface border-2 border-slate-200 dark:border-border hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary transition-all flex items-center justify-center shadow-sm hover:shadow-md"
                                >
                                    {t('navbar.about')}
                                </Link>
                            </div>
                        </div>
                        {}
                        <div className="hidden lg:block absolute top-1/2 ltr:right-0 rtl:left-0 transform -translate-y-1/2 w-1/2 h-full z-0">
                            {}
                            <div className="absolute top-20 ltr:right-10 rtl:left-10 w-[500px] h-[500px] bg-linear-to-br from-primary/20 to-amber-700/20 rounded-full blur-3xl animate-pulse"></div>
                            <div className="relative z-10 mt-20 ltr:ml-20 rtl:mr-20">
                                <div className="glass-panel p-6 rounded-2xl w-96 transform rotate-6 hover:rotate-2 transition-transform duration-500">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">🌳</div>
                                        <div>
                                            <h4 className="font-bold dark:text-white">{t('landingPage.hero.card1.title')}</h4>
                                            <p className="text-xs text-gray-500">{t('landingPage.hero.card1.subtitle')}</p>
                                        </div>
                                    </div>
                                    <div className="h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                                        <img
                                            src="/assets/images/hero_card.png"
                                            alt="Clean City"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-primary font-bold">{t('landingPage.hero.card1.volunteers')}</span>
                                        <span className="text-gray-500">{t('landingPage.hero.card1.distance')}</span>
                                    </div>
                                </div>

                                <div className="glass-panel p-5 rounded-2xl w-80 absolute -bottom-20 ltr:-left-10 rtl:-right-10 transform ltr:-rotate-3 rtl:rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🚧</span>
                                        <div>
                                            <h4 className="font-bold dark:text-white">{t('landingPage.hero.card2.title')}</h4>
                                            <span className="inline-block px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">{t('landingPage.hero.card2.status')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {}
                <section className="py-24 bg-white dark:bg-background transition-colors duration-500">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">{t('landingPage.features.title')}</h2>
                            <p className="mt-4 text-slate-600 dark:text-slate-400">{t('landingPage.features.subtitle')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {}
                            <div className="glass-panel p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow relative overflow-hidden group">
                                <div className="absolute top-4 ltr:right-4 rtl:left-4 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">{t('landingPage.features.card1.tag')}</div>
                                <div className="w-16 h-16 bg-primary/10 dark:bg-surface rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">📍</div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('landingPage.features.card1.title')}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {t('landingPage.features.card1.description')}
                                </p>
                            </div>

                            {}
                            <div className="glass-panel p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow relative overflow-hidden group">
                                <div className="absolute top-4 right-4 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">{t('landingPage.features.card2.tag')}</div>
                                <div className="w-16 h-16 bg-purple-50 dark:bg-surface rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">🤝</div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('landingPage.features.card2.title')}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {t('landingPage.features.card2.description')}
                                </p>
                            </div>

                            {}
                            <div className="glass-panel p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow relative overflow-hidden group">
                                <div className="absolute top-4 right-4 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold px-3 py-1 rounded-full">{t('landingPage.features.card3.tag')}</div>
                                <div className="w-16 h-16 bg-orange-50 dark:bg-surface rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">🚀</div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('landingPage.features.card3.title')}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {t('landingPage.features.card3.description')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {}
                <section className="py-24 bg-gray-50 dark:bg-background transition-colors duration-500">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t('landingPage.howItWorks.title')}</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-white dark:bg-surface shadow-md flex items-center justify-center text-3xl mb-4 text-primary">👤</div>
                                <h4 className="font-bold text-lg dark:text-white">{t('landingPage.howItWorks.step1')}</h4>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-white dark:bg-surface shadow-md flex items-center justify-center text-3xl mb-4 text-primary">📝</div>
                                <h4 className="font-bold text-lg dark:text-white">{t('landingPage.howItWorks.step2')}</h4>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-white dark:bg-surface shadow-md flex items-center justify-center text-3xl mb-4 text-yellow-500">🏗️</div>
                                <h4 className="font-bold text-lg dark:text-white">{t('landingPage.howItWorks.step3')}</h4>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-white dark:bg-surface shadow-md flex items-center justify-center text-3xl mb-4 text-primary">✅</div>
                                <h4 className="font-bold text-lg dark:text-white">{t('landingPage.howItWorks.step4')}</h4>
                            </div>
                        </div>
                    </div>
                </section>

                {}
                <section className="py-20 bg-primary text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
                            <div>
                                <div className="text-4xl font-extrabold mb-2">1,234</div>
                                <div className="text-white/80 font-medium">{t('landingPage.stats.issues')}</div>
                            </div>
                            <div>
                                <div className="text-4xl font-extrabold mb-2">89%</div>
                                <div className="text-white/80 font-medium">{t('landingPage.stats.resolution')}</div>
                            </div>
                            <div>
                                <div className="text-4xl font-extrabold mb-2">567</div>
                                <div className="text-white/80 font-medium">{t('landingPage.stats.funded')}</div>
                            </div>
                            <div>
                                <div className="text-4xl font-extrabold mb-2">12</div>
                                <div className="text-white/80 font-medium">{t('landingPage.stats.partners')}</div>
                            </div>
                        </div>
                    </div>
                </section>

                {}
                <footer className="bg-slate-900 text-slate-400 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6 md:flex-row md:justify-between">
                        <div className="text-2xl font-bold text-white">FixMyCity</div>
                        <div className="flex gap-8">
                            <Link to="/about" className="hover:text-white transition-colors">{t('landingPage.footer.about')}</Link>
                            <Link to="/privacy" className="hover:text-white transition-colors">{t('landingPage.footer.privacy')}</Link>
                            <Link to="/terms" className="hover:text-white transition-colors">{t('landingPage.footer.terms')}</Link>
                            <Link to="/contact" className="hover:text-white transition-colors">{t('landingPage.footer.contact')}</Link>
                        </div>

                    </div>
                    <div className="text-center mt-8 text-sm text-slate-500">
                        {t('landingPage.footer.rights')}
                    </div>
                </footer>
            </main>
        </div>
    );
}

export default LandingPage;