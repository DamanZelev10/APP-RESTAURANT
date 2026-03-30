const STORAGE_KEY = 'restaurant_reservations';

export const getReservations = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveReservations = (reservations) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
};

export const addReservation = (reservation) => {
  const current = getReservations();
  const newReservation = {
    ...reservation,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
  saveReservations([...current, newReservation]);
  return newReservation;
};

export const updateReservation = (id, updatedData) => {
  const current = getReservations();
  const index = current.findIndex(r => r.id === id);
  if (index !== -1) {
    current[index] = { ...current[index], ...updatedData };
    saveReservations(current);
    return current[index];
  }
  return null;
};

export const deleteReservation = (id) => {
  const current = getReservations();
  const filtered = current.filter(r => r.id !== id);
  saveReservations(filtered);
};

// --- AUTH LOGIC ---
const AUTH_KEY = 'restaurant_auth_token';

export const loginAdmin = (username, password) => {
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
