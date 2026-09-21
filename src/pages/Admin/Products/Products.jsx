import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Package,
  AlertTriangle,
} from "lucide-react";

import productService from "../../../services/productService";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 
  // Fetch Products
 
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await productService.getAdminProducts({
        page,
        pageSize,
        search: search.trim() || undefined,
      });

      setProducts(data?.items || []);
      setTotalCount(data?.totalCount || 0);
      setTotalPages(data?.totalPages || 1);
    } catch (error) {
      console.error(
        "Failed to fetch admin products:",
        error
      );

      setError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.response?.data?.title ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

 
  // Categories
 
  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];
  }, [products]);

 
  // Filter Category
 
  const filteredProducts = useMemo(() => {
    if (category === "All") {
      return products;
    }

    return products.filter(
      (product) =>
        product.category === category
    );
  }, [products, category]);

 
  // Delete Product
 
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await productService.deleteProduct(id);

      setProducts((prev) =>
        prev.filter(
          (product) => product.id !== id
        )
      );

      setTotalCount((prev) =>
        Math.max(prev - 1, 0)
      );
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      setError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.response?.data?.title ||
          "Failed to delete product."
      );
    }
  };

 
  // Pagination
 
  const goToPreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

 
  // Loading
 
  if (loading) {
    return (
      <div className="admin-products-page">
        <div className="admin-empty-state">
          <Package size={42} />

          <h2>Loading Products...</h2>

          <p>
            Please wait while products are loading.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-products-page">

      {/* Header */}
      <div className="admin-page-header">

        <div>
          <span className="admin-page-label">
            INVENTORY
          </span>

          <h1>Products</h1>

          <p>
            Manage your store products and inventory.
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="admin-primary-btn"
        >
          <Plus size={18} />
          Add Product
        </Link>

      </div>

      {/* Error */}
      {error && (
        <div className="checkout-error">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="admin-product-stats">

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <Package size={20} />
          </div>

          <div>
            <span>Total Products</span>
            <strong>{totalCount}</strong>
          </div>

        </div>

        <div className="admin-stat-card">

          <div className="admin-stat-icon warning">
            <AlertTriangle size={20} />
          </div>

          <div>
            <span>Low Stock</span>

            <strong>
              {
                products.filter(
                  (product) =>
                    product.stock > 0 &&
                    product.stock <= 5
                ).length
              }
            </strong>
          </div>

        </div>

        <div className="admin-stat-card">

          <div className="admin-stat-icon danger">
            <Package size={20} />
          </div>

          <div>
            <span>Out of Stock</span>

            <strong>
              {
                products.filter(
                  (product) =>
                    product.stock === 0
                ).length
              }
            </strong>
          </div>

        </div>

      </div>

      {/* Toolbar */}
      <div className="admin-products-toolbar">

        <div className="admin-search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

        </div>

        <select
          className="admin-filter-select"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          {categories.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

      </div>

      {/* Products Table */}
      <div className="admin-table-wrapper">

        {filteredProducts.length > 0 ? (
          <table className="admin-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredProducts.map(
                (product) => {

                  const stockStatus =
                    product.stock === 0
                      ? "out"
                      : product.stock <= 5
                      ? "low"
                      : "available";

                  return (
                    <tr
                      key={product.id}
                    >

                      {/* Product */}
                      <td>

                        <div className="admin-product-cell">

                          <img
                            src={
                              product.featuredImage
                            }
                            alt={
                              product.name
                            }
                          />

                          <div>

                            <strong>
                              {product.name}
                            </strong>

                            <span>
                              #{product.id}
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* Category */}
                      <td>

                        <span className="admin-category-badge">
                          {product.category ||
                            "Uncategorized"}
                        </span>

                      </td>

                      {/* Price */}
                      <td>

                        <strong>
                          $
                          {Number(
                            product.price || 0
                          ).toFixed(2)}
                        </strong>

                      </td>

                      {/* Stock */}
                      <td>
                        {product.stock}
                      </td>

                      {/* Status */}
                      <td>

                        <span
                          className={`admin-stock-status ${stockStatus}`}
                        >
                          {stockStatus ===
                          "out"
                            ? "Out of Stock"
                            : stockStatus ===
                              "low"
                            ? "Low Stock"
                            : "Available"}
                        </span>

                      </td>

                      {/* Actions */}
                      <td>

                        <div className="admin-table-actions">

                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="admin-action-btn edit"
                            title="Edit Product"
                          >
                            <Pencil size={16} />
                          </Link>

                          <button
                            type="button"
                            className="admin-action-btn delete"
                            title="Delete Product"
                            onClick={() =>
                              handleDelete(
                                product.id
                              )
                            }
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>
        ) : (
          <div className="admin-empty-state">

            <Package size={42} />

            <h2>
              No Products Found
            </h2>

            <p>
              Try changing your search or
              category filter.
            </p>

          </div>
        )}

      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admin-pagination">

          <button
            type="button"
            onClick={goToPreviousPage}
            disabled={page === 1}
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            onClick={goToNextPage}
            disabled={
              page === totalPages
            }
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
}

export default AdminProducts;