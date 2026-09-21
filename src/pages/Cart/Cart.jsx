import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import cartService from "../../services/cartService";

function Cart() {
  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Load Cart
  // =========================
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);

        // Logged in user
        if (isAuthenticated) {
          const data = await cartService.getCart();

          const items = data?.items || [];

          setCart(items);
        }

        // Guest user
        else {
          const savedCart = JSON.parse(
            localStorage.getItem("cart") || "[]"
          );

          setCart(savedCart);
        }
      } catch (error) {
        console.error("Failed to load cart:", error);

        // Fallback to local cart
        const savedCart = JSON.parse(
          localStorage.getItem("cart") || "[]"
        );

        setCart(savedCart);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated]);

  // =========================
  // Update Local Cart
  // =========================
  const updateLocalCart = (updatedCart) => {
    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  // =========================
  // Increase Quantity
  // =========================
  const increaseQuantity = async (item) => {
    const newQuantity = Math.min(
      item.quantity + 1,
      item.stock ?? Infinity
    );

    if (newQuantity === item.quantity) return;

    try {
      if (isAuthenticated) {
        await cartService.updateCartItem(
          item.productId || item.id,
          newQuantity
        );

        setCart((prev) =>
          prev.map((cartItem) =>
            (cartItem.productId || cartItem.id) ===
            (item.productId || item.id)
              ? {
                  ...cartItem,
                  quantity: newQuantity,
                }
              : cartItem
          )
        );
      } else {
        const updatedCart = cart.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: newQuantity,
              }
            : cartItem
        );

        updateLocalCart(updatedCart);
      }
    } catch (error) {
      console.error(
        "Failed to increase quantity:",
        error
      );
    }
  };

  // =========================
  // Decrease Quantity
  // =========================
  const decreaseQuantity = async (item) => {
    const newQuantity = item.quantity - 1;

    if (newQuantity <= 0) {
      await removeItem(item);
      return;
    }

    try {
      if (isAuthenticated) {
        await cartService.updateCartItem(
          item.productId || item.id,
          newQuantity
        );

        setCart((prev) =>
          prev.map((cartItem) =>
            (cartItem.productId || cartItem.id) ===
            (item.productId || item.id)
              ? {
                  ...cartItem,
                  quantity: newQuantity,
                }
              : cartItem
          )
        );
      } else {
        const updatedCart = cart.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: newQuantity,
              }
            : cartItem
        );

        updateLocalCart(updatedCart);
      }
    } catch (error) {
      console.error(
        "Failed to decrease quantity:",
        error
      );
    }
  };

  // =========================
  // Remove Item
  // =========================
  const removeItem = async (item) => {
    try {
      if (isAuthenticated) {
        await cartService.removeFromCart(
          item.productId || item.id
        );

        setCart((prev) =>
          prev.filter(
            (cartItem) =>
              (cartItem.productId || cartItem.id) !==
              (item.productId || item.id)
          )
        );
      } else {
        const updatedCart = cart.filter(
          (cartItem) => cartItem.id !== item.id
        );

        updateLocalCart(updatedCart);
      }
    } catch (error) {
      console.error(
        "Failed to remove cart item:",
        error
      );
    }
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <main className="cart-page">
        <div className="empty-cart">
          <h1>Loading Cart...</h1>
        </div>
      </main>
    );
  }

  // =========================
  // Empty Cart
  // =========================
  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <div className="empty-cart">
          <ShoppingBag size={60} />

          <h1>Your Cart is Empty</h1>

          <p>
            You haven't added any products yet.
          </p>

          <Link
            to="/products"
            className="continue-shopping"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  // =========================
  // Calculate Totals
  // =========================
  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.unitPrice ?? item.price ?? 0) *
        Number(item.quantity ?? 0),
    0
  );

  const shipping = 0;

  const total = subtotal + shipping;

  return (
    <main className="cart-page">
      <div className="cart-header">
        <span className="section-label">
          SHOPPING CART
        </span>

        <h1>Your Cart</h1>

        <p>
          Review your items before checkout.
        </p>
      </div>

      <section className="cart-layout">

        {/* Cart Items */}
        <div className="cart-items">

          {cart.map((item) => {
            const productId =
              item.productId || item.id;

            const title =
              item.title || "Product";

            const price =
              Number(
                item.unitPrice ??
                  item.price ??
                  0
              );

            const image =
              item.featuredImage ||
              item.featured_image ||
              item.image ||
              "";

            const category =
              item.category?.name ||
              item.category ||
              "";

            return (
              <div
                className="cart-item"
                key={productId}
              >

                <img
                  src={image}
                  alt={title}
                />

                <div className="cart-item-info">

                  <span>
                    {category}
                  </span>

                  <h3>{title}</h3>

                  <p>
                    ${price.toFixed(2)}
                  </p>

                </div>

                <div className="cart-quantity">

                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(item)
                    }
                  >
                    <Minus size={15} />
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      increaseQuantity(item)
                    }
                  >
                    <Plus size={15} />
                  </button>

                </div>

                <div className="cart-item-total">
                  $
                  {(
                    price *
                    Number(item.quantity)
                  ).toFixed(2)}
                </div>

                <button
                  type="button"
                  className="remove-cart-item"
                  onClick={() =>
                    removeItem(item)
                  }
                >
                  <Trash2 size={18} />
                </button>

              </div>
            );
          })}

        </div>

        {/* Summary */}
        <aside className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>

            <span>
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>

            <span>Free</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>

            <strong>
              ${total.toFixed(2)}
            </strong>
          </div>

          <Link
            to="/checkout"
            className="checkout-button"
          >
            Proceed to Checkout
          </Link>

          <Link
            to="/products"
            className="continue-shopping-link"
          >
            Continue Shopping
          </Link>

        </aside>

      </section>
    </main>
  );
}

export default Cart;