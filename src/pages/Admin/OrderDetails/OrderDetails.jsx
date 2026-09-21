import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Package,
  User,
  Calendar,
  Hash,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Copy,
} from "lucide-react";
import toast from "react-hot-toast";

import orderService from "../../../services/orderService";

// =========================
// Status Helpers
// =========================

const STATUS_ICONS = {
  Pending: Clock,
  Shipped: Truck,
  Delivered: CheckCircle2,
  Canceled: XCircle,
};

const getStatusIcon = (status) => STATUS_ICONS[status] || Clock;

// =========================
// Component
// =========================

function AdminOrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Fetch Order
  // =========================

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        // جرّب جلب الأوردر مباشرة أولاً
        let foundOrder = null;

        if (orderService.getAdminOrderById) {
          try {
            foundOrder = await orderService.getAdminOrderById(id);
          } catch (err) {
            // تجاهل ونجرب الطريقة الاحتياطية
            console.warn("getAdminOrderById failed, falling back...", err);
          }
        }

        // fallback: جلب كل الأوردرات والبحث
        if (!foundOrder) {
          const orders = await orderService.getAdminOrders();

          foundOrder = Array.isArray(orders)
            ? orders.find((item) => String(item.id) === String(id))
            : null;
        }

        if (!isMounted) return;

        if (!foundOrder) {
          setError("Order not found.");
          return;
        }

        setOrder(foundOrder);
      } catch (error) {
        if (!isMounted) return;

        console.error("Failed to fetch order:", error);

        const message =
          error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to load order.";

        setError(message);
        toast.error(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    } else {
      setError("Order not found.");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  // =========================
  // Calculations (memoized)
  // =========================

  const items = useMemo(
    () => (Array.isArray(order?.items) ? order.items : []),
    [order]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total +
          Number(item.unitPrice || 0) * Number(item.quantity || 0),
        0
      ),
    [items]
  );

  const totalItems = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      ),
    [items]
  );

  const total = Number(order?.total || subtotal);

  // =========================
  // Handlers
  // =========================

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(String(order.id));
      toast.success("Order ID copied.");
    } catch {
      toast.error("Failed to copy Order ID.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="admin-empty-state">
        <h2>Loading Order...</h2>
        <p>Please wait while we load the order information.</p>
      </div>
    );
  }

  // =========================
  // Error / Not Found
  // =========================

  if (error || !order) {
    return (
      <div className="admin-empty-state">
        <h2>{error || "Order Not Found"}</h2>

        <p>The order you are trying to view could not be found.</p>

        <Link to="/admin/orders" className="admin-primary-btn">
          Back to Orders
        </Link>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(order.status);

  return (
    <>
      {/* =========================
          Scoped Styles
      ========================= */}
      <style>{`
        .admin-order-details-page {
          padding: 4px 0 40px;
        }

        /* =========================
           Header
           ========================= */

        .admin-order-details-page .admin-page-header {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 22px;
        }

        .admin-order-details-page .admin-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-decoration: none;
          margin-bottom: 10px;
          transition: color 0.2s ease;
        }

        .admin-order-details-page .admin-back-link:hover {
          color: #111827;
        }

        .admin-order-details-page .admin-page-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #6366f1;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .admin-order-details-page h1 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 26px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 6px;
        }

        .admin-order-details-page .admin-page-header p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        .admin-order-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .admin-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #fff;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .admin-icon-btn:hover {
          background: #f9fafb;
          color: #111827;
          border-color: #d1d5db;
        }

        .admin-secondary-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: #fff;
          color: #374151;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .admin-secondary-btn:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        /* =========================
           Status Badge
           ========================= */

        .admin-order-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .admin-order-status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .admin-order-status-badge.shipped {
          background: #dbeafe;
          color: #1e40af;
        }

        .admin-order-status-badge.delivered {
          background: #d1fae5;
          color: #065f46;
        }

        .admin-order-status-badge.canceled {
          background: #fee2e2;
          color: #991b1b;
        }

        /* =========================
           KPI Cards
           ========================= */

        .admin-order-kpis {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 14px;
          margin-bottom: 22px;
        }

        .admin-order-kpi {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 16px 18px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
        }

        .admin-order-kpi-label {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .admin-order-kpi-value {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }

        .admin-order-kpi-value small {
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
        }

        /* =========================
           Sections
           ========================= */

        .admin-order-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 18px;
          margin-bottom: 18px;
        }

        .admin-order-details-page .admin-form-section {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 18px;
        }

        .admin-order-details-page .admin-form-section-header {
          margin-bottom: 14px;
        }

        .admin-order-details-page .admin-form-section-header h2 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 4px;
        }

        .admin-order-details-page .admin-form-section-header p {
          margin: 0;
          font-size: 13px;
          color: #6b7280;
        }

        .admin-detail-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .admin-detail-list > div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .admin-detail-list span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .admin-detail-list strong {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          word-break: break-word;
        }

        /* =========================
           Items
           ========================= */

        .admin-order-items {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .admin-order-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px;
          border: 1px solid #f3f4f6;
          border-radius: 10px;
          background: #fafafa;
        }

        .admin-order-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background: #fff;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          flex-shrink: 0;
          color: #9ca3af;
        }

        .admin-order-item-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .admin-order-item-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1;
          min-width: 0;
        }

        .admin-order-item-info strong {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .admin-order-item-info span {
          font-size: 12px;
          color: #6b7280;
        }

        .admin-order-item-total {
          font-size: 15px;
          font-weight: 700;
          color: #111827;
          white-space: nowrap;
        }

        .admin-empty-text {
          color: #6b7280;
          font-size: 14px;
          margin: 0;
        }

        /* =========================
           Totals
           ========================= */

        .admin-order-totals {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .admin-order-total-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #374151;
        }

        .admin-order-total-row.total {
          padding-top: 10px;
          border-top: 1px dashed #e5e7eb;
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }

        /* =========================
           Empty / Error State
           ========================= */

        .admin-order-details-page .admin-empty-state,
        .admin-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 60px 20px;
          text-align: center;
        }

        .admin-empty-state h2 {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .admin-empty-state p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .admin-primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          border: none;
          border-radius: 8px;
          background: #6366f1;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .admin-primary-btn:hover {
          background: #4f46e5;
        }

        /* =========================
           Print
           ========================= */

        @media print {
          .admin-back-link,
          .admin-icon-btn,
          .admin-secondary-btn {
            display: none !important;
          }

          .admin-order-details-page .admin-form-section,
          .admin-order-kpi {
            border-color: #ddd;
            box-shadow: none;
          }
        }

        /* =========================
           Responsive
           ========================= */

        @media (max-width: 640px) {
          .admin-order-details-page .admin-page-header {
            flex-direction: column;
          }

          .admin-order-header-actions {
            width: 100%;
          }

          .admin-order-item {
            flex-wrap: wrap;
          }

          .admin-order-item-total {
            width: 100%;
            text-align: right;
          }
        }
      `}</style>

      <div className="admin-order-details-page">
        {/* =========================
            Header
        ========================= */}

        <div className="admin-page-header">
          <div>
            <Link to="/admin/orders" className="admin-back-link">
              <ArrowLeft size={17} />
              Back to Orders
            </Link>

            <span className="admin-page-label">ORDER DETAILS</span>

            <h1>
              {order.id}
              <button
                type="button"
                className="admin-icon-btn"
                onClick={handleCopyId}
                title="Copy Order ID"
              >
                <Copy size={16} />
              </button>
            </h1>

            <p>View customer and order information.</p>
          </div>

          <div className="admin-order-header-actions">
            <span
              className={`admin-order-status-badge ${String(
                order.status || ""
              ).toLowerCase()}`}
            >
              <StatusIcon size={14} />
              {order.status || "Unknown"}
            </span>

            <button
              type="button"
              className="admin-secondary-btn"
              onClick={handlePrint}
            >
              <Printer size={16} />
              Print
            </button>
          </div>
        </div>

        {/* =========================
            KPI Summary
        ========================= */}

        <div className="admin-order-kpis">
          <div className="admin-order-kpi">
            <span className="admin-order-kpi-label">Total</span>
            <strong className="admin-order-kpi-value">
              ${total.toFixed(2)}
            </strong>
          </div>

          <div className="admin-order-kpi">
            <span className="admin-order-kpi-label">Items</span>
            <strong className="admin-order-kpi-value">
              {items.length} <small>({totalItems} units)</small>
            </strong>
          </div>

          <div className="admin-order-kpi">
            <span className="admin-order-kpi-label">Payment</span>
            <strong className="admin-order-kpi-value">
              {order.paymentMethod || "-"}
            </strong>
          </div>

          <div className="admin-order-kpi">
            <span className="admin-order-kpi-label">Date</span>
            <strong className="admin-order-kpi-value">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : "-"}
            </strong>
          </div>
        </div>

        {/* =========================
            Customer + Shipping
        ========================= */}

        <div className="admin-order-details-grid">
          {/* Customer */}

          <section className="admin-form-section">
            <div className="admin-form-section-header">
              <h2>
                <User size={18} />
                Customer Information
              </h2>
            </div>

            <div className="admin-detail-list">
              <div>
                <span>Customer</span>
                <strong>
                  {order.customerName || "Unknown Customer"}
                </strong>
              </div>

              <div>
                <span>
                  <Hash size={15} />
                  Client ID
                </span>
                <strong>#{order.clientId || "-"}</strong>
              </div>

              <div>
                <span>
                  <Calendar size={15} />
                  Order Date
                </span>
                <strong>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "-"}
                </strong>
              </div>
            </div>
          </section>

          {/* Shipping + Payment */}

          <section className="admin-form-section">
            <div className="admin-form-section-header">
              <h2>
                <Truck size={18} />
                Shipping & Payment
              </h2>
            </div>

            <div className="admin-detail-list">
              <div>
                <span>
                  <MapPin size={15} />
                  Shipping Address
                </span>
                <strong>{order.shippingAddress || "-"}</strong>
              </div>

              <div>
                <span>
                  <CreditCard size={15} />
                  Payment Method
                </span>
                <strong>{order.paymentMethod || "-"}</strong>
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
              <Package size={18} />
              Order Items
            </h2>
            <p>Products included in this order.</p>
          </div>

          <div className="admin-order-items">
            {items.length > 0 ? (
              items.map((item, index) => {
                const itemTotal =
                  Number(item.unitPrice || 0) *
                  Number(item.quantity || 0);

                return (
                  <div
                    className="admin-order-item"
                    key={item.id || index}
                  >
                    <div className="admin-order-item-icon">
                      {item.featuredImage ? (
                        <img
                          src={item.featuredImage}
                          alt={item.title || "Product"}
                        />
                      ) : (
                        <Package size={19} />
                      )}
                    </div>

                    <div className="admin-order-item-info">
                      <strong>
                        {item.title || "Unknown Product"}
                      </strong>

                      <span>Quantity: {item.quantity}</span>

                      <span>
                        Unit Price: $
                        {Number(item.unitPrice || 0).toFixed(2)}
                      </span>
                    </div>

                    <strong className="admin-order-item-total">
                      ${itemTotal.toFixed(2)}
                    </strong>
                  </div>
                );
              })
            ) : (
              <p className="admin-empty-text">
                No items found in this order.
              </p>
            )}
          </div>

          {/* Totals */}

          <div className="admin-order-totals">
            <div className="admin-order-total-row">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>

            <div className="admin-order-total-row total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default AdminOrderDetails;