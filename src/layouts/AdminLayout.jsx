import { useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === "/admin") {
      return "Dashboard";
    }

    if (location.pathname.startsWith("/admin/products/add")) {
      return "Add Product";
    }

    if (location.pathname.startsWith("/admin/products/edit")) {
      return "Edit Product";
    }

    if (location.pathname.startsWith("/admin/products")) {
      return "Products";
    }

    if (location.pathname.startsWith("/admin/categories")) {
      return "Categories";
    }

    if (location.pathname.startsWith("/admin/orders")) {
      return "Orders";
    }

    if (location.pathname.startsWith("/admin/discounts")) {
      return "Discounts";
    }

    return "Admin Panel";
  };

  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-main">

        <header className="admin-topbar">

          <div>
            <span>ADMIN PANEL</span>

            <h2>
              {getPageTitle()}
            </h2>
          </div>

          <div className="admin-user">

            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>Admin</strong>
              <small>Administrator</small>
            </div>

          </div>

        </header>

        <main className="admin-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;