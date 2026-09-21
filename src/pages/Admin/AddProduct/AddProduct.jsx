import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ImagePlus,
  Save,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import categoryService from "../../../services/categoryService";
import productService from "../../../services/productService";

function AddProduct() {
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
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);

  const [featuredImage, setFeaturedImage] = useState(null);
  const [media, setMedia] = useState([]);

 
  // Fetch Categories
 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        const data = await categoryService.getCategories();

        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load categories"
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

 
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

 
  // Featured Image
 

  const handleFeaturedImageChange = (e) => {
    const file = e.target.files?.[0] || null;

    setFeaturedImage(file);
  };

 
  // Additional Images
 

  const addMediaField = () => {
    setMedia((prev) => [...prev, null]);
  };

  const handleMediaChange = (index, file) => {
    setMedia((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  };

  const removeMediaField = (index) => {
    setMedia((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

 
  // Submit
 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim()) {
      toast.error("Please enter the product title.");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Please select a category.");
      return;
    }

    if (formData.price === "") {
      toast.error("Please enter the product price.");
      return;
    }

    if (formData.stock === "") {
      toast.error("Please enter the product stock.");
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      // Backend fields
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

      // Featured image
      if (featuredImage) {
        data.append(
          "Images",
          featuredImage
        );
      }

      // Additional images
      media.forEach((file) => {
        if (file) {
          data.append(
            "Images",
            file
          );
        }
      });

      await productService.createProduct(data);

      toast.success(
        "Product created successfully!"
      );

      navigate("/admin/products");
    } catch (error) {
      console.error(
        "Failed to create product:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Failed to create product.";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

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

          <h1>Add Product</h1>

          <p>
            Create a new product and add it to your store.
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
                Enter the main information about the product.
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
                Set the product price and available stock.
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
                disabled={loadingCategories}
              >

                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select category"}
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
                Upload the featured image and additional images.
              </p>
            </div>
          </div>

          {/* Featured Image */}

          <div className="admin-form-group full">

            <label htmlFor="featuredImage">
              Featured Image
            </label>

            <div className="admin-image-input">

              <ImagePlus size={19} />

              <input
                id="featuredImage"
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageChange}
              />

            </div>

            {featuredImage && (
              <small>
                Selected: {featuredImage.name}
              </small>
            )}

          </div>

          {/* Additional Images */}

          <div className="admin-media-section">

            <div className="admin-media-header">

              <label>
                Additional Images
              </label>

              <button
                type="button"
                className="admin-secondary-btn"
                onClick={addMediaField}
              >
                + Add Image
              </button>

            </div>

            {media.map((file, index) => (
              <div
                className="admin-media-row"
                key={index}
              >

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleMediaChange(
                      index,
                      e.target.files?.[0] || null
                    )
                  }
                />

                <button
                  type="button"
                  className="admin-remove-media"
                  onClick={() =>
                    removeMediaField(index)
                  }
                >
                  <X size={17} />
                </button>

                {file && (
                  <small>
                    {file.name}
                  </small>
                )}

              </div>
            ))}

          </div>

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
              ? "Saving..."
              : "Save Product"}

          </button>

        </div>

      </form>

    </div>
  );
}

export default AddProduct;