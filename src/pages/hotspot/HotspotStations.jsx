import React, { useState, useEffect } from 'react';
import './HotspotStations.css';

export default function HotspotStations() {
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formStation, setFormStation] = useState({
    name: '',
    location: '',
    ipAddress: '',
    ssid: '',
    frequency: '2.4GHz',
    bandwidth: '20MHz',
    channel: 1,
    maxClients: 50,
    status: 'active',
    description: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [message, setMessage] = useState({ type: '', text: '' });

  const frequencyOptions = ['2.4GHz', '5GHz', '6GHz'];
  const bandwidthOptions = ['20MHz', '40MHz', '80MHz', '160MHz'];
  const statusOptions = ['active', 'maintenance', 'offline'];

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    setIsLoading(true);
    try {
      await new Promise(res => setTimeout(res, 1000));
      setStations([
        { id: 1, name: 'Main Office', location: 'Nairobi CBD', ipAddress: '192.168.1.1', ssid: 'OfficeWiFi', frequency: '2.4GHz', bandwidth: '20MHz', channel: 6, maxClients: 100, connectedClients: 47, status: 'active', uptime: '15d 6h', dataUsage: '245 GB', description: 'Main office hotspot' },
        { id: 2, name: 'Mall Zone', location: 'Westgate Mall', ipAddress: '192.168.1.2', ssid: 'MallWiFi', frequency: '5GHz', bandwidth: '40MHz', channel: 36, maxClients: 200, connectedClients: 189, status: 'active', uptime: '12d 3h', dataUsage: '1.2 TB', description: 'Mall hotspot' },
        { id: 3, name: 'University', location: 'Library', ipAddress: '192.168.1.3', ssid: 'UniWiFi', frequency: '2.4GHz', bandwidth: '20MHz', channel: 11, maxClients: 150, connectedClients: 0, status: 'maintenance', uptime: '0d 0h', dataUsage: '890 GB', description: 'Library hotspot' }
      ]);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load stations' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!formStation.name.trim() || !formStation.ipAddress.trim()) {
      setMessage({ type: 'error', text: 'Name and IP are required' });
      return;
    }
    if (formStation.id) {
      // Update existing
      setStations(prev => prev.map(s => s.id === formStation.id ? formStation : s));
      setMessage({ type: 'success', text: 'Station updated' });
    } else {
      // Add new
      setStations(prev => [...prev, { ...formStation, id: Date.now(), connectedClients: 0, uptime: '0d 0h', dataUsage: '0 GB' }]);
      setMessage({ type: 'success', text: 'Station added' });
    }
    setFormStation({ name: '', location: '', ipAddress: '', ssid: '', frequency: '2.4GHz', bandwidth: '20MHz', channel: 1, maxClients: 50, status: 'active', description: '' });
    setShowForm(false);
  };

  const handleDelete = id => {
    if (window.confirm('Delete this station?')) {
      setStations(prev => prev.filter(s => s.id !== id));
      if (selectedStation?.id === id) setSelectedStation(null);
      setMessage({ type: 'success', text: 'Station deleted' });
    }
  };

  const handleStatusChange = (id, status) => {
    setStations(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const filteredStations = stations.filter(s =>
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || s.status === statusFilter)
  );

  if (isLoading) return <div className="page-card"><p>Loading stations...</p></div>;

  return (
    <div className="page-card">
      <h1>Hotspot Stations</h1>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
          <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      <div className="controls-bar">
        <input type="text" placeholder="Search stations..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All</option>
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => { setShowForm(true); setFormStation({ name: '', location: '', ipAddress: '', ssid: '', frequency: '2.4GHz', bandwidth: '20MHz', channel: 1, maxClients: 50, status: 'active', description: '' }); }}>Add Station</button>
      </div>

      {showForm && (
        <div className="station-form">
          <h3>{formStation.id ? 'Edit' : 'Add'} Station</h3>

          <label>Name</label>
          <input placeholder="Station name" value={formStation.name} onChange={e => setFormStation({ ...formStation, name: e.target.value })} />

          <label>IP Address</label>
          <input placeholder="e.g., 192.168.1.1" value={formStation.ipAddress} onChange={e => setFormStation({ ...formStation, ipAddress: e.target.value })} />

          <label>Location</label>
          <input placeholder="e.g., Nairobi CBD" value={formStation.location} onChange={e => setFormStation({ ...formStation, location: e.target.value })} />

          <label>SSID</label>
          <input placeholder="WiFi SSID" value={formStation.ssid} onChange={e => setFormStation({ ...formStation, ssid: e.target.value })} />

          <label>Frequency</label>
          <select value={formStation.frequency} onChange={e => setFormStation({ ...formStation, frequency: e.target.value })}>
            {frequencyOptions.map(f => <option key={f} value={f}>{f}</option>)}
          </select>

          <label>Bandwidth</label>
          <select value={formStation.bandwidth} onChange={e => setFormStation({ ...formStation, bandwidth: e.target.value })}>
            {bandwidthOptions.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <label>Channel</label>
          <input type="number" min="1" max="165" value={formStation.channel} onChange={e => setFormStation({ ...formStation, channel: parseInt(e.target.value) || 1 })} />

          <label>Max Clients</label>
          <input type="number" min="1" max="1000" value={formStation.maxClients} onChange={e => setFormStation({ ...formStation, maxClients: parseInt(e.target.value) || 50 })} />

          <label>Status</label>
          <select value={formStation.status} onChange={e => setFormStation({ ...formStation, status: e.target.value })}>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <label>Description</label>
          <textarea placeholder="Optional notes..." value={formStation.description} onChange={e => setFormStation({ ...formStation, description: e.target.value })}></textarea>

          <div className="form-actions">
            <button onClick={() => setShowForm(false)}>Cancel</button>
            <button onClick={handleSave}>{formStation.id ? 'Update' : 'Add'}</button>
          </div>
        </div>
      )}

      <table className="stations-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>SSID</th>
            <th>IP</th>
            <th>Clients</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStations.map(s => (
            <tr key={s.id} onClick={() => setSelectedStation(s)}>
              <td>{s.name}</td>
              <td>{s.location}</td>
              <td>{s.ssid}</td>
              <td>{s.ipAddress}</td>
              <td>{s.connectedClients} / {s.maxClients}</td>
              <td>{s.status}</td>
              <td>
                {s.status !== 'offline' && <button onClick={() => handleStatusChange(s.id, s.status === 'active' ? 'maintenance' : 'active')}>Toggle</button>}
                <button onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedStation && (
        <div className="station-details">
          <h3>{selectedStation.name}</h3>
          <p>Location: {selectedStation.location}</p>
          <p>SSID: {selectedStation.ssid}</p>
          <p>IP: {selectedStation.ipAddress}</p>
          <p>Status: {selectedStation.status}</p>
          <p>Clients: {selectedStation.connectedClients} / {selectedStation.maxClients}</p>
          <p>Uptime: {selectedStation.uptime}</p>
          <p>Data Usage: {selectedStation.dataUsage}</p>
          <p>Description: {selectedStation.description || 'None'}</p>
          <button onClick={() => setSelectedStation(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
