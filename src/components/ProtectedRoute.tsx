// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole: 'tourist' | 'guide' | 'seller' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();

  // Step 1: Jab tak auth check ho raha hai
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Step 2: Agar user login hi nahi hai
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Step 3: Agar user admin hai → sab sections ka access
  if (user.role === 'admin') {
    return children;
  }

  // Step 4: Agar user ka role required role se match nahi karta
  if (user.role !== requiredRole) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  // Step 5: Agar sab sahi hai
  return children;
};

export default ProtectedRoute;
