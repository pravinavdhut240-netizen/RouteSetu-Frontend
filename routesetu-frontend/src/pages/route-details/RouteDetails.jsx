import { ArrowRight, CloudRain, MapPin, ShieldCheck, TriangleAlert, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import RouteMap from '../../components/RouteMap';
import { routeApi } from '../../services/api';

export default function RouteDetails() {
  const [route, setRoute] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    routeApi.list().then((routes) => {
      const selectedId = Number(localStorage.getItem('routesetu-selected-route'));
      setRoute(routes.find((savedRoute) => savedRoute.id === selectedId) || routes[0] || null);
    }).catch((requestError) => setError(requestError.message));
  }, []);

  if (error) return <AppShell><p className="error">{error}</p></AppShell>;
  if (!route) return <AppShell><section className="detail-card empty-fleet"><h2>No selected route</h2><p>Plan a route or select one from Fleet Monitoring to view its details.</p><Link className="button" to="/live-routes">Open Fleet Monitoring <ArrowRight size={15} /></Link></section></AppShell>;

  const hours = Math.floor(route.duration_minutes / 60);
  const minutes = route.duration_minutes % 60;
  return <AppShell><PageHeading eyebrow="Selected route" title={`${route.origin} to ${route.destination}`} text={`Fleet route #${route.id} · ${route.status}`}><Link className="button" to="/live-navigation">Start navigation <ArrowRight size={15} /></Link></PageHeading><div className="detail-grid"><section className="route-visual large-map"><RouteMap geometry={route.geometry} height="420px" /></section><section className="detail-card"><div className="detail-title"><h2>Route overview</h2><span className={`risk risk-${route.risk_level === 'high' ? 'medium' : 'low'}`}>{route.risk_level} risk</span></div><div className="route-summary"><MapPin /><div><strong>{route.distance_km} km</strong><small>Estimated {hours}h {minutes}m</small></div><Truck /><div><strong>{route.status}</strong><small>Fleet monitoring status</small></div></div><Info icon={<CloudRain />} title="Weather" text={`Live weather available for ${route.destination}`} /><Info icon={<TriangleAlert />} title="Road conditions" text={`${route.risk_level} risk based on RouteSetu intelligence`} /><Info icon={<ShieldCheck />} title="Map and route" text="OpenStreetMap geocoding · OSRM driving route" /><Link className="button" to="/live-routes">Back to Fleet Monitoring <ArrowRight size={15} /></Link></section></div></AppShell>;
}

function PageHeading({ eyebrow, title, text, children }) { return <div className="page-heading"><div><span className="eyebrow purple">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>{children}</div>; }
function Info({ icon, title, text }) { return <div className="info-row"><span>{icon}</span><div><strong>{title}</strong><small>{text}</small></div></div>; }
