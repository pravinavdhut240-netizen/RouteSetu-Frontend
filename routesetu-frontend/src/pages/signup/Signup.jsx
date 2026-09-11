import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import Input from '../../components/Input';
import PasswordInput from '../../components/PasswordInput';
import { authApi } from '../../services/api';

export default function Signup() {
  const navigate = useNavigate(); const [form, setForm] = useState({ name: '', email: '', password: '' }); const [confirmPassword, setConfirmPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  async function submit(event) { event.preventDefault(); setError(''); if (form.password !== confirmPassword) { setError('Passwords do not match'); return; } setLoading(true); try { await authApi.signup(form); navigate('/login'); } catch (requestError) { setError(requestError.message); } finally { setLoading(false); } }
  return <AuthLayout><div className="auth-form signup-form"><div className="form-heading"><span className="eyebrow purple">● Transit authority clearance</span><h2>Create your Account</h2><p>Get verified access to safe mountain routes and dispatch tracking.</p></div><form onSubmit={submit}>{error && <p className="error">{error}</p>}<Input label="Full Name" placeholder="e.g. Tenzing Norbu / Rajesh Sharma" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><Input label="Email Address" type="email" placeholder="fleet@transporter.in" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><Input label="Mobile Number" type="tel" placeholder="+91 98765 43210" required value={form.mobile_number || ''} onChange={(e) => setForm({ ...form, mobile_number: e.target.value })} /><PasswordInput placeholder="At least 8 characters" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><PasswordInput label="Confirm Password" placeholder="Re-enter your password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /><label className="check terms"><input type="checkbox" required /> I agree to the <a href="#terms">Terms of Service & Transporter Safety Protocol</a> for mountain corridors.</label><Button variant="gold" disabled={loading}>{loading ? 'Creating account…' : 'Create Account'} <ArrowRight size={16} /></Button></form><p className="switch">Already have an account? <Link to="/login">Log in <ArrowRight size={13} /></Link></p></div></AuthLayout>;
}
