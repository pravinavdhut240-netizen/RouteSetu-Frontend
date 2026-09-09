import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, RotateCcw } from 'lucide-react';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function ForgotPassword() {
  const navigate = useNavigate();
  return <AuthLayout><div className="auth-form card-form"><Link className="back-link top-back" to="/"><ArrowRight size={13} /> Back to Login</Link><div className="verify-icon"><RotateCcw /></div><div className="form-heading"><h2>Reset your password</h2><p>Enter your registered email address or mobile number and we’ll send you an OTP to reset your password.</p></div><form onSubmit={(e) => { e.preventDefault(); navigate('/verify-otp'); }}><Input label="Email or Mobile Number" placeholder="e.g. 98765 43210 or fleet@logistics.in" required /><Button>Send Reset OTP <ArrowRight size={16} /></Button></form><p className="switch">Remember your password? <Link to="/">Return to Login</Link></p></div></AuthLayout>;
}
