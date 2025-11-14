import React, { useEffect, useState } from "react";
import "./Page.css";

export default function Page() {
  const [stationName, setStationName] = useState("");
  const [contact, setContact] = useState("");
  const [payment, setPayment] = useState("");
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5000/stations";

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const fetchStations = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStations(data);
    } catch {
      showToast("Failed to fetch stations", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleAddStation = async (e) => {
    e.preventDefault();
    if (!stationName || !contact || !payment) {
      showToast("Please fill all fields", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: stationName, contact, payment }),
      });

      if (res.ok) {
        showToast("Station added successfully", "success");
        setStationName("");
        setContact("");
        setPayment("");
        fetchStations();
      } else showToast("Failed to add station", "error");
    } catch {
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStation = async () => {
    if (!selectedStation) {
      showToast("Select a station to delete", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${selectedStation}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Station deleted", "success");
        setSelectedStation("");
        fetchStations();
      } else showToast("Delete failed", "error");
    } catch {
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
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

      <h1 className="page-title">Station Manager</h1>

      <div className="cards-grid">
        {/* Add Station */}
        <div className="card fade-in">
          <h2>Add Station</h2>
          <p>Enter details to add a new station</p>

          <form onSubmit={handleAddStation}>
            <label>Station Name</label>
            <input
              type="text"
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
              placeholder="Enter station name"
            />

            <label>Contact</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="e.g. 0712 345 678"
            />

            <label>Payment Method</label>
            <select value={payment} onChange={(e) => setPayment(e.target.value)}>
              <option value="">Select Payment Account</option>
              <option value="mpesa">M-Pesa</option>
              <option value="paypal">PayPal</option>
              <option value="bank">Bank Account</option>
            </select>

            <button type="submit" className="submit" disabled={loading}>
              Submit
            </button>
          </form>
        </div>

        {/* Delete Station */}
        <div className="card fade-in">
          <h2>Delete Station</h2>
          <p>Choose a station to remove</p>

          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
          >
            <option value="">Select Station</option>
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <button onClick={handleDeleteStation} className="delete" disabled={loading}>
            Delete
          </button>
        </div>
      </div>

      <div className="added-stations fade-in">
        <h2>Added Stations</h2>
        {stations.length === 0 ? (
          <p>
            <i>No stations added yet.</i>
          </p>
        ) : (
          <ul>
            {stations.map((s) => (
              <li key={s.id}>
                <strong>{s.name}</strong> — {s.contact} ({s.payment})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
