import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { AuthQueryProvider } from './components/AuthQueryProvider';
import ProtectedRoute from './components/ProtectedRoute';
import { PermissionGuard } from './components/PermissionGuard';
import { USER_ADMIN, TEAM_LEADER } from './hooks/useUserClaims';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import LoginPage from './features/auth/LoginPage';
import SetPasswordPage from './features/auth/SetPasswordPage';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/ResetPasswordPage';
import HomePage from './features/summary/HomePage';
import DailyDetailsPage from './features/summary/DailyDetailsPage';
import EditRequestsPage from './features/requests/EditRequestsPage';
import RegistrationNumbersPage from './features/registration-numbers/RegistrationNumbersPage';
import EditReservationsPage from './features/reservations/EditReservationsPage';
import OverrideRequestsPage from './features/requests/OverrideRequestsPage';
import UsersPage from './features/users/UsersPage';
import AddUserPage from './features/users/AddUserPage';
import EditUserPage from './features/users/EditUserPage';
import DeleteUserPage from './features/users/DeleteUserPage';
import ProfilePage from './features/profile/ProfilePage';
import FAQPage from './features/static/FAQPage';
import PrivacyPage from './features/static/PrivacyPage';
import AccessDeniedPage from './features/static/AccessDeniedPage';
import NotFoundPage from './features/static/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <AuthQueryProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<PublicLayout />}>
              <Route index element={<LoginPage />} />
            </Route>
            <Route path="/set-password" element={<PublicLayout />}>
              <Route index element={<SetPasswordPage />} />
            </Route>
            <Route path="/forgot-password" element={<PublicLayout />}>
              <Route index element={<ForgotPasswordPage />} />
            </Route>
            <Route path="/reset-password" element={<PublicLayout />}>
              <Route index element={<ResetPasswordPage />} />
            </Route>
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<HomePage />} />
              <Route path="daily-details/:date" element={<DailyDetailsPage />} />
              <Route path="edit-requests" element={<EditRequestsPage />} />
              <Route path="registration-numbers" element={<RegistrationNumbersPage />} />
              <Route
                path="edit-reservations"
                element={
                  <PermissionGuard requiredPermissions={[TEAM_LEADER]}>
                    <EditReservationsPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="override-requests"
                element={
                  <PermissionGuard requiredPermissions={[TEAM_LEADER]}>
                    <OverrideRequestsPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="users"
                element={
                  <PermissionGuard requiredPermissions={[USER_ADMIN]}>
                    <UsersPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="users/add"
                element={
                  <PermissionGuard requiredPermissions={[USER_ADMIN]}>
                    <AddUserPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="users/edit/:userId"
                element={
                  <PermissionGuard requiredPermissions={[USER_ADMIN]}>
                    <EditUserPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="users/delete/:userId"
                element={
                  <PermissionGuard requiredPermissions={[USER_ADMIN]}>
                    <DeleteUserPage />
                  </PermissionGuard>
                }
              />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="faq" element={<FAQPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="access-denied" element={<AccessDeniedPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthQueryProvider>
    </AuthProvider>
  );
}

export default App;
