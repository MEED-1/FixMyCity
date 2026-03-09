import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LocationPicker from '../../components/map/LocationPicker';
import { issueService } from '../../services/issueService';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { getDashboardPath } from '../../utils/roleUtils';
import useAuthStore from '../../store/useAuthStore';
import CustomDropdown from '../../components/common/CustomDropdown';
import { lookupService } from '../../services/lookupService';

const CATEGORY_ICONS = {
    'infrastructure': '🛣️',
    'lighting': '💡',
    'waste': '🗑️',
    'water': '💧',
    'public_spaces': '🌳',
    'safety': '⚠️',
    'other': '❓'
};

const STEPS = [
    { number: 1, title: 'Category' },
    { number: 2, title: 'Details' },
    { number: 3, title: 'Photos' },
    { number: 4, title: 'Location' },
    { number: 5, title: 'Review' }
];

function EditIssue() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuthStore();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [initialFetchLoading, setInitialFetchLoading] = useState(true);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingPhotos, setExistingPhotos] = useState([]);

    const [categories, setCategories] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        municipality: '',
        latitude: null,
        longitude: null,
        photos: [] // New photos to upload
    });

    useEffect(() => {
        const fetchLookupsAndIssue = async () => {
            try {
                const [catsData, munsData, issue] = await Promise.all([
                    lookupService.categories.getAll(),
                    lookupService.municipalities.getAll(),
                    issueService.getById(id)
                ]);

                const mappedCats = catsData.map(c => ({
                    id: c.name.toLowerCase(),
                    label: c.name,
                    icon: CATEGORY_ICONS[c.name.toLowerCase()] || '📍',
                    desc: c.description || 'Report an issue in this category'
                }));
                setCategories(mappedCats);
                setMunicipalities(munsData.map(m => m.name));

                if (issue.user_id !== user?.id) {
                    toast.error("You are not authorized to edit this issue.");
                    navigate(getDashboardPath(user?.role));
                    return;
                }
                if (issue.boost_status === 'active') {
                    toast.error("This issue cannot be edited while it has an active boost.");
                    navigate(`/urban-issues/${id}`);
                    return;
                }
                if (['in_progress', 'resolved'].includes(issue.status)) {
                    toast.error("This issue cannot be edited after work has started.");
                    navigate(`/urban-issues/${id}`);
                    return;
                }

                setFormData({
                    title: issue.title || '',
                    description: issue.description || '',
                    category: issue.category || '',
                    priority: issue.priority || 'medium',
                    municipality: issue.municipality || '',
                    latitude: issue.location?.coordinates?.[1] || null,
                    longitude: issue.location?.coordinates?.[0] || null,
                    photos: []
                });

                if (issue.photos && issue.photos.length > 0) {
                    setExistingPhotos(issue.photos);
                }

            } catch (error) {
                console.error("Failed to load issue data:", error);
                toast.error("Failed to load issue data.");
                navigate('/dashboard');
            } finally {
                setInitialFetchLoading(false);
            }
        };

        if (id && user) {
            fetchLookupsAndIssue();
        }
    }, [id, user, navigate]);

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const validateStep = (step) => {
        switch (step) {
            case 1:
                if (!formData.category) return toast.error("Please select a category.");
                return true;
            case 2:
                if (!formData.title.trim()) return toast.error("Please enter a title.");
                if (!formData.description.trim()) return toast.error("Please enter a description.");
                if (!formData.municipality) return toast.error("Please select a municipality.");
                return true;
            case 3:
                return true;
            case 4:
                if (!formData.latitude || !formData.longitude) return toast.error("Please pin the location on the map.");
                return true;
            default:
                return true;
        }
    };

    const handleCategorySelect = (categoryId) => {
        setFormData({ ...formData, category: categoryId });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, photos: [...formData.photos, ...files] });

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeNewPhoto = (index) => {
        const newPhotos = [...formData.photos];
        newPhotos.splice(index, 1);
        setFormData({ ...formData, photos: newPhotos });

        const newPreviews = [...imagePreviews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);
    };

    const removeExistingPhoto = (index) => {
        const remaining = [...existingPhotos];
        remaining.splice(index, 1);
        setExistingPhotos(remaining);
    };

    const handleLocationSelect = (latlng) => {
        setFormData({
            ...formData,
            latitude: latlng.lat,
            longitude: latlng.lng,
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('priority', formData.priority);
            data.append('municipality', formData.municipality);
            data.append('latitude', formData.latitude);
            data.append('longitude', formData.longitude);


            if (formData.photos && formData.photos.length > 0) {
                formData.photos.forEach((photo) => {
                    data.append('photos[]', photo);
                });
            }

            await issueService.update(id, data);
            toast.success("Issue updated successfully! It is pending re-approval.");

            navigate(`/urban-issues/${id}`);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to update issue. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (initialFetchLoading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                { }
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-foreground">Edit Issue</h1>
                    <p className="mt-1 text-muted-foreground">Update the details of your issue.</p>
                </div>

                { }
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 rounded-md mb-8">
                    <div className="flex">
                        <div className="shrink-0">
                            <span>⚠️</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
                                Editing this issue will reset it to pending status and require admin re-approval.
                            </p>
                        </div>
                    </div>
                </div>

                { }
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        {STEPS.map((step) => (
                            <div key={step.number} className="flex flex-col items-center w-full z-10 relative">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 ${currentStep >= step.number
                                        ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-110'
                                        : 'bg-muted dark:bg-surface border-2 border-border text-muted-foreground'
                                        }`}
                                >
                                    {step.number}
                                </div>
                                <span className="text-xs mt-2 font-medium text-gray-500 dark:text-gray-400 hidden sm:block">{step.title}</span>
                            </div>
                        ))}
                    </div>
                    { }
                    <div className="relative h-1 bg-muted dark:bg-surface border border-border/50 -mt-11 mb-12 mx-8 rounded-full">
                        <div
                            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(169,123,80,0.4)]"
                            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                        ></div>
                    </div>
                </div>

                { }
                <div className="card-3d p-6 sm:p-10 min-h-[400px]">

                    { }
                    {currentStep === 1 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategorySelect(cat.id)}
                                    className={`p-6 rounded-2xl border-2 text-center transition-all duration-200 hover:-translate-y-1 ${formData.category === cat.id
                                        ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-[0_0_15px_rgba(169,123,80,0.15)]'
                                        : 'border-transparent bg-gray-50 dark:bg-surface/50 hover:border-gray-200 dark:hover:border-white/10 shadow-sm'
                                        }`}
                                >
                                    <div className="text-4xl mb-3">{cat.icon}</div>
                                    <div className="font-bold text-gray-900 dark:text-white">{cat.label}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{cat.desc}</div>
                                </button>
                            ))}
                        </div>
                    )}

                    { }
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="input-3d"
                                    placeholder="e.g., Deep Pothole on Main St"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="input-3d"
                                    placeholder="Describe the issue in detail..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mt-2">Priority</label>
                                <CustomDropdown
                                    value={formData.priority}
                                    onChange={(val) => setFormData({ ...formData, priority: val })}
                                    options={[
                                        { value: 'low', label: 'Low (Cosmetic, Minor inconvenience)' },
                                        { value: 'medium', label: 'Medium (Needs attention)' },
                                        { value: 'high', label: 'High (Hazardous, Urgent)' },
                                        { value: 'critical', label: 'Critical (Immediate danger)' }
                                    ]}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mt-4">Municipality</label>
                                <CustomDropdown
                                    value={formData.municipality}
                                    onChange={(val) => setFormData({ ...formData, municipality: val })}
                                    options={[
                                        ...municipalities.map(m => ({ value: m, label: m }))
                                    ]}
                                    placeholder="Select Municipality"
                                />
                                <p className="text-xs text-muted-foreground mt-2">This correctly routes your issue to the proper authority.</p>
                            </div>
                        </div>
                    )}

                    { }
                    {currentStep === 3 && (
                        <div className="text-center">
                            <div className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-3xl p-10 hover:border-primary transition-colors cursor-pointer bg-gray-50 dark:bg-surface/50 shadow-inner">
                                <label className="cursor-pointer block">
                                    <span className="text-5xl mb-4 block">📸</span>
                                    <span className="text-lg font-medium text-gray-900 dark:text-white block">Upload New Photos</span>
                                    <span className="text-sm text-gray-500 block mt-2">Choosing new photos will replace old ones</span>
                                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                                </label>
                            </div>

                            {existingPhotos.length > 0 && formData.photos.length === 0 && (
                                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {existingPhotos.map((photo, index) => (
                                        <div key={`exist-${index}`} className="relative group rounded-xl overflow-hidden aspect-square border-gray-200 border">
                                            <img src={photo} alt="Current" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeExistingPhoto(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-6 h-6 shadow-sm"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {imagePreviews.length > 0 && (
                                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {imagePreviews.map((src, index) => (
                                        <div key={`new-${index}`} className="relative group rounded-xl overflow-hidden aspect-square border-primary border-2">
                                            <img src={src} alt="New Preview" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeNewPhoto(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-6 h-6 shadow-sm"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    { }
                    {currentStep === 4 && (
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Click on the map or use the location button to update the exact spot.</p>
                            <LocationPicker
                                onLocationSelect={handleLocationSelect}
                                initialLayout={formData.latitude ? [formData.latitude, formData.longitude] : null}
                            />
                            {formData.latitude && (
                                <div className="mt-4 p-3 bg-primary/10 text-primary rounded-lg text-sm flex items-center">
                                    <span className="mr-2">📍</span>
                                    Location selected: {formData.latitude.toFixed(5)}, {formData.longitude.toFixed(5)}
                                </div>
                            )}
                        </div>
                    )}

                    { }
                    {currentStep === 5 && (
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                <h3 className="text-sm uppercase tracking-wide text-gray-500 font-bold mb-2">Category</h3>
                                <div className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
                                    <span className="mr-2">{categories.find(c => c.id === formData.category)?.icon}</span>
                                    {categories.find(c => c.id === formData.category)?.label}
                                </div>
                            </div>
                            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                <h3 className="text-sm uppercase tracking-wide text-gray-500 font-bold mb-2">Details</h3>
                                <h4 className="font-bold text-gray-900 dark:text-white">{formData.title}</h4>
                                <p className="text-gray-600 dark:text-gray-300 mt-1">{formData.description}</p>
                                <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-bold uppercase ${formData.priority === 'high' ? 'bg-red-100 text-red-700' :
                                    formData.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-primary/10 text-primary'
                                    }`}>
                                    {formData.priority} Priority
                                </span>
                            </div>
                            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                <h3 className="text-sm uppercase tracking-wide text-gray-500 font-bold mb-2">Location</h3>
                                <p className="text-gray-900 dark:text-white">{formData.latitude?.toFixed(5)}, {formData.longitude?.toFixed(5)}</p>
                            </div>
                        </div>
                    )}

                </div>

                { }
                <div className="mt-8 flex justify-between">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className={`px-6 py-3 rounded-2xl font-bold transition-colors ${currentStep === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-surface dark:text-gray-600 border border-transparent'
                            : 'bg-white dark:bg-surface text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm'
                            }`}
                    >
                        Back
                    </button>

                    {currentStep < 5 ? (
                        <button
                            onClick={handleNext}
                            className="btn-primary-3d px-8 py-3 rounded-xl font-bold"
                        >
                            Next Step
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="btn-primary-3d w-full sm:w-auto hover:bg-yellow-600 border-yellow-500"
                        >
                            {loading ? 'Submitting...' : 'Submit Edit (Requires Re-approval)'}
                        </button>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
}

export default EditIssue;
