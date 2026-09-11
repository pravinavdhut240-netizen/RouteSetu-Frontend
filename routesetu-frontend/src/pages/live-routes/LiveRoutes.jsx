import { ArrowRight, CircleDot, Map, Navigation, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import { useEffect, useState } from 'react';
import { roadApi } from '../../services/api';

export default function LiveRoutes() {
  const [roads, setRoads] = useState([]);
  useEffect(() => {
    roadApi.list().then(setRoads).catch((error) => console.error('Failed to load road conditions', error));
  }, []);
  return <AppShell><div className="page-heading"><div><span className="eyebrow purple">Fleet monitoring</span><h1>Live routes</h1><p>Track every active vehicle and route in your logistics network.</p></div><Link className="button" to="/route-planning"><Map size={15} /> Plan a new route</Link></div><div className="live-route-grid"><section className="live-map-card"><div className="live-map-toolbar"><strong>Live fleet map</strong><span><i /> {roads.length} monitored roads</span></div><svg viewBox="0 0 700 390" role="img" aria-label="Live fleet route map"><path className="map-road faint" d="M10 310 C140 260 160 110 320 180 S520 310 690 60" /><path className="map-safe" d="M10 310 C140 260 160 110 320 180 S520 310 690 60" /><circle className="vehicle vehicle-one" cx="207" cy="178" r="8" /><circle className="vehicle vehicle-two" cx="457" cy="258" r="8" /><circle className="vehicle vehicle-three" cx="583" cy="164" r="8" /></svg></section><section className="active-route-list"><div className="card-title"><h2>Active vehicles</h2><span className="status">Live</span></div><Vehicle name="TRK-204 · Guwahati → Tawang" status="On schedule" progress="72%" /><Vehicle name="TRK-118 · Shillong → Aizawl" status="Weather watch" progress="48%" /><Vehicle name="TRK-087 · Imphal → Kohima" status="On schedule" progress="31%" /></section></div></AppShell>;
}
function Vehicle({ name, status, progress }) { return <Link className="vehicle-row" to="/route-details"><span className="vehicle-icon"><Truck size={16} /></span><div><strong>{name}</strong><small><CircleDot size={10} /> {status}</small><span className="progress"><i style={{ width: progress }} /></span></div><ArrowRight size={15} /></Link>; }
