import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mountain, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    return `/dashboard/${user.role}`;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
          <img
            src="/Images/logo.png"
            alt="Logo"
            className="h-20 w-20 object-contain"
          />

          {/* ✅ Text */}
          <span className="text-2xl font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">
            Jharkhand Tourism
          </span>
        </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Home
            </Link>
            <Link to="/map" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Explore Map
            </Link>
            <Link to="/transport" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Transport
            </Link>
            <Link to="/TripPlanner" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Trip Planner
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={getDashboardPath()}
                  className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors font-medium"
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/login" 
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/map" 
                className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore Map
              </Link>
              <Link 
                to="/transport" 
                className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Transport
              </Link>
              <Link 
                to="/TripPlanner" 
                className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Trip Planner
              </Link>
              {user ? (
                <>
                  <Link 
                    to={getDashboardPath()}
                    className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-600 hover:text-red-700 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/login" 
                    className="text-emerald-600 hover:text-emerald-700 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;