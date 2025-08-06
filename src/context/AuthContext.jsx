import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { message } from 'antd';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await API.get('/auth/profile', { withCredentials: true });
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('No active session');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await API.post('/auth/login', credentials, { withCredentials: true });
      if (response.data && response.data.user) {
        setUser(response.data.user);
        message.success('Login successful!');
        navigate('/'); 
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      message.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout', {}, { withCredentials: true });
      setUser(null);
      message.success('Logout successful!');
      navigate('/auth/login');
    } catch (error) {
      message.error('Logout failed. Please try again.');
    }
  };

  const value = { user, setUser, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};