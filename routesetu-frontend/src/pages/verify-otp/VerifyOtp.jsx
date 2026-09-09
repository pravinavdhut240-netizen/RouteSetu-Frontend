import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import OtpInput from '../../components/OtpInput';

export default function VerifyOtp() {
  const navigate = useNavigate();
  return <AuthLayout><div className="auth-form centered"><div className="verify-icon"><CheckCircle2 /></div><div className="form-heading"><h2>Verify your number</h2><p>Enter the 6-digit code sent to <strong>+91 98765 43210</strong></p><Link to="/signup">Edit number</Link></div><OtpInput /><p className="resend">Didn't receive code? <button type="button">Resend OTP</button></p><Button onClick={() => navigate('/dashboard')}>Verify & Proceed <ArrowRight size={16} /></Button><Link className="back-link" to="/signup"><ArrowLeft size={13} /> Back to Sign Up</Link></div></AuthLayout>;
}
