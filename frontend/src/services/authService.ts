import api from './api';
import type { Token, UserResponse } from '../types';
import { API_ENDPOINTS } from '../constants/api';

export const authService = {
  async register(name: string, email: string, password: string, role: string = 'user'): Promise<{ message: string }> {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, { name, email, password, role });
    return response.data;
  },

  async login(email: string, password: string): Promise<Token> {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    return response.data;
  },

  async getMe(): Promise<UserResponse> {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },
};
