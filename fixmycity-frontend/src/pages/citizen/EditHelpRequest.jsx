import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LocationPicker from '../../components/map/LocationPicker';
import { helpService } from '../../services/helpService';
import { toast } from 'react-toastify';
import { PhotoIcon, MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline';
import CustomDropdown from '../../components/common/CustomDropdown';

function EditHelpRequest() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'volunteering',
        target_amount: '',
        latitude: '',
        longitude: '',
        photos: null,
    });

    const [existingPhotos, setExistingPhotos] = useState([]);
    const [removedPhotos, setRemovedPhotos] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    useEffect(() => {
        fetchRequestData();
    }, [id]);

    const fetchRequestData = async () => {
        try {
            const data = await helpService.getById(id);

            if (data.current_amount > 0 || data.donations_count > 0) {
                toast.error('Cannot edit a request that has received donations.');
                navigate(`/community-help/${id}`);
                return;
            }

            setFormData({
                title: data.title || '',
                description: data.description || '',
                category: data.category || 'volunteering',
                target_amount: data.target_amount || '',
                latitude: data.location?.coordinates[1] || '',
                longitude: data.location?.coordinates[0] || '',
                photos: null
            });

            if (data.photos && data.photos.length > 0) {
                setExistingPhotos(data.photos);
            }
        } catch (error) {
            toast.error('Failed to load request data');
            navigate('/community');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, photos: files });

        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(newPreviewUrls);
    };

    const removeExistingPhoto = (photoUrl) => {
        setExistingPhotos(existingPhotos.filter(p => p !== photoUrl));
        setRemovedPhotos([...removedPhotos, photoUrl]);
    };

    const removeNewPreview = (index) => {
        const newPhotos = [...formData.photos];
        newPhotos.splice(index, 1);
        setFormData({ ...formData, photos: newPhotos });

        const newUrls = [...previewUrls];
        URL.revokeObjectURL(newUrls[index]);
        newUrls.splice(index, 1);
        setPreviewUrls(newUrls);
    };

    const handleLocationSelect = (latlng) => {
        setFormData({
            ...formData,
            latitude: latlng.lat,
            longitude: latlng.lng,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.latitude || !formData.longitude) {
            toast.error('Please select a location on the map.');
            return;
        }

        if (formData.category === 'donation' && (!formData.target_amount || formData.target_amount <= 0)) {
            toast.error('Please specify a valid target amount for donation requests.');
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('latitude', formData.latitude);
            data.append('longitude', formData.longitude);

            if (formData.category === 'donation') {
                data.append('target_amount', formData.target_amount);
            }

            if (formData.photos && formData.photos.length > 0) {
                for (let i = 0; i < formData.photos.length; i++) {
                    data.append('photos[]', formData.photos[i]);
                }
            }

            if (removedPhotos.length > 0) {
                data.append('removed_photos', JSON.stringify(removedPhotos));
            }

            await helpService.update(id, data);
            toast.success('Help request updated successfully! It may require admin approval if details were changed.');
            navigate(`/community-help/${id}`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Edit Help Request</h1>
                        <p className="mt-1 text-muted-foreground">Modify your community help request details.</p>
                    </div>
                    <button
                        onClick={() => navigate(`/community-help/${id}`)}
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                        Back to Request
                    </button>
                </div>

                <div className="card-3d overflow-hidden">
                    <form onSubmit={handleSubmit} className="divide-y divide-gray-200 dark:divide-gray-700">
                        <div className="px-6 py-8 space-y-8">

                            {}
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-foreground mb-4 flex items-center">
                                    <span className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center mr-3 text-sm font-bold">1</span>
                                    Basic Information
                                </h3>

                                <div className="mb-4 bg-amber-50 dark:bg-amber-500/10 border-l-4 border-amber-400 p-4 rounded-r-md">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <p className="text-sm text-amber-700 dark:text-amber-400">
                                                Editing the title, description, or photos will change the status back to "Pending Approval".
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                    <div className="sm:col-span-4">
                                        <label htmlFor="title" className="block text-sm font-medium text-muted-foreground">
                                            Request Title <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="title"
                                                id="title"
                                                required
                                                className="input-3d"
                                                value={formData.title}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="category" className="block text-sm font-medium text-muted-foreground">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-3">
                                            <CustomDropdown
                                                value={formData.category}
                                                onChange={(val) => setFormData({ ...formData, category: val })}
                                                options={[
                                                    { value: 'volunteering', label: 'Volunteering (Time/Effort)' },
                                                    { value: 'donation', label: 'Donation (Financial Support)' },
                                                    { value: 'other', label: 'Other' }
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    {formData.category === 'donation' && (
                                        <div className="sm:col-span-3">
                                            <label htmlFor="target_amount" className="block text-sm font-medium text-muted-foreground">
                                                Target Amount (DH) <span className="text-red-500">*</span>
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">$</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    name="target_amount"
                                                    id="target_amount"
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                    className="input-3d pl-7"
                                                    value={formData.target_amount}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="sm:col-span-6">
                                        <label htmlFor="description" className="block text-sm font-medium text-muted-foreground">
                                            Description <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="description"
                                                name="description"
                                                rows={4}
                                                required
                                                className="input-3d"
                                                value={formData.description}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {}
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-foreground mb-4 flex items-center">
                                    <span className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center mr-3 text-sm font-bold">2</span>
                                    Location
                                </h3>
                                <div className="rounded-lg overflow-hidden border border-border shadow-inner">
                                    {}
                                    <LocationPicker
                                        onLocationSelect={handleLocationSelect}
                                        initialPosition={formData.latitude && formData.longitude ? [formData.latitude, formData.longitude] : null}
                                    />
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground flex items-center">
                                    <MapPinIcon className="h-4 w-4 mr-1" />
                                    Tap on the map to change the location.
                                </p>
                            </div>

                            {}
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-foreground mb-4 flex items-center">
                                    <span className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center mr-3 text-sm font-bold">3</span>
                                    Photos
                                </h3>

                                {}
                                {existingPhotos.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Current Photos</h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {existingPhotos.map((url, idx) => (
                                                <div key={idx} className="relative aspect-w-4 aspect-h-3 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                                                    <img src={url} alt={`Existing ${idx}`} className="object-cover w-full h-full" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExistingPhoto(url)}
                                                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg transform transition-transform scale-90 group-hover:scale-100"
                                                            title="Remove photo"
                                                        >
                                                            <XMarkIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Add New Photos</h4>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-muted/50 transition-colors">
                                        <div className="space-y-1 text-center">
                                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex justify-center text-sm text-gray-600 dark:text-gray-400">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-medium text-primary hover:text-primary/70 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                                                >
                                                    <span>Upload files</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleFileChange} />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                        </div>
                                    </div>
                                    {previewUrls.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {previewUrls.map((url, idx) => (
                                                <div key={`new-${idx}`} className="relative aspect-w-4 aspect-h-3 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                                                    <img src={url} alt={`Preview ${idx}`} className="object-cover w-full h-full" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between">
                                                        <div className="p-1 flex justify-end">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeNewPreview(idx)}
                                                                className="bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-full shadow-sm"
                                                                title="Remove file"
                                                            >
                                                                <XMarkIcon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                        <div className="bg-black/60 p-1.5 text-center">
                                                            <span className="text-[10px] text-white font-medium uppercase tracking-wider">New</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-muted/30 flex items-center justify-end rounded-b-2xl gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(`/community-help/${id}`)}
                                className="bg-surface py-2.5 px-6 border border-border rounded-xl shadow-sm text-sm font-semibold text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary-3d py-2.5 px-8 flex items-center justify-center font-semibold rounded-xl text-sm"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default EditHelpRequest;
