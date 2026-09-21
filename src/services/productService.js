import api from "./api";

const productService = {
 
  // Public Products
 

  getProducts: async (params = {}) => {
    const response = await api.get("/api/products", {
      params,
    });

    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/api/products/${id}`);

    return response.data;
  },

 
  // Admin Products
 

  getAdminProducts: async (params = {}) => {
    const response = await api.get("/api/admin/products", {
      params,
    });

    return response.data;
  },

  getAdminProductById: async (id) => {
    const response = await api.get(`/api/admin/products/${id}`);

    return response.data;
  },

  createProduct: async (formData) => {
    const response = await api.post(
      "/api/admin/products",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  updateProduct: async (id, formData) => {
    const response = await api.put(
      `/api/admin/products/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(
      `/api/admin/products/${id}`,
      {
        params: {
          confirm: true,
        },
      }
    );

    return response.data;
  },
};

export default productService;