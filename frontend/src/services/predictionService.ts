import api from './api';
import { API_ENDPOINTS } from '../constants/api';
import type {
  PredictFoodResult,
  PredictionHistoryResponse,
  AdminPredictionHistoryResponse,
  TodayNutritionSummary,
  PeriodicNutritionSummary,
  TopFoodsResponse,
  AdminDashboardStats,
  DashboardAnalyticsResponse,
  Prediction,
  FoodSearchItem,
} from '../types';

export const predictionService = {
  async predictFood(imageFile: File, weight: number): Promise<PredictFoodResult> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('weight', weight.toString());

    const response = await api.post(API_ENDPOINTS.PREDICTIONS.PREDICT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async searchFoods(query: string): Promise<FoodSearchItem[]> {
    const response = await api.get('/nutrition/search', {
      params: { query },
    });
    return response.data;
  },

  async saveManualMeal(foodId: number, weightGrams: number): Promise<PredictFoodResult> {
    const response = await api.post('/prediction/manual', {
      food_id: foodId,
      weight_grams: weightGrams,
    });
    return response.data;
  },

  async getHistory(page: number = 1, limit: number = 10): Promise<PredictionHistoryResponse> {
    const response = await api.get(API_ENDPOINTS.PREDICTIONS.HISTORY, {
      params: { page, limit },
    });
    return response.data;
  },

  async deletePrediction(predictionId: number): Promise<{ message: string }> {
    const response = await api.delete(API_ENDPOINTS.PREDICTIONS.DELETE(predictionId));
    return response.data;
  },

  async getTodaySummary(): Promise<TodayNutritionSummary> {
    const response = await api.get(API_ENDPOINTS.PREDICTIONS.TODAY_SUMMARY);
    return response.data;
  },

  async getWeeklySummary(): Promise<PeriodicNutritionSummary> {
    const response = await api.get(API_ENDPOINTS.PREDICTIONS.WEEKLY_SUMMARY);
    return response.data;
  },

  async getMonthlySummary(): Promise<PeriodicNutritionSummary> {
    const response = await api.get(API_ENDPOINTS.PREDICTIONS.MONTHLY_SUMMARY);
    return response.data;
  },

  async getTopFoods(): Promise<TopFoodsResponse> {
    const response = await api.get(API_ENDPOINTS.PREDICTIONS.TOP_FOODS);
    return response.data;
  },

  async getAllHistory(page: number = 1, limit: number = 10): Promise<AdminPredictionHistoryResponse> {
    const response = await api.get(API_ENDPOINTS.PREDICTIONS.ALL_HISTORY, {
      params: { page, limit },
    });
    return response.data;
  },

  async getAdminDashboard(): Promise<AdminDashboardStats> {
    const response = await api.get(API_ENDPOINTS.USERS.ADMIN_DASHBOARD);
    return response.data;
  },

  async getDashboardAnalytics(): Promise<DashboardAnalyticsResponse> {
    const response = await api.get(API_ENDPOINTS.PREDICTIONS.ANALYTICS);
    return response.data;
  },

  async updatePrediction(predictionId: number, foodName: string, weight: number): Promise<{ message: string; prediction: Prediction }> {
    const response = await api.patch(`/prediction/${predictionId}`, {
      food_name: foodName,
      weight
    });
    return response.data;
  },
};
export default predictionService;
