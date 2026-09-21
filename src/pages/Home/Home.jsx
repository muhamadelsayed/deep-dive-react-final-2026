import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductGrid from "../../components/ProductGrid/ProductGrid";
import productService from "../../services/productService";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await productService.getProducts({
          page: 1,
          pageSize: 4,
        });

        setProducts(data?.items || []);
      } catch (err) {
        console.error("Failed to load featured products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <main className="home-page">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-label">
            Welcome to our store
          </span>

          <h1>
            Everything You Need,
            <br />
            All in One Place.
          </h1>

          <p>
            Discover our collection of quality products
            and find what suits you best.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="primary-button">
              Shop Now
            </Link>

            <Link to="/register" className="secondary-button">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="section-heading">
          <div>
            <span>Our Collection</span>
            <h2>Featured Products</h2>
          </div>

          <Link to="/products" className="view-all">
            View All
          </Link>
        </div>

        {loading && (
          <div className="products-loading">
            Loading products...
          </div>
        )}

        {!loading && error && (
          <div className="products-error">
            {error}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <ProductGrid
            products={products}
          />
        )}

        {!loading && !error && products.length === 0 && (
          <div className="products-empty">
            No products available.
          </div>
        )}
      </section>

    </main>
  );
}

export default Home;