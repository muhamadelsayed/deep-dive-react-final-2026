import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authService from "../../services/authService";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email) {
      setError("Email is missing. Please register again.");
      return;
    }

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }

    setLoading(true);

    try {
      await authService.verifyOTP({
        email,
        otp,
      });

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("OTP verification failed:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Invalid or expired OTP. Please try again.";

      setError(
        typeof message === "string"
          ? message
          : "Invalid or expired OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <h1>Verify Your Email</h1>

          <p>
            Enter the 6-digit OTP sent to your email.
          </p>

          {email && (
            <span className="verify-email">
              {email}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">

          <div className="form-group">
            <label htmlFor="otp">
              OTP
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength="6"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
            />
          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

        <div className="auth-footer">
          Already verified?{" "}
          <Link to="/login">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default VerifyOTP;