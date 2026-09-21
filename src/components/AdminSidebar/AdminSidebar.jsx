import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Percent,
  LogOut,
  Store,
  Menu,
  X,
} from "lucide-react";
import {
  NavLink,
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: Tags,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      name: "Discounts",
      path: "/admin/discounts",
      icon: Percent,
    },
  ];

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeSidebar();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* =========================
          MOBILE MENU BUTTON
      ========================= */}

      <button
        type="button"
        className="admin-mobile-menu"
        onClick={() => setIsOpen(true)}
        aria-label="Open admin menu"
      >
        <Menu size={22} />
      </button>


      {/* =========================
          OVERLAY
      ========================= */}

      {isOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={closeSidebar}
        />
      )}


      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`admin-sidebar ${
          isOpen ? "open" : ""
        }`}
      >

        {/* Logo */}

        <div className="admin-logo">

          <div className="admin-logo-left">
            <Store size={22} />
            <span>STORE</span>
          </div>

          <button
            type="button"
            className="admin-sidebar-close"
            onClick={closeSidebar}
            aria-label="Close admin menu"
          >
            <X size={21} />
          </button>

        </div>


        {/* =========================
            NAVIGATION
        ========================= */}

        <nav className="admin-nav">

          <span className="admin-nav-title">
            MANAGEMENT
          </span>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive
                    ? "admin-nav-link active"
                    : "admin-nav-link"
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

        </nav>


        {/* =========================
            SIDEBAR BOTTOM
        ========================= */}

        <div className="admin-sidebar-bottom">

          {/* View Store */}

          <Link
            to="/"
            className="admin-nav-link"
            onClick={closeSidebar}
          >
            <Store size={19} />
            <span>View Store</span>
          </Link>


          {/* Logout */}

          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>

        </div>

      </aside>
    </>
  );
}

export default AdminSidebar;