import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { AuthProvider } from './contexts/AuthProvider';
import { AuthQueryProvider } from './components/AuthQueryProvider';
import ProtectedRoute from './components/ProtectedRoute';
import { PermissionGuard } from './components/PermissionGuard';
import { USER_ADMIN, TEAM_LEADER } from './hooks/useUserClaims';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';

const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);

const pageImports = {
  LoginPage: () => import('./features/auth/LoginPage'),
  SetPasswordPage: () => import('./features/auth/SetPasswordPage'),
  ForgotPasswordPage: () => import('./features/auth/ForgotPasswordPage'),
  ResetPasswordPage: () => import('./features/auth/ResetPasswordPage'),
  HomePage: () => import('./features/summary/HomePage'),
  DailyDetailsPage: () => import('./features/summary/DailyDetailsPage'),
  EditRequestsPage: () => import('./features/requests/EditRequestsPage'),
  RegistrationNumbersPage: () => import('./features/registration-numbers/RegistrationNumbersPage'),
  EditReservationsPage: () => import('./features/reservations/EditReservationsPage'),
  OverrideRequestsPage: () => import('./features/requests/OverrideRequestsPage'),
  UsersPage: () => import('./features/users/UsersPage'),
  AddUserPage: () => import('./features/users/AddUserPage'),
  EditUserPage: () => import('./features/users/EditUserPage'),
  DeleteUserPage: () => import('./features/users/DeleteUserPage'),
  ProfilePage: () => import('./features/profile/ProfilePage'),
  FAQPage: () => import('./features/static/FAQPage'),
  PrivacyPage: () => import('./features/static/PrivacyPage'),
  AccessDeniedPage: () => import('./features/static/AccessDeniedPage'),
  NotFoundPage: () => import('./features/static/NotFoundPage'),
};

const LoginPage = lazy(pageImports.LoginPage);
const SetPasswordPage = lazy(pageImports.SetPasswordPage);
const ForgotPasswordPage = lazy(pageImports.ForgotPasswordPage);
const ResetPasswordPage = lazy(pageImports.ResetPasswordPage);
const HomePage = lazy(pageImports.HomePage);
const DailyDetailsPage = lazy(pageImports.DailyDetailsPage);
const EditRequestsPage = lazy(pageImports.EditRequestsPage);
const RegistrationNumbersPage = lazy(pageImports.RegistrationNumbersPage);
const EditReservationsPage = lazy(pageImports.EditReservationsPage);
const OverrideRequestsPage = lazy(pageImports.OverrideRequestsPage);
const UsersPage = lazy(pageImports.UsersPage);
const AddUserPage = lazy(pageImports.AddUserPage);
const EditUserPage = lazy(pageImports.EditUserPage);
const DeleteUserPage = lazy(pageImports.DeleteUserPage);
const ProfilePage = lazy(pageImports.ProfilePage);
const FAQPage = lazy(pageImports.FAQPage);
const PrivacyPage = lazy(pageImports.PrivacyPage);
const AccessDeniedPage = lazy(pageImports.AccessDeniedPage);
const NotFoundPage = lazy(pageImports.NotFoundPage);

function preloadAllPages() {
  Object.values(pageImports).forEach((importFn) => importFn());
}

function usePreloadRoutes() {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(preloadAllPages);
      return () => cancelIdleCallback(id);
    } else {
      const id = setTimeout(preloadAllPages, 2000);
      return () => clearTimeout(id);
    }
  }, []);
}

function App() {
  usePreloadRoutes();

  return (
    <AuthProvider>
      <AuthQueryProvider>
        <BrowserRouter>
          <Suspense>
            <SentryRoutes>
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
            </SentryRoutes>
          </Suspense>
        </BrowserRouter>
      </AuthQueryProvider>
    </AuthProvider>
  );
}

export default App;
