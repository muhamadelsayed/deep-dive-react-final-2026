import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import wishlistService from "../../services/wishlistService";
import cartService from "../../services/cartService";

function Wishlist() {
  const { isAuthenticated } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      if (!isAuthenticated) {
        const savedWishlist = JSON.parse(
          localStorage.getItem("wishlist") || "[]"
        );

        setWishlist(savedWishlist);
        return;
      }

      const data = await wishlistService.getWishlist();

      setWishlist(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load wishlist:", err);

      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to load wishlist."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [isAuthenticated]);

  const removeFromWishlist = async (productId) => {
    try {
      if (isAuthenticated) {
        await wishlistService.removeFromWishlist(productId);

        setWishlist((prev) =>
          prev.filter((item) => item.productId !== productId)
        );

        return;
      }

      const updatedWishlist = wishlist.filter(
        (item) => item.id !== productId
      );

      setWishlist(updatedWishlist);

      localStorage.setItem(
        "wishlist",
        JSON.stringify(updatedWishlist)
      );
    } catch (err) {
      console.error("Failed to remove wishlist item:", err);

      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to remove item from wishlist."
      );
    }
  };

  const moveToCart = async (product) => {
    try {
      const productId = product.productId || product.id;

      if (isAuthenticated) {
        await cartService.addToCart(productId, 1);

        await wishlistService.removeFromWishlist(productId);

        setWishlist((prev) =>
          prev.filter((item) => item.productId !== productId)
        );

        return;
      }

      const stock = product.stock ?? 1;

      if (stock === 0) {
        return;
      }

      const cart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      const existingItem = cart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        existingItem.quantity = Math.min(
          existingItem.quantity + 1,
          stock
        );
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

      const updatedWishlist = wishlist.filter(
        (item) => item.id !== product.id
      );

      setWishlist(updatedWishlist);

      localStorage.setItem(
        "wishlist",
        JSON.stringify(updatedWishlist)
      );
    } catch (err) {
      console.error("Failed to move product to cart:", err);

      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to move product to cart."
      );
    }
  };

  if (loading) {
    return (
      <main className="wishlist-page">
        <div className="empty-wishlist">
          <Heart size={60} />

          <h1>Loading Wishlist...</h1>

          <p>Please wait while we load your favorite products.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="wishlist-page">
        <div className="empty-wishlist">
          <Heart size={60} />

          <h1>Something went wrong</h1>

          <p>{error}</p>

          <button
            className="continue-shopping"
            onClick={loadWishlist}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (wishlist.length === 0) {
    return (
      <main className="wishlist-page">
        <div className="empty-wishlist">
          <Heart size={60} />

          <h1>Your Wishlist is Empty</h1>

          <p>
            Save products you love and come back to them later.
          </p>

          <Link
            to="/products"
            className="continue-shopping"
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="wishlist-page">
      <div className="wishlist-header">
        <span className="section-label">
          YOUR FAVORITES
        </span>

        <h1>Wishlist</h1>

        <p>
          Products you've saved for later.
        </p>
      </div>

      <section className="wishlist-grid">
        {wishlist.map((product) => {
          const productId =
            product.productId || product.id;

          const image =
            product.featuredImage ||
            product.featured_image ||
            product.image;

          const price = Number(product.price || 0);

          return (
            <article
              className="wishlist-card"
              key={product.id || productId}
            >
              <div className="wishlist-image">
                <Link to={`/products/${productId}`}>
                  <img
                    src={image}
                    alt={product.title}
                  />
                </Link>

                <button
                  className="wishlist-remove"
                  onClick={() =>
                    removeFromWishlist(productId)
                  }
                >
                  <Trash2 size={17} />
                </button>
              </div>

              <div className="wishlist-info">
                <span className="product-category">
                  Product
                </span>

                <Link
                  to={`/products/${productId}`}
                  className="product-title"
                >
                  {product.title}
                </Link>

                <div className="wishlist-bottom">
                  <strong className="product-price">
                    ${price.toFixed(2)}
                  </strong>

                  <button
                    className="add-cart-btn"
                    onClick={() =>
                      moveToCart(product)
                    }
                  >
                    <ShoppingCart size={16} />

                    Move to Cart
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default Wishlist;