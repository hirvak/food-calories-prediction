export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  // Users Profile & Administration
  USERS: {
    GET_PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/update-profile',
    CHANGE_PASSWORD: '/users/change-password',
    ADMIN_USERS: '/users/admin/users',
    ADMIN_DELETE_USER: (userId: number) => `/users/admin/delete-user/${userId}`,
    ADMIN_DASHBOARD: '/users/admin-dashboard',
  },
  // AI Predictions & History & Summaries
  PREDICTIONS: {
    PREDICT: '/prediction/predict',
    HISTORY: '/prediction/history',
    DELETE: (predictionId: number) => `/prediction/${predictionId}`,
    TODAY_SUMMARY: '/prediction/today-summary',
    WEEKLY_SUMMARY: '/prediction/weekly-summary',
    MONTHLY_SUMMARY: '/prediction/monthly-summary',
    TOP_FOODS: '/prediction/top-foods',
    ALL_HISTORY: '/prediction/all-history',
    ANALYTICS: '/prediction/dashboard-analytics',
  },
} as const;
