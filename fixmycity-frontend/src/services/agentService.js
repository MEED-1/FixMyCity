import api from './api';

export const agentService = {
    async getAssignedIssues(filters = {}) {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);

        const response = await api.get(`/agent/issues?${params.toString()}`);
        return response.data;
    },

    async updateStatus(issueId, status) {
        const response = await api.patch(`/agent/issues/${issueId}/status`, { status });
        return response.data;
    },

    async updateStatusWithPhotos(issueId, formData) {
        formData.append('_method', 'PATCH');
        const response = await api.post(`/agent/issues/${issueId}/status`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    async getReports() {
        const response = await api.get('/agent/reports');
        return response.data;
    }
};
