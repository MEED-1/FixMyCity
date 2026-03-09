import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useAuthStore from '../../store/useAuthStore';
import { toast } from 'react-toastify';
import { lookupService } from '../../services/lookupService';
import {
    UserCircleIcon,
    LockClosedIcon,
    BellIcon,
    PencilSquareIcon,
    TrashIcon,
    CameraIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const TABS = [
    { id: 'personal', label: 'profile.personalInfo', icon: UserCircleIcon },
];

function ProfileSettings() {
    const { user, updateProfile, updateProfilePicture, deleteProfilePicture, deleteAccount, loading } = useAuthStore();
    const { t } = useTranslation();
    const fileInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState('personal');
    const [municipalities, setMunicipalities] = useState([]);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        municipality: user?.municipality || '',
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
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await updateProfile({
            name: formData.name,
            phone: formData.phone,
            municipality: formData.municipality
        });
        if (result.success) {
            toast.success("Profile updated successfully!");
        } else {
            toast.error(typeof result.error === 'string' ? result.error : "Failed to update profile.");
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        e.target.value = '';

        const result = await updateProfilePicture(file);
        if (result.success) {
            toast.success("Profile picture updated!");
        } else {
            toast.error(result.error);
        }
    };

    const handleDeletePicture = async () => {
        if (!user.avatar_url) return;

        const result = await deleteProfilePicture();
        if (result.success) {
            toast.success("Profile picture deleted!");
        } else {
            toast.error(result.error);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone and will delete all your issues, comments, and data.")) {
            const result = await deleteAccount();
            if (result.success) {
                toast.success("Account deleted successfully.");
            } else {
                toast.error(result.error);
            }
        }
    };



    const renderPersonalInfo = () => (
        <form onSubmit={handleSubmit} className="space-y-8">
            { }
            <div className="flex items-center gap-6">
                <div className="relative">
                    {user?.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt={`${user.name}'s avatar`}
                            className="h-24 w-24 rounded-full object-cover border-4 border-surface shadow-lg"
                        />
                    ) : (
                        <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary border-4 border-surface shadow-lg">
                            {user?.name?.charAt(0)}
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary/80 transition-colors"
                        disabled={loading}
                    >
                        <CameraIcon className="w-4 h-4" />
                    </button>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-foreground">{user?.name || 'User'}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <div className="mt-2 flex gap-2">
                        <input
                            type="file"
                            name="avatar"
                            id="avatar"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="btn-primary-3d px-4 py-2 text-xs"
                            disabled={loading}
                        >
                            {t('profile.changePicture')}
                        </button>
                        {user?.avatar_url && (
                            <button
                                type="button"
                                onClick={handleDeletePicture}
                                className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                                disabled={loading}
                            >
                                {t('profile.remove')}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                <h4 className="text-base font-semibold text-foreground">{t('profile.personalInfo')}</h4>

                <div className="relative">
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">{t('profile.fullName')}</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input-3d pr-10"
                        />
                        <PencilSquareIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                </div>

                <div className="relative">
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">{t('profile.emailAddress')}</label>
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className="input-3d pr-10 opacity-60 cursor-not-allowed"
                        />
                        <PencilSquareIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                    </div>
                </div>

                <div className="relative">
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">{t('profile.phoneNumber')}</label>
                    <div className="relative">
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="input-3d pr-10"
                            placeholder="+212 ..."
                        />
                        <PencilSquareIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                </div>

                <div className="relative">
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">{t('profile.municipality')}</label>
                    <div className="relative">
                        <select
                            name="municipality"
                            value={formData.municipality}
                            onChange={handleChange}
                            className="input-3d pr-10 appearance-none"
                        >
                            <option value="">{t('profile.selectMunicipality')}</option>
                            {municipalities.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button type="submit" disabled={loading} className="btn-primary-3d px-8 py-2.5 disabled:opacity-50">
                    {loading ? t('profile.updating') : t('profile.update')}
                </button>
            </div>

            { }
            <div className="mt-12 pt-8 border-t border-border">
                <h4 className="text-base font-semibold text-red-600 dark:text-red-400 mb-2">{t('profile.dangerZone')}</h4>
                <p className="text-sm text-muted-foreground mb-4">
                    {t('profile.dangerZoneText')}
                </p>
                <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors border border-red-200 dark:border-red-900/50 disabled:opacity-50"
                >
                    {t('profile.deleteAccount')}
                </button>
            </div>
        </form>
    );


    return (
        <DashboardLayout>
            <div className="w-full animate-in xl:max-w-[1600px] xl:mx-auto fade-in slide-in-from-bottom-4 duration-700">
                { }

                <div className="flex flex-col md:flex-row gap-6">
                    { }
                    <div className="md:w-56 shrink-0">
                        <nav className="space-y-1">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                        ? 'bg-primary/10 text-primary font-semibold'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    {t(tab.label)}
                                </button>
                            ))}
                        </nav>

                        { }
                        <div className="mt-8 pt-6 border-t border-border">
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200">
                                <TrashIcon className="w-5 h-5" />
                                {t('profile.deleteAccount')}
                            </button>
                        </div>
                    </div>

                    { }
                    <div className="flex-1">
                        <div className="card-3d p-6 sm:p-8">
                            {activeTab === 'personal' && renderPersonalInfo()}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default ProfileSettings;
