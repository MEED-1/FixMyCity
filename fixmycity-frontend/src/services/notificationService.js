import api from './api';

const notificationService = {
    getAll: () => api.get('/notifications'),
    markAsRead: (id) => api.post(`/notifications/${id}/read`),
    delete: (id) => api.delete(`/notifications/${id}`),
};

export default notificationService;
