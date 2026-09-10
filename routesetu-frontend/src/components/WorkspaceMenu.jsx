import { AlertTriangle, BarChart3, Bell, CircleHelp, CloudSun, Ellipsis, History, LayoutDashboard, Map, Route, Settings, ShieldAlert, UserRound, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const workspaceItems = [
  [LayoutDashboard, '/dashboard', 'Overview'],
  [Route, '/route-planning', 'Plan a route'],
  [Map, '/live-routes', 'Live routes'],
  [Map, '/route-details', 'Route details'],
  [Map, '/live-navigation', 'Live navigation'],
  [CloudSun, '/weather', 'Weather'],
  [ShieldAlert, '/terrain-risk', 'Terrain & risk'],
  [Bell, '/alerts', 'Alerts'],
  [BarChart3, '/reports', 'Reports'],
  [History, '/route-history', 'Trip history']
];

export default function WorkspaceMenu({ open, onToggle }) {
  const location = useLocation();
  if (!open) return <button className="options-trigger" onClick={onToggle} aria-label="Show all options" aria-expanded="false"><Ellipsis size={19} /></button>;

  return <><button className="options-trigger" onClick={onToggle} aria-label="Hide all options" aria-expanded="true"><Ellipsis size={19} /></button><div className="vertical-taskbar-backdrop" onClick={onToggle}><aside className="vertical-taskbar" onClick={(event) => event.stopPropagation()}><div className="vertical-taskbar-header"><Logo dark /><button className="close-menu" onClick={onToggle} aria-label="Close all options"><X size={18} /></button></div><p className="vertical-taskbar-label">All workspace options</p><nav className="vertical-taskbar-nav">{workspaceItems.map(([Icon, path, label]) => <Link key={path} className={location.pathname === path ? 'active' : ''} to={path} onClick={onToggle}><Icon size={16} />{label}</Link>)}</nav><div className="vertical-taskbar-bottom"><Link to="/profile" onClick={onToggle}><UserRound size={16} />Profile</Link><Link to="/settings" onClick={onToggle}><Settings size={16} />Settings</Link><Link to="/help" onClick={onToggle}><CircleHelp size={16} />Help & support</Link></div></aside></div></>;
}
