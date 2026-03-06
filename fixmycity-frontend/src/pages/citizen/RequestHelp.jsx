import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LocationPicker from '../../components/map/LocationPicker';
import { helpService } from '../../services/helpService';
import { toast } from 'react-toastify';
import { PhotoIcon, MapPinIcon, CurrencyDollarIcon, HandRaisedIcon } from '@heroicons/react/24/outline';
import CustomDropdown from '../../components/common/CustomDropdown';

function RequestHelp() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'volunteering',
        target_amount: '',
        latitude: '',
        longitude: '',
        photos: null,
    });
    const [previewUrls, setPreviewUrls] = useState([]);

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

            if (formData.photos) {
                for (let i = 0; i < formData.photos.length; i++) {
                    data.append('photos[]', formData.photos[i]);
                }
            }

            await helpService.create(data);
            toast.success('Help request submitted successfully!');
            navigate('/community');
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground">Request Community Help</h1>
                    <p className="mt-1 text-muted-foreground">Ask for volunteers or financial support from your neighbors.</p>
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
                                                placeholder="e.g., Park Cleanup needed"
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
                                                    placeholder="0.00"
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
                                                placeholder="Describe exactly what help you need..."
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
                                    <LocationPicker onLocationSelect={handleLocationSelect} />
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground flex items-center">
                                    <MapPinIcon className="h-4 w-4 mr-1" />
                                    Tap on the map to pin the location where help is needed.
                                </p>
                            </div>

                            {}
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-foreground mb-4 flex items-center">
                                    <span className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center mr-3 text-sm font-bold">3</span>
                                    Photos
                                </h3>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="space-y-1 text-center">
                                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/70 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                                            >
                                                <span>Upload a file</span>
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
                                            <div key={idx} className="relative aspect-w-4 aspect-h-3 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                                <img src={url} alt={`Preview ${idx}`} className="object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-muted/30 flex items-center justify-end rounded-b-2xl">
                            <button
                                type="button"
                                onClick={() => navigate('/community')}
                                className="bg-surface py-2 px-6 border border-border rounded-md shadow-sm text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-4"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary-3d"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default RequestHelp;
