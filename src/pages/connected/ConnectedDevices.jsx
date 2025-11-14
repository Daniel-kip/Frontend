import React, { useEffect, useState } from "react";
import "./Page.css";

export default function Page() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  // Mock API endpoint (replace later with your backend)
  const API_URL = "http://localhost:5000/devices";

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  // Fetch all devices
  const fetchDevices = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setDevices(data);
    } catch {
      showToast("Failed to fetch devices", "error");
    } finally {
      setLoading(false);
    }
  };

  // Simulate initial device fetch
  useEffect(() => {
    // Mock data for now
    setDevices([
      {
        id: 1,
        name: "Router A",
        type: "Router",
        ip: "192.168.1.1",
        dataUsed: 56.3,
        status: "active",
      },
      {
        id: 2,
        name: "MikroTik 1",
        type: "MikroTik",
        ip: "192.168.1.20",
        dataUsed: 32.4,
        status: "inactive",
      },
      {
        id: 3,
        name: "Router B",
        type: "Router",
        ip: "192.168.1.5",
        dataUsed: 80.1,
        status: "active",
      },
    ]);
  }, []);

  // Device actions
  const toggleStatus = (id) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: d.status === "active" ? "inactive" : "active",
            }
          : d
      )
    );
    showToast("Client status updated", "success");
  };

  const deleteDevice = (id) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    showToast("Client deleted", "success");
  };

  return (
    <div className="page-container">
      {toast.message && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <h1 className="page-title">Connected Devices Dashboard</h1>
      <p className="subtitle">Monitor and manage all connected clients</p>

      <div className="device-grid">
        {devices.length === 0 ? (
          <p className="no-devices">No connected devices found</p>
        ) : (
          devices.map((device) => (
            <div key={device.id} className="device-card fade-in">
              <div className="device-header">
                <h3>{device.name}</h3>
                <span
                  className={`status ${
                    device.status === "active" ? "online" : "offline"
                  }`}
                >
                  {device.status === "active" ? "Online" : "Offline"}
                </span>
              </div>

              <p className="device-type">{device.type}</p>
              <p className="device-ip">IP: {device.ip}</p>
              <p className="device-data">
                Data Used: <strong>{device.dataUsed} GB</strong>
              </p>

              <div className="device-actions">
                <button
                  className={
                    device.status === "active" ? "deactivate" : "reactivate"
                  }
                  onClick={() => toggleStatus(device.id)}
                >
                  {device.status === "active" ? "Deactivate" : "Reactivate"}
                </button>
                <button
                  className="delete"
                  onClick={() => deleteDevice(device.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
