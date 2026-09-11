const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail || 'Request failed');
  return data;
}

export const authApi = {
  login: (credentials) => request('/api/v1/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  signup: (details) => request('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(details) }),
  me: () => request('/api/v1/auth/me', { headers: { Authorization: `Bearer ${localStorage.getItem('routesetu-token')}` } }),
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
