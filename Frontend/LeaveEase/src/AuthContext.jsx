import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; 


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  
  useEffect(() => {
    const checkSavedAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        
        if (token && rememberMe) {
        
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          setUser({ ...userData, token });
        } else if (token && !rememberMe) {
         
          localStorage.removeItem('authToken');
         
          sessionStorage.setItem('authToken', token);

        }
      } catch (err) {
        setError('Authentication failed. Please login again.');
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkSavedAuth();
  }, []);
  
  
  const login = async (email, password, rememberMe) => {
    setLoading(true);
    setError(null);

    try {
        let url = `http://localhost:8080/api/auth/login?email=${email}&password=${password}`;
        const response = await axios.post(url);
       
        const { token, role } = response.data;
        console.log(response.data);

        sessionStorage.setItem('email',email);
        sessionStorage.setItem('password',password)
       
        if (rememberMe) {
            localStorage.setItem('authToken', token);
            localStorage.setItem('role', role);  
            localStorage.setItem('rememberMe', 'true');
        } else {
            
            sessionStorage.setItem('authToken', token);
            sessionStorage.setItem('role', role);
            localStorage.removeItem('authToken');
            localStorage.removeItem('role');
            localStorage.setItem('rememberMe', 'false');
        }

        
        return true;

    } catch (err) {
        setError(err.message || 'Login failed. Please try again.');
        return false;
    } finally {
        setLoading(false);
    }
};
  
  const value = {
    user,
    loading,
    error,
    login,
    
    isAuthenticated: !!user
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};