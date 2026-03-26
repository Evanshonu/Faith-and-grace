import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://faith-and-grace.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export const menuAPI = {
  getAll: () => api.get("/api/menu"),
  create: (data) => api.post("/api/menu", data),
  update: (id, data) => api.patch(`/api/menu/${id}`, data),
  delete: (id) => api.delete(`/api/menu/${id}`)
};

export const orderAPI = {
  create: (data) => api.post("/api/orders", data),
  getAll: () => api.get("/api/orders"),
  getByEmail: (email) => api.get(`/api/orders/customer/${email}`),
  updateStatus: (id, status) =>
    api.patch(`/api/orders/${id}`, { status })
};

// FIX: was "/payments/create" — correct path is "/api/payments/create-intent"
export const paymentAPI = {
  getConfig: () => api.get("/api/payments/config"),
  createIntent: (data) => api.post("/api/payments/create-intent", data)
};

export default api;