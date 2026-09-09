import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import Input from '../../components/Input';
import PasswordInput from '../../components/PasswordInput';

export default function Login() {
  const navigate = useNavigate(); const [identifier, setIdentifier] = useState('');
  return <AuthLayout><div className="auth-form"><div className="form-heading"><span className="eyebrow purple">● Welcome back</span><h2>Sign in to RouteSetu</h2><p>Enter your registered credentials to access your dispatch dashboard.</p></div><form onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}><Input label="Email or Mobile Number" placeholder="Phone number or email address" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} /><PasswordInput placeholder="Enter your password" required /><div className="form-options"><label className="check"><input type="checkbox" defaultChecked /> Remember me for 30 days</label><Link to="/forgot-password">Forgot password?</Link></div><Button>Log In <ArrowRight size={16} /></Button></form><p className="switch">Don't have an account yet? <Link to="/signup">Create an account <ArrowRight size={13} /></Link></p><Footer /></div></AuthLayout>;
}
function Footer() { return <footer>© 2026 RouteSetu Transit Tech. North East Logistics Grid. All rights reserved.</footer>; }
