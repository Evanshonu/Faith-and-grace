import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const menuAPI = {
  getAll: () => api.get('/menu-items/'),
  getByCategory: (category) => api.get(`/menu-items/?category=${category}`),
  getById: (id) => api.get(`/menu-items/${id}/`),
};

export const orderAPI = {
  create: (orderData) => api.post('/orders/', orderData),
  getById: (id) => api.get(`/orders/${id}/`),
  confirmPayment: (id, confirmationCode) =>
    api.post(`/orders/${id}/confirm_payment/`, { confirmation_code: confirmationCode }),
  updateStatus: (id, status) =>
    api.post(`/orders/${id}/update_status/`, { status }),
};

export default api;
