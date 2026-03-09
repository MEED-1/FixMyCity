import api from './api';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

export const paymentService = {
    async createBoostSession(data) {
        const response = await api.post('/boost/create-session', data);
        return response.data;
    },

    async createDonationSession(data) {
        const response = await api.post('/donations/create-session', data);
        return response.data;
    },

    async getMyBoosts() {
        const response = await api.get('/boost/my-boosts');
        return response.data;
    },

    async getMyDonations() {
        const response = await api.get('/donations/my-donations');
        return response.data;
    }
};
