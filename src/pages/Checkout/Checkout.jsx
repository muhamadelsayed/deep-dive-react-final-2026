import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import orderService from "../../services/orderService";
import cartService from "../../services/cartService";
import { useAuth } from "../../context/AuthContext";

function Checkout() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [paymentMethod] = useState("COD");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

   
  // Fetch Cart
   
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (isAuthenticated) {
          const data = await cartService.getCart();

          setCart(data?.items || []);
        } else {
          const savedCart = JSON.parse(
            localStorage.getItem("cart") || "[]"
          );

          setCart(savedCart);
        }
      } catch (error) {
        console.error(
          "Failed to fetch cart:",
          error
        );

        setError(
          error.response?.data?.detail ||
            error.response?.data?.message ||
            "Failed to load your cart."
        );
      }
    };

    fetchCart();
  }, [isAuthenticated]);

   
  // Calculate Total
   
  const subtotal = cart.reduce((total, item) => {
    const price =
      Number(
        item.unitPrice ??
          item.price ??
          0
      );

    return (
      total +
      price * Number(item.quantity || 0)
    );
  }, 0);

  const shipping = 0;
  const total = subtotal + shipping;

   
  // Create Order
   
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!isAuthenticated) {
      setError(
        "Please login before placing an order."
      );
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!address.trim()) {
      setError(
        "Please enter your shipping address."
      );
      return;
    }

    try {
      setLoading(true);

      await orderService.createOrder({
        shippingAddress: address.trim(),
        paymentMethod,
      });

      /*
        The backend creates the order from
        the authenticated user's cart.
      */

      try {
        const latestCart =
          await cartService.getCart();

        if (
          !latestCart?.items ||
          latestCart.items.length === 0
        ) {
          localStorage.removeItem("cart");
        }
      } catch {
        localStorage.removeItem("cart");
      }

      navigate("/orders");
    } catch (error) {
      console.error(
        "Checkout failed:",
        error
      );

      setError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.response?.data?.title ||
          "Something went wrong while creating your order."
      );
    } finally {
      setLoading(false);
    }
  };

   
  // Empty Cart
   
  if (cart.length === 0 && !error) {
    return (
      <main className="checkout-page">
        <div className="empty-checkout">
          <h1>Your Cart is Empty</h1>

          <p>
            Add some products before proceeding
            to checkout.
          </p>

          <Link to="/products">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">

      <div className="checkout-header">
        <span className="section-label">
          CHECKOUT
        </span>

        <h1>Complete Your Order</h1>

        <p>
          Enter your shipping information and
          choose your payment method.
        </p>
      </div>

      <section className="checkout-layout">

        {/* Checkout Form */}
        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >
          <div className="checkout-section">

            <h2>Shipping Address</h2>

            <div className="form-group">
              <label htmlFor="address">
                Full Address
              </label>

              <textarea
                id="address"
                rows="5"
                placeholder="Enter your full shipping address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setError("");
                }}
              />
            </div>

          </div>

          {/* Payment */}
          <div className="checkout-section">

            <h2>Payment Method</h2>

            <label className="payment-option">
              <input
                type="radio"
                checked
                readOnly
              />

              <div>
                <strong>
                  Cash on Delivery
                </strong>

                <span>
                  Pay when your order arrives.
                </span>
              </div>
            </label>

          </div>

          {/* Error */}
          {error && (
            <div className="checkout-error">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="place-order-button"
            disabled={loading}
          >
            {loading
              ? "Creating Order..."
              : "Place Order"}
          </button>

        </form>

        {/* Order Summary */}
        <aside className="checkout-summary">

          <h2>Order Summary</h2>

          <div className="checkout-items">

            {cart.map((item) => {
              const price = Number(
                item.unitPrice ??
                  item.price ??
                  0
              );

              const image =
                item.featuredImage ||
                item.featured_image ||
                item.image;

              return (
                <div
                  className="checkout-item"
                  key={
                    item.id ||
                    item.productId
                  }
                >
                  <img
                    src={image}
                    alt={item.title}
                  />

                  <div>
                    <h3>
                      {item.title}
                    </h3>

                    <span>
                      Qty:{" "}
                      {item.quantity}
                    </span>
                  </div>

                  <strong>
                    $
                    {(
                      price *
                      Number(
                        item.quantity || 0
                      )
                    ).toFixed(2)}
                  </strong>
                </div>
              );
            })}

          </div>

          <div className="summary-divider" />

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

        </aside>

      </section>

    </main>
  );
}

export default Checkout;