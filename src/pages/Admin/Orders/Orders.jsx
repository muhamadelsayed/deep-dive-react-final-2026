import { useEffect, useMemo, useState } from "react";
import { Search, Eye, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import orderService from "../../../services/orderService";

// =========================
// Status Config
// =========================

const ORDER_STATUSES = [
  "Pending",
  "Shipped",
  "Delivered",
  "Canceled",
];

const STATUS_TRANSITIONS = {
  Pending: ["Pending", "Shipped", "Canceled"],
  Shipped: ["Pending", "Shipped", "Delivered", "Canceled"],
  Delivered: ["Delivered"],
  Canceled: ["Canceled"],
};

const isFinalStatus = (status) =>
  status === "Delivered" || status === "Canceled";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // =========================
  // Fetch Orders
  // =========================

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const data = await orderService.getAdminOrders();

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch admin orders:", error);

        toast.error(
          error.response?.data?.message || "Failed to load orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // =========================
  // Filter Orders
  // =========================

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderId = String(order.id || "").toLowerCase();
      const customer = String(order.customerName || "").toLowerCase();
      const searchValue = search.toLowerCase();

      const matchesSearch =
        orderId.includes(searchValue) || customer.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // =========================
  // Available Statuses
  // =========================

  const getNextStatuses = (status) => {
    return STATUS_TRANSITIONS[status] || ORDER_STATUSES;
  };

  // =========================
  // Update Status
  // =========================

  const handleStatusChange = async (id, newStatus) => {
    const currentOrder = orders.find((o) => o.id === id);
    if (!currentOrder || currentOrder.status === newStatus) return;

    // تأكيد عند الإلغاء
    if (newStatus === "Canceled") {
      const confirmed = window.confirm(
        "هل أنت متأكد من إلغاء هذا الأوردر؟ لا يمكن التراجع بعدها."
      );
      if (!confirmed) return;
    }

    const previousStatus = currentOrder.status;

    // Optimistic update
    setUpdatingId(id);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );

    try {
      await orderService.updateOrderStatus(id, newStatus);

      toast.success("تم تحديث حالة الأوردر بنجاح.");
    } catch (error) {
      // Rollback في حال الفشل
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status: previousStatus } : o
        )
      );

      console.error("Failed to update order status:", error);

      toast.error(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="admin-empty-state">
        <h2>Loading Orders...</h2>

        <p>Please wait while we load customer orders.</p>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      {/* Header */}

      <div className="admin-page-header">
        <div>
          <span className="admin-page-label">MANAGEMENT</span>

          <h1>Orders</h1>

          <p>View and manage customer orders.</p>
        </div>
      </div>

      {/* Toolbar */}

      <div className="admin-products-toolbar">
        <div className="admin-search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search order or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="admin-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Canceled">Canceled</option>
        </select>
      </div>

      {/* Orders Table */}

      <div className="admin-table-wrapper">
        {filteredOrders.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>View</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => {
                const availableStatuses = getNextStatuses(order.status);
                const locked = isFinalStatus(order.status);

                return (
                  <tr key={order.id}>
                    {/* Order */}

                    <td>
                      <div className="admin-order-id">
                        <strong>{order.id}</strong>

                        <span>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                    </td>

                    {/* Customer */}

                    <td>
                      <div className="admin-customer-cell">
                        <strong>
                          {order.customerName || "Unknown Customer"}
                        </strong>

                        <span>Client #{order.clientId}</span>
                      </div>
                    </td>

                    {/* Items */}

                    <td>
                      {Array.isArray(order.items) ? order.items.length : 0}
                    </td>

                    {/* Total */}

                    <td>
                      <strong>
                        ${Number(order.total || 0).toFixed(2)}
                      </strong>
                    </td>

                    {/* Payment */}

                    <td>
                      <span className="admin-category-badge">
                        {order.paymentMethod || "-"}
                      </span>
                    </td>

                    {/* Status */}

                    <td>
                      <div className="admin-status-cell">
                        <span
                          className={`admin-status-badge ${String(
                            order.status || ""
                          ).toLowerCase()}`}
                        >
                          {order.status || "Unknown"}
                        </span>

                        {!locked && (
                          <select
                            className={`admin-order-status-select ${String(
                              order.status || ""
                            ).toLowerCase()}`}
                            value={order.status || ""}
                            disabled={updatingId === order.id}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                          >
                            {availableStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        )}

                        {updatingId === order.id && (
                          <small className="admin-status-updating">
                            جاري التحديث...
                          </small>
                        )}
                      </div>
                    </td>

                    {/* View */}

                    <td>
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="admin-action-btn edit"
                        title="View Order"
                      >
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="admin-empty-state">
            <ShoppingBag size={42} />

            <h2>No Orders Found</h2>

            <p>
              {orders.length === 0
                ? "There are no customer orders yet."
                : "Try another search or status filter."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;