import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import MainLayout from './layout/MainLayout';
import LoadingScreen from './Components/LoadingScreen';
import { testBackendConnection } from './api/axiosConfig'; // Import the test function

// Pages
import Home from './pages/home/Home';
import ConnectedDevices from './pages/connected/ConnectedDevices';
import Mikrotiks from './pages/connected/Mikrotiks';
import AddStation from './pages/connected/AddStation';
import HotspotStations from './pages/hotspot/HotspotStations';
import ModifyHotspot from './pages/hotspot/ModifyHotspot';
import CompensateClients from './pages/hotspot/CompensateClients';
import GenerateVoucher from './pages/hotspot/compensate/GenerateVoucher';
import AddVoucherTime from './pages/hotspot/compensate/AddVoucherTime';
import UpdateVoucherTime from './pages/hotspot/compensate/UpdateVoucherTime';
import PPPoE from './pages/pppoe/PPPoE';
import UpdatePPPoETime from './pages/pppoe/UpdatePPPoETime';
import RemovePPPoE from './pages/pppoe/RemovePPPoE';
import AddPPPoE from './pages/pppoe/AddPPPoE';
import BulkSMS from './pages/bulksms/BulkSMS';
import DTNPay from './pages/dtnpay/DTNPay';
import LinkPaymentAccount from './pages/dtnpay/LinkPaymentAccount';
import AddAccount from './pages/dtnpay/AddAccount';
import RemoveAccount from './pages/dtnpay/RemoveAccount';
import AddedAccounts from './pages/dtnpay/AddedAccounts';
import TestHotspotWallet from './pages/dtnpay/TestHotspotWallet';
import TestPayment from './pages/dtnpay/TestPayment';
import APIKey from './pages/dtnpay/APIKey';
import MyInvoices from './pages/account/MyInvoices';
import MyProfile from './pages/account/MyProfile';
import Settings from './pages/settings/Settings';

// Auth pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';

function AppRoutes() {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const [appLoading, setAppLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'connected', 'error'

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Starting app initialization...');
        
        // First, test backend connection
        console.log(' Testing backend connection...');
        const isBackendConnected = await testBackendConnection();
        
        if (!isBackendConnected) {
          setBackendStatus('error');
          console.error(' Backend connection failed');
          // Continue with app loading but show error state
        } else {
          setBackendStatus('connected');
          console.log(' Backend connection successful');
        }

        // Check authentication status
        console.log(' Checking authentication status...');
        await checkAuthStatus();
        
        // Simulate minimum app loading time (2-3 seconds)
        console.log('Simulating loading time...');
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
        
        console.log(' App initialization complete');
      } catch (error) {
        console.error(' App initialization error:', error);
        setBackendStatus('error');
      } finally {
        setAppLoading(false);
      }
    };

    initializeApp();
  }, [checkAuthStatus]);

  // Show loading screen while app is initializing
  if (appLoading) {
    return <LoadingScreen />;
  }

  // Show backend connection error (optional - you can remove this if you want to proceed anyway)
  if (backendStatus === 'error') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0f0f1f',
        color: 'white',
        fontFamily: 'Segoe UI, sans-serif',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
        <h1 style={{ color: '#e46033', marginBottom: '10px' }}>Connection Error</h1>
        <p style={{ marginBottom: '20px', maxWidth: '500px' }}>
          Unable to connect to the backend server. Please check if the backend is running and try again.
        </p>
        <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '30px' }}>
          <p>Expected backend URL: {process.env.REACT_APP_API_URL || 'http://localhost:5031/api'}</p>
          <p>Make sure the backend server is running on port 5031</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#e46033',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout backendStatus={backendStatus} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="connected-devices" element={<ConnectedDevices />} />
        <Route path="connected-devices/mikrotiks" element={<Mikrotiks />} />
        <Route path="connected-devices/add-station" element={<AddStation />} />
        <Route path="hotspot/stations" element={<HotspotStations />} />
        <Route path="hotspot/modify-packages" element={<ModifyHotspot />} />
        <Route path="hotspot/compensate" element={<CompensateClients />} />
        <Route path="hotspot/compensate/generate-voucher" element={<GenerateVoucher />} />
        <Route path="hotspot/compensate/add-voucher-time" element={<AddVoucherTime />} />
        <Route path="hotspot/compensate/update-voucher-time" element={<UpdateVoucherTime />} />
        <Route path="pppoe" element={<PPPoE />} />
        <Route path="pppoe/update-time" element={<UpdatePPPoETime />} />
        <Route path="pppoe/remove" element={<RemovePPPoE />} />
        <Route path="pppoe/add" element={<AddPPPoE />} />
        <Route path="bulksms" element={<BulkSMS />} />
        <Route path="dtnpay" element={<DTNPay />} />
        <Route path="dtnpay/link-account" element={<LinkPaymentAccount />} />
        <Route path="dtnpay/link-account/add" element={<AddAccount />} />
        <Route path="dtnpay/link-account/remove" element={<RemoveAccount />} />
        <Route path="dtnpay/link-account/list" element={<AddedAccounts />} />
        <Route path="dtnpay/test-wallet" element={<TestHotspotWallet />} />
        <Route path="dtnpay/test-wallet/test" element={<TestPayment />} />
        <Route path="dtnpay/test-wallet/apikey" element={<APIKey />} />
        <Route path="account/invoices" element={<MyInvoices />} />
        <Route path="account/profile" element={<MyProfile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}