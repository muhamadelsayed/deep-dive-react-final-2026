import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import wishlistService from "../../services/wishlistService";
import cartService from "../../services/cartService";

function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);

  const isOutOfStock = product.stock === 0;

  const productId = product.id;

  const productImage =
    product.featuredImage ||
    product.featured_image ||
    product.image;

  const productPrice = Number(product.price || 0);

  const category =
    product.category?.name ||
    product.category ||
    "Product";

  const handleWishlist = async () => {
    if (loadingWishlist) return;

    if (!isAuthenticated) {
      const wishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );

      const exists = wishlist.some(
        (item) => item.id === productId
      );

      let updatedWishlist;

      if (exists) {
        updatedWishlist = wishlist.filter(
          (item) => item.id !== productId
        );

        setIsInWishlist(false);
      } else {
        updatedWishlist = [...wishlist, product];

        setIsInWishlist(true);
      }

      localStorage.setItem(
        "wishlist",
        JSON.stringify(updatedWishlist)
      );

      return;
    }

    try {
      setLoadingWishlist(true);

      if (isInWishlist) {
        await wishlistService.removeFromWishlist(productId);

        setIsInWishlist(false);
      } else {
        await wishlistService.addToWishlist(productId);

        setIsInWishlist(true);
      }
    } catch (error) {
      console.error(
        "Failed to update wishlist:",
        error
      );
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock || loadingCart) return;

    try {
      setLoadingCart(true);

      if (isAuthenticated) {
        await cartService.addToCart(productId, 1);
      } else {
        const cart = JSON.parse(
          localStorage.getItem("cart") || "[]"
        );

        const existingItem = cart.find(
          (item) => item.id === productId
        );

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({
            ...product,
            quantity: 1,
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

  return (
    <article className="product-card">

      {/* Image */}
      <div className="product-image-wrapper">

        <Link to={`/products/${productId}`}>
          <img
            src={productImage}
            alt={product.title}
            className="product-image"
          />
        </Link>

        <button
          className={`wishlist-btn ${
            isInWishlist ? "active" : ""
          }`}
          type="button"
          aria-label={
            isInWishlist
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          onClick={handleWishlist}
          disabled={loadingWishlist}
        >
          <Heart
            size={19}
            fill={isInWishlist ? "currentColor" : "none"}
          />
        </button>

        {isOutOfStock && (
          <span className="stock-badge">
            Out of Stock
          </span>
        )}

      </div>

      {/* Info */}
      <div className="product-info">

        <span className="product-category">
          {category}
        </span>

        <Link
          to={`/products/${productId}`}
          className="product-title"
        >
          {product.title}
        </Link>

        <p className="product-description">
          {product.description}
        </p>

        <div className="product-bottom">

          <span className="product-price">
            ${productPrice.toFixed(2)}
          </span>

          <button
            className="add-cart-btn"
            type="button"
            disabled={isOutOfStock || loadingCart}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={17} />

            {isOutOfStock
              ? "Out of Stock"
              : loadingCart
              ? "Adding..."
              : "Add"}
          </button>

        </div>

      </div>

    </article>
  );
}

export default ProductCard;