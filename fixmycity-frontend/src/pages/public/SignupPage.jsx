import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import Navbar from '../../components/common/Navbar';
import { useTranslation } from 'react-i18next';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { lookupService } from '../../services/lookupService';

import { getDashboardPath } from '../../utils/roleUtils';

function SignupPage() {
    const navigate = useNavigate();
    const { register, loading, error } = useAuthStore();
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [municipalities, setMunicipalities] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        municipality: '',
    });

    useEffect(() => {
        const fetchMunicipalities = async () => {
            try {
                const data = await lookupService.municipalities.getAll();
                setMunicipalities(data.map(m => m.name));
            } catch (error) {
                console.error("Failed to fetch municipalities", error);
            }
        };
        fetchMunicipalities();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await register(formData);
        if (success) {
            const user = useAuthStore.getState().user;
            navigate(getDashboardPath(user?.role));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background flex flex-col transition-colors duration-500">
            <Navbar />
            <div className="grow flex">
                {}
                <div className="hidden lg:flex w-1/2 bg-[#3D2B1F] relative overflow-hidden items-center justify-center">
                    <div className="absolute inset-0 bg-linear-to-tr from-[#3D2B1F] to-[#5C3D2E]"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>

                    <div className="relative z-10 text-center px-10 text-white">
                        <h2 className="text-4xl font-bold mb-6">{t('auth.joinCommunity')}</h2>
                        <div className="space-y-6 text-lg text-white/80">
                            <div className="flex items-center space-x-4 glass-panel p-4 rounded-xl border-none bg-white/10">
                                <span className="text-3xl">📢</span>
                                <span>{t('auth.feature1')}</span>
                            </div>
                            <div className="flex items-center space-x-4 glass-panel p-4 rounded-xl border-none bg-white/10">
                                <span className="text-3xl">🤝</span>
                                <span>{t('auth.feature2')}</span>
                            </div>
                            <div className="flex items-center space-x-4 glass-panel p-4 rounded-xl border-none bg-white/10">
                                <span className="text-3xl">✨</span>
                                <span>{t('auth.feature3')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {}
                <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-6 lg:px-20 xl:px-32 bg-white dark:bg-background">
                    <div className="max-w-md w-full mx-auto space-y-8">
                        <div>
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                                {t('navbar.signup')}
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                {t('auth.alreadyAccount')}{' '}
                                <Link to="/login" className="font-medium text-primary hover:text-primary/70 transition">
                                    {t('auth.signIn')}
                                </Link>
                            </p>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-900/50">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <h3 className="text-sm font-bold text-red-800 dark:text-red-300">{t('auth.registrationFailed')}</h3>
                                            <p className="mt-1 text-sm text-red-700 dark:text-red-400">{typeof error === 'string' ? error : JSON.stringify(error)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t('auth.fullName')}
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-border dark:bg-background dark:text-white rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition hover:border-primary"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t('auth.email')}
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-border dark:bg-background dark:text-white rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition hover:border-primary"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t('auth.phone')}
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            autoComplete="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-border dark:bg-background dark:text-white rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition hover:border-primary"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="municipality" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t('auth.municipality', 'Municipality')}
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            id="municipality"
                                            name="municipality"
                                            required
                                            value={formData.municipality}
                                            onChange={handleChange}
                                            className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-border dark:bg-background dark:text-white rounded-xl shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition hover:border-primary"
                                        >
                                            <option value="">{t('auth.selectMunicipality', 'Select Municipality')}</option>
                                            {municipalities.map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t('auth.password')}
                                    </label>
                                    <div className="mt-1 relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="appearance-none block w-full px-4 py-3 pe-10 border border-gray-300 dark:border-border dark:bg-background dark:text-white rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition hover:border-primary"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 end-0 pe-3 flex items-center text-gray-400 hover:text-gray-500"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5" aria-hidden="true" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white btn-primary-3d focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? t('auth.creatingAccount') : t('navbar.signup')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;