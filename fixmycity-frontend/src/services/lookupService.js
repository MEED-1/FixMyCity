import api from './api';

export const lookupService = {
    categories: {
        async getAll() {
            const response = await api.get('/categories');
            return response.data;
        }
    },
    municipalities: {
        async getAll() {
            const response = await api.get('/municipalities');
            return response.data;
        }
    }
};
