import React, { useState, useEffect } from 'react';
import './PPPoEClient.css';

export default function AddPPPoEClient() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    service: 'pppoe-internet',
    profile: '1Mbps',
    ipAddress: '',
    macAddress: '',
    staticIp: false,
    pool: 'pppoe-pool',
    remoteAddress: '',
    localAddress: '',
    comment: '',
    disabled: false,
    limitBytesIn: '',
    limitBytesOut: '',
    limitUptime: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [existingUsers, setExistingUsers] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const mockUsers = [
      { username: 'client001', service: 'pppoe-internet', profile: '2Mbps', status: 'active' },
      { username: 'client002', service: 'pppoe-internet', profile: '5Mbps', status: 'active' },
      { username: 'client003', service: 'pppoe-voip', profile: '1Mbps', status: 'disabled' },
      { username: 'business001', service: 'pppoe-business', profile: '10Mbps', status: 'active' },
    ];
    setExistingUsers(mockUsers);
  }, []);

  const serviceOptions = [
    { value: 'pppoe-internet', label: 'Internet Service', description: 'Standard internet access' },
    { value: 'pppoe-business', label: 'Business Service', description: 'Business-grade internet with priority' },
    { value: 'pppoe-voip', label: 'VoIP Service', description: 'Voice over IP optimized service' },
    { value: 'pppoe-guest', label: 'Guest Service', description: 'Limited guest internet access' }
  ];

  const profileOptions = [
    { value: '1Mbps', label: '1 Mbps', speed: '1/1 Mbps', price: 'KSh 500' },
    { value: '2Mbps', label: '2 Mbps', speed: '2/2 Mbps', price: 'KSh 800' },
    { value: '5Mbps', label: '5 Mbps', speed: '5/5 Mbps', price: 'KSh 1,200' },
    { value: '10Mbps', label: '10 Mbps', speed: '10/10 Mbps', price: 'KSh 2,000' },
    { value: '20Mbps', label: '20 Mbps', speed: '20/20 Mbps', price: 'KSh 3,500' },
    { value: '50Mbps', label: '50 Mbps', speed: '50/50 Mbps', price: 'KSh 6,000' },
    { value: '100Mbps', label: '100 Mbps', speed: '100/100 Mbps', price: 'KSh 10,000' }
  ];

  const poolOptions = [
    { value: 'pppoe-pool', label: 'Default PPPoE Pool' },
    { value: 'static-pool', label: 'Static IP Pool' },
    { value: 'premium-pool', label: 'Premium Pool' },
    { value: 'business-pool', label: 'Business Pool' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const generateUsername = () => {
    const prefix = 'client';
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const username = `${prefix}${randomNum}`;
    if (existingUsers.find(u => u.username === username)) return generateUsername();
    setFormData(prev => ({ ...prev, username }));
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) return setMessage({ type: 'error', text: 'Username is required' }), false;
    if (!formData.password) return setMessage({ type: 'error', text: 'Password is required' }), false;
    if (formData.password.length < 8) return setMessage({ type: 'error', text: 'Password must be at least 8 characters' }), false;
    if (existingUsers.find(u => u.username === formData.username)) return setMessage({ type: 'error', text: 'Username already exists' }), false;
    if (formData.ipAddress && !isValidIP(formData.ipAddress)) return setMessage({ type: 'error', text: 'Invalid IP address' }), false;
    if (formData.macAddress && !isValidMAC(formData.macAddress)) return setMessage({ type: 'error', text: 'Invalid MAC address' }), false;
    return true;
  };

  const isValidIP = (ip) => {
    const ipRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(ip)) return false;
    return ip.split('.').every(n => parseInt(n) >= 0 && parseInt(n) <= 255);
  };

  const isValidMAC = (mac) => /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage({ type: 'success', text: 'PPPoE client created successfully!' });
      setTimeout(() => {
        setFormData({
          username: '', password: '', service: 'pppoe-internet', profile: '1Mbps', ipAddress: '',
          macAddress: '', staticIp: false, pool: 'pppoe-pool', remoteAddress: '', localAddress: '',
          comment: '', disabled: false, limitBytesIn: '', limitBytesOut: '', limitUptime: ''
        });
        setMessage({ type: '', text: '' });
      }, 2500);
    } catch {
      setMessage({ type: 'error', text: 'Failed to create PPPoE client.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedProfile = () => profileOptions.find(p => p.value === formData.profile);
  const getSelectedService = () => serviceOptions.find(s => s.value === formData.service);

  return (
    <div className="page-card">
      <div className="page-header">
        <h1>Add PPPoE Client</h1>
        <p>Create new PPPoE client accounts</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
          <button className="alert-close" onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      <div className="pppoe-content">
        <div className="form-section">
          <div className="card">
            <div className="card-header"><h2>Client Configuration</h2></div>
            <form onSubmit={handleSubmit} className="pppoe-form">
              <div className="form-grid">
                {/* Username */}
                <div className="form-group">
                  <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder=" " required />
                  <label>Username</label>
                  <button type="button" onClick={generateUsername} className="btn-secondary" disabled={isSubmitting}>Generate</button>
                </div>

                {/* Password */}
                <div className="form-group">
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder=" " required minLength="8" />
                  <label>Password</label>
                  <button type="button" onClick={generatePassword} className="btn-secondary" disabled={isSubmitting}>Generate</button>
                </div>

                {/* Service */}
                <div className="form-group">
                  <select name="service" value={formData.service} onChange={handleChange} required>
                    {serviceOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <label>Service Type</label>
                </div>

                {/* Profile */}
                <div className="form-group">
                  <select name="profile" value={formData.profile} onChange={handleChange} required>
                    {profileOptions.map(p => <option key={p.value} value={p.value}>{p.label} ({p.speed})</option>)}
                  </select>
                  <label>Speed Profile</label>
                </div>
              </div>

              <div className="form-section-divider"><h3>IP Configuration</h3></div>

              <div className="form-grid">
                <div className="form-group">
                  <input type="text" name="ipAddress" value={formData.ipAddress} onChange={handleChange} placeholder=" " />
                  <label>IP Address</label>
                </div>
                <div className="form-group">
                  <input type="text" name="macAddress" value={formData.macAddress} onChange={handleChange} placeholder=" " />
                  <label>MAC Address</label>
                </div>
                <div className="form-group">
                  <select name="pool" value={formData.pool} onChange={handleChange}>
                    {poolOptions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                  <label>IP Pool</label>
                </div>
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input type="checkbox" name="staticIp" checked={formData.staticIp} onChange={handleChange} />
                    Assign Static IP
                  </label>
                </div>
              </div>

              <div className="advanced-toggle">
                <button type="button" className="btn-link" onClick={() => setShowAdvanced(!showAdvanced)}>
                  {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
                </button>
              </div>

              {showAdvanced && (
                <div className="advanced-settings">
                  <div className="form-grid">
                    <div className="form-group"><input type="text" name="remoteAddress" value={formData.remoteAddress} onChange={handleChange} placeholder=" " /><label>Remote Address</label></div>
                    <div className="form-group"><input type="text" name="localAddress" value={formData.localAddress} onChange={handleChange} placeholder=" " /><label>Local Address</label></div>
                    <div className="form-group"><input type="number" name="limitBytesIn" value={formData.limitBytesIn} onChange={handleChange} placeholder=" " /><label>Download Limit (Bytes)</label></div>
                    <div className="form-group"><input type="number" name="limitBytesOut" value={formData.limitBytesOut} onChange={handleChange} placeholder=" " /><label>Upload Limit (Bytes)</label></div>
                    <div className="form-group"><input type="text" name="limitUptime" value={formData.limitUptime} onChange={handleChange} placeholder=" " /><label>Uptime Limit</label></div>
                  </div>
                </div>
              )}

              <div className="form-group"><textarea name="comment" value={formData.comment} onChange={handleChange} placeholder=" " rows="3" /><label>Comment</label></div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" name="disabled" checked={formData.disabled} onChange={handleChange} />
                  Disable this client
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setFormData({
                  username: '', password: '', service: 'pppoe-internet', profile: '1Mbps', ipAddress: '',
                  macAddress: '', staticIp: false, pool: 'pppoe-pool', remoteAddress: '', localAddress: '',
                  comment: '', disabled: false, limitBytesIn: '', limitBytesOut: '', limitUptime: ''
                })}>Clear Form</button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? <span className="spinner"></span> : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
