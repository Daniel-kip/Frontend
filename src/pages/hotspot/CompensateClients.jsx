import React, { useState, useEffect } from 'react';
import './VoucherPage.css';

export default function AdvancedVoucher() {
  const [hotspots, setHotspots] = useState([
    { id: 1, name: 'Hotspot A' },
    { id: 2, name: 'Hotspot B' }
  ]);
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({
    hotspotId: '',
    packageId: '',
    transactionCode: '',
    clientNumber: '',
  });
  const [voucherCode, setVoucherCode] = useState('');
  const [message, setMessage] = useState('');

  
  useEffect(() => {
    if (!form.hotspotId) return;
    //API
    setPackages([
      { id: 'pkg1', name: '1 Hour Access' },
      { id: 'pkg2', name: '24 Hour Access' }
    ]);
  }, [form.hotspotId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const generateVoucher = () => {
    if (!form.hotspotId || !form.packageId || !form.transactionCode) {
      setMessage('Please fill all required fields');
      return;
    }
    //code generation logic
    const code = 'VCH-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    setVoucherCode(code);
    setMessage('Voucher generated successfully!');
  };

  return (
    <div className="voucher-card">
      <h2>Compensate Client</h2>

      <div className="form-group">
        <label>Choose Hotspot:</label>
        <select name="hotspotId" value={form.hotspotId} onChange={handleChange}>
          <option value="">Select Hotspot to Generate Code</option>
          {hotspots.map(h => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Package:</label>
        <select name="packageId" value={form.packageId} onChange={handleChange} disabled={!form.hotspotId}>
          <option value="">Select a hotspot first</option>
          {packages.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Mpesa Transaction Code:</label>
        <input
          type="text"
          name="transactionCode"
          value={form.transactionCode}
          placeholder="e.g. QJL7XXXX"
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Client Number (optional):</label>
        <input
          type="text"
          name="clientNumber"
          value={form.clientNumber}
          placeholder="e.g. 25472* *** 234"
          onChange={handleChange}
        />
      </div>

      {message && <div className="form-message">{message}</div>}

      <button className="btn-generate" onClick={generateVoucher}>Generate Voucher</button>

      {voucherCode && (
        <div className="voucher-preview">
          <h3>Voucher Code:</h3>
          <p>{voucherCode}</p>
        </div>
      )}
    </div>
  );
}
