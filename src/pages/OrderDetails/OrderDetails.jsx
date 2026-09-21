import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";

import orderService from "../../services/orderService";
import { useAuth } from "../../context/AuthContext";

function OrderDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState("");

  //  
  // Fetch Orders
  //  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        if (!isAuthenticated) {
          setOrder(null);
          return;
        }

        const orders = await orderService.getOrders();

        const foundOrder = orders.find(
          (item) => item.id?.toString() === id
        );

        setOrder(foundOrder || null);
      } catch (error) {
        console.error(
          "Failed to fetch order:",
          error
        );

        setError(
          error.response?.data?.detail ||
            error.response?.data?.message ||
            error.response?.data?.title ||
            "Failed to load order."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isAuthenticated]);

  //  
  // Loading
  //  
  if (loading) {
    return (
      <main className="not-found-page">
        <Package size={50} />

        <h1>Loading Order...</h1>

        <p>Please wait while we load your order.</p>
      </main>
    );
  }

  //  
  // Error
  //  
  if (error) {
    return (
      <main className="not-found-page">
        <Package size={50} />

        <h1>Something Went Wrong</h1>

        <p>{error}</p>

        <Link to="/orders">
          Back to Orders
        </Link>
      </main>
    );
  }

  //  
  // Order Not Found
  //  
  if (!order) {
    return (
      <main className="not-found-page">
        <Package size={50} />

        <h1>Order Not Found</h1>

        <Link to="/orders">
          Back to Orders
        </Link>
      </main>
    );
  }

  const status = order.status || "Pending";

  const canCancel =
    status.toLowerCase() === "pending";

  // Cancel Order
  const handleCancel = async () => {
    if (canceling || !canCancel) return;

    try {
      setCanceling(true);
      setError("");

      await orderService.cancelOrder(order.id);

      setOrder((prev) => ({
        ...prev,
        status: "Canceled",
      }));
    } catch (error) {
      console.error(
        "Failed to cancel order:",
        error
      );

      setError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.response?.data?.title ||
          "Failed to cancel order."
      );
    } finally {
      setCanceling(false);
    }
  };

  return (
    <main className="order-details-page">

      {/* Back */}
      <Link
        to="/orders"
        className="back-link"
      >
        <ArrowLeft size={18} />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="order-details-header">

        <div>
          <span className="section-label">
            ORDER DETAILS
          </span>

          <h1>
            Order #{order.id}
          </h1>

          <p>
            Placed on{" "}
            {order.createdAt
              ? new Date(
                  order.createdAt
                ).toLocaleDateString()
              : "Recently"}
          </p>
        </div>

        <span
          className={`status-badge ${status.toLowerCase()}`}
        >
          {status}
        </span>

      </div>

      {error && (
        <div className="checkout-error">
          {error}
        </div>
      )}

      <section className="order-details-layout">

        {/*  
            Order Content
          */}
        <div className="order-details-content">

          {/* Items */}
          <div className="order-detail-box">

            <h2>Order Items</h2>

            <div className="order-products">

              {(order.items || []).map(
                (item, index) => {

                  const image =
                    item.featuredImage ||
                    item.featured_image ||
                    item.image;

                  const unitPrice =
                    Number(
                      item.unitPrice || 0
                    );

                  const quantity =
                    Number(
                      item.quantity || 0
                    );

                  return (
                    <div
                      className="order-product"
                      key={
                        item.id ||
                        item.productId ||
                        index
                      }
                    >

                      <img
                        src={image}
                        alt={item.title}
                      />

                      <div className="order-product-info">

                        <h3>
                          {item.title}
                        </h3>

                        <span>
                          Quantity: {quantity}
                        </span>

                        <span>
                          Unit Price: $
                          {unitPrice.toFixed(2)}
                        </span>

                      </div>

                      <strong>
                        $
                        {(
                          unitPrice *
                          quantity
                        ).toFixed(2)}
                      </strong>

                    </div>
                  );
                }
              )}

            </div>

          </div>

          {/* Shipping */}
          <div className="order-detail-box">

            <h2>Shipping Information</h2>

            <p className="shipping-address">
              {order.shippingAddress ||
                "No address available"}
            </p>

          </div>

          {/* Payment */}
          <div className="order-detail-box">

            <h2>Payment Method</h2>

            <p>
              {order.paymentMethod ||
                "Cash on Delivery"}
            </p>

          </div>

        </div>

        {/*  
            Summary
          */}
        <aside className="order-summary-box">

          <h2>Order Summary</h2>

          <div className="summary-row">

            <span>Subtotal</span>

            <span>
              $
              {Number(
                order.total || 0
              ).toFixed(2)}
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
              $
              {Number(
                order.total || 0
              ).toFixed(2)}
            </strong>

          </div>

          {/* Cancel */}
          {canCancel && (
            <button
              className="cancel-order-button"
              onClick={handleCancel}
              disabled={canceling}
            >
              {canceling
                ? "Canceling..."
                : "Cancel Order"}
            </button>
          )}

        </aside>

      </section>

    </main>
  );
}

export default OrderDetails;