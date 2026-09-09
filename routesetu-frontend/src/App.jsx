import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import VerifyOtp from './pages/verify-otp/VerifyOtp';
import ForgotPassword from './pages/forgot-password/ForgotPassword';
import ResetPassword from './pages/reset-password/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';

export default function App() {
  return <Routes><Route path="/" element={<Login />} /><Route path="/signup" element={<Signup />} /><Route path="/verify-otp" element={<VerifyOtp />} /><Route path="/forgot-password" element={<ForgotPassword />} /><Route path="/reset-password" element={<ResetPassword />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
}
