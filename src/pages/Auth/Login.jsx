import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import LoadingScreen from "../../Components/LoadingScreen";
import "./Login.css";

const Login = () => {
  const { loginWithCredentials, checkAuthStatus, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);

  // Forgot password state
  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !showLoginSuccess) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate, showLoginSuccess]);

  const preventCopyPaste = (e) => {
    e.preventDefault();
    setError("Copy/paste is disabled for security reasons.");
  };

  /** --------------------------
   * Handle Input Changes
   * -------------------------- */
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    setError("");
  }, []);

  /** --------------------------
   * Validate Form*/
  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Please enter your email address");
      return false;
    }
    
    if (!formData.password) {
      setError("Please enter your password");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  /* Handle Login */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await loginWithCredentials(formData.email, formData.password);

      if (result.success) {
        // Check token validity
        const authStatus = await checkAuthStatus();
        if (authStatus) {
          // Show loading screen before redirect
          setShowLoginSuccess(true);
          // The LoadingScreen will handle the 20-second wait and redirect
        } else {
          setError("Authentication failed. Please try again.");
          setLoading(false);
        }
      } else {
        setError(result.message || "Invalid email or password");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.message || 
        "Unable to connect to the server. Please check your connection and try again."
      );
      setLoading(false);
    }
  };

  /*Forgot Password */
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMessage("");

    if (!forgotEmail.trim()) {
      setForgotMessage("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
      setForgotMessage("Please enter a valid email address.");
      return;
    }

    setForgotLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5031/api"}/Auth/ForgotPassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        setForgotMessage("If this email exists in our system, you will receive a password reset link shortly.");
        setForgotEmail(""); // Clear email on success
        setTimeout(() => setShowForgotPopup(false), 3000); // Auto-close after 3 seconds
      } else {
        setForgotMessage(data.message || "Failed to send reset link. Please try again.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setForgotMessage("Network error. Please check your connection and try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  /** --------------------------
   * Close Forgot Password Popup
   * -------------------------- */
  const closeForgotPopup = useCallback(() => {
    setShowForgotPopup(false);
    setForgotMessage("");
    setForgotEmail("");
    setForgotLoading(false);
  }, []);

  /** --------------------------
   * Prevent body scroll when popup active
   * -------------------------- */
  useEffect(() => {
    if (showForgotPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showForgotPopup]);

  /** --------------------------
   * Handle Escape key to close popup
   * -------------------------- */
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && showForgotPopup) {
        closeForgotPopup();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [showForgotPopup, closeForgotPopup]);

  // Show loading screen after successful login
  if (showLoginSuccess) {
    return <LoadingScreen />;
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Please sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              <FaEnvelope className="input-icon" />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="login-input"
              disabled={loading}
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              <FaLock className="input-icon" />
              Password
            </label>
            <div className="password-input-container">
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onCopy={preventCopyPaste}
                onPaste={preventCopyPaste}
                onCut={preventCopyPaste}
                className="login-input password-input"
                disabled={loading}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="password-toggle"
                disabled={loading}
                aria-label={passwordVisible ? "Hide password" : "Show password"}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Forgot password link */}
          <div className="forgot-password-container">
            <button
              type="button"
              onClick={() => setShowForgotPopup(true)}
              className="forgot-password-btn"
              disabled={loading}
            >
              Forgot your password?
            </button>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading || !formData.email || !formData.password}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="register-link">
              Create one here
            </Link>
          </p>
        </div>
      </div>

      {/* Overlay */}
      {showForgotPopup && (
        <div 
          className="overlay active" 
          onClick={closeForgotPopup}
          role="presentation"
        />
      )}

      {/* Forgot Password Popup */}
      {showForgotPopup && (
        <div className="popup active" role="dialog" aria-labelledby="forgot-password-title">
          <div className="popup-content">
            <h3 id="forgot-password-title" className="popup-title">
              Forgot Password
            </h3>
            <p className="popup-description">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleForgotPassword} className="popup-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="popup-input"
                disabled={forgotLoading}
                autoComplete="email"
                required
              />
              <button
                type="submit"
                className="popup-submit-btn"
                disabled={forgotLoading || !forgotEmail}
              >
                {forgotLoading ? (
                  <>
                    <div className="spinner small"></div>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            {forgotMessage && (
              <p className={`forgot-message ${forgotMessage.includes("successfully") ? "success" : "info"}`}>
                {forgotMessage}
              </p>
            )}

            <button
              onClick={closeForgotPopup}
              className="popup-close-btn"
              disabled={forgotLoading}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;