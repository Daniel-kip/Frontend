import React, { useState, useEffect } from 'react';
import './Invoices.css';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 10;

  // Mock data - replace with actual API call
  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock invoice data
      const mockInvoices = [
        {
          id: 'INV-2024-001',
          clientName: 'John Doe',
          clientEmail: 'john.doe@email.com',
          service: 'PPPoE Internet',
          package: '10Mbps Premium',
          amount: 2000,
          dueDate: '2024-02-15',
          issueDate: '2024-01-20',
          status: 'paid',
          paymentMethod: 'M-Pesa',
          transactionId: 'MP123456789',
          items: [
            { description: 'Monthly Internet Subscription - 10Mbps', amount: 2000 }
          ]
        },
        {
          id: 'INV-2024-002',
          clientName: 'Business Solutions Ltd',
          clientEmail: 'accounts@businesssolutions.co.ke',
          service: 'Business Fiber',
          package: '50Mbps Dedicated',
          amount: 15000,
          dueDate: '2024-02-20',
          issueDate: '2024-01-22',
          status: 'pending',
          paymentMethod: '',
          transactionId: '',
          items: [
            { description: 'Business Fiber - 50Mbps Dedicated', amount: 15000 }
          ]
        },
        {
          id: 'INV-2024-003',
          clientName: 'Sarah Johnson',
          clientEmail: 'sarah.j@email.com',
          service: 'PPPoE Internet',
          package: '5Mbps Standard',
          amount: 1200,
          dueDate: '2024-02-10',
          issueDate: '2024-01-18',
          status: 'overdue',
          paymentMethod: '',
          transactionId: '',
          items: [
            { description: 'Monthly Internet Subscription - 5Mbps', amount: 1200 }
          ]
        },
        {
          id: 'INV-2024-004',
          clientName: 'Tech Hub Nairobi',
          clientEmail: 'admin@techhub.co.ke',
          service: 'Co-working Internet',
          package: '100Mbps Shared',
          amount: 25000,
          dueDate: '2024-02-28',
          issueDate: '2024-01-25',
          status: 'paid',
          paymentMethod: 'Bank Transfer',
          transactionId: 'BT987654321',
          items: [
            { description: 'Co-working Space Internet - 100Mbps', amount: 25000 }
          ]
        },
        {
          id: 'INV-2024-005',
          clientName: 'Mike Omondi',
          clientEmail: 'mike.omondi@email.com',
          service: 'PPPoE Internet',
          package: '2Mbps Basic',
          amount: 800,
          dueDate: '2024-02-05',
          issueDate: '2024-01-15',
          status: 'pending',
          paymentMethod: '',
          transactionId: '',
          items: [
            { description: 'Monthly Internet Subscription - 2Mbps', amount: 800 }
          ]
        }
      ];
      
      setInvoices(mockInvoices);
      setFilteredInvoices(mockInvoices);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter invoices based on search and filters
  useEffect(() => {
    let filtered = invoices;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      filtered = filtered.filter(invoice => {
        const dueDate = new Date(invoice.dueDate);
        switch (dateFilter) {
          case 'today':
            return dueDate.toDateString() === today.toDateString();
          case 'week':
            const weekFromNow = new Date(today);
            weekFromNow.setDate(today.getDate() + 7);
            return dueDate <= weekFromNow && dueDate >= today;
          case 'overdue':
            return dueDate < today && invoice.status !== 'paid';
          default:
            return true;
        }
      });
    }

    setFilteredInvoices(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [invoices, searchTerm, statusFilter, dateFilter]);

  // Calculate statistics
  const stats = {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    pending: invoices.filter(inv => inv.status === 'pending').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    totalRevenue: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0),
    pendingRevenue: invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0)
  };

  // Pagination
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleSendReminder = (invoiceId) => {
    // Implement send reminder logic
    console.log('Sending reminder for invoice:', invoiceId);
    alert(`Payment reminder sent for ${invoiceId}`);
  };

  const handleMarkAsPaid = (invoiceId) => {
    // Implement mark as paid logic
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId ? { ...inv, status: 'paid' } : inv
    ));
    alert(`Invoice ${invoiceId} marked as paid`);
  };

  const handleDownloadInvoice = (invoice) => {
    // Implement download logic
    console.log('Downloading invoice:', invoice.id);
    alert(`Downloading invoice ${invoice.id}`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { class: 'paid', label: 'Paid' },
      pending: { class: 'pending', label: 'Pending' },
      overdue: { class: 'overdue', label: 'Overdue' }
    };
    
    const config = statusConfig[status] || { class: 'pending', label: 'Pending' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="page-card">
        <div className="loading-center">
          <div className="spinner-large"></div>
          <p>Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-card">
      <div className="page-header">
        <h1>Invoice Management</h1>
        <p>View and manage client invoices and payments</p>
      </div>

      {/* Statistics Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Invoices</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.paid}</h3>
            <p>Paid Invoices</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="controls-bar">
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by invoice ID, client name, or email..."
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
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
          
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Dates</option>
            <option value="today">Due Today</option>
            <option value="week">Due This Week</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <button className="btn-primary" onClick={() => alert('Generate new invoice feature coming soon!')}>
          + Generate Invoice
        </button>
      </div>

      {/* Invoices Table */}
      <div className="invoices-list">
        <div className="card">
          <div className="card-header">
            <h2>Invoices ({filteredInvoices.length})</h2>
            <p>Manage client invoices and track payments</p>
          </div>

          {filteredInvoices.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h3>No invoices found</h3>
              <p>
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'No invoices have been generated yet'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && dateFilter === 'all' && (
                <button className="btn-primary" onClick={() => alert('Generate new invoice')}>
                  Create First Invoice
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="table-container">
                <table className="invoices-table">
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Client</th>
                      <th>Service</th>
                      <th>Amount</th>
                      <th>Issue Date</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInvoices.map(invoice => (
                      <tr key={invoice.id} className={invoice.status}>
                        <td>
                          <div className="invoice-id">
                            <strong>{invoice.id}</strong>
                          </div>
                        </td>
                        <td>
                          <div className="client-info">
                            <strong>{invoice.clientName}</strong>
                            <small>{invoice.clientEmail}</small>
                          </div>
                        </td>
                        <td>
                          <div className="service-info">
                            <span>{invoice.service}</span>
                            <small>{invoice.package}</small>
                          </div>
                        </td>
                        <td className="amount-cell">
                          <strong>{formatCurrency(invoice.amount)}</strong>
                        </td>
                        <td className="date-cell">{formatDate(invoice.issueDate)}</td>
                        <td className="date-cell">
                          <div className={`due-date ${invoice.status === 'overdue' ? 'overdue' : ''}`}>
                            {formatDate(invoice.dueDate)}
                          </div>
                        </td>
                        <td>
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon view"
                              onClick={() => handleViewInvoice(invoice)}
                              title="View Invoice"
                            >
                              👁️
                            </button>
                            <button
                              className="btn-icon download"
                              onClick={() => handleDownloadInvoice(invoice)}
                              title="Download Invoice"
                            >
                              📥
                            </button>
                            {invoice.status !== 'paid' && (
                              <button
                                className="btn-icon reminder"
                                onClick={() => handleSendReminder(invoice.id)}
                                title="Send Reminder"
                              >
                                🔔
                              </button>
                            )}
                            {invoice.status === 'pending' && (
                              <button
                                className="btn-icon paid"
                                onClick={() => handleMarkAsPaid(invoice.id)}
                                title="Mark as Paid"
                              >
                                ✅
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  
                  <div className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="modal-overlay">
          <div className="modal-content invoice-modal">
            <div className="modal-header">
              <h2>Invoice Details - {selectedInvoice.id}</h2>
              <button
                className="close-btn"
                onClick={() => setShowInvoiceModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="invoice-details">
                <div className="invoice-header">
                  <div className="invoice-meta">
                    <div className="meta-item">
                      <label>Client:</label>
                      <span>{selectedInvoice.clientName}</span>
                    </div>
                    <div className="meta-item">
                      <label>Email:</label>
                      <span>{selectedInvoice.clientEmail}</span>
                    </div>
                    <div className="meta-item">
                      <label>Service:</label>
                      <span>{selectedInvoice.service} - {selectedInvoice.package}</span>
                    </div>
                  </div>
                  <div className="invoice-status">
                    {getStatusBadge(selectedInvoice.status)}
                  </div>
                </div>

                <div className="invoice-dates">
                  <div className="date-item">
                    <label>Issue Date:</label>
                    <span>{formatDate(selectedInvoice.issueDate)}</span>
                  </div>
                  <div className="date-item">
                    <label>Due Date:</label>
                    <span className={selectedInvoice.status === 'overdue' ? 'overdue' : ''}>
                      {formatDate(selectedInvoice.dueDate)}
                    </span>
                  </div>
                </div>

                <div className="invoice-items">
                  <h4>Invoice Items</h4>
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.description}</td>
                          <td>{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td><strong>Total</strong></td>
                        <td><strong>{formatCurrency(selectedInvoice.amount)}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {selectedInvoice.status === 'paid' && (
                  <div className="payment-details">
                    <h4>Payment Details</h4>
                    <div className="payment-info">
                      <div className="payment-item">
                        <label>Payment Method:</label>
                        <span>{selectedInvoice.paymentMethod}</span>
                      </div>
                      <div className="payment-item">
                        <label>Transaction ID:</label>
                        <span>{selectedInvoice.transactionId}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowInvoiceModal(false)}
              >
                Close
              </button>
              <button
                className="btn-primary"
                onClick={() => handleDownloadInvoice(selectedInvoice)}
              >
                Download Invoice
              </button>
              {selectedInvoice.status !== 'paid' && (
                <button
                  className="btn-success"
                  onClick={() => handleMarkAsPaid(selectedInvoice.id)}
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}