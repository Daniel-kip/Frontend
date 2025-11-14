import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import './Profile.css';

export default function MyProfile() {
  const { user, updateLastLoginTime } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    bio: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || 'DelTech Networks',
        position: user.position || '',
        bio: user.bio || ''
      });
      setProfileImagePreview(user.profileImage || '');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select a valid image file' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
        return;
      }

      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Here you would typically send the data to your backend
      console.log('Updating profile:', { ...formData, profileImage });

      setMessage({ 
        type: 'success', 
        text: 'Profile updated successfully!' 
      });

      // Update last login time
      updateLastLoginTime();

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to update profile. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      e.target.reset();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update password' });
    } finally {
      setIsLoading(false);
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfileImagePreview('');
  };

  return (
    <div className="page-card">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account settings and preferences</p>
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

      <div className="profile-content">
        {/* Sidebar Navigation */}
        <div className="profile-sidebar">
          <div className="sidebar-section">
            <h3>Account Settings</h3>
            <nav className="sidebar-nav">
              <button 
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                👤 Profile Information
              </button>
              <button 
                className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                🔒 Security & Password
              </button>
              <button 
                className={`nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                ⚙️ Preferences
              </button>
            </nav>
          </div>

          {/* Account Stats */}
          <div className="sidebar-section">
            <h3>Account Overview</h3>
            <div className="account-stats">
              <div className="stat-item">
                <span className="stat-label">Member Since</span>
                <span className="stat-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2024'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Last Login</span>
                <span className="stat-value">
                  {user?.lastLoginTime ? new Date(user.lastLoginTime).toLocaleDateString() : 'Recently'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Role</span>
                <span className="stat-value">{user?.role || 'User'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Profile Information</h2>
                <p>Update your personal details and profile picture</p>
              </div>

              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-section">
                  <h3>Profile Picture</h3>
                  <div className="profile-image-section">
                    <div className="image-preview">
                      {profileImagePreview ? (
                        <img src={profileImagePreview} alt="Profile preview" />
                      ) : (
                        <div className="image-placeholder">
                          <span>👤</span>
                        </div>
                      )}
                    </div>
                    <div className="image-actions">
                      <label className="btn-secondary">
                        📷 Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
                        />
                      </label>
                      {profileImagePreview && (
                        <button
                          type="button"
                          className="btn-outline"
                          onClick={removeProfileImage}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <small className="helper-text">
                      Recommended: Square image, at least 200x200 pixels, max 5MB
                    </small>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Personal Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="fullName" className="required">Full Name</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="required">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+254 XXX XXX XXX"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="company">Company</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Your company name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="position">Position</label>
                      <input
                        type="text"
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        placeholder="Your job title"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us a little about yourself..."
                      rows="4"
                      maxLength="500"
                    />
                    <small className="helper-text">
                      {formData.bio.length}/500 characters
                    </small>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner"></span>
                        Updating Profile...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security & Password Tab */}
          {activeTab === 'security' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Security & Password</h2>
                <p>Change your password and manage security settings</p>
              </div>

              <form onSubmit={handlePasswordChange} className="security-form">
                <div className="form-section">
                  <h3>Change Password</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="currentPassword" className="required">Current Password</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        placeholder="Enter current password"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="newPassword" className="required">New Password</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        placeholder="Enter new password"
                        required
                        minLength="8"
                      />
                      <small className="helper-text">
                        Must be at least 8 characters long
                      </small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword" className="required">Confirm New Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner"></span>
                        Updating Password...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </button>
                </div>
              </form>

              <div className="security-features">
                <h3>Security Features</h3>
                <div className="feature-list">
                  <div className="feature-item">
                    <div className="feature-info">
                      <h4>Two-Factor Authentication</h4>
                      <p>Add an extra layer of security to your account</p>
                    </div>
                    <button className="btn-outline">Enable</button>
                  </div>
                  
                  <div className="feature-item">
                    <div className="feature-info">
                      <h4>Login Notifications</h4>
                      <p>Get notified of new sign-ins to your account</p>
                    </div>
                    <button className="btn-outline">Enable</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Preferences</h2>
                <p>Customize your experience and notification settings</p>
              </div>

              <div className="preferences-form">
                <div className="form-section">
                  <h3>Notification Preferences</h3>
                  <div className="preference-options">
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
                      <span className="checkmark"></span>
                      Email notifications for new invoices
                    </label>
                    
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
                      <span className="checkmark"></span>
                      SMS alerts for service updates
                    </label>
                    
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      Marketing and promotional emails
                    </label>
                    
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
                      <span className="checkmark"></span>
                      Payment reminders and due dates
                    </label>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Interface Preferences</h3>
                  <div className="form-group">
                    <label htmlFor="theme">Theme</label>
                    <select id="theme" defaultValue="light">
                      <option value="light">Light Mode</option>
                      <option value="dark">Dark Mode</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="timezone">Timezone</label>
                    <select id="timezone" defaultValue="Africa/Nairobi">
                      <option value="Africa/Nairobi">East Africa Time (EAT)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn-primary">Save Preferences</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}