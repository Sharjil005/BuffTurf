import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import OwnerLayout from './layouts/OwnerLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Discovery from './pages/Discovery';
import TurfDetail from './pages/TurfDetail';
import MyBookings from './pages/MyBookings';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import AddTurf from './pages/owner/AddTurf';
import ManageSlots from './pages/owner/ManageSlots';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import OwnerOverview from './pages/owner/OwnerOverview';
import OwnerBookings from './pages/owner/OwnerBookings';
import AdminLayout from './layouts/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTurfs from './pages/admin/AdminTurfs';
import AdminBookings from './pages/admin/AdminBookings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/turfs" element={<Discovery />} />
            <Route path="/turfs/:id" element={<TurfDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/my-bookings" element={<MyBookings />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['TURF_OWNER']} />}>
              <Route element={<OwnerLayout />}>
                <Route path="/owner" element={<OwnerOverview />} />
                <Route path="/owner/turfs" element={<OwnerDashboard />} />
                <Route path="/owner/bookings" element={<OwnerBookings />} />
                <Route path="/owner/add-turf" element={<AddTurf />} />
              </Route>
              <Route path="/owner/turfs/:id/slots" element={<ManageSlots />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/favorites" element={<Favorites />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminOverview />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/turfs" element={<AdminTurfs />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;