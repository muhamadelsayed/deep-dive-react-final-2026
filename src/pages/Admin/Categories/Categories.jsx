import { useEffect, useMemo, useState } from "react";
import {
  Pencil,
  Plus,
  Search,
  Trash2,
  Tags,
} from "lucide-react";

import api from "../../../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  
  // Get Categories
  
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/api/admin/categories"
      );

      setCategories(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch categories:",
        error
      );

      setError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.response?.data?.title ||
          "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  
  // Search
  
  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [categories, search]);

  
  // Add Category
  
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!newCategory.trim()) return;

    try {
      setSaving(true);
      setError("");

      const response = await api.post(
        "/api/admin/categories",
        {
          name: newCategory.trim(),
        }
      );

      setCategories((prev) => [
        ...prev,
        response.data,
      ]);

      setNewCategory("");
      setShowForm(false);
    } catch (error) {
      console.error(
        "Failed to add category:",
        error
      );

      setError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.response?.data?.title ||
          "Failed to add category."
      );
    } finally {
      setSaving(false);
    }
  };

  
  // Start Edit
  
  const startEdit = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setError("");
  };

  
  // Cancel Edit
  
  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  
  // Update Category
  
  const handleUpdate = async (id) => {
    if (!editingName.trim()) return;

    try {
      setSaving(true);
      setError("");

      await api.put(
        `/api/admin/categories/${id}`,
        {
          name: editingName.trim(),
        }
      );

      setCategories((prev) =>
        prev.map((category) =>
          category.id === id
            ? {
                ...category,
                name: editingName.trim(),
              }
            : category
        )
      );

      cancelEdit();
    } catch (error) {
      console.error(
        "Failed to update category:",
        error
      );

      setError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.response?.data?.title ||
          "Failed to update category."
      );
    } finally {
      setSaving(false);
    }
  };

  
  // Delete Category
  
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");

      await api.delete(
        `/api/admin/categories/${id}`
      );

      setCategories((prev) =>
        prev.filter(
          (category) => category.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete category:",
        error
      );

      setError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.response?.data?.title ||
          "Failed to delete category."
      );
    } finally {
      setSaving(false);
    }
  };

  
  // Loading
  
  if (loading) {
    return (
      <div className="admin-categories-page">
        <div className="admin-empty-state">
          <Tags size={42} />

          <h2>Loading Categories...</h2>

          <p>
            Please wait while categories are loading.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-categories-page">

      {/* Header */}
      <div className="admin-page-header">

        <div>
          <span className="admin-page-label">
            CATALOG
          </span>

          <h1>Categories</h1>

          <p>
            Organize your products into categories.
          </p>
        </div>

        <button
          className="admin-primary-btn"
          type="button"
          onClick={() => {
            setShowForm(!showForm);
            setError("");
          }}
        >
          <Plus size={18} />
          Add Category
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="checkout-error">
          {error}
        </div>
      )}

      {/* Add Category */}
      {showForm && (
        <form
          className="admin-category-add-form"
          onSubmit={handleAdd}
        >

          <div className="admin-form-group">

            <label htmlFor="categoryName">
              Category Name
            </label>

            <input
              id="categoryName"
              type="text"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) =>
                setNewCategory(e.target.value)
              }
            />

          </div>

          <div className="admin-category-form-actions">

            <button
              type="button"
              className="admin-cancel-btn"
              onClick={() => {
                setShowForm(false);
                setNewCategory("");
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-primary-btn"
              disabled={saving}
            >
              {saving
                ? "Adding..."
                : "Add Category"}
            </button>

          </div>

        </form>
      )}

      {/* Toolbar */}
      <div className="admin-products-toolbar">

        <div className="admin-search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      {/* Categories */}
      <div className="admin-table-wrapper">

        {filteredCategories.length > 0 ? (
          <table className="admin-table">

            <thead>
              <tr>
                <th>Category</th>
                <th>Created</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredCategories.map(
                (category) => (
                  <tr key={category.id}>

                    <td>

                      {editingId === category.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) =>
                            setEditingName(
                              e.target.value
                            )
                          }
                          className="admin-edit-input"
                        />
                      ) : (
                        <div className="admin-category-cell">

                          <div className="admin-category-icon">
                            <Tags size={18} />
                          </div>

                          <strong>
                            {category.name}
                          </strong>

                        </div>
                      )}

                    </td>

                    <td>
                      {category.createdAt
                        ? new Date(
                            category.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <span className="admin-stock-status available">
                        Active
                      </span>
                    </td>

                    <td>

                      <div className="admin-table-actions">

                        {editingId === category.id ? (
                          <>
                            <button
                              type="button"
                              className="admin-action-btn edit"
                              onClick={() =>
                                handleUpdate(
                                  category.id
                                )
                              }
                              disabled={saving}
                            >
                              Save
                            </button>

                            <button
                              type="button"
                              className="admin-action-btn delete"
                              onClick={cancelEdit}
                              disabled={saving}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="admin-action-btn edit"
                              title="Edit Category"
                              onClick={() =>
                                startEdit(
                                  category
                                )
                              }
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              className="admin-action-btn delete"
                              title="Delete Category"
                              onClick={() =>
                                handleDelete(
                                  category.id
                                )
                              }
                              disabled={saving}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>
        ) : (
          <div className="admin-empty-state">

            <Tags size={42} />

            <h2>
              No Categories Found
            </h2>

            <p>
              {search
                ? "Try another search."
                : "No categories have been created yet."}
            </p>

          </div>
        )}

      </div>

    </div>
  );
}

export default Categories;