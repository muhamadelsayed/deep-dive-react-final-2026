import api from "./api";

const wishlistService = {
  // =========================
  // Get Wishlist
  // =========================
  getWishlist: async () => {
    const response = await api.get("/api/wishlist");

    return response.data;
  },

  // =========================
  // Add Product To Wishlist
  // =========================
  addToWishlist: async (productId) => {
    const response = await api.post(
      `/api/wishlist/${productId}`
    );

    return response.data;
  },

  // =========================
  // Remove Product From Wishlist
  // =========================
  removeFromWishlist: async (productId) => {
    const response = await api.delete(
      `/api/wishlist/${productId}`
    );

    return response.data;
  },
};

export default wishlistService;