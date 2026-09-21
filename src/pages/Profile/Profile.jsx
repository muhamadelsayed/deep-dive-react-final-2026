import { useEffect, useState } from "react";
import {
  User,
  Mail,
  MapPin,
  Lock,
  Save,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import profileService from "../../services/profileService";
import { useAuth } from "../../context/AuthContext";

function Profile() {
  const { logout } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [activeSection, setActiveSection] = useState("profile");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // Load Profile
  // =========================
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await profileService.getProfile();

        setFormData((prev) => ({
          ...prev,
          name: data.name || "",
          email: data.email || "",
          address: data.address || "",
        }));
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // =========================
  // Handle Input Change
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =========================
  // Update Personal Info
  // =========================
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await profileService.updateProfile({
        name: formData.name,
        address: formData.address,
      });

      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error("Failed to update profile:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Update Address
  // =========================
  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await profileService.updateProfile({
        name: formData.name,
        address: formData.address,
      });

      setSuccess("Address updated successfully.");
    } catch (err) {
      console.error("Failed to update address:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to update address."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Change Password
  // =========================
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.password) {
      setError("Please enter your new password.");
      return;
    }

    if (!formData.confirmPassword) {
      setError("Please confirm your new password.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSaving(true);

      await profileService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.password,
      });

      setSuccess("Password updated successfully.");

      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
        currentPassword: "",
      }));
    } catch (err) {
      console.error("Failed to change password:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to change password."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Logout
  // =========================
  const handleLogout = () => {
    logout();
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-loading">
          Loading profile...
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">

      {/* Header */}
      <div className="profile-header">
        <span className="section-label">
          MY ACCOUNT
        </span>

        <h1>Account Settings</h1>

        <p>
          Manage your personal information, address and
          account settings.
        </p>
      </div>

      {/* Global Messages */}
      {error && (
        <div className="profile-error">
          {error}
        </div>
      )}

      {success && (
        <div className="profile-success">
          {success}
        </div>
      )}

      <section className="profile-layout">

        {/* Sidebar */}
        <aside className="profile-sidebar">

          <div className="profile-user">
            <div className="profile-avatar">
              <User size={28} />
            </div>

            <div>
              <h3>{formData.name || "User"}</h3>
              <span>{formData.email}</span>
            </div>
          </div>

          <nav className="profile-nav">

            {/* Personal Information */}
            <button
              type="button"
              className={
                activeSection === "profile"
                  ? "profile-nav-item active"
                  : "profile-nav-item"
              }
              onClick={() => {
                setActiveSection("profile");
                setError("");
                setSuccess("");
              }}
            >
              <User size={18} />
              Personal Information
            </button>

            {/* Address */}
            <button
              type="button"
              className={
                activeSection === "address"
                  ? "profile-nav-item active"
                  : "profile-nav-item"
              }
              onClick={() => {
                setActiveSection("address");
                setError("");
                setSuccess("");
              }}
            >
              <MapPin size={18} />
              Address
            </button>

            {/* Password */}
            <button
              type="button"
              className={
                activeSection === "password"
                  ? "profile-nav-item active"
                  : "profile-nav-item"
              }
              onClick={() => {
                setActiveSection("password");
                setError("");
                setSuccess("");
              }}
            >
              <Lock size={18} />
              Password
            </button>

            {/* Orders */}
            <Link
              to="/orders"
              className="profile-nav-link"
            >
              <Mail size={18} />
              My Orders
            </Link>

          </nav>

          {/* Logout */}
          <button
            type="button"
            className="profile-logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>

        </aside>

        {/* Content */}
        <div className="profile-content">

          {/* =========================
              Personal Information
          ========================== */}
          {activeSection === "profile" && (
            <div className="profile-box">

              <div className="profile-box-header">
                <div>
                  <h2>Personal Information</h2>

                  <p>
                    Update your basic account information.
                  </p>
                </div>

                <User size={24} />
              </div>

              <form
                className="profile-form"
                onSubmit={handleProfileSubmit}
              >

                <div className="profile-form-grid">

                  {/* Name */}
                  <div className="form-group">
                    <label htmlFor="name">
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label htmlFor="email">
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                    />

                    <small>
                      Email cannot be changed.
                    </small>
                  </div>

                </div>

                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={saving}
                >
                  <Save size={18} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </form>

            </div>
          )}

          {/* =========================
              Address
          ========================== */}
          {activeSection === "address" && (
            <div className="profile-box">

              <div className="profile-box-header">
                <div>
                  <h2>Shipping Address</h2>

                  <p>
                    This address will be used during checkout.
                  </p>
                </div>

                <MapPin size={24} />
              </div>

              <form
                className="profile-form"
                onSubmit={handleAddressSubmit}
              >

                <div className="form-group">
                  <label htmlFor="address">
                    Full Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    rows="6"
                    placeholder="Enter your full address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={saving}
                >
                  <Save size={18} />

                  {saving
                    ? "Saving..."
                    : "Save Address"}
                </button>

              </form>

            </div>
          )}

          {/* =========================
              Password
          ========================== */}
          {activeSection === "password" && (
            <div className="profile-box">

              <div className="profile-box-header">
                <div>
                  <h2>Change Password</h2>

                  <p>
                    Update your password to keep your
                    account secure.
                  </p>
                </div>

                <Lock size={24} />
              </div>

              <form
                className="profile-form"
                onSubmit={handlePasswordSubmit}
              >

                {/* Current Password */}
                <div className="form-group">
                  <label htmlFor="currentPassword">
                    Current Password
                  </label>

                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    value={formData.currentPassword || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* New Password */}
                <div className="form-group">
                  <label htmlFor="password">
                    New Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    Confirm New Password
                  </label>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={saving}
                >
                  <Save size={18} />

                  {saving
                    ? "Updating..."
                    : "Update Password"}
                </button>

              </form>

            </div>
          )}

        </div>

      </section>

    </main>
  );
}

export default Profile;