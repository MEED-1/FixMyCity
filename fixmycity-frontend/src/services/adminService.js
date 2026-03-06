import api from './api';

export const adminService = {
    async getStats() {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    async getUsers(role = '') {
        const params = new URLSearchParams();
        if (role) params.append('role', role);

        const response = await api.get(`/admin/users?${params.toString()}`);
        return response.data;
    },

    async assignIssue(issueId, agentId) {
        const response = await api.post(`/admin/issues/${issueId}/assign`, { agent_id: agentId });
        return response.data;
    },

    async deleteUser(userId) {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    },

    async getTransactions() {
        const response = await api.get('/admin/transactions');
        return response.data;
    },

    async getCategories() {
        const response = await api.get('/admin/categories');
        return response.data;
    },
    async createCategory(data) {
        const response = await api.post('/admin/categories', data);
        return response.data;
    },
    async updateCategory(id, data) {
        const response = await api.put(`/admin/categories/${id}`, data);
        return response.data;
    },
    async deleteCategory(id) {
        const response = await api.delete(`/admin/categories/${id}`);
        return response.data;
    },

    async getMunicipalities() {
        const response = await api.get('/admin/municipalities');
        return response.data;
    },
    async createMunicipality(data) {
        const response = await api.post('/admin/municipalities', data);
        return response.data;
    },
    async updateMunicipality(id, data) {
        const response = await api.put(`/admin/municipalities/${id}`, data);
        return response.data;
    },
    async deleteMunicipality(id) {
        const response = await api.delete(`/admin/municipalities/${id}`);
        return response.data;
    },

    async updateIssueStatus(issueId, status) {
        const response = await api.patch(`/admin/issues/${issueId}/status`, { status });
        return response.data;
    },
    async deleteIssue(issueId) {
        const response = await api.delete(`/admin/issues/${issueId}`);
        return response.data;
    },
    async deleteComment(issueId, commentIndex) {
        const response = await api.delete(`/admin/issues/${issueId}/comments/${commentIndex}`);
        return response.data;
    },

    async updateUserRole(userId, role) {
        const response = await api.patch(`/admin/users/${userId}/role`, { role });
        return response.data;
    },

    async updateHelpRequestStatus(id, verification_status) {
        const response = await api.patch(`/admin/help-requests/${id}/status`, { verification_status });
        return response.data;
    },
    async deleteHelpRequest(id) {
        const response = await api.delete(`/admin/help-requests/${id}`);
        return response.data;
    }
};
