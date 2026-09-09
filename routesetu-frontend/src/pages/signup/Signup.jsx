import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import Input from '../../components/Input';
import PasswordInput from '../../components/PasswordInput';

export default function Signup() {
  const navigate = useNavigate();
  return <AuthLayout><div className="auth-form signup-form"><div className="form-heading"><span className="eyebrow purple">● Transit authority clearance</span><h2>Create your Account</h2><p>Get verified access to safe mountain routes and dispatch tracking.</p></div><form onSubmit={(e) => { e.preventDefault(); navigate('/verify-otp'); }}><Input label="Full Name" placeholder="e.g. Tenzing Norbu / Rajesh Sharma" required /><Input label="Email Address" type="email" placeholder="fleet@transporter.in" required /><Input label="Mobile Number" type="tel" placeholder="+91 98765 43210" required /><PasswordInput placeholder="At least 8 characters" required /><PasswordInput label="Confirm Password" placeholder="Re-enter your password" required /><label className="check terms"><input type="checkbox" required /> I agree to the <a href="#terms">Terms of Service & Transporter Safety Protocol</a> for mountain corridors.</label><Button variant="gold">Create Account <ArrowRight size={16} /></Button></form><p className="switch">Already have an account? <Link to="/">Log in <ArrowRight size={13} /></Link></p></div></AuthLayout>;
}
