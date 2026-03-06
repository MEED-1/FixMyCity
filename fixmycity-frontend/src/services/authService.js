import api from './api';

export const authService = {
    async register(userData) {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    async logout() {
        await api.post('/auth/logout');
        localStorage.removeItem('token');
    },

    async getCurrentUser() {
        const response = await api.get('/auth/me');
        return response.data;
    },

    async updateProfile(profileData) {
        const response = await api.put('/auth/profile', profileData);
        return response.data;
    },

    async updateProfilePicture(formData) {
        const response = await api.post('/auth/profile-picture', formData);
        return response.data;
    },

    async deleteProfilePicture() {
        const response = await api.delete('/auth/profile-picture');
        return response.data;
    },

    async deleteAccount() {
        const response = await api.delete('/auth/account');
        return response.data;
    },
};
