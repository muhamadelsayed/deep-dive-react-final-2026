import { useEffect, useMemo, useState } from "react";
import { Search, Eye, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import orderService from "../../../services/orderService";

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

        setOrders(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Failed to fetch admin orders:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load orders."
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
      const orderId =
        String(order.id || "").toLowerCase();

      const customer =
        String(
          order.customerName || ""
        ).toLowerCase();

      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        orderId.includes(searchValue) ||
        customer.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    orders,
    search,
    statusFilter,
  ]);

  // =========================
  // Available Statuses
  // =========================

  const getNextStatuses = (status) => {
    if (status === "Pending") {
      return [
        "Pending",
        "Shipped",
        "Canceled",
      ];
    }

    if (status === "Shipped") {
      return [
        "Shipped",
        "Delivered",
      ];
    }

    return [status];
  };

  // =========================
  // Update Status
  // =========================

  const handleStatusChange = async (
    id,
    newStatus
  ) => {
    try {
      setUpdatingId(id);

      await orderService.updateOrderStatus(
        id,
        newStatus
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );

      toast.success(
        "Order status updated successfully."
      );
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );

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

        <p>
          Please wait while we load customer orders.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">

      {/* Header */}

      <div className="admin-page-header">
        <div>

          <span className="admin-page-label">
            MANAGEMENT
          </span>

          <h1>Orders</h1>

          <p>
            View and manage customer orders.
          </p>

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
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <select
          className="admin-filter-select"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >

          <option value="All">
            All Status
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Shipped">
            Shipped
          </option>

          <option value="Delivered">
            Delivered
          </option>

          <option value="Canceled">
            Canceled
          </option>

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

                const availableStatuses =
                  getNextStatuses(
                    order.status
                  );

                return (
                  <tr key={order.id}>

                    {/* Order */}

                    <td>

                      <div className="admin-order-id">

                        <strong>
                          {order.id}
                        </strong>

                        <span>
                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleDateString()
                            : "-"}
                        </span>

                      </div>

                    </td>

                    {/* Customer */}

                    <td>

                      <div className="admin-customer-cell">

                        <strong>
                          {order.customerName ||
                            "Unknown Customer"}
                        </strong>

                        <span>
                          Client #{order.clientId}
                        </span>

                      </div>

                    </td>

                    {/* Items */}

                    <td>
                      {Array.isArray(
                        order.items
                      )
                        ? order.items.length
                        : 0}
                    </td>

                    {/* Total */}

                    <td>

                      <strong>
                        $
                        {Number(
                          order.total || 0
                        ).toFixed(2)}
                      </strong>

                    </td>

                    {/* Payment */}

                    <td>

                      <span className="admin-category-badge">
                        {order.paymentMethod ||
                          "-"}
                      </span>

                    </td>

                    {/* Status */}

                    <td>

                      <select
                        className={`admin-order-status-select ${String(
                          order.status || ""
                        ).toLowerCase()}`}
                        value={
                          order.status || ""
                        }
                        disabled={
                          availableStatuses.length ===
                            1 ||
                          updatingId ===
                            order.id
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value
                          )
                        }
                      >

                        {availableStatuses.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          )
                        )}

                      </select>

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

            <h2>
              No Orders Found
            </h2>

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