const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(formatError(data.detail || data.message || 'Request failed'));
  return data;
}

function formatError(detail) {
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => {
      if (typeof item === 'string') return item;
      const location = Array.isArray(item.loc) ? item.loc.join('.') : '';
      return location ? `${location}: ${item.msg || 'Invalid value'}` : (item.msg || 'Invalid value');
    }).join('; ');
  }
  if (detail && typeof detail === 'object') return detail.message || JSON.stringify(detail);
  return 'Request failed';
}

export const authApi = {
  login: (credentials) => request('/api/v1/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  signup: (details) => request('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(details) }),
  me: () => request('/api/v1/auth/me', { headers: { Authorization: `Bearer ${localStorage.getItem('routesetu-token')}` } }),
  updateProfile: (details) => request('/api/v1/auth/me', {
    method: 'PATCH',
    headers: authenticatedHeaders(),
    body: JSON.stringify(details)
  }),
  requestReset: async () => { throw new Error('Password reset is not connected to the backend yet'); },
  resetPassword: async () => { throw new Error('Password reset is not connected to the backend yet'); }
};

function authenticatedHeaders() {
  const token = localStorage.getItem('routesetu-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const roadApi = {
  list: () => request('/api/v1/roads'),
  incidents: () => request('/api/v1/incidents'),
  risks: () => request('/api/v1/risks'),
  reportIncident: (roadId, incident) => request(`/api/v1/roads/${roadId}/incidents`, {
    method: 'POST',
    headers: authenticatedHeaders(),
    body: JSON.stringify(incident)
  })
};

export const routeApi = {
  plan: (details) => request('/api/v1/routes', {
    method: 'POST',
    headers: authenticatedHeaders(),
    body: JSON.stringify(details)
  }),
  list: () => request('/api/v1/routes', { headers: authenticatedHeaders() }),
  updateStatus: (routeId, status) => request(`/api/v1/routes/${routeId}/status?status=${encodeURIComponent(status)}`, {
    method: 'PATCH',
    headers: authenticatedHeaders()
  }),
  analysis: (routeId) => request(`/api/v1/routes/${routeId}/analysis`, { headers: authenticatedHeaders() }),
  track: (routeId, point) => request(`/api/v1/routes/${routeId}/tracking`, {
    method: 'POST',
    headers: authenticatedHeaders(),
    body: JSON.stringify(point)
  })
};

export const weatherApi = {
  current: (location = 'Bomdila') => request(`/api/v1/weather?location=${encodeURIComponent(location)}`)
};

export const alertApi = {
  list: () => request('/api/v1/alerts', { headers: authenticatedHeaders() })
};
