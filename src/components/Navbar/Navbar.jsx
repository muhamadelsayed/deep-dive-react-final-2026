import { Link, NavLink } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  User,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          STORE
        </Link>

        {/* Main Links */}
        <div className="navbar-links">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Contact
          </NavLink>

        </div>

        {/* Actions */}
        <div className="navbar-actions">

          <Link
            to="/wishlist"
            className="nav-icon"
            title="Wishlist"
          >
            <Heart size={20} />
          </Link>

          <Link
            to="/cart"
            className="nav-icon"
            title="Cart"
          >
            <ShoppingCart size={20} />
          </Link>

          {/* ADMIN BUTTON */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="nav-admin"
              title="Admin Panel"
            >
              <ShieldCheck size={18} />
              <span>Admin</span>
            </Link>
          )}

          {/* Logged In */}
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="nav-login"
              >
                <User size={18} />
                <span>
                  {user?.name || "Profile"}
                </span>
              </Link>

              <button
                type="button"
                className="nav-logout"
                onClick={logout}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="nav-login"
            >
              <User size={18} />
              <span>Login</span>
            </Link>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;