import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Invalid token, logging out...', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: userToken, user: userData } = response.data;
      
      localStorage.setItem('token', userToken);
      setToken(userToken);
      setUser(userData);
      return userData;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      throw new Error(errorMsg);
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token: userToken, user: userData } = response.data;
      
      localStorage.setItem('token', userToken);
      setToken(userToken);
      setUser(userData);
      return userData;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      throw new Error(errorMsg);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
