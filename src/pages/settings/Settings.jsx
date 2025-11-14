import React, { useState } from "react";
import "./SettingsPage.css";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkMode: false,
    language: "en",
    currency: "USD",
  });

  const handleToggle = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSelectChange = (key, value) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>System Settings</h2>
        <p>Manage your account preferences and application behavior.</p>
      </div>

      <div className="settings-grid">
        {/* Notifications */}
        <section className="settings-card">
          <h4>Notifications</h4>

          <div className="setting">
            <span>Push Notifications</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={() => handleToggle("notifications")}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting">
            <span>Email Updates</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.emailUpdates}
                onChange={() => handleToggle("emailUpdates")}
              />
              <span className="slider"></span>
            </label>
          </div>
        </section>

        {/* Appearance */}
        <section className="settings-card">
          <h4>Appearance</h4>

          <div className="setting">
            <span>Dark Mode</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={() => handleToggle("darkMode")}
              />
              <span className="slider"></span>
            </label>
          </div>
        </section>

        {/* Preferences */}
        <section className="settings-card">
          <h4>Preferences</h4>

          <div className="setting">
            <span>Language</span>
            <select
              value={settings.language}
              onChange={(e) => handleSelectChange("language", e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <div className="setting">
            <span>Currency</span>
            <select
              value={settings.currency}
              onChange={(e) => handleSelectChange("currency", e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="KES">KES (KSh)</option>
            </select>
          </div>
        </section>

        {/* Account */}
        <section className="settings-card">
          <h4>Account</h4>

          <button className="btn">Change Password</button>
          <button className="btn">Privacy Settings</button>
          <button className="btn danger">Delete Account</button>
        </section>
      </div>
    </div>
  );
}
