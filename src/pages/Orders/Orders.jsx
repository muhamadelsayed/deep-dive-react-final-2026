import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";

import orderService from "../../services/orderService";
import { useAuth } from "../../context/AuthContext";

function Orders() {
  const { isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        if (!isAuthenticated) {
          setOrders([]);
          return;
        }

        const data = await orderService.getOrders();

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);

        setError(
          error.response?.data?.detail ||
            error.response?.data?.message ||
            error.response?.data?.title ||
            "Failed to load orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <main className="orders-page">
        <div className="empty-orders">
          <Package size={60} />

          <h1>Loading Orders...</h1>

          <p>
            Please wait while we load your orders.
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // Error
  // =========================
  if (error) {
    return (
      <main className="orders-page">
        <div className="empty-orders">
          <Package size={60} />

          <h1>Something went wrong</h1>

          <p>{error}</p>

          <Link to="/products">
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  // =========================
  // Empty Orders
  // =========================
  if (orders.length === 0) {
    return (
      <main className="orders-page">
        <div className="empty-orders">
          <Package size={60} />

          <h1>No Orders Yet</h1>

          <p>
            You haven't placed any orders yet.
          </p>

          <Link to="/products">
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">

      {/* Header */}
      <div className="orders-header">
        <span className="section-label">
          YOUR ACCOUNT
        </span>

        <h1>My Orders</h1>

        <p>
          Track and manage your orders.
        </p>
      </div>

      {/* Orders */}
      <section className="orders-list">

        {orders.map((order) => {
          const itemCount = order.items?.length || 0;

          return (
            <article
              className="order-card"
              key={order.id}
            >

              {/* Order Info */}
              <div className="order-main">

                <div className="order-icon">
                  <Package size={22} />
                </div>

                <div className="order-info">

                  <span className="order-number">
                    Order #{order.id}
                  </span>

                  <h3>
                    {itemCount}{" "}
                    {itemCount === 1
                      ? "Item"
                      : "Items"}
                  </h3>

                  <p>
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString()
                      : "Recently"}
                  </p>

                </div>

              </div>

              {/* Status */}
              <div className="order-status">
                <span
                  className={`status-badge ${String(
                    order.status || "Pending"
                  ).toLowerCase()}`}
                >
                  {order.status || "Pending"}
                </span>
              </div>

              {/* Total */}
              <div className="order-total">
                <span>Total</span>

                <strong>
                  ${Number(order.total || 0).toFixed(2)}
                </strong>
              </div>

              {/* Details */}
              <Link
                to={`/orders/${order.id}`}
                className="order-details-link"
              >
                <span>View Details</span>

                <ChevronRight size={18} />
              </Link>

            </article>
          );
        })}

      </section>

    </main>
  );
}

export default Orders;