import { AlertTriangle, CheckCircle2, Mountain, ShieldAlert, Waves, Wind } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppShell from '../../components/AppShell';
import { routeApi } from '../../services/api';

export default function TerrainRisk() {
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    routeApi.list().then((routes) => {
      const selectedId = Number(localStorage.getItem('routesetu-selected-route'));
      const selected = routes.find((route) => route.id === selectedId) || routes[0];
      if (!selected) throw new Error('No saved route selected. Plan a route first.');
      return routeApi.analysis(selected.id);
    }).then(setAnalysis).catch((requestError) => setError(requestError.message));
  }, []);

  if (error) return <AppShell><section className="active-route-list empty-fleet"><AlertTriangle size={28} /><h2>Terrain analysis unavailable</h2><p>{error}</p></section></AppShell>;
  if (!analysis) return <AppShell><p>Loading terrain analysis...</p></AppShell>;
  const tone = ['critical', 'high'].includes(analysis.risk_level) ? 'danger' : analysis.risk_level === 'medium' ? 'warning' : 'safe';
  return <AppShell><div className="page-heading"><div><span className="eyebrow purple">Route intelligence</span><h1>Terrain & risk details</h1><p>Analysis for the selected route: {analysis.route_name}.</p></div><span className={`risk risk-${tone === 'danger' ? 'medium' : tone === 'warning' ? 'medium' : 'low'}`}>{analysis.risk_level} risk</span></div><div className="terrain-analysis-summary"><div><small>Risk score</small><strong>{analysis.risk_score}<em>/100</em></strong></div><div><small>Terrain</small><strong>{analysis.terrain_type}</strong></div><div><small>Data source</small><strong>{analysis.data_source}</strong></div></div><div className="terrain-grid"><section className="terrain-map"><Mountain size={42} /><h2>{analysis.terrain_type} profile</h2><p>{analysis.terrain_summary}</p><div className="elevation">{analysis.elevation_profile.map((height, index) => <span key={`${height}-${index}`} style={{ height: `${height}%` }} title={`Segment ${index + 1}: ${height}% terrain intensity`} />)}</div><div className="terrain-profile-labels"><small>Origin</small><small>Corridor segments</small><small>Destination</small></div><div className="analysis-action"><CheckCircle2 size={18} /><div><strong>Recommended action</strong><small>{analysis.recommended_action}</small></div></div></section><section className="risk-list"><div className="card-title"><h2>Hazards ahead</h2><span className="status">Analyzed</span></div>{analysis.hazards.map((hazard, index) => <Risk key={`${hazard.title}-${index}`} icon={hazard.severity === 'high' || hazard.severity === 'critical' ? <ShieldAlert /> : hazard.severity === 'medium' ? <Waves /> : <Wind />} title={hazard.title} text={hazard.text} tone={hazard.severity === 'high' || hazard.severity === 'critical' ? 'danger' : hazard.severity === 'medium' ? 'warning' : 'safe'} />)}</section></div></AppShell>;
}
function Risk({ icon, title, text, tone }) { return <div className={`risk-detail ${tone}`}><span>{icon}</span><div><strong>{title}</strong><small>{text}</small></div></div>; }
