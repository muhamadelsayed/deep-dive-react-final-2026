import api from "./api";

const cartService = {
  // Get current user's cart
  getCart: async () => {
    const response = await api.get("/api/cart");

    return response.data;
  },

  // Add product to cart
  addToCart: async (productId, quantity) => {
    const response = await api.post(
      "/api/cart/items",
      {
        productId,
        quantity,
      }
    );

    return response.data;
  },

  // Update product quantity
  updateCartItem: async (productId, quantity) => {
    const response = await api.put(
      `/api/cart/items/${productId}`,
      {
        quantity,
      }
    );

    return response.data;
  },

  // Remove product from cart
  removeFromCart: async (productId) => {
    const response = await api.delete(
      `/api/cart/items/${productId}`
    );

    return response.data;
  },
};

export default cartService;