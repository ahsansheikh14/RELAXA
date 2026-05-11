import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/user/LoginPage';
import DashboardPage from '../pages/user/DashboardPage';
import ExercisesPage from '../pages/user/ExercisesPage';
import ReportsPage from '../pages/user/ReportsPage';
import ChatPage from '../pages/user/ChatPage';
import ResetPasswordPage from '../pages/user/ResetPasswordPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminContentPage from '../pages/admin/AdminContentPage';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage';
import AdminAddExercisePage from '../pages/admin/AdminAddExercisePage';
import AdminProtectedRoute from '../components/AdminProtectedRoute';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/exercises" element={<ExercisesPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/content" element={<AdminContentPage />} />
        <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        <Route path="/admin/exercises/new" element={<AdminAddExercisePage />} />
        <Route path="/admin/exercises/:id/edit" element={<AdminAddExercisePage />} />
      </Route>

      <Route path="*" element={<p>404 - Page not found</p>} />
    </Routes>
  );
}

export default AppRouter;
