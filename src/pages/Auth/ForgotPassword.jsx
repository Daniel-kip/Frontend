import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/Auth/forgot-password", { email });

      if (response.data.success) {
        setMessage("Password reset link sent to your email.");
      } else {
        setError(response.data.message || "Failed to send reset link.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <form className="forgot-form" onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
        <p className="subtitle">
          Enter your registered email address, and we’ll send you a reset link.
        </p>

        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="redirect-text">
          <Link to="/login">Back to Login</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
