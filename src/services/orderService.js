import api from "./api";

const orderService = {
  // =========================
  // User Orders
  // =========================

  getOrders: async () => {
    const response = await api.get("/api/orders");

    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await api.post(
      "/api/orders",
      orderData
    );

    return response.data;
  },

  cancelOrder: async (id) => {
    const response = await api.post(
      `/api/orders/${id}/cancel`
    );

    return response.data;
  },

  // =========================
  // Admin Orders
  // =========================

  getAdminOrders: async () => {
    const response = await api.get(
      "/api/admin/orders"
    );

    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(
      `/api/admin/orders/${id}/status`,
      {
        status,
      }
    );

    return response.data;
  },
};

export default orderService;