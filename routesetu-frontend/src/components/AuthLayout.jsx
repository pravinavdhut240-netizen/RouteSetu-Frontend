import { Mountain, CloudRain, ShieldCheck } from 'lucide-react';
import Logo from './Logo';
import Reveal from './Reveal';

export default function AuthLayout({ children, compact = false }) {
  return <main className={`auth-shell ${compact ? 'auth-compact' : ''}`}><aside className="hero-panel"><Reveal><Logo /></Reveal><div className="hero-copy"><Reveal delay={100}><span className="eyebrow">✦ Mission-Critical Mountain Logistics</span><h1>Ship Smarter and Safer Across the North East</h1><p>Engineered for live hill-terrain route monitoring, proactive monsoon weather intelligence, and instant landslide corridor avoidance across all seven sister states.</p></Reveal></div><div className="feature-row"><Feature delay={180} icon={<Mountain />} title="AI Route Risk" text="Live elevation analysis" /><Feature delay={260} icon={<CloudRain />} title="Weather Alerts" text="Flash flood & fog tracking" /><Feature delay={340} icon={<ShieldCheck />} title="Safest Corridors" text="Hill bypass verification" /></div><Reveal delay={420}><Logo /></Reveal></aside><section className="content-panel"><Reveal className="auth-content">{children}</Reveal></section></main>;
}

function Feature({ icon, title, text, delay }) { return <Reveal delay={delay}><div className="feature"><span>{icon}</span><div><strong>{title}</strong><small>{text}</small></div></div></Reveal>; }
