import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";

import productService from "../../services/productService";
import cartService from "../../services/cartService";
import wishlistService from "../../services/wishlistService";
import { useAuth } from "../../context/AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Fetch Product
  // =========================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await productService.getProductById(id);

        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);

        setError(
          error.response?.data?.message ||
            error.response?.data?.title ||
            "Product not found."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =========================
  // Check Wishlist
  // =========================
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        if (isAuthenticated) {
          const data = await wishlistService.getWishlist();

          const exists = data.some(
            (item) => item.productId === id
          );

          setIsInWishlist(exists);

          return;
        }

        const wishlist = JSON.parse(
          localStorage.getItem("wishlist") || "[]"
        );

        const exists = wishlist.some(
          (item) => item.id === id
        );

        setIsInWishlist(exists);
      } catch (error) {
        console.error(
          "Failed to check wishlist:",
          error
        );
      }
    };

    checkWishlist();
  }, [id, isAuthenticated]);

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <main className="not-found-page">
        <h1>Loading Product...</h1>
      </main>
    );
  }

  // =========================
  // Error
  // =========================
  if (error || !product) {
    return (
      <main className="not-found-page">
        <h1>Product Not Found</h1>

        <p>{error}</p>

        <Link to="/products">
          Back to Products
        </Link>
      </main>
    );
  }

  const isOutOfStock = product.stock === 0;

  // =========================
  // Category
  // =========================
  const categoryName =
    product.category?.name ||
    product.category ||
    "Uncategorized";

  // =========================
  // Image
  // =========================
  const productImage =
    product.featuredImage ||
    product.featured_image ||
    product.image;

  // =========================
  // Increase Quantity
  // =========================
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  // =========================
  // Decrease Quantity
  // =========================
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // =========================
  // Add To Cart
  // =========================
  const handleAddToCart = async () => {
    if (isOutOfStock || loadingCart) return;

    try {
      setLoadingCart(true);

      if (isAuthenticated) {
        await cartService.addToCart(
          product.id,
          quantity
        );
      } else {
        const cart = JSON.parse(
          localStorage.getItem("cart") || "[]"
        );

        const existingItem = cart.find(
          (item) => item.id === product.id
        );

        if (existingItem) {
          existingItem.quantity = Math.min(
            existingItem.quantity + quantity,
            product.stock
          );
        } else {
          cart.push({
            ...product,
            quantity,
          });
        }

        localStorage.setItem(
          "cart",
          JSON.stringify(cart)
        );
      }
    } catch (error) {
      console.error(
        "Failed to add product to cart:",
        error
      );
    } finally {
      setLoadingCart(false);
    }
  };

  // =========================
  // Wishlist
  // =========================
  const handleWishlist = async () => {
    if (loadingWishlist) return;

    try {
      setLoadingWishlist(true);

      if (isAuthenticated) {
        if (isInWishlist) {
          await wishlistService.removeFromWishlist(
            product.id
          );

          setIsInWishlist(false);
        } else {
          await wishlistService.addToWishlist(
            product.id
          );

          setIsInWishlist(true);
        }

        return;
      }

      const wishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );

      const exists = wishlist.some(
        (item) => item.id === product.id
      );

      let updatedWishlist;

      if (exists) {
        updatedWishlist = wishlist.filter(
          (item) => item.id !== product.id
        );

        setIsInWishlist(false);
      } else {
        updatedWishlist = [
          ...wishlist,
          product,
        ];

        setIsInWishlist(true);
      }

      localStorage.setItem(
        "wishlist",
        JSON.stringify(updatedWishlist)
      );
    } catch (error) {
      console.error(
        "Failed to update wishlist:",
        error
      );
    } finally {
      setLoadingWishlist(false);
    }
  };

  return (
    <main className="product-details-page">

      {/* Back */}
      <Link
        to="/products"
        className="back-link"
      >
        <ArrowLeft size={18} />
        Back to Products
      </Link>

      <section className="product-details">

        {/* Product Image */}
        <div className="product-details-image">
          <img
            src={productImage}
            alt={product.title}
          />
        </div>

        {/* Product Info */}
        <div className="product-details-info">

          <span className="product-category">
            {categoryName}
          </span>

          <h1>{product.title}</h1>

          <div className="product-details-price">
            ${Number(product.price).toFixed(2)}
          </div>

          <p className="product-details-description">
            {product.description}
          </p>

          <div className="product-stock">
            {isOutOfStock
              ? "Out of Stock"
              : `${product.stock} items available`}
          </div>

          {!isOutOfStock && (
            <>
              {/* Quantity */}
              <div className="quantity-control">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={
                    quantity >= product.stock
                  }
                >
                  +
                </button>

              </div>

              {/* Actions */}
              <div className="product-actions">

                <button
                  type="button"
                  className="add-cart-button"
                  onClick={handleAddToCart}
                  disabled={loadingCart}
                >
                  <ShoppingCart size={20} />

                  {loadingCart
                    ? "Adding..."
                    : "Add to Cart"}
                </button>

                <button
                  type="button"
                  className={`wishlist-button ${
                    isInWishlist ? "active" : ""
                  }`}
                  onClick={handleWishlist}
                  disabled={loadingWishlist}
                  aria-label={
                    isInWishlist
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  <Heart
                    size={20}
                    fill={
                      isInWishlist
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>

              </div>
            </>
          )}

        </div>

      </section>

    </main>
  );
}

export default ProductDetails;