export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | string;
  is_active?: boolean;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface UserProfileStats {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  member_since: string;
  total_predictions: number;
  total_calories_consumed: number;
  current_streak?: number;
  longest_streak?: number;
  last_meal_logged_date?: string | null;
}

export interface UserListResponse {
  page: number;
  limit: number;
  total_records: number;
  total_pages: number;
  users: User[];
}

export interface Prediction {
  id: number;
  user_id: number;
  food_name: string;
  weight_grams: number;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fiber: number;
  sugar: number;
  confidence: number;
  image_path: string | null;
  prediction_source?: 'IMAGE' | 'MANUAL' | 'BARCODE' | string;
  nutrition_id?: number | null;
  created_at: string;
}

export interface FoodSearchItem {
  id: number;
  food_name: string;
  calories_per_100g: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fiber: number;
  sugar: number;
}

export interface PredictionHistoryResponse {
  user: User;
  page: number;
  limit: number;
  total_records: number;
  total_pages: number;
  predictions: Prediction[];
}

export interface AdminPredictionHistoryResponse {
  page: number;
  limit: number;
  total_records: number;
  total_pages: number;
  predictions: Prediction[];
}

export interface PredictFoodResult {
  food_name: string;
  confidence: number;
  weight: number;
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
    fiber: number;
    sugar: number;
  };
  message?: string; // in case of "No food detected" response
  nutrition_coach?: {
    score: number;
    stars: number;
    good_points: string[];
    warnings: string[];
    recommendation: string;
    hydration_tip: string;
  };
  healthy_alternatives?: string[];
  streak_updated_today?: boolean;
}

export interface TodayNutritionSummary {
  user: string;
  foods_consumed: number;
  total_calories: number;
  total_protein: number;
  total_fat: number;
  total_carbohydrates: number;
}

export interface PeriodicNutritionSummary {
  user: string;
  foods_consumed: number;
  total_calories: number;
  total_protein: number;
  total_fat: number;
  total_carbohydrates: number;
  total_fiber: number;
  total_sugar: number;
}

export interface TopFoodItem {
  food_name: string;
  count: number;
}

export interface TopFoodsResponse {
  user: string;
  top_foods: TopFoodItem[];
}

export interface AdminDashboardStats {
  total_users: number;
  total_predictions: number;
  total_calories_consumed: number;
  most_detected_food: string | null;
}

export interface DashboardAnalyticsResponse {
  weekly_trend: {
    day: string;
    calories: number;
  }[];
  macronutrients: {
    protein: number;
    fat: number;
    carbohydrates: number;
  };
  statistics: {
    total_predictions: number;
    average_calories: number;
    average_confidence: number;
    highest_calorie_meal: {
      food: string;
      calories: number;
    } | null;
    lowest_calorie_meal: {
      food: string;
      calories: number;
    } | null;
  };
  recent_activity: {
    food: string;
    calories: number;
    confidence: number;
    time: string;
  }[];
  top_foods: {
    food_name: string;
    count: number;
  }[];
  current_streak: number;
  longest_streak: number;
  last_meal_logged_date: string | null;
}

export interface BMICalculatorRequest {
  age: number;
  gender: 'male' | 'female';
  height_cm: number;
  weight_kg: number;
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

export interface BMICalculatorResponse {
  bmi: number;
  bmi_category: string;
  maintenance_calories: number;
  weight_loss_calories: number;
  weight_gain_calories: number;
}
