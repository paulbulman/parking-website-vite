import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { PermissionGuard } from './components/PermissionGuard';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import EditRequests from './pages/EditRequests';
import RegistrationNumbers from './pages/RegistrationNumbers';
import EditReservations from './pages/EditReservations';
import OverrideRequests from './pages/OverrideRequests';
import Users from './pages/Users';
import Profile from './pages/Profile';
import FAQ from './pages/FAQ';
import AccessDenied from './pages/AccessDenied';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<PublicLayout />}>
              <Route index element={<Login />} />
            </Route>
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Home />} />
              <Route path="edit-requests" element={<EditRequests />} />
              <Route path="registration-numbers" element={<RegistrationNumbers />} />
              <Route
                path="edit-reservations"
                element={
                  <PermissionGuard requiredPermissions={['TeamLeader']}>
                    <EditReservations />
                  </PermissionGuard>
                }
              />
              <Route
                path="override-requests"
                element={
                  <PermissionGuard requiredPermissions={['TeamLeader']}>
                    <OverrideRequests />
                  </PermissionGuard>
                }
              />
              <Route
                path="users"
                element={
                  <PermissionGuard requiredPermissions={['UserAdmin']}>
                    <Users />
                  </PermissionGuard>
                }
              />
              <Route path="profile" element={<Profile />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="access-denied" element={<AccessDenied />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
