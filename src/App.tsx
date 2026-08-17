// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layout
import MainLayout from './components/MainLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import TouristDashboard from './pages/TouristDashboard';
import GuideDashboard from './pages/GuideDashboard';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MapPage from './pages/MapPage';
import TransportPage from './pages/TransportPage';
import TripPlanner from './pages/TripPlanner';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Routes jinke upar Navbar dikhega */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/transport" element={<TransportPage />} />
              <Route path="/tripplanner" element={<TripPlanner />} />

              {/* === PROTECTED DASHBOARD ROUTES === */}
              <Route
                path="/dashboard/tourist"
                element={
                  <ProtectedRoute requiredRole="tourist">
                    <TouristDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/guide"
                element={
                  <ProtectedRoute requiredRole="guide">
                    <GuideDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/seller"
                element={
                  <ProtectedRoute requiredRole="seller">
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Login Page (bina Navbar ke) */}
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
