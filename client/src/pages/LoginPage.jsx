import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import api from '../services/api';
import {
  Sprout,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const LoginPage = ({ navigate }) => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useNotifications();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetStep, setResetStep] = useState(1); // 1: enter email, 2: reset with token

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!emailOrPhone.trim()) {
      setErrorMessage('Please enter your registered email address or mobile number.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setLoading(true);
    try {
      const data = await login(emailOrPhone.trim(), password);
      showToast(data.message || 'Login successful!', 'success');
      
      // Navigate to corresponding dashboard
      if (data.user?.role === 'admin') navigate('admin-dashboard');
      else if (data.user?.role === 'librarian') navigate('librarian-dashboard');
      else navigate('farmer-dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Invalid credentials. Please verify and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo Autofill Helper for Evaluators
  const handleAutofill = (email, pass) => {
    setEmailOrPhone(email);
    setPassword(pass);
    setErrorMessage('');
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email: forgotEmail });
      if (res.success) {
        setResetToken(res.resetToken);
        setResetStep(2);
        showToast('Password reset token generated!', 'info');
      }
    } catch (err) {
      showToast(err.message || 'No account with this email was found.', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    setForgotLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        token: resetToken,
        newPassword,
        confirmPassword: confirmNewPassword,
      });
      if (res.success) {
        showToast('Password successfully reset! Please log in.', 'success');
        setForgotModalOpen(false);
        setResetStep(1);
        setPassword(newPassword);
      }
    } catch (err) {
      showToast(err.message || 'Password reset failed.', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '480px',
      margin: '20px auto 40px',
      padding: '0 12px',
    }}>
      <div className="card" style={{ padding: '36px 32px' }}>
        {/* Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: '#164B35',
            color: '#D9A441',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 6px 16px rgba(22, 75, 53, 0.25)',
          }}>
            <Sprout size={32} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#164B35', marginBottom: '6px' }}>
            Welcome to Seed Vault
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7280' }}>
            Enter your credentials to access the Village Seed Library portal
          </p>
        </div>

        {/* Demo Fast-Login Autofill (For B.Tech CSE PBL Evaluation) */}
        <div style={{
          backgroundColor: '#F7F5EA',
          border: '1.5px dashed #D9A441',
          borderRadius: '10px',
          padding: '12px 14px',
          marginBottom: '22px',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#92400E', textTransform: 'uppercase', marginBottom: '8px' }}>
            ⚡ PBL Demo Fast-Login Accounts:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button
              type="button"
              onClick={() => handleAutofill('admin@seedvault.org', 'Admin@123')}
              style={demoPillStyle}
            >
              👑 Admin Officer
            </button>
            <button
              type="button"
              onClick={() => handleAutofill('librarian@seedvault.org', 'Librarian@123')}
              style={demoPillStyle}
            >
              📚 Seed Librarian
            </button>
            <button
              type="button"
              onClick={() => handleAutofill('farmer@seedvault.org', 'Farmer@123')}
              style={demoPillStyle}
            >
              🌾 Village Farmer
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            backgroundColor: '#FEE2E2',
            color: '#991B1B',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '18px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid #FCA5A5',
          }}>
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address or Mobile Number</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. farmer@seedvault.org or 9876543210"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
              <Mail
                size={18}
                color="#9CA3AF"
                style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                style={{ background: 'none', color: '#164B35', fontSize: '12px', fontWeight: 600 }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                required
              />
              <Lock
                size={18}
                color="#9CA3AF"
                style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '12px',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  color: '#6B7280',
                  padding: '2px',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '22px',
            fontSize: '13px',
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#4B5563' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#164B35', width: '16px', height: '16px' }}
              />
              <span>Remember me on this device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginBottom: '20px' }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Login to Seed Vault</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          fontSize: '13px',
          color: '#6B7280',
          borderTop: '1px solid #E5E7EB',
          paddingTop: '18px',
        }}>
          New to the village seed library?{' '}
          <button
            type="button"
            onClick={() => navigate('register')}
            style={{ background: 'none', color: '#164B35', fontWeight: 700 }}
          >
            Create an Account
          </button>
        </div>
      </div>

      {/* Forgot / Reset Password Modal */}
      {forgotModalOpen && (
        <div className="modal-overlay" onClick={() => setForgotModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#164B35', marginBottom: '8px' }}>
              {resetStep === 1 ? 'Password Recovery' : 'Reset Account Password'}
            </h3>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
              {resetStep === 1
                ? 'Enter your registered email address to receive a secure password reset token.'
                : 'Enter your new account password to complete password reset.'}
            </p>

            {resetStep === 1 ? (
              <form onSubmit={handleForgotPasswordSubmit}>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Registered Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. farmer@seedvault.org"
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    {forgotLoading ? 'Processing...' : 'Generate Token'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit}>
                <div style={{ backgroundColor: '#F0FDF4', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', color: '#166534', marginBottom: '14px' }}>
                  Reset token validated for demo evaluation: <code style={{ fontWeight: 700 }}>{resetToken.slice(0, 10)}...</code>
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    {forgotLoading ? 'Resetting...' : 'Save New Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const demoPillStyle = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #D9A441',
  color: '#92400E',
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: 700,
  cursor: 'pointer',
};

