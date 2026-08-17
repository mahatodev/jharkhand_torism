import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  mobileNumber?: string;
  role: 'tourist' | 'guide' | 'seller' | 'admin';
  isVerified?: boolean;
  qualifications?: string[];
  pricePerDay?: number;
  bankAccount?: {
    accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
  };
  upiId?: string;
  cart?: Product[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    password: string,
    mobile: string,
    role: string,
    govtId?: string
  ) => Promise<boolean>;
  logout: () => void;
  fetchUser: () => void;
}

const API_URL = 'http://localhost:5000';
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount check localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, []);

  const fetchUser = async () => {
    const currentToken = token || localStorage.getItem('token');
    if (!currentToken) return;

    try {
      const res = await fetch(`${API_URL}/api/profile/me`, {
        headers: { 'x-auth-token': currentToken },
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    }
  };

  useEffect(() => {
    if (token) fetchUser();
  }, [token]);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        setIsLoading(false);
        return false;
      }

      const data = await response.json();

      // Admin ke liye special handling
      if (data.user.role === 'admin') {
        console.log('✅ Admin logged in:', data.user);
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login Error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    mobileNumber: string,
    role: string,
    govtId?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, mobileNumber, role, govtId }),
      });
      setIsLoading(false);
      return response.ok;
    } catch (error) {
      console.error('Signup Error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = { user, token, isLoading, signup, login, logout, fetchUser };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};
