import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    XMarkIcon,
    TagIcon,
    SwatchIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const PRESET_COLORS = [
    '#EF4444', '#F97316', '#F59E0B', '#22C55E',
    '#14B8A6', '#3B82F6', '#6366F1', '#8B5CF6',
    '#EC4899', '#64748B',
];

const EMPTY_FORM = { name: '', type: '', icon: '', color: '#3B82F6', is_active: true };

function ManageCategories() {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await adminService.getCategories();
            setCategories(data);
        } catch {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    const openEdit = (cat) => {
        setEditing(cat);
        setForm({
            name: cat.name || '',
            type: cat.type || '',
            icon: cat.icon || '',
            color: cat.color || '#3B82F6',
            is_active: cat.is_active !== false,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editing) {
                await adminService.updateCategory(editing.id || editing._id, form);
                toast.success('Category updated');
            } else {
                await adminService.createCategory(form);
                toast.success('Category created');
            }
            setShowModal(false);
            fetchCategories();
        } catch {
            toast.error('Save failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await adminService.deleteCategory(deleteId);
            toast.success('Category deleted');
            setDeleteId(null);
            fetchCategories();
        } catch {
            toast.error('Delete failed');
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                {}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{t('manageCategories.title')}</h1>
                        <p className="text-muted-foreground">{t('manageCategories.subtitle')}</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                    >
                        <PlusIcon className="w-5 h-5" /> {t('manageCategories.addCategory')}
                    </button>
                </div>

                {}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-20 glass-panel rounded-2xl">
                        <TagIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium text-foreground">{t('manageCategories.noCategories')}</h3>
                        <p className="text-muted-foreground mt-2">{t('manageCategories.noCategoriesSub')}</p>
                    </div>
                ) : (
                    <div className="glass-panel rounded-2xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-left text-muted-foreground">
                                    <th className="px-6 py-4 font-medium">{t('manageCategories.color')}</th>
                                    <th className="px-6 py-4 font-medium">{t('manageCategories.name')}</th>
                                    <th className="px-6 py-4 font-medium hidden sm:table-cell">{t('manageCategories.type')}</th>
                                    <th className="px-6 py-4 font-medium hidden md:table-cell">{t('manageCategories.icon')}</th>
                                    <th className="px-6 py-4 font-medium">{t('manageCategories.status')}</th>
                                    <th className="px-6 py-4 font-medium text-right">{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat) => (
                                    <tr key={cat.id || cat._id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div
                                                className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-slate-700 shadow"
                                                style={{ backgroundColor: cat.color || '#3B82F6' }}
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-foreground">{cat.name}</td>
                                        <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">{cat.type || '—'}</td>
                                        <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">{cat.icon || '—'}</td>
                                        <td className="px-6 py-4">
                                            {cat.is_active !== false ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400">
                                                    <CheckCircleIcon className="w-3.5 h-3.5" /> {t('common.active')}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400">
                                                    <XCircleIcon className="w-3.5 h-3.5" /> {t('common.inactive')}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEdit(cat)} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors" title="Edit">
                                                    <PencilSquareIcon className="w-4.5 h-4.5" />
                                                </button>
                                                <button onClick={() => setDeleteId(cat.id || cat._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors" title="Delete">
                                                    <TrashIcon className="w-4.5 h-4.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {}
            {showModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md border border-border overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <h2 className="text-lg font-bold text-foreground">{editing ? t('manageCategories.editCategory') : t('manageCategories.newCategory')}</h2>
                            <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-muted transition-colors">
                                <XMarkIcon className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">{t('manageCategories.name')} *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 outline-none transition"
                                    placeholder="e.g. Road Damage"
                                />
                            </div>
                            {}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">{t('manageCategories.type')}</label>
                                <input
                                    type="text"
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 outline-none transition"
                                    placeholder="e.g. infrastructure"
                                />
                            </div>
                            {}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">{t('manageCategories.iconLabel')}</label>
                                <input
                                    type="text"
                                    value={form.icon}
                                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 outline-none transition"
                                    placeholder="e.g. 🚧 or road"
                                />
                            </div>
                            {}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">{t('manageCategories.color')}</label>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {PRESET_COLORS.map((c) => (
                                        <button
                                            type="button"
                                            key={c}
                                            onClick={() => setForm({ ...form, color: c })}
                                            className={`w-8 h-8 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-110'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                            {}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_active}
                                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                    className="w-5 h-5 rounded-md border-border text-primary focus:ring-primary"
                                />
                                <span className="text-sm font-medium text-foreground">{t('common.active')}</span>
                            </label>
                            {}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-50 transition-all"
                            >
                                {submitting ? t('common.saving') : (editing ? t('manageCategories.updateCategory') : t('manageCategories.createCategory'))}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {}
            {deleteId && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-sm border border-border p-6 text-center">
                        <TrashIcon className="w-12 h-12 mx-auto text-red-500 mb-4" />
                        <h3 className="text-lg font-bold text-foreground mb-2">{t('manageCategories.deleteCategory')}</h3>
                        <p className="text-muted-foreground text-sm mb-6">{t('common.actionCannotBeUndone')}</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors">
                                {t('common.cancel')}
                            </button>
                            <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all">
                                {t('common.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default ManageCategories;
