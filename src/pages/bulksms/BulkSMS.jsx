import React, { useState, useEffect, useCallback } from "react";
import "./BulkSms.css";

export default function BulkSms() {
  const [recipients, setRecipients] = useState("");
  const [invalidNumbers, setInvalidNumbers] = useState([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [messageType, setMessageType] = useState("Promotional");
  const [senderId, setSenderId] = useState("");
  const [isPriority, setIsPriority] = useState(false);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [balance, setBalance] = useState(null);
  const [user, setUser] = useState(null);

  const apiBaseUrl = "http://localhost:5031/api";

  // Get auth token and user info
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  // API request headers
  const getHeaders = () => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    };
  };

  // --- Phone validation ---
  const isValidPhoneNumber = useCallback((number) => {
    const cleaned = number.replace(/[\s\-()]/g, "");
    const phoneRegex = /^\+?\d{7,15}$/;
    return phoneRegex.test(cleaned);
  }, []);

  const handleRecipientsChange = (e) => {
    const text = e.target.value;
    setRecipients(text);
    const numbers = text.split(/[\s,]+/).filter((num) => num.trim().length > 0);
    const invalid = numbers.filter((num) => !isValidPhoneNumber(num));
    setInvalidNumbers(invalid);
  };

  const handleMessageChange = (e) => {
    const text = e.target.value;
    setMessage(text);
    setCharCount(text.length);
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  // --- Load message logs ---
  const loadMessageLogs = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/Messaging/logs?pageSize=10`, {
        headers: getHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error("Failed to load logs:", error);
    }
  };

  // --- Send messages ---
  const handleSend = async (e) => {
    e.preventDefault();

    const rawNumbers = recipients.split(/[\s,]+/).filter((num) => num.trim().length > 0);
    const validNumbers = rawNumbers.filter(isValidPhoneNumber);
    const invalidNums = rawNumbers.filter((num) => !isValidPhoneNumber(num));

    if (validNumbers.length === 0) {
      setStatus({ type: "error", text: "No valid phone numbers provided." });
      return;
    }

    if (message.length === 0) {
      setStatus({ type: "error", text: "Message cannot be empty." });
      return;
    }

    if (!getAuthToken()) {
      setStatus({ type: "error", text: "Please log in to send messages." });
      return;
    }

    setLoading(true);
    setStatus(null);
    setReport([]);
    setProgress(0);

    const payload = {
      PhoneNumbers: validNumbers,
      Message: message,
      SenderId: senderId || undefined,
      MessageType: messageType,
      IsPriority: isPriority
    };

    try {
      const response = await fetch(`${apiBaseUrl}/Messaging/send`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        setStatus({ type: "error", text: "Authentication required. Please log in." });
        setLoading(false);
        return;
      }

      if (response.status === 403) {
        setStatus({ type: "error", text: "You don't have permission to send messages." });
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const finalReport = [
          ...result.results.map((r) => ({
            number: r.phoneNumber,
            status: r.success ? "Delivered" : "Failed",
            messageId: r.messageId,
            cost: r.cost,
            sentAt: new Date().toISOString(),
          })),
          ...invalidNums.map((num) => ({ 
            number: num, 
            status: "Invalid", 
            messageId: null,
            cost: 0,
            sentAt: new Date().toISOString() 
          })),
        ];

        setReport(finalReport);
        setProgress(100);

        setStatus({
          type: "success",
          text: `Successfully sent ${result.successful}/${result.total} messages. ${invalidNums.length} invalid numbers skipped. Total cost: ${result.totalCost || 0} KES`,
        });

        // Clear form on success
        setRecipients("");
        setMessage("");
        setCharCount(0);
        setInvalidNumbers([]);
        
        // Refresh logs
        loadMessageLogs();
      } else {
        throw new Error(result.message || "Failed to send messages");
      }
    } catch (err) {
      console.error("Send error:", err);
      setStatus({ 
        type: "error", 
        text: err.message || "Error sending messages. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Login function ---
  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(`${apiBaseUrl}/Auth/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('authToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setStatus({ type: "success", text: "Login successful!" });
        return true;
      } else {
        setStatus({ type: "error", text: data.message || "Login failed" });
        return false;
      }
    } catch (error) {
      setStatus({ type: "error", text: "Login error: " + error.message });
      return false;
    }
  };

  // --- Logout function ---
  const handleLogout = async () => {
    try {
      await fetch(`${apiBaseUrl}/Auth/logout`, {
        method: "POST",
        headers: getHeaders(),
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setStatus({ type: "success", text: "Logged out successfully" });
    }
  };

  // --- Load initial data ---
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      loadMessageLogs();
    }
  }, []);

  const smsParts = Math.ceil(charCount / 160) || 1;
  const estimatedCost = smsParts * report.filter(r => r.status === "Delivered").length;

  // Login form state
  const [showLogin, setShowLogin] = useState(!getAuthToken());
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const success = await handleLogin(loginEmail, loginPassword);
    if (success) {
      setShowLogin(false);
      loadMessageLogs();
    }
  };

  return (
    <div className="page-card fancy-sms">
      {/* Login Form */}
      {showLogin && (
        <div className="login-overlay">
          <div className="login-form">
            <h3>Login to DelTech SMS</h3>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button type="submit" className="btn-primary">
                Login
              </button>
              <div className="demo-credentials">
                <p><strong>Demo Credentials:</strong></p>
                <p>Email: user@deltech.com | Password: User123!</p>
                <p>Email: admin@deltech.com | Password: Admin123!</p>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="sms-header">
        <div className="header-top">
          <div>
            <h2>Bulk SMS Sender</h2>
            <p>Send messages to multiple recipients at once</p>
          </div>
          <div className="user-info">
            {user && (
              <div className="user-welcome">
                Welcome, <strong>{user.fullName}</strong> ({user.role})
                <button className="btn-secondary logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
            <button 
              className="btn-secondary" 
              onClick={() => setShowLogs(!showLogs)}
            >
              {showLogs ? "Hide Logs" : "Show Recent Logs"}
            </button>
          </div>
        </div>
      </div>

      {showLogs && logs.length > 0 && (
        <div className="recent-logs">
          <h4>Recent Messages</h4>
          <div className="logs-list">
            {logs.slice(0, 5).map((log, index) => (
              <div key={log.id || index} className="log-item">
                <div className="log-recipient">{log.recipient}</div>
                <div className={`log-status ${log.status === 'Delivered' ? 'success' : 'failed'}`}>
                  {log.status || 'Pending'}
                </div>
                <div className="log-time">{getRelativeTime(log.sentAt)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSend} className="sms-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="messageType">Message Type</label>
            <select 
              id="messageType"
              value={messageType} 
              onChange={(e) => setMessageType(e.target.value)}
            >
              <option value="Promotional">Promotional</option>
              <option value="Transactional">Transactional</option>
              <option value="Alert">Alert</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="senderId">Sender ID (Optional)</label>
            <input
              id="senderId"
              type="text"
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
              placeholder="e.g., DelTech"
              maxLength="11"
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isPriority}
                onChange={(e) => setIsPriority(e.target.checked)}
              />
              Priority Message
            </label>
          </div>
        </div>

        <div className="form-group recipients-container">
          <label htmlFor="recipients">
            Recipients {recipients && `(${recipients.split(/[\s,]+/).filter(num => num.trim().length > 0).length} numbers)`}
          </label>
          <div className="recipients-highlight">
            {recipients.split(/([\s,]+)/).map((part, idx) => {
              if (part.trim() === "" || part === "," || part === " ") return part;
              return isValidPhoneNumber(part) ? (
                <span key={idx} className="valid-number">{part}</span>
              ) : (
                <span key={idx} className="invalid-number">{part}</span>
              );
            })}
          </div>
          <textarea
            id="recipients"
            rows={3}
            value={recipients}
            onChange={handleRecipientsChange}
            placeholder="e.g. +254712345678, +254723456789"
            className="recipients-input"
          />
          {invalidNumbers.length > 0 && (
            <small className="invalid-numbers">
              Invalid numbers: {invalidNumbers.join(", ")}
            </small>
          )}
          <small>Separate multiple numbers with commas or spaces. Include country code (+254 for Kenya).</small>
        </div>

        <div className="form-group">
          <label htmlFor="message">
            Message {message && `(${smsParts} part${smsParts > 1 ? 's' : ''})`}
          </label>
          <textarea
            id="message"
            rows={5}
            value={message}
            onChange={handleMessageChange}
            placeholder="Type your message here..."
            maxLength="1600"
          />
          <div className="char-info">
            <span>{charCount} / 1600 characters</span>
            <span>{smsParts} SMS part{smsParts > 1 ? "s" : ""}</span>
            {estimatedCost > 0 && <span>Estimated cost: {estimatedCost} KES</span>}
          </div>
        </div>

        {loading && (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            <small>{progress}% sent</small>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading || !user}>
            {loading ? "Sending..." : "Send Bulk SMS"}
          </button>
          
          {!user && (
            <small className="auth-warning">Please log in to send messages</small>
          )}
        </div>

        {status && (
          <div className={`status-message ${status.type}`}>
            {status.text}
          </div>
        )}
      </form>

      {report.length > 0 && (
        <div className="delivery-report fade-in">
          <div className="report-header">
            <h3>Delivery Report</h3>
            <div className="report-actions">
              <div className="report-summary">
                Total: {report.length} | 
                Delivered: {report.filter(r => r.status === "Delivered").length} | 
                Failed: {report.filter(r => r.status === "Failed").length} | 
                Invalid: {report.filter(r => r.status === "Invalid").length}
              </div>
              <button className="btn-secondary" onClick={() => {
                const csvContent = [
                  "Recipient,Status,Message ID,Cost (KES),Sent At",
                  ...report.map(r => `"${r.number}",${r.status},${r.messageId || "N/A"},${r.cost},"${new Date(r.sentAt).toLocaleString()}"`)
                ].join("\n");
                
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `sms_report_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
              }}>
                Download CSV
              </button>
            </div>
          </div>

          <div className="report-table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Status</th>
                  <th>Message ID</th>
                  <th>Cost</th>
                  <th>Sent</th>
                </tr>
              </thead>
              <tbody>
                {report.map((r, i) => (
                  <tr key={i} className={r.status === "Failed" ? "failed-row" : r.status === "Invalid" ? "invalid-row" : "delivered-row"}>
                    <td>{r.number}</td>
                    <td className={`status-cell ${r.status.toLowerCase()}`}>
                      {r.status}
                    </td>
                    <td className="message-id">{r.messageId || "N/A"}</td>
                    <td className="cost">{r.cost} KES</td>
                    <td className="sent-time">
                      {new Date(r.sentAt).toLocaleString()} 
                      <br />
                      <small>({getRelativeTime(r.sentAt)})</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}