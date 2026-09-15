import { AlertTriangle, ArrowRight, Clock3, MapPin, Route, Sparkles, Truck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import AppShell from '../../components/AppShell';
import RouteMap from '../../components/RouteMap';
import { routeApi } from '../../services/api';

export default function RoutePlanning() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ origin: 'Guwahati', destination: 'Tawang', vehicle_type: 'heavy goods vehicle' });
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try { const createdRoute = await routeApi.plan({ origin: String(form.origin), destination: String(form.destination), vehicle_type: String(form.vehicle_type) }); setPlan(createdRoute); localStorage.setItem('routesetu-selected-route', String(createdRoute.id)); }
    catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }

  const currentPlan = plan || { distance_km: 0, duration_minutes: 0, risk_level: 'unknown', geometry: [] };
  const hours = Math.floor(currentPlan.duration_minutes / 60);
  const minutes = currentPlan.duration_minutes % 60;

  return <AppShell><div className="planning-desktop">
    <div className="page-heading"><div><span className="eyebrow purple">Route planning</span><h1>Plan your route</h1><p>Enter real places to calculate a driving route on the live map.</p></div><span className="planning-status"><i /> OpenStreetMap + OSRM</span></div>
    <div className="planning-workspace">
      <section className="planning-controls"><div className="planning-card-heading"><Route size={18} /><div><h2>New route</h2><p>Locations are geocoded automatically</p></div></div>
        <form onSubmit={submit}>
          <label className="route-field"><span>From (origin)</span><div><MapPin size={15} /><input value={form.origin} onChange={(event) => setForm({ ...form, origin: event.target.value })} placeholder="Guwahati" required /></div></label>
          <label className="route-field"><span>To (destination)</span><div><MapPin size={15} /><input value={form.destination} onChange={(event) => setForm({ ...form, destination: event.target.value })} placeholder="Tawang" required /></div></label>
          <label className="route-field"><span>Vehicle profile</span><div><Truck size={15} /><input value={form.vehicle_type} onChange={(event) => setForm({ ...form, vehicle_type: event.target.value })} required /></div></label>
          {error && <p className="error">{error}</p>}
          <Button disabled={loading}>{loading ? 'Finding route...' : 'Check route'} <ArrowRight size={15} /></Button>
        </form>
        <div className="planning-note"><Sparkles size={15} /><span><strong>Free route services</strong><small>OpenStreetMap geocoding and OSRM driving directions power this route.</small></span></div>
      </section>
      <section className="planning-results"><div className="results-top"><div><span className="eyebrow purple">Route result</span><h2>{plan ? `${plan.origin} to ${plan.destination}` : 'Recommended corridor'}</h2></div><span className="optimized-pill"><Sparkles size={12} /> {plan?.geometry?.length ? 'Live route' : 'Waiting for input'}</span></div>
        <div className="desktop-route-map"><RouteMap geometry={currentPlan.geometry} /></div>
        <div className="planning-risk"><AlertTriangle size={18} /><div><strong>{plan ? `${currentPlan.distance_km} km driving route` : 'No route calculated yet'}</strong><small>{plan ? `${hours}h ${minutes}m estimated · ${currentPlan.risk_level} road risk from RouteSetu data` : 'Enter an origin and destination, then check route.'}</small></div></div>
        <div className="desktop-route-options"><RouteOption title="Calculated route" tag={plan ? currentPlan.risk_level : 'Pending'} distance={plan ? `${currentPlan.distance_km} km` : '--'} time={plan ? `${hours}h ${minutes}m` : '--'} current /><RouteOption title="Road intelligence" tag={plan ? 'Available' : 'Pending'} distance={plan ? 'Weather linked' : '--'} time={plan ? 'Risk linked' : '--'} /></div>
        {plan && <button className="button monitor-route-button" onClick={async () => { try { await routeApi.updateStatus(plan.id, 'in_progress'); } finally { navigate('/live-routes'); } }}><Truck size={15} /> Monitor this route in Fleet Monitoring <ArrowRight size={15} /></button>}
      </section>
    </div>
  </div></AppShell>;
}

function RouteOption({ title, tag, distance, time, current }) {
  return <article className={`desktop-route-option ${current ? 'current' : 'recommended'}`}><div><span className="route-option-dot" /><strong>{title}</strong><em>{tag}</em></div><small><Clock3 size={13} /> {distance} · {time}</small>{!current && <span className="best-choice">Connected</span>}</article>;
}
