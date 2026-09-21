import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api"; // استدعاء ملف الـ API المركزي

function Login() {
 const navigate = useNavigate();
 const location = useLocation();
 const { login } = useAuth();

const [formData, setFormData] = useState({
  email: "",
  password: "",
 });

const [errors, setErrors] = useState({});
 const [loading, setLoading] = useState(false);

const handleChange = (e) => {
  const { name, value } = e.target;

setFormData((prev) => ({
   ...prev,
   [name]: value,
  }));

setErrors((prev) => ({
   ...prev,
   [name]: "",
   general: "",
  }));
 };

const validateForm = () => {
  const newErrors = {};

if (!formData.email.trim()) {
   newErrors.email = "Email is required";
  } else if (!/\S+@\S+.\S+/.test(formData.email)) {
   newErrors.email = "Please enter a valid email";
  }

if (!formData.password) {
   newErrors.password = "Password is required";
  }

return newErrors;
 };

const handleSubmit = async (e) => {
  e.preventDefault();

const validationErrors = validateForm();

if (Object.keys(validationErrors).length > 0) {
   setErrors(validationErrors);
   return;
  }

setLoading(true);
  setErrors({});

try {
   // استدعاء نقطة النهاية الحقيقية لتسجيل الدخول في الـ Backend
   const response = await API.post("api/auth/login", {
    email: formData.email,
    password: formData.password,
   });

// الـ Backend يرجع AuthResponseDto فيه { name, token, role }
   const { name, token, role } = response.data;

login({ name, token, role });

setLoading(false);

const from = location.state?.from;

if (role === "admin") {
    navigate(from ||"/admin", { replace: true });
   } else {
    navigate(from|| "/", { replace: true });
   }
  } catch (err) {
   console.error("Login failed:", err);

const errorMsg =
    err.response?.data?.title ||err.response?.data?.message||
    "Invalid email or password. Please try again.";

setErrors({
    general: errorMsg,
   });

setLoading(false);
  }
 };

// دالة لتعبئة بيانات حساب تجريبي للاختبار الفوري
 const handleFillDemo = (type) => {
  if (type === "admin") {
   setFormData({
    email: "admin@ecommerce.com",
    password: "Admin@123",
   });
  } else {
   setFormData({
    email: "masalim122006@gmail.com", // أو أي إيميل عميل مسجل لديك
    password: "123456",
   });
  }
  setErrors({});
 };

return (
  <main className="auth-page">
   <section className="auth-container">

<div className="auth-header">
     <span>WELCOME BACK</span>

<h1>Login</h1>

<p>
      Sign in to continue shopping with us.
     </p>
    </div>

{/* أزرار سريعة لتعبئة حسابات الاختبار */}
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
     <button
      type="button"
      onClick={() => handleFillDemo("admin")}
      style={{
       flex: 1,
       padding: "8px",
       background: "#eee",
       border: "1px solid #ccc",
       borderRadius: "4px",
       cursor: "pointer",
       fontSize: "12px",
       fontWeight: "600"
      }}
     >
      Fill Admin Demo
     </button>
     <button
      type="button"
      onClick={() => handleFillDemo("client")}
      style={{
       flex: 1,
       padding: "8px",
       background: "#eee",
       border: "1px solid #ccc",
       borderRadius: "4px",
       cursor: "pointer",
       fontSize: "12px",
       fontWeight: "600"
      }}
     >
      Fill Client Demo
     </button>
    </div>

{errors.general && (
     <div className="form-error">
      {errors.general}
     </div>
    )}

<form
     className="auth-form"
     onSubmit={handleSubmit}
    >

<div className="form-group">
      <label htmlFor="email">
       Email
      </label>

<input
       id="email"
       name="email"
       type="email"
       placeholder="Enter your email"
       value={formData.email}
       onChange={handleChange}
      />

{errors.email && (
       <span className="field-error">
        {errors.email}
       </span>
      )}
     </div>

<div className="form-group">
      <label htmlFor="password">
       Password
      </label>

<input
       id="password"
       name="password"
       type="password"
       placeholder="Enter your password"
       value={formData.password}
       onChange={handleChange}
      />

{errors.password && (
       <span className="field-error">
        {errors.password}
       </span>
      )}
     </div>

<button
      type="submit"
      className="auth-button"
      disabled={loading}
     >
      {loading ? "Signing In..." : "Login"}
     </button>

</form>

<p className="auth-footer">
     Don't have an account?{" "}
     <Link to="/register">
      Create Account
     </Link>
    </p>

</section>
  </main>
 );
}

export default Login;