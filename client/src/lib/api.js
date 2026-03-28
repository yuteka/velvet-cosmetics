const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// 🛒 Cart API
export const saveCart = async (userId, cartData) => {
  const res = await fetch(`${API_URL}/api/cart/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, cartData }),
  });
  return res.json();
};

export const getCart = async (userId) => {
  const res = await fetch(`${API_URL}/api/cart/get/${userId}`);
  return res.json();
};

export const clearCart = async (userId) => {
  const res = await fetch(`${API_URL}/api/cart/clear/${userId}`, {
    method: 'DELETE',
  });
  return res.json();
};

// 👤 Profile API
export const saveProfile = async (userId, profileData) => {
  const res = await fetch(`${API_URL}/api/profile/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, profileData }),
  });
  return res.json();
};

export const getProfile = async (userId) => {
  const res = await fetch(`${API_URL}/api/profile/get/${userId}`);
  return res.json();
};

// 🔐 Session API
export const saveSession = async (userId, userData) => {
  const res = await fetch(`${API_URL}/api/session/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, userData }),
  });
  return res.json();
};

export const getSession = async (userId) => {
  const res = await fetch(`${API_URL}/api/session/get/${userId}`);
  return res.json();
};