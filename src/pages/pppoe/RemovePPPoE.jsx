import React, { useState, useEffect } from 'react';
import './RemovePPPoEClient.css';

export default function RemovePPPoEClient() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [clientToRemove, setClientToRemove] = useState(null);
  const [bulkAction, setBulkAction] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [removalReason, setRemovalReason] = useState('');

  // Removal reasons for tracking
  const removalReasons = [
    'Service termination',
    'Non-payment',
    'Customer request',
    'Network maintenance',
    'Policy violation',
    'Migration to other service',
    'Other'
  ];

  // Simulate loading PPPoE clients from API
  useEffect(() => {
    loadClients();
  }, []);

  // Filter clients when search or filters change
  useEffect(() => {
    filterClients();
  }, [clients, searchTerm, statusFilter, serviceFilter]);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data - replace with actual API call
      const mockClients = [
        {
          id: 1,
          username: 'client001',
          service: 'pppoe-internet',
          profile: '2Mbps',
          status: 'active',
          ipAddress: '192.168.88.101',
          macAddress: '00:1B:44:11:3A:B7',
          connected: true,
          uptime: '5 days, 12 hours',
          dataTransferred: '45.2 GB',
          lastSeen: '2024-01-20 14:30:00',
          createdAt: '2024-01-15',
          comment: 'Residential client - Nairobi West'
        },
        {
          id: 2,
          username: 'client002',
          service: 'pppoe-business',
          profile: '10Mbps',
          status: 'active',
          ipAddress: '192.168.88.102',
          macAddress: '00:1B:44:11:3A:B8',
          connected: true,
          uptime: '2 days, 3 hours',
          dataTransferred: '120.5 GB',
          lastSeen: '2024-01-20 14:25:00',
          createdAt: '2024-01-10',
          comment: 'Business client - CBD Office'
        },
        {
          id: 3,
          username: 'client003',
          service: 'pppoe-internet',
          profile: '1Mbps',
          status: 'disabled',
          ipAddress: '192.168.88.103',
          macAddress: '00:1B:44:11:3A:B9',
          connected: false,
          uptime: '0 days, 0 hours',
          dataTransferred: '0 GB',
          lastSeen: '2024-01-19 18:45:00',
          createdAt: '2024-01-05',
          comment: 'Temporarily suspended - pending payment'
        },
        {
          id: 4,
          username: 'business001',
          service: 'pppoe-business',
          profile: '50Mbps',
          status: 'active',
          ipAddress: '192.168.88.104',
          macAddress: '00:1B:44:11:3A:BA',
          connected: true,
          uptime: '15 days, 6 hours',
          dataTransferred: '890.3 GB',
          lastSeen: '2024-01-20 14:28:00',
          createdAt: '2024-01-01',
          comment: 'Corporate client - Head Office'
        },
        {
          id: 5,
          username: 'guest001',
          service: 'pppoe-guest',
          profile: '1Mbps',
          status: 'active',
          ipAddress: '192.168.88.105',
          macAddress: '00:1B:44:11:3A:BB',
          connected: false,
          uptime: '0 days, 0 hours',
          dataTransferred: '2.1 GB',
          lastSeen: '2024-01-20 10:15:00',
          createdAt: '2024-01-18',
          comment: 'Temporary guest access'
        },
        {
          id: 6,
          username: 'voip001',
          service: 'pppoe-voip',
          profile: '1Mbps',
          status: 'active',
          ipAddress: '192.168.88.106',
          macAddress: '00:1B:44:11:3A:BC',
          connected: true,
          uptime: '30 days, 4 hours',
          dataTransferred: '15.8 GB',
          lastSeen: '2024-01-20 14:32:00',
          createdAt: '2023-12-20',
          comment: 'VoIP service client'
        }
      ];
      
      setClients(mockClients);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load PPPoE clients' });
    } finally {
      setIsLoading(false);
    }
  };

  const filterClients = () => {
    let filtered = clients;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.ipAddress.includes(searchTerm) ||
        client.macAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.comment?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    // Apply service filter
    if (serviceFilter !== 'all') {
      filtered = filtered.filter(client => client.service === serviceFilter);
    }

    setFilteredClients(filtered);
  };

  const handleSelectClient = (clientId) => {
    setSelectedClients(prev => {
      if (prev.includes(clientId)) {
        return prev.filter(id => id !== clientId);
      } else {
        return [...prev, clientId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(client => client.id));
    }
  };

  const handleRemoveSingle = (client) => {
    setClientToRemove(client);
    setBulkAction(false);
    setShowConfirmModal(true);
  };

  const handleRemoveBulk = () => {
    if (selectedClients.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one client to remove' });
      return;
    }
    
    setBulkAction(true);
    setShowConfirmModal(true);
  };

  const confirmRemoval = async () => {
    setIsLoading(true);
    try {
      if (bulkAction) {
        // Remove multiple clients
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const clientsToRemove = clients.filter(client => selectedClients.includes(client.id));
        const usernames = clientsToRemove.map(client => client.username).join(', ');
        
        setClients(prev => prev.filter(client => !selectedClients.includes(client.id)));
        
        setMessage({ 
          type: 'success', 
          text: `Successfully removed ${selectedClients.length} client(s): ${usernames}` 
        });
        
        setSelectedClients([]);
      } else {
        // Remove single client
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setClients(prev => prev.filter(client => client.id !== clientToRemove.id));
        
        setMessage({ 
          type: 'success', 
          text: `Successfully removed client: ${clientToRemove.username}` 
        });
        
        setClientToRemove(null);
      }
      
      // Log removal reason for audit
      if (removalReason) {
        console.log(`Removal reason: ${removalReason}`);
        // In real application, send this to your audit log API
      }
      
      setShowConfirmModal(false);
      setRemovalReason('');
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to remove client(s). Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceDisplayName = (service) => {
    const serviceNames = {
      'pppoe-internet': 'Internet',
      'pppoe-business': 'Business',
      'pppoe-voip': 'VoIP',
      'pppoe-guest': 'Guest'
    };
    return serviceNames[service] || service;
  };

  const getStatusDisplay = (client) => {
    if (client.status === 'disabled') {
      return { text: 'Disabled', class: 'disabled' };
    }
    return client.connected 
      ? { text: 'Connected', class: 'connected' }
      : { text: 'Not Connected', class: 'inactive' };
  };

  // Calculate statistics
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    disabled: clients.filter(c => c.status === 'disabled').length,
    connected: clients.filter(c => c.connected).length,
    internet: clients.filter(c => c.service === 'pppoe-internet').length,
    business: clients.filter(c => c.service === 'pppoe-business').length
  };

  if (isLoading && clients.length === 0) {
    return (
      <div className="page-card">
        <div className="loading-center">
          <div className="spinner-large"></div>
          <p>Loading PPPoE clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-card">
      <div className="page-header">
        <h1>Remove PPPoE Client</h1>
        <p>Manage and remove Point-to-Point Protocol over Ethernet client accounts</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
          <button 
            className="alert-close" 
            onClick={() => setMessage({ type: '', text: '' })}
          >
            ×
          </button>
        </div>
      )}

      {/* Statistics Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Clients</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.active}</h3>
            <p>Active Clients</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-info">
            <h3>{stats.connected}</h3>
            <p>Connected Now</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats.business}</h3>
            <p>Business Clients</p>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="controls-bar">
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search clients by username, IP, or MAC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
          
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Services</option>
            <option value="pppoe-internet">Internet</option>
            <option value="pppoe-business">Business</option>
            <option value="pppoe-voip">VoIP</option>
            <option value="pppoe-guest">Guest</option>
          </select>
        </div>

        <div className="bulk-actions">
          <span className="selected-count">
            {selectedClients.length} selected
          </span>
          <button
            className="btn-danger"
            onClick={handleRemoveBulk}
            disabled={selectedClients.length === 0 || isLoading}
          >
            🗑️ Remove Selected ({selectedClients.length})
          </button>
        </div>
      </div>

      {/* Clients Table */}
      <div className="clients-list">
        <div className="card">
          <div className="card-header">
            <h2>PPPoE Clients ({filteredClients.length})</h2>
            <p>Select clients to remove or manage individually</p>
          </div>

          {filteredClients.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No clients found</h3>
              <p>
                {searchTerm || statusFilter !== 'all' || serviceFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'No PPPoE clients configured'
                }
              </p>
            </div>
          ) : (
            <div className="table-container">
              <table className="clients-table">
                <thead>
                  <tr>
                    <th className="select-column">
                      <input
                        type="checkbox"
                        checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                        onChange={handleSelectAll}
                        className="select-all-checkbox"
                      />
                    </th>
                    <th>Username</th>
                    <th>Service Type</th>
                    <th>IP Address</th>
                    <th>Status</th>
                    <th>Uptime</th>
                    <th>Data Transferred</th>
                    <th>Last Seen</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map(client => {
                    const statusInfo = getStatusDisplay(client);
                    return (
                      <tr key={client.id} className={client.status}>
                        <td className="select-column">
                          <input
                            type="checkbox"
                            checked={selectedClients.includes(client.id)}
                            onChange={() => handleSelectClient(client.id)}
                            className="client-checkbox"
                          />
                        </td>
                        <td>
                          <div className="client-username">
                            <strong>{client.username}</strong>
                            {client.comment && (
                              <small>{client.comment}</small>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`service-badge service-${client.service}`}>
                            {getServiceDisplayName(client.service)}
                          </span>
                          <small>{client.profile}</small>
                        </td>
                        <td className="ip-cell">
                          <code>{client.ipAddress}</code>
                          <small>{client.macAddress}</small>
                        </td>
                        <td>
                          <span className={`status-badge status-${statusInfo.class}`}>
                            {statusInfo.text}
                          </span>
                        </td>
                        <td className="uptime-cell">{client.uptime}</td>
                        <td className="data-cell">{client.dataTransferred}</td>
                        <td className="last-seen-cell">{client.lastSeen}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon remove"
                              onClick={() => handleRemoveSingle(client)}
                              title="Remove this client"
                              disabled={isLoading}
                            >
                              🗑️ Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Removal Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content danger-modal">
            <div className="modal-header">
              <h2>
                {bulkAction 
                  ? `Remove ${selectedClients.length} Client(s)` 
                  : `Remove Client: ${clientToRemove?.username}`
                }
              </h2>
              <button
                className="close-btn"
                onClick={() => {
                  setShowConfirmModal(false);
                  setRemovalReason('');
                }}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="warning-section">
                <div className="warning-icon">⚠️</div>
                <div className="warning-content">
                  <h3>This action cannot be undone</h3>
                  <p>
                    {bulkAction 
                      ? `You are about to permanently remove ${selectedClients.length} PPPoE client(s). This will:` 
                      : `You are about to permanently remove the PPPoE client "${clientToRemove?.username}". This will:`
                    }
                  </p>
                  <ul>
                    <li>Immediately disconnect the client if connected</li>
                    <li>Remove all configuration settings</li>
                    <li>Free up the IP address for reuse</li>
                    <li>Delete the client from the PPPoE server</li>
                    <li>Remove any associated billing information</li>
                  </ul>
                </div>
              </div>

              {bulkAction && (
                <div className="clients-to-remove">
                  <h4>Clients to be removed:</h4>
                  <div className="clients-list">
                    {clients
                      .filter(client => selectedClients.includes(client.id))
                      .map(client => (
                        <div key={client.id} className="client-item">
                          <strong>{client.username}</strong>
                          <span>{client.ipAddress}</span>
                          <span className={`status-badge status-${getStatusDisplay(client).class}`}>
                            {getStatusDisplay(client).text}
                          </span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}

              <div className="removal-reason">
                <label>Reason for removal (optional):</label>
                <select
                  value={removalReason}
                  onChange={(e) => setRemovalReason(e.target.value)}
                  className="reason-select"
                >
                  <option value="">Select a reason...</option>
                  {removalReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
                {removalReason === 'Other' && (
                  <input
                    type="text"
                    placeholder="Please specify..."
                    className="reason-input"
                  />
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowConfirmModal(false);
                  setRemovalReason('');
                }}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={confirmRemoval}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Removing...
                  </>
                ) : (
                  `Yes, Remove ${bulkAction ? selectedClients.length + ' Client(s)' : 'Client'}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Important Notes */}
      <div className="notes-section">
        <div className="card notes-card">
          <div className="card-header">
            <h3>📋 Important Notes</h3>
          </div>
          <ul className="notes-list">
            <li>Removing a client is permanent and cannot be undone</li>
            <li>Connected clients will be immediately disconnected</li>
            <li>Consider disabling clients instead of removing for temporary suspensions</li>
            <li>Removed clients' IP addresses will be available for new clients</li>
            <li>Always document the reason for removal for audit purposes</li>
            <li>Notify affected clients before removal when possible</li>
          </ul>
        </div>
      </div>
    </div>
  );
}