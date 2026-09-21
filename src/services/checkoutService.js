import api from "./api";

const checkoutService = {
  // =========================
  // Create Order / Checkout
  // =========================
  createOrder: async (orderData) => {
    const response = await api.post(
      "/api/orders",
      orderData
    );

    return response.data;
  },
};

export default checkoutService;