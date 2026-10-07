import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL } from '../config/api';
/* eslint-disable react-refresh/only-export-components */

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('dailymart-user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('dailymart-token'));

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('dailymart-user', JSON.stringify(user));
      localStorage.setItem('dailymart-token', token);
    } else {
      localStorage.removeItem('dailymart-user');
      localStorage.removeItem('dailymart-token');
    }
  }, [user, token]);

  const authenticate = async (path, email, password) => {
    const response = await fetch(`${API_URL}/auth/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Authentication failed');
    setUser(data.user);
    setToken(data.token);
  };

  const signIn = (email, password) => authenticate('login', email, password);
  const register = (email, password) => authenticate('register', email, password);
  const signOut = () => {
    setUser(null);
    setToken(null);
  };

  return <AuthContext.Provider value={{ user, token, signIn, register, signOut }}>{children}</AuthContext.Provider>;
}
