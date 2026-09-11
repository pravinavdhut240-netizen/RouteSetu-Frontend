import { Navigate, useLocation } from 'react-router-dom';

export default function AuthGuard({ children }) {
  const location = useLocation();
  return localStorage.getItem('routesetu-token') ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
