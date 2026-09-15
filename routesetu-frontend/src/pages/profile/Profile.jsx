import { Mail, Phone, Save, Truck, UserRound, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppShell from '../../components/AppShell';
import { initials, useAuthUser } from '../../context/AuthUserContext';
import { authApi } from '../../services/api';

export default function Profile() {
  const user = useAuthUser();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', mobile_number: '' });
  useEffect(() => { if (user) setForm({ name: user.name || '', email: user.email || '', mobile_number: user.mobile_number || '' }); }, [user]);
  function beginEditing() { setMessage(''); setError(''); setEditing(true); }
  function cancelEditing() { setError(''); setMessage(''); setForm({ name: user?.name || '', email: user?.email || '', mobile_number: user?.mobile_number || '' }); setEditing(false); }
  async function saveProfile(event) { event.preventDefault(); setError(''); setMessage(''); setSaving(true); try { await authApi.updateProfile(form); window.dispatchEvent(new Event('routesetu-auth-changed')); setEditing(false); setMessage('Profile updated successfully.'); } catch (requestError) { setError(requestError.message); } finally { setSaving(false); } }
  return <AppShell><div className="page-heading"><div><span className="eyebrow purple">Account</span><h1>Profile</h1><p>Manage your dispatcher and fleet information.</p></div></div><section className="profile-card"><div className="profile-avatar">{initials(form.name)}</div><h2>{form.name || 'Loading profile...'}</h2><span className="profile-role">{user?.role || 'Fleet dispatcher'}</span>{message && <p className="success-message">{message}</p>}{error && <p className="error">{error}</p>}{editing ? <form className="profile-edit-form" onSubmit={saveProfile}><ProfileInput icon={<UserRound />} label="Full name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required /><ProfileInput icon={<Mail />} label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} required /><ProfileInput icon={<Phone />} label="Mobile number" value={form.mobile_number} onChange={(value) => setForm({ ...form, mobile_number: value })} /><div className="profile-actions"><button className="button" disabled={saving}><Save size={15} /> {saving ? 'Saving...' : 'Save changes'}</button><button className="button button-secondary" type="button" onClick={cancelEditing}><X size={15} /> Cancel</button></div></form> : <><div className="profile-fields"><Info icon={<Mail />} label="Email" value={user?.email || 'Loading...'} /><Info icon={<Phone />} label="Mobile" value={user?.mobile_number || 'Not provided'} /><Info icon={<Truck />} label="Fleet" value="North East Transit · 12 vehicles" /></div><button className="button" onClick={beginEditing}>Edit profile</button></>}</section></AppShell>;
}
function ProfileInput({ icon, label, type = 'text', value, onChange, required }) { return <label className="profile-input"><span>{icon}</span><small>{label}</small><input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} /></label>; }
function Info({ icon, label, value }) { return <div><span>{icon}</span><small>{label}</small><strong>{value}</strong></div>; }
