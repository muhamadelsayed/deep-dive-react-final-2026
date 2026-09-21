import { Routes, Route } from "react-router-dom";

// =========================
// Main Pages
// =========================
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart";
import Wishlist from "../pages/Wishlist/Wishlist";
import Checkout from "../pages/Checkout/Checkout";
import Orders from "../pages/Orders/Orders";
import OrderDetails from "../pages/OrderDetails/OrderDetails";
import Profile from "../pages/Profile/Profile";
import AdminOrderDetails from "../pages/Admin/OrderDetails/OrderDetails";

// =========================
// Route Protection
// =========================
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import AdminProtectedRoute from "../components/ProtectedRoute/AdminProtectedRoute";

// =========================
// Admin Pages
// =========================
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import AdminProducts from "../pages/Admin/Products/Products";
import AddProduct from "../pages/Admin/AddProduct/AddProduct";
import EditProduct from "../pages/Admin/EditProduct/EditProduct";
import Categories from "../pages/Admin/Categories/Categories";
import AdminOrders from "../pages/Admin/Orders/Orders";
import Discounts from "../pages/Admin/Discounts/Discounts";

function AppRoutes() {
  return (
    <Routes>

      {/*PUBLIC WEBSITE*/}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />


      <Route path="/about" element={<About />} />

      <Route path="/contact" element={<Contact />} />

      <Route
        path="/products"
        element={<Products />}
      />

      <Route
        path="/products/:id"
        element={<ProductDetails />}
      />

      <Route
        path="/cart"
        element={<Cart />}
      />


      {/*PROTECTED USER PAGES*/}

      <Route element={<ProtectedRoute />}>

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/orders/:id"
          element={<OrderDetails />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

      </Route>


      {/*PROTECTED ADMIN PANEL*/}

      <Route element={<AdminProtectedRoute />}>

        <Route
          path="/admin"
          element={<AdminLayout />}
        >

          {/* Dashboard */}
          <Route
            index
            element={<Dashboard />}
          />

          {/* Products */}
          <Route
            path="products"
            element={<AdminProducts />}
          />

          {/* Add Product */}
          <Route
            path="products/add"
            element={<AddProduct />}
          />

          {/* Edit Product */}
          <Route
            path="products/edit/:id"
            element={<EditProduct />}
          />

          {/* Categories */}
          <Route
            path="categories"
            element={<Categories />}
          />

          {/* Orders */}
          <Route
            path="orders"
            element={<AdminOrders />}
          />

          {/* Order Details */}
          <Route
            path="orders/:id"
            element={<AdminOrderDetails />}
          />

          {/* Discounts */}
          <Route
            path="discounts"
            element={<Discounts />}
          />

        </Route>

      </Route>

    </Routes>
  );
}

export default AppRoutes;