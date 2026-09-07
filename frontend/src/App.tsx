import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ErrorBoundary from './components/ErrorBoundary';
import MainLayout from './layouts/MainLayout';
import OwnerLayout from './layouts/OwnerLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Discovery from './pages/Discovery';
import TurfDetail from './pages/TurfDetail';
import MyBookings from './pages/MyBookings';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import Support from './pages/Support';

const OwnerOverview = lazy(() => import('./pages/owner/OwnerOverview'));
const OwnerDashboard = lazy(() => import('./pages/owner/OwnerDashboard'));
const OwnerBookings = lazy(() => import('./pages/owner/OwnerBookings'));
const OwnerAnalytics = lazy(() => import('./pages/owner/OwnerAnalytics'));
const OwnerComplaints = lazy(() => import('./pages/owner/OwnerComplaints'));
const AddTurf = lazy(() => import('./pages/owner/AddTurf'));
const ManageSlots = lazy(() => import('./pages/owner/ManageSlots'));

const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminTurfs = lazy(() => import('./pages/admin/AdminTurfs'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminComplaints = lazy(() => import('./pages/admin/AdminComplaints'));

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center text-ink-900/50">
      Loading...
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/turfs" element={<Discovery />} />
                  <Route path="/turfs/:id" element={<TurfDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  <Route element={<ProtectedRoute />}>
                    <Route path="/my-bookings" element={<MyBookings />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/support" element={<Support />} />
                  </Route>

                  <Route element={<ProtectedRoute allowedRoles={['TURF_OWNER']} />}>
                    <Route element={<OwnerLayout />}>
                      <Route path="/owner" element={<OwnerOverview />} />
                      <Route path="/owner/turfs" element={<OwnerDashboard />} />
                      <Route path="/owner/bookings" element={<OwnerBookings />} />
                      <Route path="/owner/analytics" element={<OwnerAnalytics />} />
                      <Route path="/owner/complaints" element={<OwnerComplaints />} />
                      <Route path="/owner/add-turf" element={<AddTurf />} />
                    </Route>
                    <Route path="/owner/turfs/:id/slots" element={<ManageSlots />} />
                  </Route>

                  <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                    <Route element={<AdminLayout />}>
                      <Route path="/admin" element={<AdminOverview />} />
                      <Route path="/admin/users" element={<AdminUsers />} />
                      <Route path="/admin/turfs" element={<AdminTurfs />} />
                      <Route path="/admin/bookings" element={<AdminBookings />} />
                      <Route path="/admin/analytics" element={<AdminAnalytics />} />
                      <Route path="/admin/complaints" element={<AdminComplaints />} />
                    </Route>
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;