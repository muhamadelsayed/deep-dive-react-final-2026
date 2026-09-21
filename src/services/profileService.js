import api from "./api";

const profileService = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get("/api/users/profile");
    return response.data;
  },

  // Update current user profile
  updateProfile: async ({ name, address }) => {
    await api.put("/api/users/profile", {
      name,
      address,
    });
  },

  // Change password
  changePassword: async ({ currentPassword, newPassword }) => {
    await api.put("/api/users/change-password", {
      currentPassword,
      newPassword,
    });
  },
};

export default profileService;