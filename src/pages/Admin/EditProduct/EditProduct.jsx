import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ImagePlus,
  Save,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import categoryService from "../../../services/categoryService";
import productService from "../../../services/productService";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    isVirtual: false,
  });

  const [categories, setCategories] = useState([]);

  const [existingImages, setExistingImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);

  const [newImages, setNewImages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

 
  // Fetch Product + Categories
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [product, categoriesData] =
          await Promise.all([
            productService.getAdminProductById(id),
            categoryService.getCategories(),
          ]);

        setFormData({
          title: product.title || "",
          description: product.description || "",
          price: product.price ?? "",
          stock: product.stock ?? "",
          categoryId: product.categoryId || "",
          isVirtual: product.isVirtual || false,
        });

        setCategories(
          Array.isArray(categoriesData)
            ? categoriesData
            : []
        );

        setExistingImages(
          Array.isArray(product.images)
            ? product.images
            : []
        );
      } catch (error) {
        console.error(
          "Failed to fetch product:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

 
  // Handle Form Changes
 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

 
  // Remove Existing Image
 

  const removeExistingImage = (imageId) => {
    setExistingImages((prev) =>
      prev.filter((image) => image.id !== imageId)
    );

    setRemovedImageIds((prev) => [
      ...prev,
      imageId,
    ]);
  };

 
  // Add New Images
 

  const handleNewImagesChange = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    setNewImages((prev) => [
      ...prev,
      ...files,
    ]);

    // Allow selecting same file again
    e.target.value = "";
  };

  const removeNewImage = (index) => {
    setNewImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

 
  // Submit
 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error(
        "Please enter the product title."
      );
      return;
    }

    if (!formData.categoryId) {
      toast.error(
        "Please select a category."
      );
      return;
    }

    if (formData.price === "") {
      toast.error(
        "Please enter the product price."
      );
      return;
    }

    if (formData.stock === "") {
      toast.error(
        "Please enter the product stock."
      );
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

     
      // Product Data
     

      data.append(
        "CategoryId",
        formData.categoryId
      );

      data.append(
        "Title",
        formData.title.trim()
      );

      data.append(
        "Description",
        formData.description.trim()
      );

      data.append(
        "Price",
        Number(formData.price)
      );

      data.append(
        "Stock",
        Number(formData.stock)
      );

      data.append(
        "IsVirtual",
        formData.isVirtual
      );

     
      // Removed Images
     

      removedImageIds.forEach((imageId) => {
        data.append(
          "RemovedImageIds",
          imageId
        );
      });

     
      // New Images
     

      newImages.forEach((file) => {
        data.append(
          "Images",
          file
        );
      });

      await productService.updateProduct(
        id,
        data
      );

      toast.success(
        "Product updated successfully!"
      );

      navigate("/admin/products");
    } catch (error) {
      console.error(
        "Failed to update product:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Failed to update product.";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

 
  // Loading
 

  if (loading) {
    return (
      <div className="admin-empty-state">
        <h2>Loading Product...</h2>

        <p>
          Please wait while we load the product information.
        </p>
      </div>
    );
  }
  // Error
  if (error) {
    return (
      <div className="admin-empty-state">
        <h2>Unable to Load Product</h2>

        <p>{error}</p>

        <Link
          to="/admin/products"
          className="admin-primary-btn"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-product-form-page">

      {/* Header */}

      <div className="admin-page-header">
        <div>

          <Link
            to="/admin/products"
            className="admin-back-link"
          >
            <ArrowLeft size={17} />
            Back to Products
          </Link>

          <span className="admin-page-label">
            INVENTORY
          </span>

          <h1>Edit Product</h1>

          <p>
            Update product information and inventory.
          </p>

        </div>
      </div>

      <form
        className="admin-product-form"
        onSubmit={handleSubmit}
      >

        {/* =========================
            Basic Information
        ========================= */}

        <section className="admin-form-section">

          <div className="admin-form-section-header">
            <div>

              <h2>Basic Information</h2>

              <p>
                Update the main information about this product.
              </p>

            </div>
          </div>

          <div className="admin-form-grid">

            <div className="admin-form-group full">

              <label htmlFor="title">
                Product Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="Enter product title"
                value={formData.title}
                onChange={handleChange}
              />

            </div>

            <div className="admin-form-group full">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="6"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleChange}
              />

            </div>

          </div>

        </section>

        {/* =========================
            Pricing & Inventory
        ========================= */}

        <section className="admin-form-section">

          <div className="admin-form-section-header">
            <div>

              <h2>Pricing & Inventory</h2>

              <p>
                Update price, stock and category.
              </p>

            </div>
          </div>

          <div className="admin-form-grid">

            {/* Price */}

            <div className="admin-form-group">

              <label htmlFor="price">
                Price
              </label>

              <div className="admin-input-with-prefix">

                <span>$</span>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* Stock */}

            <div className="admin-form-group">

              <label htmlFor="stock">
                Stock
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                placeholder="0"
                value={formData.stock}
                onChange={handleChange}
              />

            </div>

            {/* Category */}

            <div className="admin-form-group">

              <label htmlFor="categoryId">
                Category
              </label>

              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
              >

                <option value="">
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}

              </select>

            </div>

            {/* Virtual Product */}

            <div className="admin-form-group admin-checkbox-group">

              <label className="admin-checkbox-label">

                <input
                  type="checkbox"
                  name="isVirtual"
                  checked={formData.isVirtual}
                  onChange={handleChange}
                />

                <span>
                  Virtual Product
                </span>

              </label>

              <small>
                Enable this if the product does not require
                physical delivery.
              </small>

            </div>

          </div>

        </section>

        {/* =========================
            Product Images
        ========================= */}

        <section className="admin-form-section">

          <div className="admin-form-section-header">
            <div>

              <h2>Product Images</h2>

              <p>
                Manage existing images and upload new ones.
              </p>

            </div>
          </div>

          {/* Existing Images */}

          {existingImages.length > 0 && (
            <div className="admin-media-section">

              <div className="admin-media-header">
                <label>
                  Existing Images
                </label>
              </div>

              <div className="admin-existing-images">

                {existingImages.map((image) => (
                  <div
                    className="admin-existing-image"
                    key={image.id}
                  >

                    <img
                      src={image.url}
                      alt="Product"
                    />

                    <button
                      type="button"
                      className="admin-remove-media"
                      onClick={() =>
                        removeExistingImage(
                          image.id
                        )
                      }
                    >
                      <X size={17} />
                    </button>

                  </div>
                ))}

              </div>

            </div>
          )}

          {/* New Images */}

          <div className="admin-form-group full">

            <label htmlFor="newImages">
              Add New Images
            </label>

            <div className="admin-image-input">

              <ImagePlus size={19} />

              <input
                id="newImages"
                type="file"
                accept="image/*"
                multiple
                onChange={
                  handleNewImagesChange
                }
              />

            </div>

          </div>

          {/* New Image List */}

          {newImages.length > 0 && (
            <div className="admin-media-section">

              <div className="admin-media-header">
                <label>
                  New Images
                </label>
              </div>

              {newImages.map((file, index) => (
                <div
                  className="admin-media-row"
                  key={`${file.name}-${index}`}
                >

                  <span>
                    {file.name}
                  </span>

                  <button
                    type="button"
                    className="admin-remove-media"
                    onClick={() =>
                      removeNewImage(index)
                    }
                  >
                    <X size={17} />
                  </button>

                </div>
              ))}

            </div>
          )}

        </section>

        {/*  
            Actions
          */}

        <div className="admin-form-actions">

          <Link
            to="/admin/products"
            className="admin-cancel-btn"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="admin-primary-btn"
            disabled={saving}
          >

            <Save size={18} />

            {saving
              ? "Updating..."
              : "Update Product"}

          </button>

        </div>

      </form>

    </div>
  );
}

export default EditProduct;