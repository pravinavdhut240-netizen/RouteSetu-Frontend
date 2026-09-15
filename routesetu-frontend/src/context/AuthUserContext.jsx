import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/api';

const AuthUserContext = createContext(null);

export function AuthUserProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    function loadUser() {
      if (!localStorage.getItem('routesetu-token')) { setUser(null); return; }
      authApi.me().then(setUser).catch(() => {
        localStorage.removeItem('routesetu-token');
        setUser(null);
      });
    }
    loadUser();
    window.addEventListener('routesetu-auth-changed', loadUser);
    return () => window.removeEventListener('routesetu-auth-changed', loadUser);
  }, []);
  return <AuthUserContext.Provider value={user}>{children}</AuthUserContext.Provider>;
}

export function useAuthUser() {
  return useContext(AuthUserContext);
}

export function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'U';
}
