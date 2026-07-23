import { createContext, useContext, useState, useCallback } from 'react';
import { isGasAdmin, setGasToken, clearGasToken } from '../api/gasBridge';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (isGasAdmin()) {
      const gasUser = sessionStorage.getItem('pm_gas_user');
      if (gasUser) return { email: gasUser, name: gasUser.split('@')[0] };
    }
    const saved = localStorage.getItem('pm_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email, password) => {
    const { api } = await import('../api/client');
    const data = await api.login(email, password);
    if (isGasAdmin()) {
      setGasToken(data.token, data.user?.email || email);
      const gasUser = { email: data.user?.email || email, name: data.user?.name || 'Admin' };
      setUser(gasUser);
      return gasUser;
    }
    localStorage.setItem('pm_token', data.token);
    localStorage.setItem('pm_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    if (isGasAdmin()) clearGasToken();
    localStorage.removeItem('pm_token');
    localStorage.removeItem('pm_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
