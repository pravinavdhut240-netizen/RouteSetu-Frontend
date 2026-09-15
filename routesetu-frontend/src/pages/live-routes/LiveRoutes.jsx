import { ArrowRight, Map, Navigation, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import RouteMap from '../../components/RouteMap';
import { useEffect, useState } from 'react';
import { routeApi } from '../../services/api';

export default function LiveRoutes() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    routeApi.list().then((savedRoutes) => {
      setRoutes(savedRoutes);
      const selectedId = Number(localStorage.getItem('routesetu-selected-route'));
      setSelectedRoute(savedRoutes.find((route) => route.id === selectedId) || savedRoutes[0] || null);
    }).catch((requestError) => setError(requestError.message));
  }, []);

  function selectRoute(route) {
    setSelectedRoute(route);
    localStorage.setItem('routesetu-selected-route', String(route.id));
  }

  const hours = selectedRoute ? Math.floor(selectedRoute.duration_minutes / 60) : 0;
  const minutes = selectedRoute ? selectedRoute.duration_minutes % 60 : 0;
  return <AppShell><div className="page-heading"><div><span className="eyebrow purple">Fleet monitoring</span><h1>Live routes</h1><p>{selectedRoute ? `Monitoring selected route: ${selectedRoute.origin} to ${selectedRoute.destination}.` : 'Plan a route to start fleet monitoring.'}</p></div><Link className="button" to="/route-planning"><Map size={15} /> Plan a new route</Link></div>
    {error && <p className="error">{error}</p>}
    {selectedRoute ? <div className="fleet-monitor-layout"><section className="live-map-card selected-fleet-map"><div className="live-map-toolbar"><strong>{selectedRoute.origin} → {selectedRoute.destination}</strong><span><i /> Selected route · {selectedRoute.status}</span></div><RouteMap geometry={selectedRoute.geometry} height="clamp(430px, 58vh, 620px)" /></section><section className="active-route-list selected-route-details"><div className="card-title"><h2>Route details</h2><span className="status">{selectedRoute.status}</span></div><div className="fleet-route-title"><span className="vehicle-icon"><Truck size={18} /></span><div><strong>Fleet route #{selectedRoute.id}</strong><small>Selected for active monitoring</small></div></div><Detail label="Distance" value={`${selectedRoute.distance_km} km`} /><Detail label="Estimated time" value={`${hours}h ${minutes}m`} /><Detail label="Risk level" value={selectedRoute.risk_level} /><Detail label="Map source" value="OpenStreetMap + OSRM" /><Link className="button" to="/live-navigation"><Navigation size={15} /> Open live navigation <ArrowRight size={15} /></Link><h3>Saved routes</h3>{routes.map((route) => <button className={`fleet-route-row ${route.id === selectedRoute.id ? 'selected' : ''}`} key={route.id} onClick={() => selectRoute(route)}><span><strong>{route.origin} → {route.destination}</strong><small>{route.distance_km} km · {route.status}</small></span><ArrowRight size={15} /></button>)}</section></div> : <EmptyFleet />}
  </AppShell>;
}

function Detail({ label, value }) { return <div className="fleet-detail"><small>{label}</small><strong>{value}</strong></div>; }
function EmptyFleet() { return <section className="active-route-list empty-fleet"><Truck size={28} /><h2>No route selected</h2><p>Plan a route first. Once it is saved, it will appear here with its map and live monitoring details.</p><Link className="button" to="/route-planning">Plan your first route <ArrowRight size={15} /></Link></section>; }
