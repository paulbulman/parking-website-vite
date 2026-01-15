import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Home from './pages/Home';
import RegistrationNumbers from './pages/RegistrationNumbers';
import EditReservations from './pages/EditReservations';
import OverrideRequests from './pages/OverrideRequests';
import Users from './pages/Users';
import Profile from './pages/Profile';
import FAQ from './pages/FAQ';
import Logout from './pages/Logout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="registration-numbers" element={<RegistrationNumbers />} />
            <Route path="edit-reservations" element={<EditReservations />} />
            <Route path="override-requests" element={<OverrideRequests />} />
            <Route path="users" element={<Users />} />
            <Route path="profile" element={<Profile />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="logout" element={<Logout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
