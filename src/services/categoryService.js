import api from "./api";

const categoryService = {
  getCategories: async () => {
    const response = await api.get("/api/admin/categories");
    return response.data;
  },

  createCategory: async (name) => {
    const response = await api.post("/api/admin/categories", {
      name,
    });
    return response.data;
  },

  updateCategory: async (id, name) => {
    const response = await api.put(`/api/admin/categories/${id}`, {
      name,
    });
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/api/admin/categories/${id}`);
    return response.data;
  },
};

export default categoryService;