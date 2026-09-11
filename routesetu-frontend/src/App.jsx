import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import VerifyOtp from './pages/verify-otp/VerifyOtp';
import ForgotPassword from './pages/forgot-password/ForgotPassword';
import ResetPassword from './pages/reset-password/ResetPassword';
import ResetSuccess from './pages/reset-success/ResetSuccess';
import Dashboard from './pages/dashboard/Dashboard';
import RoutePlanning from './pages/route-planning/RoutePlanning';
import RouteDetails from './pages/route-details/RouteDetails';
import LiveNavigation from './pages/live-navigation/LiveNavigation';
import WeatherDetails from './pages/weather/WeatherDetails';
import TerrainRisk from './pages/terrain-risk/TerrainRisk';
import Alerts from './pages/alerts/Alerts';
import RouteHistory from './pages/route-history/RouteHistory';
import Profile from './pages/profile/Profile';
import Settings from './pages/settings/Settings';
import Help from './pages/help/Help';
import LiveRoutes from './pages/live-routes/LiveRoutes';
import Reports from './pages/reports/Reports';
import AuthGuard from './components/AuthGuard';

export default function App() {
  const protectedPages = [[RoutePlanning, '/route-planning'], [RouteDetails, '/route-details'], [LiveRoutes, '/live-routes'], [LiveNavigation, '/live-navigation'], [WeatherDetails, '/weather'], [TerrainRisk, '/terrain-risk'], [Alerts, '/alerts'], [Reports, '/reports'], [RouteHistory, '/route-history'], [Profile, '/profile'], [Settings, '/settings'], [Help, '/help'], [Dashboard, '/dashboard']];
  return <Routes><Route path="/" element={<Navigate to="/login" replace />} /><Route path="/login" element={<Login />} /><Route path="/signup" element={<Signup />} /><Route path="/verify-otp" element={<VerifyOtp />} /><Route path="/forgot-password" element={<ForgotPassword />} /><Route path="/reset-password" element={<ResetPassword />} /><Route path="/reset-success" element={<ResetSuccess />} />{protectedPages.map(([Page, path]) => <Route key={path} path={path} element={<AuthGuard><Page /></AuthGuard>} />)}<Route path="*" element={<Navigate to="/login" replace />} /></Routes>;
}
