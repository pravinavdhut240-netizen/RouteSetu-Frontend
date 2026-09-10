import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';

export default function ResetSuccess() {
  return <AuthLayout compact><div className="auth-form success-form"><div className="success-card"><div className="success-icon"><CheckCircle2 /></div><h2>Password reset successful</h2><p>Your credentials have been securely updated. You can now access your fleet dispatch dashboard.</p><Link className="button" to="/login">Go to Login <ArrowRight size={16} /></Link></div><footer>© 2024 RouteSetu Transit Tech. All rights reserved.</footer></div></AuthLayout>;
}
