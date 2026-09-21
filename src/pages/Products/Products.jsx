import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import productService from "../../services/productService";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Fetch Products
  // =========================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await productService.getProducts();

        // Handle paged response or direct array
        const productsData = Array.isArray(data)
          ? data
          : data?.items || data?.data || [];

        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch products:", error);

        setError(
          error.response?.data?.message ||
            error.response?.data?.title ||
            "Failed to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =========================
  // Categories
  // =========================
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.category?.name || product.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [products]);

  // =========================
  // Filter + Sort
  // =========================
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter((product) =>
        product.title?.toLowerCase().includes(searchValue)
      );
    }

    if (category !== "All") {
      result = result.filter(
        (product) =>
          (product.category?.name || product.category) === category
      );
    }

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
      result.sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      );
    }

    return result;
  }, [products, search, category, sort]);

  return (
    <main className="products-page">

      <section className="products-header">
        <div>
          <span className="section-label">
            OUR COLLECTION
          </span>

          <h1>All Products</h1>

          <p>
            Discover our collection and find what suits you best.
          </p>
        </div>
      </section>

      <section className="products-content">

        {/* Filters */}
        <div className="products-toolbar">

          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <SlidersHorizontal size={18} />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <select
            className="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">
              Sort By
            </option>

            <option value="low">
              Price: Low to High
            </option>

            <option value="high">
              Price: High to Low
            </option>

            <option value="name">
              Name: A-Z
            </option>
          </select>

        </div>

        {/* Loading */}
        {loading && (
          <div className="empty-products">
            <h2>Loading products...</h2>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="empty-products">
            <h2>Something went wrong</h2>
            <p>{error}</p>
          </div>
        )}

        {/* Products */}
        {!loading &&
          !error &&
          (filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="empty-products">
              <h2>No products found</h2>
              <p>
                Try another search or category.
              </p>
            </div>
          ))}

      </section>

    </main>
  );
}

export default Products;