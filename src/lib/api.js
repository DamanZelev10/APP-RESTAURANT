/**
 * API Service for ROSÉ Cafe Bar
 * Handles all communication with the Express/Prisma backend
 */

const API_BASE = import.meta.env?.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem('restaurant_auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('restaurant_auth_token');
      localStorage.removeItem('restaurant_user');
      // If we are not already on the login page or public routes, redirect
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/'; 
      }
    }
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
  
  // ─── Customer Portal ───────────────────────────────────
  getPortalReservation: (token) => request(`/reservations/portal/${token}`),
  portalAction: (token, action) => request(`/reservations/portal/${token}/action`, { method: 'PATCH', body: JSON.stringify({ action }) }),
  requestPortalAccess: (phone) => request('/reservations/request-access', { method: 'POST', body: JSON.stringify({ phone }) }),

  // ─── Dashboard ─────────────────────────────────────────
  getDashboardMetrics: () => request('/dashboard'),

  // ─── Customers ──────────────────────────────────────────
  getCustomers: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/customers?${params}`);
  },
  getCustomer: (id) => request(`/customers/${id}`),
  updateCustomerStatus: (id, isActive) => request(`/customers/${id}/status`, { method: 'PUT', body: JSON.stringify({ isActive }) }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: 'DELETE' }),

  // ─── Settings ───────────────────────────────────────────
  getRestaurant: () => request('/settings'),
  updateRestaurant: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  getSettings: () => request('/settings/settings'),
  updateSettings: (data) => request('/settings/settings', { method: 'PUT', body: JSON.stringify(data) }),
  getBusinessHours: () => request('/settings/business-hours'),
  updateBusinessHour: (id, data) => request(`/settings/business-hours/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // ─── Alerts ────────────────────────────────────────────
  getAlerts: () => request('/alerts'),

  // ─── Payments ──────────────────────────────────────────
  createPaymentCheckout: (reservationId) => request('/payments/create-checkout', { method: 'POST', body: JSON.stringify({ reservationId }) }),
  getPaymentStatus: (reservationId) => request(`/payments/status/${reservationId}`),
  simulateWebhook: (provider, payload) => request(`/payments/webhook/${provider}`, { method: 'POST', body: JSON.stringify(payload) }),
};

// ─── AUTH LOGIC ───────────────────
const AUTH_KEY = 'restaurant_auth_token';
const USER_KEY = 'restaurant_user';

export const loginAdmin = async (username, password) => {
  try {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    localStorage.setItem(AUTH_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    return true;
  } catch (error) {
    throw error;
  }
};

export const getMe = async () => {
  return request('/auth/me');
};

export const logoutAdmin = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  return !!localStorage.getItem(AUTH_KEY);
};
