import React, { useState, useEffect } from "react";
import "./AddMikrotik.css";

export default function MikrotikConfigPage() {
  const [theme, setTheme] = useState("light");
  const [formData, setFormData] = useState({
    mikrotikName: "",
    wirelessName: "",
    router: "",
    service: "",
  });

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const routerOptions = [
    "Select your router",
    "RB750Gr3 (hEX)",
    "RB4011iGS+RM",
    "RB5009UG+S+IN",
    "RB951",
    "hAP Lite",
    "hAP ac³",
    "CHR (Cloud Hosted Router)",
  ];

  const serviceOptions = [
    "Select service",
    "PPPoE + Hotspot",
    "PPPoE Only",
    "Hotspot Only",
    "DHCP + NAT",
    "Bridge Mode",
  ];

  return (
    <div className="mikrotik-page">
      {/* Star Theme Toggle */}
      <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
        ★
      </button>

      <div className="content">
        {/* Left Form Section */}
        <div className="card form-card">
          <h2>Add Mikrotik</h2>
          <label>Enter your Mikrotik Name</label>
          <input
            type="text"
            placeholder="Enter router name"
            value={formData.mikrotikName}
            onChange={(e) =>
              setFormData({ ...formData, mikrotikName: e.target.value })
            }
          />

          <label>Enter your preferred Wireless name</label>
          <input
            type="text"
            placeholder="Enter wireless name"
            value={formData.wirelessName}
            onChange={(e) =>
              setFormData({ ...formData, wirelessName: e.target.value })
            }
          />

          <label>Choose router:</label>
          <select
            value={formData.router}
            onChange={(e) => setFormData({ ...formData, router: e.target.value })}
          >
            {routerOptions.map((opt, i) => (
              <option key={i} value={opt === "Select your router" ? "" : opt}>
                {opt}
              </option>
            ))}
          </select>

          <label>Choose service:</label>
          <select
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
          >
            {serviceOptions.map((opt, i) => (
              <option key={i} value={opt === "Select service" ? "" : opt}>
                {opt}
              </option>
            ))}
          </select>

          <label>Assign Ports to Interfaces:</label>
          <input type="text" placeholder="e.g. ether1=WAN, ether2=LAN" />

          <button className="btn-generate">Generate scripts</button>
        </div>

        {/* Right Guide Section */}
        <div className="card guide-card">
          <h2>Guide</h2>
          <div className="guide-box">
            <p><strong>Instructions:</strong></p>
            <ol>
              <li>Fill in the required details below (name, router, service, and interface mapping).</li>
              <li>Click <strong>“Generate scripts”</strong> to download a Mikrotik configuration file.</li>
              <li>Connect your PC to the Mikrotik via <strong>ether1</strong> (the port to your ISP) using WinBox.</li>
              <li>Perform a router reset:</li>
              <ul>
                <li>Go to <strong>System → Reset Configuration</strong></li>
                <li>Check <strong>“No Default Configuration”</strong></li>
                <li>Check <strong>“Do not backup”</strong></li>
                <li>Do NOT select <strong>“Keep user configuration”</strong></li>
              </ul>
              <li>After reboot, upload the downloaded .rsc file to the <strong>Files</strong> section in WinBox.</li>
              <li>Open the terminal and run this command to apply configuration:</li>
            </ol>
            <div className="code-snippet">/import file-name=bosminet_config.rsc</div>
          </div>
          <p className="video-link">
            If you are new <a href="https://youtube.com" target="_blank" rel="noreferrer">Click Here</a> for a full video guide
          </p>
        </div>
      </div>
    </div>
  );
}
