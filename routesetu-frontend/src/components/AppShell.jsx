import { BarChart3, Bell, CloudSun, History, LayoutDashboard, LogOut, Map, Route, Settings, ShieldAlert, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import WorkspaceMenu from './WorkspaceMenu';
import { initials, useAuthUser } from '../context/AuthUserContext';

const navItems = [
  ['/dashboard', LayoutDashboard, 'Overview'],
  ['/route-planning', Route, 'Plan a route'],
  ['/live-routes', Map, 'Live routes'],
  ['/route-details', Map, 'Route details'],
  ['/live-navigation', Map, 'Live navigation'],
  ['/weather', CloudSun, 'Weather'],
  ['/terrain-risk', ShieldAlert, 'Terrain & risk'],
  ['/alerts', Bell, 'Alerts'],
  ['/reports', BarChart3, 'Reports'],
  ['/route-history', History, 'Trip history']
];

export default function AppShell({ children }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('routesetu-theme') !== 'light');
  const location = useLocation();
  const user = useAuthUser();
  const displayName = user?.name || 'Dispatcher';
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('routesetu-theme', dark ? 'dark' : 'light');
  }, [dark]);
  const topNavItems = navItems.filter(([path]) => ['/dashboard', '/live-routes', '/alerts', '/reports'].includes(path));
  return <div className="app-shell"><div className="app-main"><header className="app-header"><div className="app-header-brand"><Logo dark /><WorkspaceMenu open={workspaceOpen} onToggle={() => setWorkspaceOpen(!workspaceOpen)} /></div><nav className="app-top-nav">{topNavItems.map(([path, Icon, label]) => <Link key={path} className={location.pathname === path ? 'active' : ''} to={path}>{label}</Link>)}</nav><div className="header-title">North East Logistics Grid</div><div className="header-user"><button className="theme-toggle" onClick={() => setDark(!dark)} aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}>{dark ? '☀' : '☾'}</button><div className="header-popover-wrap"><button className="icon-button notification-trigger" onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }} aria-label="Open notifications"><Bell size={18} /><i /></button>{notificationsOpen && <NotificationPopover />}</div><div className="header-popover-wrap"><button className="profile-trigger" onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}><span>{initials(displayName)}</span><strong>{displayName}</strong></button>{profileOpen && <ProfilePopover user={user} />}</div></div></header><main className="app-content">{children}</main></div></div>;
}

function NotificationPopover() { return <div className="header-popover notification-popover"><div className="popover-heading"><strong>Notifications</strong><Link to="/alerts">View all</Link></div><div className="popover-alert"><span className="popover-dot danger" /><div><strong>Heavy rainfall advisory</strong><small>NH-13 · Bomdila corridor</small><time>12 min ago</time></div></div><div className="popover-alert"><span className="popover-dot warning" /><div><strong>Temporary checkpoint</strong><small>NH-6 · Jowai bypass</small><time>1 hour ago</time></div></div></div>; }
function ProfilePopover({ user }) { return <div className="header-popover profile-popover"><div className="popover-profile"><span>{initials(user?.name)}</span><div><strong>{user?.name || 'Dispatcher'}</strong><small>{user?.role || 'Fleet dispatcher'}</small></div></div><Link to="/profile"><UserRound size={15} /> View profile</Link><Link to="/settings"><Settings size={15} /> Account settings</Link><button onClick={() => { localStorage.removeItem('routesetu-token'); window.location.href = '/login'; }}><LogOut size={15} /> Sign out</button></div>; }
