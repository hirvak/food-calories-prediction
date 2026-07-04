import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import PredictFood from './pages/PredictFood';
import Dashboard from './pages/Dashboard';
import PredictionHistory from './pages/PredictionHistory';
import UserProfile from './pages/UserProfile';
import UpdateProfile from './pages/UpdateProfile';
import ChangePassword from './pages/ChangePassword';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import AdminPredictions from './pages/AdminPredictions';
import BmiCalculator from './pages/BmiCalculator';
import Reports from './pages/Reports';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes wrapped in MainLayout */}
            <Route
              path="/predict"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PredictFood />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PredictionHistory />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <UserProfile />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bmi-calculator"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <BmiCalculator />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Reports />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/update"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <UpdateProfile />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/change-password"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ChangePassword />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes wrapped in MainLayout */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <MainLayout>
                    <AdminDashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <MainLayout>
                    <UserManagement />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/predictions"
              element={
                <ProtectedRoute adminOnly>
                  <MainLayout>
                    <AdminPredictions />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback to root landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
