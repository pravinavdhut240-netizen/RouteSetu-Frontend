import { Mountain, CloudRain, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

export default function AuthLayout({ children, compact = false }) {
  return <main className={`auth-shell ${compact ? 'auth-compact' : ''}`}><aside className="hero-panel"><Logo /><div className="hero-copy"><span className="eyebrow">✦ Mission-Critical Mountain Logistics</span><h1>Ship Smarter and Safer Across the North East</h1><p>Engineered for live hill-terrain route monitoring, proactive monsoon weather intelligence, and instant landslide corridor avoidance across all seven sister states.</p></div><div className="feature-row"><Feature icon={<Mountain />} title="AI Route Risk" text="Live elevation analysis" /><Feature icon={<CloudRain />} title="Weather Alerts" text="Flash flood & fog tracking" /><Feature icon={<ShieldCheck />} title="Safest Corridors" text="Hill bypass verification" /></div><Logo /></aside><section className="content-panel">{children}</section></main>;
}

function Feature({ icon, title, text }) { return <div className="feature"><span>{icon}</span><div><strong>{title}</strong><small>{text}</small></div></div>; }
