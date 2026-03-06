import { create } from 'zustand';
import { authService } from '../services/authService';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.login(credentials);
      const { token, user } = data;

      localStorage.setItem('token', token);
      set({
        user,
        token,
        isAuthenticated: true,
        loading: false
      });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Login failed',
        loading: false
      });
      return false;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.register(userData);
      const { token, user } = data;

      localStorage.setItem('token', token);
      set({
        user,
        token,
        isAuthenticated: true,
        loading: false
      });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.errors || 'Registration failed',
        loading: false
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ loading: true });
    try {
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: true, loading: false });
    } catch (error) {
      set({ user: null, token: null, isAuthenticated: false, loading: false });
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.updateProfile(profileData);
      set((state) => ({
        user: { ...state.user, ...data.user },
        loading: false
      }));
      return { success: true, message: data.message };
    } catch (error) {
      set({
        error: error.response?.data?.errors || 'Profile update failed',
        loading: false
      });
      return { success: false, error: error.response?.data?.errors || 'Profile update failed' };
    }
  },

  updateProfilePicture: async (file) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const data = await authService.updateProfilePicture(formData);
      set((state) => ({
        user: { ...state.user, avatar_url: data.avatar_url },
        loading: false
      }));
      return { success: true, avatar_url: data.avatar_url };
    } catch (error) {
      set({
        error: error.response?.data?.errors?.avatar?.[0] || 'Image upload failed',
        loading: false
      });
      return { success: false, error: error.response?.data?.errors?.avatar?.[0] || 'Image upload failed' };
    }
  },

  deleteProfilePicture: async () => {
    set({ loading: true, error: null });
    try {
      await authService.deleteProfilePicture();
      set((state) => ({
        user: { ...state.user, avatar_url: null },
        loading: false
      }));
      return { success: true };
    } catch (error) {
      set({
        error: 'Failed to delete profile picture',
        loading: false
      });
      return { success: false, error: 'Failed to delete profile picture' };
    }
  },

  deleteAccount: async () => {
    set({ loading: true, error: null });
    try {
      await authService.deleteAccount();
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, loading: false });
      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to delete account',
        loading: false
      });
      return { success: false, error: error.response?.data?.error || 'Failed to delete account' };
    }
  }
}));

export default useAuthStore;