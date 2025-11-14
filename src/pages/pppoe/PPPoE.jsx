import React, { useState, useEffect } from 'react';
import './PPPoEClient.css';

export default function PPPoE() {
  const [clients, setClients] = useState([]);

  // Mock data to simulate registered clients
  useEffect(() => {
    const mockClients = [
      {
        username: 'client001',
        service: 'Internet Service',
        profile: '2 Mbps',
        ipAddress: '192.168.1.101',
        macAddress: '00:1B:44:11:3A:B7',
        comment: 'Office PC',
        status: 'Active',
        usage: '3.5GB',
        daysLeft: 15
      },
      {
        username: 'client002',
        service: 'Business Service',
        profile: '10 Mbps',
        ipAddress: '192.168.1.102',
        macAddress: '00:1B:44:11:3A:C8',
        comment: 'Main branch',
        status: 'Disabled',
        usage: '1.2GB',
        daysLeft: 0
      }
    ];
    setClients(mockClients);
  }, []);

  return (
    <div className="page-card">
      <div className="page-header">
        <h1>PPPoE Clients</h1>
        <p>All registered clients with status, usage, and profile information</p>
      </div>

      <div className="clients-grid">
        {clients.length === 0 && <p>No clients registered yet.</p>}
        {clients.map((client, index) => (
          <div className="client-card" key={index}>
            <div className={`status-badge ${client.status.toLowerCase()}`}>
              {client.status}
            </div>
            <div className="client-info">
              <h3>{client.username}</h3>
              <p><strong>Service:</strong> {client.service}</p>
              <p><strong>Profile:</strong> {client.profile}</p>
              <p><strong>IP:</strong> {client.ipAddress || 'Dynamic'}</p>
              <p><strong>MAC:</strong> {client.macAddress || 'Not set'}</p>
              {client.comment && <p><strong>Comment:</strong> {client.comment}</p>}
              <p><strong>Internet Usage:</strong> {client.usage || '0GB'}</p>
              <p><strong>Days Left:</strong> {client.daysLeft}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
