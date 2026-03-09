import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import Navbar from '../../components/common/Navbar';
import { useTranslation } from 'react-i18next';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

import { getDashboardPath } from '../../utils/roleUtils';

function LoginPage() {
    const navigate = useNavigate();
    const { login, loading, error } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login({ email, password });
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
                <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
                    <img
                        src="/assets/images/login.png"
                        alt="Smart City Night"
                        className="absolute inset-0 w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-primary/40 to-purple-900/40 opacity-70"></div>
                    {}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                    {}
                </div>

                {}
                <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-6 lg:px-20 xl:px-32 bg-white dark:bg-background">
                    <div className="max-w-md w-full mx-auto space-y-8">
                        <div>
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                                {t('navbar.login')}
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                {t('auth.or')}{' '}
                                <Link to="/signup" className="font-medium text-primary hover:text-primary/70 transition">
                                    {t('auth.createAccount')}
                                </Link>
                            </p>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-900/50">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <h3 className="text-sm font-bold text-red-800 dark:text-red-300">{t('auth.loginFailed')}</h3>
                                            <p className="mt-1 text-sm text-red-700 dark:text-red-400">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
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
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-border dark:bg-background dark:text-white rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition hover:border-primary"
                                        />
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
                                            autoComplete="current-password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
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
                                    {loading ? t('auth.signingIn') : t('navbar.login')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;