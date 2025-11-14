import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../api"; // make sure api.js has correct baseURL
import "./Register.css";

const Register = ({ onLogin }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const typingTimeoutRef = useRef(null);

  const passwordRequirements = [
    { regex: /.{8,}/, label: "At least 8 characters" },
    { regex: /[A-Z]/, label: "At least 1 uppercase letter" },
    { regex: /[a-z]/, label: "At least 1 lowercase letter" },
    { regex: /\d/, label: "At least 1 number" },
    { regex: /[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/~`]/, label: "At least 1 special character" },
  ];

  const checkPasswordStrength = (pwd) =>
    passwordRequirements.map(req => ({
      ...req,
      valid: req.regex.test(pwd)
    }));

  const passwordStrength = checkPasswordStrength(password);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setShowRequirements(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setShowRequirements(true), 500);
  };

  const preventCopyPaste = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordStrength.every(req => req.valid)) {
      setError("Please meet all password requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // Make POST request to backend
      const response = await api.post("/Auth/Register", {
        fullName: name, 
        email,
        password,
        confirmPassword
      });

      if (response.data.success) {
        // Registration successful - navigate to login
        setError(""); 
        navigate("/login", { 
          state: { 
            message: "Registration successful! Please login with your credentials.",
            email: email 
          } 
        });
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);

      if (err.response) {
        // Backend returned an error response
        const errorMessage = err.response.data?.message || 
                            err.response.data?.error || 
                            "Registration failed. Please check your input.";
        setError(errorMessage);
      } else if (err.request) {
        // Request was made but no response received
        setError("Unable to connect to the server. Please ensure the backend is running on http://localhost:5031");
      } else {
        // Something else happened
        setError("Unexpected error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1>Welcome to DelTech Networks</h1>
        <p className="form-subtitle">Create your account to get started</p>

        <div className="input-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="input-group password-container">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type={passwordVisible ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            onCopy={preventCopyPaste}
            onPaste={preventCopyPaste}
            onCut={preventCopyPaste}
            required
            disabled={loading}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setPasswordVisible(!passwordVisible)}
            disabled={loading}
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Password Requirements */}
        {showRequirements && password && (
          <div className="password-requirements">
            <div className="requirements-title">Password must contain:</div>
            {passwordStrength.map((req, idx) => (
              <div 
                key={idx} 
                className={`requirement ${req.valid ? "valid" : "invalid"}`}
              >
                <span className="requirement-icon">
                  {req.valid ? "✓" : "✗"}
                </span>
                {req.label}
              </div>
            ))}
          </div>
        )}

        <div className="input-group password-container">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type={confirmPasswordVisible ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onCopy={preventCopyPaste}
            onPaste={preventCopyPaste}
            onCut={preventCopyPaste}
            required
            disabled={loading}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            disabled={loading}
          >
            {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
          {confirmPassword && (
            <span className={`password-match-indicator ${confirmPassword === password ? "match" : "mismatch"}`}>
              {confirmPassword === password ? "✔" : "✖"}
            </span>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading || !name || !email || !password || !confirmPassword}
          className="submit-button"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="redirect-text">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>

        {/* contact credentials info */}
        <div className="demo-info">
          <p><strong>Talk to us at:</strong></p>
          <p>Email: deltechNetworks@gmail.com | phone: 0711807104</p>
        </div>
      </form>
    </div>
  );
};

export default Register;