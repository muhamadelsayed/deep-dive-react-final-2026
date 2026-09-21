import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";

import orderService from "../../../services/orderService";

function AdminOrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Fetch Order
  // =========================

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const orders =
          await orderService.getAdminOrders();

        const foundOrder = Array.isArray(orders)
          ? orders.find(
              (item) =>
                String(item.id) === String(id)
            )
          : null;

        if (!foundOrder) {
          setError("Order not found.");
          return;
        }

        setOrder(foundOrder);
      } catch (error) {
        console.error(
          "Failed to fetch order:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to load order.";

        setError(message);

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="admin-empty-state">
        <h2>Loading Order...</h2>

        <p>
          Please wait while we load the order information.
        </p>
      </div>
    );
  }

  // =========================
  // Error / Not Found
  // =========================

  if (error || !order) {
    return (
      <div className="admin-empty-state">

        <h2>
          {error || "Order Not Found"}
        </h2>

        <p>
          The order you are trying to view
          could not be found.
        </p>

        <Link
          to="/admin/orders"
          className="admin-primary-btn"
        >
          Back to Orders
        </Link>

      </div>
    );
  }

  // =========================
  // Calculations
  // =========================

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  const subtotal = items.reduce(
    (total, item) =>
      total +
      Number(item.unitPrice || 0) *
        Number(item.quantity || 0),
    0
  );

  return (
    <div className="admin-order-details-page">

      {/* =========================
          Header
      ========================= */}

      <div className="admin-page-header">

        <div>

          <Link
            to="/admin/orders"
            className="admin-back-link"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </Link>

          <span className="admin-page-label">
            ORDER DETAILS
          </span>

          <h1>{order.id}</h1>

          <p>
            View customer and order information.
          </p>

        </div>

        <span
          className={`admin-order-status-select ${String(
            order.status || ""
          ).toLowerCase()}`}
        >
          {order.status || "Unknown"}
        </span>

      </div>

      {/* =========================
          Customer + Shipping
      ========================= */}

      <div className="admin-order-details-grid">

        {/* Customer */}

        <section className="admin-form-section">

          <div className="admin-form-section-header">

            <h2>
              Customer Information
            </h2>

          </div>

          <div className="admin-detail-list">

            <div>
              <span>
                Customer
              </span>

              <strong>
                {order.customerName ||
                  "Unknown Customer"}
              </strong>
            </div>

            <div>
              <span>
                Client ID
              </span>

              <strong>
                #{order.clientId}
              </strong>
            </div>

            <div>
              <span>
                Order Date
              </span>

              <strong>
                {order.createdAt
                  ? new Date(
                      order.createdAt
                    ).toLocaleString()
                  : "-"}
              </strong>
            </div>

          </div>

        </section>

        {/* Shipping + Payment */}

        <section className="admin-form-section">

          <div className="admin-form-section-header">

            <h2>
              Shipping & Payment
            </h2>

          </div>

          <div className="admin-detail-list">

            <div>

              <span>
                <MapPin size={15} />
                Shipping Address
              </span>

              <strong>
                {order.shippingAddress ||
                  "-"}
              </strong>

            </div>

            <div>

              <span>
                <CreditCard size={15} />
                Payment Method
              </span>

              <strong>
                {order.paymentMethod ||
                  "-"}
              </strong>

            </div>

          </div>

        </section>

      </div>

      {/* =========================
          Order Items
      ========================= */}

      <section className="admin-form-section">

        <div className="admin-form-section-header">

          <h2>
            Order Items
          </h2>

          <p>
            Products included in this order.
          </p>

        </div>

        <div className="admin-order-items">

          {items.length > 0 ? (
            items.map((item) => {

              const itemTotal =
                Number(
                  item.unitPrice || 0
                ) *
                Number(
                  item.quantity || 0
                );

              return (
                <div
                  className="admin-order-item"
                  key={item.id}
                >

                  <div className="admin-order-item-icon">
                    {item.featuredImage ? (
                      <img
                        src={
                          item.featuredImage
                        }
                        alt={
                          item.title ||
                          "Product"
                        }
                      />
                    ) : (
                      <Package size={19} />
                    )}
                  </div>

                  <div className="admin-order-item-info">

                    <strong>
                      {item.title ||
                        "Unknown Product"}
                    </strong>

                    <span>
                      Quantity:{" "}
                      {item.quantity}
                    </span>

                    <span>
                      Unit Price: $
                      {Number(
                        item.unitPrice || 0
                      ).toFixed(2)}
                    </span>

                  </div>

                  <strong>
                    $
                    {itemTotal.toFixed(2)}
                  </strong>

                </div>
              );
            })
          ) : (
            <p>
              No items found in this order.
            </p>
          )}

        </div>

        {/* Total */}

        <div className="admin-order-total">

          <span>
            Total
          </span>

          <strong>
            $
            {Number(
              order.total || subtotal
            ).toFixed(2)}
          </strong>

        </div>

      </section>

    </div>
  );
}

export default AdminOrderDetails;