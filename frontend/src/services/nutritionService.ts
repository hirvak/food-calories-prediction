import api from './api';
import type { BMICalculatorRequest, BMICalculatorResponse } from '../types';

export const nutritionService = {
  calculateBMI: async (data: BMICalculatorRequest): Promise<BMICalculatorResponse> => {
    const response = await api.post('/nutrition/bmi-calculator', data);
    return response.data;
  }
};
