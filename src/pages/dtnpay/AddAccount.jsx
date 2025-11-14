import React, { useState } from 'react';
import './AddAccount.css';

export default function AddAccount() {
  const [formData, setFormData] = useState({
    accountType: 'mpesa',
    accountName: '',
    phoneNumber: '',
    accountNumber: '',
    bankName: '',
    branchCode: '',
    swiftCode: '',
    currency: 'KES',
    isDefault: false,
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [currentStep, setCurrentStep] = useState(1);

  const accountTypes = [
    { value: 'mpesa', label: 'M-Pesa', icon: '📱', description: 'Mobile money wallet' },
    { value: 'bank', label: 'Bank Account', icon: '🏦', description: 'Traditional bank account' },
    { value: 'airtel', label: 'Airtel Money', icon: '📶', description: 'Airtel mobile money' },
    { value: 'paypal', label: 'PayPal', icon: '🌐', description: 'International payments' }
  ];

  const banks = [
    { value: '', label: 'Select Bank' },
    { value: 'equity', label: 'Equity Bank' },
    { value: 'kcb', label: 'KCB Bank' },
    { value: 'coop', label: 'Co-operative Bank' },
    { value: 'barclays', label: 'Absa Bank Kenya' },
    { value: 'standard', label: 'Standard Chartered' },
    { value: 'dtb', label: 'Diamond Trust Bank' },
    { value: 'ncba', label: 'NCBA Bank' },
    { value: 'cba', label: 'Commercial Bank of Africa' }
  ];

  const currencies = [
    { value: 'KES', label: 'Kenyan Shilling (KES)' },
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateStep1 = () => {
    if (!formData.accountType) {
      setMessage({ type: 'error', text: 'Please select an account type' });
      return false;
    }
    if (!formData.accountName.trim()) {
      setMessage({ type: 'error', text: 'Account name is required' });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.accountType === 'mpesa' || formData.accountType === 'airtel') {
      if (!formData.phoneNumber.trim()) {
        setMessage({ type: 'error', text: 'Phone number is required for mobile money' });
        return false;
      }
      if (!/^\+?254\d{9}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
        setMessage({ type: 'error', text: 'Please enter a valid Kenyan phone number (e.g., 254712345678)' });
        return false;
      }
    } else if (formData.accountType === 'bank') {
      if (!formData.bankName) {
        setMessage({ type: 'error', text: 'Please select a bank' });
        return false;
      }
      if (!formData.accountNumber.trim()) {
        setMessage({ type: 'error', text: 'Account number is required' });
        return false;
      }
      if (!formData.branchCode.trim()) {
        setMessage({ type: 'error', text: 'Branch code is required' });
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      setMessage({ type: '', text: '' });
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
      setMessage({ type: '', text: '' });
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would typically send the data to your backend
      console.log('Adding account:', formData);

      setMessage({ 
        type: 'success', 
        text: 'Account added successfully! Redirecting to verification...' 
      });

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          accountType: 'mpesa',
          accountName: '',
          phoneNumber: '',
          accountNumber: '',
          bankName: '',
          branchCode: '',
          swiftCode: '',
          currency: 'KES',
          isDefault: false,
          description: ''
        });
        setCurrentStep(1);
        setMessage({ type: '', text: '' });
      }, 3000);

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to add account. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhoneNumber = (value) => {
    // Format phone number as user types
    const numbers = value.replace(/\D/g, '');
    if (numbers.startsWith('254')) {
      return `+${numbers}`;
    } else if (numbers.startsWith('0')) {
      return `+254${numbers.slice(1)}`;
    } else if (numbers.length > 0) {
      return `+254${numbers}`;
    }
    return value;
  };

  const getAccountTypeConfig = (type) => {
    return accountTypes.find(acc => acc.value === type) || accountTypes[0];
  };

  const isMobileMoney = formData.accountType === 'mpesa' || formData.accountType === 'airtel';
  const isBankAccount = formData.accountType === 'bank';
  const isInternational = formData.accountType === 'paypal';

  return (
    <div className="page-card">
      <div className="page-header">
        <h1>Add Payment Account</h1>
        <p>Link a new payment method to receive payments from clients</p>
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

      {/* Progress Steps */}
      <div className="progress-steps">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Account Type</div>
        </div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Account Details</div>
        </div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Confirmation</div>
        </div>
      </div>

      <div className="add-account-content">
        {/* Step 1: Account Type Selection */}
        {currentStep === 1 && (
          <div className="step-content">
            <div className="card">
              <div className="card-header">
                <h2>Select Account Type</h2>
                <p>Choose the type of payment account you want to add</p>
              </div>

              <div className="account-type-grid">
                {accountTypes.map(account => (
                  <div
                    key={account.value}
                    className={`account-type-card ${
                      formData.accountType === account.value ? 'selected' : ''
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, accountType: account.value }))}
                  >
                    <div className="account-icon">{account.icon}</div>
                    <div className="account-info">
                      <h3>{account.label}</h3>
                      <p>{account.description}</p>
                    </div>
                    <div className="selection-indicator">
                      {formData.accountType === account.value && '✓'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label className="required">Account Name</label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  placeholder="e.g., My M-Pesa, Business Account"
                  required
                />
                <small className="helper-text">
                  Give this account a recognizable name for easy identification
                </small>
              </div>

              <div className="step-actions">
                <button
                  className="btn-primary"
                  onClick={handleNextStep}
                >
                  Continue to Account Details →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Account Details */}
        {currentStep === 2 && (
          <div className="step-content">
            <div className="card">
              <div className="card-header">
                <h2>Account Details</h2>
                <p>Enter your {getAccountTypeConfig(formData.accountType).label} account information</p>
              </div>

              <form>
                {isMobileMoney && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="required">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value);
                          setFormData(prev => ({ ...prev, phoneNumber: formatted }));
                        }}
                        placeholder="+254 712 345 678"
                        required
                      />
                      <small className="helper-text">
                        Enter your {formData.accountType === 'mpesa' ? 'M-Pesa' : 'Airtel Money'} registered number
                      </small>
                    </div>
                  </div>
                )}

                {isBankAccount && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="required">Bank Name</label>
                      <select
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        required
                      >
                        {banks.map(bank => (
                          <option key={bank.value} value={bank.value}>
                            {bank.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="required">Account Number</label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        placeholder="e.g., 123456789"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="required">Branch Code</label>
                      <input
                        type="text"
                        name="branchCode"
                        value={formData.branchCode}
                        onChange={handleInputChange}
                        placeholder="e.g., 000"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>SWIFT/BIC Code</label>
                      <input
                        type="text"
                        name="swiftCode"
                        value={formData.swiftCode}
                        onChange={handleInputChange}
                        placeholder="e.g., BARCKENX"
                      />
                      <small className="helper-text">
                        Required for international transfers
                      </small>
                    </div>
                  </div>
                )}

                {isInternational && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="required">PayPal Email</label>
                      <input
                        type="email"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        placeholder="your-email@paypal.com"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="required">Currency</label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        required
                      >
                        {currencies.map(currency => (
                          <option key={currency.value} value={currency.value}>
                            {currency.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Description (Optional)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Add any notes about this account..."
                    rows="3"
                    maxLength="200"
                  />
                  <small className="helper-text">
                    {formData.description.length}/200 characters
                  </small>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                    Set as default payment account
                  </label>
                  <small className="helper-text">
                    This account will be used as the primary payment method for all transactions
                  </small>
                </div>
              </form>

              <div className="step-actions">
                <button
                  className="btn-secondary"
                  onClick={handlePreviousStep}
                >
                  ← Back
                </button>
                <button
                  className="btn-primary"
                  onClick={handleNextStep}
                >
                  Continue to Confirmation →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className="step-content">
            <div className="card">
              <div className="card-header">
                <h2>Confirm Account Details</h2>
                <p>Review your information before adding the account</p>
              </div>

              <div className="confirmation-details">
                <div className="detail-section">
                  <h3>Account Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Account Type:</label>
                      <span>{getAccountTypeConfig(formData.accountType).label}</span>
                    </div>
                    <div className="detail-item">
                      <label>Account Name:</label>
                      <span>{formData.accountName}</span>
                    </div>
                    {formData.description && (
                      <div className="detail-item">
                        <label>Description:</label>
                        <span>{formData.description}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <label>Default Account:</label>
                      <span>{formData.isDefault ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Account Details</h3>
                  <div className="detail-grid">
                    {isMobileMoney && (
                      <div className="detail-item">
                        <label>Phone Number:</label>
                        <span>{formData.phoneNumber}</span>
                      </div>
                    )}
                    {isBankAccount && (
                      <>
                        <div className="detail-item">
                          <label>Bank:</label>
                          <span>{banks.find(b => b.value === formData.bankName)?.label}</span>
                        </div>
                        <div className="detail-item">
                          <label>Account Number:</label>
                          <span>{formData.accountNumber}</span>
                        </div>
                        <div className="detail-item">
                          <label>Branch Code:</label>
                          <span>{formData.branchCode}</span>
                        </div>
                        {formData.swiftCode && (
                          <div className="detail-item">
                            <label>SWIFT Code:</label>
                            <span>{formData.swiftCode}</span>
                          </div>
                        )}
                      </>
                    )}
                    {isInternational && (
                      <>
                        <div className="detail-item">
                          <label>PayPal Email:</label>
                          <span>{formData.accountNumber}</span>
                        </div>
                        <div className="detail-item">
                          <label>Currency:</label>
                          <span>{formData.currency}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="security-notice">
                  <div className="security-icon">🔒</div>
                  <div className="security-content">
                    <h4>Secure & Encrypted</h4>
                    <p>Your account details are encrypted and stored securely. We never share your financial information with third parties.</p>
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button
                  className="btn-secondary"
                  onClick={handlePreviousStep}
                >
                  ← Back
                </button>
                <button
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Adding Account...
                    </>
                  ) : (
                    'Add Account'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="tips-section">
        <div className="card tips-card">
          <div className="card-header">
            <h3>💡 Payment Account Tips</h3>
          </div>
          <ul className="tips-list">
            <li>M-Pesa is recommended for quick payments in Kenya</li>
            <li>Bank accounts are better for large transactions</li>
            <li>Keep your account information up to date</li>
            <li>Set a default account for automatic payments</li>
            <li>Verify your account immediately after adding it</li>
          </ul>
        </div>
      </div>
    </div>
  );
}