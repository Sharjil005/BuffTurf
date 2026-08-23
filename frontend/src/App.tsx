import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import OwnerLayout from './layouts/OwnerLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Discovery from './pages/Discovery';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import AddTurf from './pages/owner/AddTurf';
import NotFound from './pages/NotFound';
import TurfDetail from './pages/TurfDetail';
import ManageSlots from './pages/owner/ManageSlots';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/turfs" element={<Discovery />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/turfs/:id" element={<TurfDetail />} />

            <Route element={<ProtectedRoute allowedRoles={['TURF_OWNER']} />}>
              <Route element={<OwnerLayout />}>
                <Route path="/owner" element={<OwnerDashboard />} />
                <Route path="/owner/add-turf" element={<AddTurf />} />
              </Route>
              <Route path="/owner/turfs/:id/slots" element={<ManageSlots />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;