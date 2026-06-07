// ============================================================
// CHIKOTI API SERVICE — drop this file into each portal's
// src/services/api.js   (or import from shared/)
// ============================================================

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() { return localStorage.getItem('ck_token'); }

async function request(path, options = {}) {
  const token = getToken();
  const res   = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Auth
  login:    (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  me:       ()     => request('/auth/me'),

  // Properties (public)
  getProperties: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/properties${qs ? '?' + qs : ''}`);
  },
  getFeatured:   ()   => request('/properties/featured'),
  getProperty:   (id) => request(`/properties/${id}`),

  // Properties (seller)
  myProperties:    ()     => request('/properties/seller/mine'),
  createProperty:  (body) => request('/properties', { method: 'POST', body: JSON.stringify(body) }),
  deleteProperty:  (id)   => request(`/properties/${id}`, { method: 'DELETE' }),

  // Inquiries
  sendInquiry:     (body) => request('/inquiries', { method: 'POST', body: JSON.stringify(body) }),
  myInquiries:     ()     => request('/inquiries/seller'),

  // Favorites
  getFavorites:    ()   => request('/users/favorites'),
  toggleFavorite:  (id) => request(`/users/favorites/${id}`, { method: 'POST' }),

  // Admin
  adminStats:      ()          => request('/admin/stats'),
  adminProperties: (params={}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/properties${qs ? '?' + qs : ''}`);
  },
  updateStatus: (id, body)   => request(`/admin/properties/${id}/status`, { method: 'PATCH', body: JSON.stringify(body) }),
  adminUsers:   ()            => request('/admin/users'),
  updateUser:   (id, body)    => request(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  adminInquiries: ()          => request('/admin/inquiries'),
};
