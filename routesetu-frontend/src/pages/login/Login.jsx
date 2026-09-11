import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import Input from '../../components/Input';
import PasswordInput from '../../components/PasswordInput';
import { authApi } from '../../services/api';

export default function Login() {
  const navigate = useNavigate(); const [identifier, setIdentifier] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  async function submit(event) { event.preventDefault(); setError(''); setLoading(true); try { const data = await authApi.login({ email: identifier, password }); localStorage.setItem('routesetu-token', data.access_token); navigate('/dashboard'); } catch (requestError) { setError(requestError.message); } finally { setLoading(false); } }
  return <AuthLayout><div className="auth-form"><div className="form-heading"><span className="eyebrow purple">● Welcome back</span><h2>Sign in to RouteSetu</h2><p>Enter your registered credentials to access your dispatch dashboard.</p></div><form onSubmit={submit}>{error && <p className="error">{error}</p>}<Input label="Email Address" type="email" placeholder="fleet@transporter.in" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} /><PasswordInput placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} /><div className="form-options"><label className="check"><input type="checkbox" defaultChecked /> Remember me for 30 days</label><Link to="/forgot-password">Forgot password?</Link></div><Button disabled={loading}>{loading ? 'Signing in…' : 'Log In'} <ArrowRight size={16} /></Button></form><p className="switch">Don't have an account yet? <Link to="/signup">Create an account <ArrowRight size={13} /></Link></p><Footer /></div></AuthLayout>;
}
function Footer() { return <footer>© 2026 RouteSetu Transit Tech. North East Logistics Grid. All rights reserved.</footer>; }
