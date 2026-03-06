import api from './api';

export const helpService = {
    async getAll(filters = {}) {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.status) params.append('status', filters.status);
        if (filters.mine) params.append('mine', 'true');

        const response = await api.get(`/community-help?${params.toString()}`);
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/community-help/${id}`);
        return response.data;
    },

    async create(requestData) {
        const response = await api.post('/community-help', requestData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async delete(id) {
        const response = await api.delete(`/community-help/${id}`);
        return response.data;
    },

    async update(id, requestData) {
        if (requestData instanceof FormData) {
            requestData.append('_method', 'PATCH');
        } else {
            const formData = new FormData();
            formData.append('_method', 'PATCH');
            Object.keys(requestData).forEach(key => {
                if (requestData[key] !== null) {
                    formData.append(key, requestData[key]);
                }
            });
            requestData = formData;
        }

        const response = await api.post(`/community-help/${id}`, requestData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};
