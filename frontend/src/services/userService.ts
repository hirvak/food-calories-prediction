import api from './api';
import { API_ENDPOINTS } from '../constants/api';
import type { UserProfileStats, UserListResponse } from '../types';

export const userService = {
  async getProfile(): Promise<UserProfileStats> {
    const response = await api.get(API_ENDPOINTS.USERS.GET_PROFILE);
    return response.data;
  },

  async updateProfile(data: { name?: string; email?: string }): Promise<{ message: string; user: any }> {
    const response = await api.patch(API_ENDPOINTS.USERS.UPDATE_PROFILE, data);
    return response.data;
  },

  async changePassword(data: any): Promise<{ message: string }> {
    const response = await api.patch(API_ENDPOINTS.USERS.CHANGE_PASSWORD, data);
    return response.data;
  },

  async getAdminUsers(page: number = 1, limit: number = 10): Promise<UserListResponse> {
    const response = await api.get(API_ENDPOINTS.USERS.ADMIN_USERS, {
      params: { page, limit },
    });
    return response.data;
  },

  async deleteUser(userId: number): Promise<{ message: string }> {
    const response = await api.delete(API_ENDPOINTS.USERS.ADMIN_DELETE_USER(userId));
    return response.data;
  },
};
export default userService;
