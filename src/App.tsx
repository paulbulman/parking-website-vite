import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import RegistrationNumbers from './pages/RegistrationNumbers';
import EditReservations from './pages/EditReservations';
import OverrideRequests from './pages/OverrideRequests';
import Users from './pages/Users';
import Profile from './pages/Profile';
import FAQ from './pages/FAQ';
import Logout from './pages/Logout';

function App() {
  return (
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
  );
}

export default App;
