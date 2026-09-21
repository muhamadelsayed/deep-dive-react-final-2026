import api from "./api";

const authService = {
  register: async (userData) => {
    const response = await api.post("/api/Auth/register", {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      address: userData.address,
    });

    return response.data;
  },

  verifyOTP: async ({ email, otp }) => {
    const response = await api.post("/api/Auth/verify-otp", {
      email,
      otp,
    });

    return response.data;
  },

  login: async ({ email, password }) => {
    const response = await api.post("/api/Auth/login", {
      email,
      password,
    });

    return response.data;
  },
};

export default authService;