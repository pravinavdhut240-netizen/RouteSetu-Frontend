import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const defaultCenter = [27.4728, 94.912];
const startIcon = new L.DivIcon({ className: 'route-map-marker route-map-start', html: '<span>START</span>' });
const endIcon = new L.DivIcon({ className: 'route-map-marker route-map-end', html: '<span>END</span>' });

function FitRoute({ positions }) {
  const map = useMap();
  if (positions.length > 1) map.fitBounds(positions, { padding: [30, 30] });
  return null;
}

export default function RouteMap({ geometry = [], currentPosition, height = '275px' }) {
  const positions = geometry.map(([longitude, latitude]) => [latitude, longitude]);
  const center = positions[0] || defaultCenter;
  return <MapContainer className="route-leaflet-map" style={{ height, width: '100%' }} center={center} zoom={7} scrollWheelZoom>
    <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    {positions.length > 1 && <><FitRoute positions={positions} /><Polyline positions={positions} pathOptions={{ color: '#7d3cff', weight: 6 }} /><Marker position={positions[0]} icon={startIcon} /><Marker position={positions[positions.length - 1]} icon={endIcon} /></>}
    {currentPosition && <CircleMarker center={[currentPosition.latitude, currentPosition.longitude]} radius={9} pathOptions={{ color: '#fff', fillColor: '#ef5d70', fillOpacity: 1, weight: 4 }} />}
    {!positions.length && <div className="route-map-empty">Enter two places and check route to load the live map.</div>}
  </MapContainer>;
}
