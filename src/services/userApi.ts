import api from './api';
import type { User } from '../types';

// ✅ Get public user profile by ID (no auth required)
export const getUserById = async (userId: string) => {
  try {
    const response = await api.get(`/profile/${userId}`);
    return response.data.user || response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile.');
  }
};

// ✅ Get current logged-in user profile (auth required)
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get('/profile');
    return response.data.user || response.data; // <— ensure structure is same as updateUserProfile
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch current user.');
  }
};

// ✅ Update user profile (multipart or JSON)
export const updateUserProfile = async (
  data: Partial<User> | FormData
): Promise<User> => {
  try {
    const isFormData = data instanceof FormData;
    const response = await api.put('/profile', data, {
      headers: isFormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' },
    });
    return response.data.user || response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to update user profile.'
    );
  }
};
