import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import PasswordInput from '../../components/PasswordInput';

export default function ResetPassword() {
  const navigate = useNavigate();
  return <AuthLayout compact><div className="auth-form reset-form"><div className="form-heading"><h2>Create a new password</h2><p>Your new password must be different from previous credentials across the regional dispatch mesh.</p></div><form onSubmit={(e) => { e.preventDefault(); navigate('/reset-success'); }}><PasswordInput label="New Secure Password" defaultValue="Kopili#Pass2024" required /><div className="checklist"><small>VERIFICATION CHECKLIST</small><span><Check /> At least 8 characters</span><span><Check /> Contains a number</span><span><Check /> Contains special symbol</span><span><Check /> No common dictionary words</span></div><PasswordInput label="Confirm New Password" defaultValue="Kopili#Pass2024" required /><Button>Reset Password <ArrowRight size={16} /></Button></form><footer>© 2024 RouteSetu Transit Tech. All rights reserved.</footer></div></AuthLayout>;
}
