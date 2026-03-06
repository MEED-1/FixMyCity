import api from './api';

export const issueService = {
    async getAll(filters = {}) {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.status) params.append('status', filters.status);
        if (filters.mine) params.append('mine', 'true');

        const response = await api.get(`/urban-issues?${params.toString()}`);
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/urban-issues/${id}`);
        return response.data;
    },

    async create(issueData) {
        const response = await api.post('/urban-issues', issueData);
        return response.data;
    },

    async update(id, issueData) {
        if (issueData instanceof FormData) {
            issueData.append('_method', 'PATCH');
            const response = await api.post(`/urban-issues/${id}`, issueData);
            return response.data;
        } else {
            const response = await api.patch(`/urban-issues/${id}`, issueData);
            return response.data;
        }
    },

    async delete(id) {
        const response = await api.delete(`/urban-issues/${id}`);
        return response.data;
    },

    async upvote(id) {
        const response = await api.post(`/urban-issues/${id}/upvote`);
        return response.data;
    },

    async addComment(id, content) {
        const response = await api.post(`/urban-issues/${id}/comments`, { content });
        return response.data;
    }
};
