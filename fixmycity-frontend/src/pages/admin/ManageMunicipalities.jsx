import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    XMarkIcon,
    BuildingOffice2Icon,
    MapPinIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

const EMPTY_FORM = { name: '', code: '', region: '', contact_info: '', is_active: true };

function ManageMunicipalities() {
    const [municipalities, setMunicipalities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => { fetchMunicipalities(); }, []);

    const fetchMunicipalities = async () => {
        setLoading(true);
        try {
            const data = await adminService.getMunicipalities();
            setMunicipalities(data);
        } catch {
            toast.error('Failed to load municipalities');
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    const openEdit = (mun) => {
        setEditing(mun);
        setForm({
            name: mun.name || '',
            code: mun.code || '',
            region: mun.region || '',
            contact_info: mun.contact_info || '',
            is_active: mun.is_active !== false,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editing) {
                await adminService.updateMunicipality(editing._id, form);
                toast.success('Municipality updated');
            } else {
                await adminService.createMunicipality(form);
                toast.success('Municipality created');
            }
            setShowModal(false);
            fetchMunicipalities();
        } catch {
            toast.error('Save failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await adminService.deleteMunicipality(deleteId);
            toast.success('Municipality deleted');
            setDeleteId(null);
            fetchMunicipalities();
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
                        <h1 className="text-2xl font-bold text-foreground">Manage Municipalities</h1>
                        <p className="text-muted-foreground">Create and manage municipal zones.</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                    >
                        <PlusIcon className="w-5 h-5" /> Add Municipality
                    </button>
                </div>

                {}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : municipalities.length === 0 ? (
                    <div className="text-center py-20 glass-panel rounded-2xl">
                        <BuildingOffice2Icon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium text-foreground">No municipalities yet</h3>
                        <p className="text-muted-foreground mt-2">Click "Add Municipality" to create your first one.</p>
                    </div>
                ) : (
                    <div className="glass-panel rounded-2xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-left text-muted-foreground">
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium hidden sm:table-cell">Code</th>
                                    <th className="px-6 py-4 font-medium hidden md:table-cell">Region</th>
                                    <th className="px-6 py-4 font-medium hidden lg:table-cell">Contact</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {municipalities.map((mun) => (
                                    <tr key={mun._id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <MapPinIcon className="w-4 h-4 text-primary shrink-0" />
                                                <span className="font-semibold text-foreground">{mun.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">
                                            {mun.code ? (
                                                <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-mono">{mun.code}</span>
                                            ) : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">{mun.region || '—'}</td>
                                        <td className="px-6 py-4 text-muted-foreground hidden lg:table-cell truncate max-w-[200px]">{mun.contact_info || '—'}</td>
                                        <td className="px-6 py-4">
                                            {mun.is_active !== false ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400">
                                                    <CheckCircleIcon className="w-3.5 h-3.5" /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400">
                                                    <XCircleIcon className="w-3.5 h-3.5" /> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEdit(mun)} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors" title="Edit">
                                                    <PencilSquareIcon className="w-4.5 h-4.5" />
                                                </button>
                                                <button onClick={() => setDeleteId(mun._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors" title="Delete">
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md border border-border overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <h2 className="text-lg font-bold text-foreground">{editing ? 'Edit Municipality' : 'New Municipality'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-muted transition-colors">
                                <XMarkIcon className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 outline-none transition"
                                    placeholder="e.g. Algiers Municipality"
                                />
                            </div>
                            {}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Code</label>
                                <input
                                    type="text"
                                    value={form.code}
                                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 outline-none transition"
                                    placeholder="e.g. ALG-01"
                                />
                            </div>
                            {}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Region</label>
                                <input
                                    type="text"
                                    value={form.region}
                                    onChange={(e) => setForm({ ...form, region: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 outline-none transition"
                                    placeholder="e.g. Algiers"
                                />
                            </div>
                            {}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Contact Info</label>
                                <input
                                    type="text"
                                    value={form.contact_info}
                                    onChange={(e) => setForm({ ...form, contact_info: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 outline-none transition"
                                    placeholder="e.g. contact@municipality.dz"
                                />
                            </div>
                            {}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_active}
                                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                    className="w-5 h-5 rounded-md border-border text-primary focus:ring-primary"
                                />
                                <span className="text-sm font-medium text-foreground">Active</span>
                            </label>
                            {}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-50 transition-all"
                            >
                                {submitting ? 'Saving…' : (editing ? 'Update Municipality' : 'Create Municipality')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {}
            {deleteId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-sm border border-border p-6 text-center">
                        <TrashIcon className="w-12 h-12 mx-auto text-red-500 mb-4" />
                        <h3 className="text-lg font-bold text-foreground mb-2">Delete Municipality?</h3>
                        <p className="text-muted-foreground text-sm mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default ManageMunicipalities;
