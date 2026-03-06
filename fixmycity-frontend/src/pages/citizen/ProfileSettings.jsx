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
    EyeIcon,
    EyeSlashIcon,
} from '@heroicons/react/24/outline';

const TABS = [
    { id: 'personal', label: 'Personal Info', icon: UserCircleIcon },
    { id: 'password', label: 'Password', icon: LockClosedIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
];

function ProfileSettings() {
    const { user, updateProfile, updateProfilePicture, deleteProfilePicture, deleteAccount, loading } = useAuthStore();
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

    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: '',
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [notifSettings, setNotifSettings] = useState({
        issueUpdates: true,
        communityAlerts: true,
        donations: false,
        newsletter: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleNotifToggle = (key) => {
        setNotifSettings({ ...notifSettings, [key]: !notifSettings[key] });
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

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            toast.error("Passwords don't match!");
            return;
        }
        toast.success("Password changed successfully!");
        setPasswordData({ current: '', new: '', confirm: '' });
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
                            Change Picture
                        </button>
                        {user?.avatar_url && (
                            <button
                                type="button"
                                onClick={handleDeletePicture}
                                className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                                disabled={loading}
                            >
                                Remove
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                <h4 className="text-base font-semibold text-foreground">Personal Information</h4>

                <div className="relative">
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Full Name</label>
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
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Email Address</label>
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
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Phone Number</label>
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
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Municipality</label>
                    <div className="relative">
                        <select
                            name="municipality"
                            value={formData.municipality}
                            onChange={handleChange}
                            className="input-3d pr-10 appearance-none"
                        >
                            <option value="">Select Municipality</option>
                            {municipalities.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button type="submit" disabled={loading} className="btn-primary-3d px-8 py-2.5 disabled:opacity-50">
                    {loading ? 'Updating...' : 'Update'}
                </button>
            </div>

            { }
            <div className="mt-12 pt-8 border-t border-border">
                <h4 className="text-base font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h4>
                <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors border border-red-200 dark:border-red-900/50 disabled:opacity-50"
                >
                    Delete Account
                </button>
            </div>
        </form>
    );

    const renderPassword = () => (
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <h4 className="text-base font-semibold text-foreground">Change Password</h4>
            <p className="text-sm text-muted-foreground">Ensure your account is using a strong, unique password.</p>

            <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Current Password</label>
                <div className="relative">
                    <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="current"
                        value={passwordData.current}
                        onChange={handlePasswordChange}
                        className="input-3d pe-10"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 end-0 pe-3 flex items-center text-gray-400 hover:text-gray-500"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                        {showCurrentPassword ? (
                            <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                        ) : (
                            <EyeIcon className="h-5 w-5" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">New Password</label>
                <div className="relative">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        name="new"
                        value={passwordData.new}
                        onChange={handlePasswordChange}
                        className="input-3d pe-10"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 end-0 pe-3 flex items-center text-gray-400 hover:text-gray-500"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                        {showNewPassword ? (
                            <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                        ) : (
                            <EyeIcon className="h-5 w-5" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirm"
                        value={passwordData.confirm}
                        onChange={handlePasswordChange}
                        className="input-3d pe-10"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 end-0 pe-3 flex items-center text-gray-400 hover:text-gray-500"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                        ) : (
                            <EyeIcon className="h-5 w-5" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button type="submit" className="btn-primary-3d px-8 py-2.5">
                    Change Password
                </button>
            </div>
        </form>
    );

    const renderNotifications = () => (
        <div className="space-y-6">
            <div>
                <h4 className="text-base font-semibold text-foreground">Notification Preferences</h4>
                <p className="text-sm text-muted-foreground mt-1">Choose what you want to be notified about.</p>
            </div>

            <div className="space-y-1">
                {[
                    { key: 'issueUpdates', label: 'Issue Updates', desc: 'Get notified when your reported issues are updated' },
                    { key: 'communityAlerts', label: 'Community Alerts', desc: 'Receive alerts about community help requests nearby' },
                    { key: 'donations', label: 'Donation Activity', desc: 'Get notified about donations to your causes' },
                    { key: 'newsletter', label: 'Weekly Newsletter', desc: 'Receive a weekly summary of city improvements' },
                ].map((item) => (
                    <div
                        key={item.key}
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors"
                    >
                        <div>
                            <p className="text-sm font-medium text-foreground">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleNotifToggle(item.key)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${notifSettings[item.key] ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ease-in-out transform ${notifSettings[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                                    } mt-0.5`}
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div>
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
                                    {tab.label}
                                </button>
                            ))}
                        </nav>

                        { }
                        <div className="mt-8 pt-6 border-t border-border">
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200">
                                <TrashIcon className="w-5 h-5" />
                                Delete Account
                            </button>
                        </div>
                    </div>

                    { }
                    <div className="flex-1">
                        <div className="card-3d p-6 sm:p-8">
                            {activeTab === 'personal' && renderPersonalInfo()}
                            {activeTab === 'password' && renderPassword()}
                            {activeTab === 'notifications' && renderNotifications()}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default ProfileSettings;
