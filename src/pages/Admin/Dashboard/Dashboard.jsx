import { useEffect, useMemo, useState } from "react";
import {
  Package,
  Tags,
  ShoppingBag,
  Clock3,
  Truck,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import productService from "../../../services/productService";
import categoryService from "../../../services/categoryService";
import orderService from "../../../services/orderService";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  
  // Fetch Dashboard Data
  

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [
          productsData,
          categoriesData,
          ordersData,
        ] = await Promise.all([
          productService.getAdminProducts({
            page: 1,
            pageSize: 100,
          }),
          categoryService.getCategories(),
          orderService.getAdminOrders(),
        ]);

        setProducts(
          Array.isArray(productsData?.items)
            ? productsData.items
            : []
        );

        setCategories(
          Array.isArray(categoriesData)
            ? categoriesData
            : []
        );

        setOrders(
          Array.isArray(ordersData)
            ? ordersData
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  
  // Order Statistics
  

  const orderStats = useMemo(() => {
    return {
      pending: orders.filter(
        (order) =>
          String(order.status).toLowerCase() ===
          "pending"
      ).length,

      shipped: orders.filter(
        (order) =>
          String(order.status).toLowerCase() ===
          "shipped"
      ).length,

      delivered: orders.filter(
        (order) =>
          String(order.status).toLowerCase() ===
          "delivered"
      ).length,

      canceled: orders.filter(
        (order) =>
          String(order.status).toLowerCase() ===
          "canceled"
      ).length,
    };
  }, [orders]);

  
  // Total Revenue
  

  const totalRevenue = useMemo(() => {
    return orders
      .filter(
        (order) =>
          String(order.status).toLowerCase() !==
          "canceled"
      )
      .reduce(
        (total, order) =>
          total + Number(order.total || 0),
        0
      );
  }, [orders]);

  
  // Recent Orders
  

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 5);
  }, [orders]);

  
  // Loading State
  

  if (loading) {
    return (
      <div className="admin-empty-state">
        <h2>Loading Dashboard...</h2>

        <p>
          Please wait while we load your store statistics.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">

      {/* =========================
          Header
      ========================= */}

      <div className="admin-page-header">

        <div>

          <span className="admin-page-label">
            OVERVIEW
          </span>

          <h1>Dashboard</h1>

          <p>
            Monitor your store performance and activity.
          </p>

        </div>

      </div>

      {/* =========================
          Main Statistics
      ========================= */}

      <div className="admin-stats-grid">

        {/* Products */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <Package size={21} />
          </div>

          <div>
            <span>
              Total Products
            </span>

            <strong>
              {products.length}
            </strong>
          </div>

        </div>

        {/* Categories */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <Tags size={21} />
          </div>

          <div>
            <span>
              Categories
            </span>

            <strong>
              {categories.length}
            </strong>
          </div>

        </div>

        {/* Orders */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <ShoppingBag size={21} />
          </div>

          <div>
            <span>
              Total Orders
            </span>

            <strong>
              {orders.length}
            </strong>
          </div>

        </div>

        {/* Revenue */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            $
          </div>

          <div>
            <span>
              Total Revenue
            </span>

            <strong>
              ${totalRevenue.toFixed(2)}
            </strong>
          </div>

        </div>

      </div>

      {/* =========================
          Order Status Statistics
      ========================= */}

      <div className="admin-dashboard-section">

        <div className="admin-form-section-header">

          <div>
            <h2>
              Order Status
            </h2>

            <p>
              Current order distribution.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="admin-back-link"
          >
            View Orders
            <ArrowRight size={16} />
          </Link>

        </div>

        <div className="admin-stats-grid">

          {/* Pending */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              <Clock3 size={21} />
            </div>

            <div>
              <span>
                Pending
              </span>

              <strong>
                {orderStats.pending}
              </strong>
            </div>

          </div>

          {/* Shipped */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              <Truck size={21} />
            </div>

            <div>
              <span>
                Shipped
              </span>

              <strong>
                {orderStats.shipped}
              </strong>
            </div>

          </div>

          {/* Delivered */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>
                Delivered
              </span>

              <strong>
                {orderStats.delivered}
              </strong>
            </div>

          </div>

          {/* Canceled */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              <XCircle size={21} />
            </div>

            <div>
              <span>
                Canceled
              </span>

              <strong>
                {orderStats.canceled}
              </strong>
            </div>

          </div>

        </div>

      </div>

      {/*  
          Recent Orders
        */}

      <div className="admin-dashboard-section">

        <div className="admin-form-section-header">

          <div>

            <h2>
              Recent Orders
            </h2>

            <p>
              Latest customer orders.
            </p>

          </div>

          <Link
            to="/admin/orders"
            className="admin-back-link"
          >
            View All
            <ArrowRight size={16} />
          </Link>

        </div>

        <div className="admin-table-wrapper">

          {recentOrders.length > 0 ? (

            <table className="admin-table">

              <thead>

                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>View</th>
                </tr>

              </thead>

              <tbody>

                {recentOrders.map(
                  (order) => (
                    <tr key={order.id}>

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

                      <td>

                        <div className="admin-customer-cell">

                          <strong>
                            {order.customerName ||
                              "Unknown Customer"}
                          </strong>

                          <span>
                            Client #
                            {order.clientId}
                          </span>

                        </div>

                      </td>

                      <td>

                        <strong>
                          $
                          {Number(
                            order.total || 0
                          ).toFixed(2)}
                        </strong>

                      </td>

                      <td>

                        <span
                          className={`admin-order-status-select ${String(
                            order.status || ""
                          ).toLowerCase()}`}
                        >
                          {order.status ||
                            "Unknown"}
                        </span>

                      </td>

                      <td>

                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="admin-action-btn edit"
                          title="View Order"
                        >
                          <ArrowRight size={16} />
                        </Link>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          ) : (

            <div className="admin-empty-state">

              <ShoppingBag size={42} />

              <h2>
                No Orders Yet
              </h2>

              <p>
                Customer orders will appear here.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;