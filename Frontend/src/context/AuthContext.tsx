import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api';

interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  signUp: (userData: any) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // This hook must be used within a Router context

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      setCurrentUser(JSON.parse(user));
      setAuthToken(token);
    }

    setLoading(false);
  }, []);

  const setAuthToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  const signUp = async (userData: any) => {
    try {
      setError(null);
      const formData = new FormData();

      Object.keys(userData).forEach(key => {
        if (key !== 'logo') {
          formData.append(key, userData[key]);
        }
      });

      if (userData.logo) {
        formData.append('logo', userData.logo);
      }

      const response = await axios.post(`${API_URL}/auth/signup`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { token, user } = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      setAuthToken(token);
      return user;
    } catch (err: any) {
      console.error('Signup error in AuthContext:', err);
      const errorMsg = err.response?.data?.error || 'Registration failed';
      setError(errorMsg);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const { token, user } = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      setAuthToken(token);
      return user;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Login failed';
      setError(errorMsg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      // Optional: notify backend
      // Clear local data
      localStorage.removeItem('user');
      setAuthToken(null);
      setCurrentUser(null);
      navigate('/login');
    } catch (err) {
      console.warn('Logout failed, clearing client session anyway.');
      setAuthToken(null);
      setCurrentUser(null);
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      setCurrentUser(response.data.user);
      return response.data.user;
    } catch (err: any) {
      if (err.response?.status === 401) {
        await logout();
      }
      throw err;
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    error,
    signUp,
    login,
    logout,
    getCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
