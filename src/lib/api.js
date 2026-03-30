/**
 * API Service for ROSÉ Cafe Bar
 * Handles all communication with the Express/Prisma backend
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.errors?.join(', ') || 'API Request failed');
  }

  return response.json();
}

export const api = {
  // ─── Reservations ──────────────────────────────────────
  getReservations: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/reservations?${params}`);
  },
  getReservation: (id) => request(`/reservations/${id}`),
  createReservation: (data) => request('/reservations', { method: 'POST', body: JSON.stringify(data) }),
  updateReservation: (id, data) => request(`/reservations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateReservationStatus: (id, status) => request(`/reservations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteReservation: (id) => request(`/reservations/${id}`, { method: 'DELETE' }),
  getAvailableSlots: (date) => request(`/reservations/slots?date=${date}`),
  sendWhatsApp: (id, type) => request(`/reservations/${id}/whatsapp`, { method: 'POST', body: JSON.stringify({ type }) }),

  // ─── Dashboard ─────────────────────────────────────────
  getDashboardMetrics: () => request('/dashboard'),

  // ─── Customers ──────────────────────────────────────────
  getCustomers: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/customers?${params}`);
  },
  getCustomer: (id) => request(`/customers/${id}`),

  // ─── Settings ───────────────────────────────────────────
  getRestaurant: () => request('/settings'),
  updateRestaurant: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  getSettings: () => request('/settings/settings'),
  updateSettings: (data) => request('/settings/settings', { method: 'PUT', body: JSON.stringify(data) }),
  getBusinessHours: () => request('/settings/business-hours'),
  updateBusinessHour: (id, data) => request(`/settings/business-hours/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // ─── Alerts ────────────────────────────────────────────
  getAlerts: () => request('/alerts'),
};

// ─── AUTH LOGIC (Simple placeholder) ───────────────────
const AUTH_KEY = 'restaurant_auth_token';

export const loginAdmin = async (username, password) => {
  if (username === 'admin' && password === 'admin') {
    localStorage.setItem(AUTH_KEY, 'authenticated');
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = () => {
  return localStorage.getItem(AUTH_KEY) === 'authenticated';
};
