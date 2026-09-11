import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/api';

const AuthUserContext = createContext(null);

export function AuthUserProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (!localStorage.getItem('routesetu-token')) return;
    authApi.me().then(setUser).catch(() => {
      localStorage.removeItem('routesetu-token');
    });
  }, []);
  return <AuthUserContext.Provider value={user}>{children}</AuthUserContext.Provider>;
}

export function useAuthUser() {
  return useContext(AuthUserContext);
}

export function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'U';
}
