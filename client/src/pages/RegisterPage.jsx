import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Sprout,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
} from 'lucide-react';

export const RegisterPage = ({ navigate }) => {
  const { register } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useNotifications();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    villageCity: '',
    district: '',
    state: 'Maharashtra',
    role: 'farmer', // Default to farmer; 'admin' disallowed
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, text: '', color: '#E5E7EB' };
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, text: 'Weak', color: '#DC2626' };
      case 2:
        return { score: 50, text: 'Fair', color: '#D97706' };
      case 3:
        return { score: 75, text: 'Good', color: '#2563EB' };
      case 4:
        return { score: 100, text: 'Strong', color: '#16A34A' };
      default:
        return { score: 0, text: '', color: '#E5E7EB' };
    }
  };

  const strength = calculatePasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    // Phone validation: exactly 10 digits
    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      setErrorMessage('Mobile number must be a valid 10-digit number (e.g. 9876543210).');
      return;
    }

    // Password length
    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    // Confirm password match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    // Terms accepted
    if (!formData.termsAccepted) {
      setErrorMessage('You must accept the Community Seed Library Terms & Conditions.');
      return;
    }

    // Disallow admin role
    if (formData.role === 'admin') {
      setErrorMessage('Security Policy: Administrator accounts cannot be created via public registration.');
      return;
    }

    setLoading(true);
    try {
      const res = await register(formData);
      showToast(res.message || 'Account created successfully! 50 Guardian Points awarded.', 'success');
      
      if (res.user?.role === 'librarian') navigate('librarian-dashboard');
      else navigate('farmer-dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Email or phone may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '620px',
      margin: '20px auto 50px',
      padding: '0 12px',
    }}>
      <div className="card" style={{ padding: '36px 32px' }}>
        {/* Header */}
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
            Register with Seed Vault
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7280' }}>
            Join your village seed library community and receive <strong>50 Seed Guardian Points</strong>!
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            backgroundColor: '#FEE2E2',
            color: '#991B1B',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '20px',
            border: '1px solid #FCA5A5',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                className="form-control"
                placeholder="e.g. Tukaram Shinde"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">10-Digit Mobile Number *</label>
              <input
                type="tel"
                name="phone"
                maxLength={10}
                className="form-control"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="e.g. farmer@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Location Fields */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '18px',
          }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Village / City *</label>
              <input
                type="text"
                name="villageCity"
                className="form-control"
                placeholder="Ralegan Siddhi"
                value={formData.villageCity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">District *</label>
              <input
                type="text"
                name="district"
                className="form-control"
                placeholder="Ahmednagar"
                value={formData.district}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">State *</label>
              <input
                type="text"
                name="state"
                className="form-control"
                placeholder="Maharashtra"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Role Selection (Only Permitted Public Roles) */}
          <div className="form-group">
            <label className="form-label">Account Role *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                border: formData.role === 'farmer' ? '2px solid #164B35' : '1px solid #D1D5DB',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: formData.role === 'farmer' ? '#EBF2E9' : '#FFFFFF',
              }}>
                <input
                  type="radio"
                  name="role"
                  value="farmer"
                  checked={formData.role === 'farmer'}
                  onChange={handleChange}
                  style={{ accentColor: '#164B35' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#164B35' }}>
                    🌾 Farmer / Member
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>
                    Borrow, grow, deposit, track garden
                  </div>
                </div>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                border: formData.role === 'librarian' ? '2px solid #164B35' : '1px solid #D1D5DB',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: formData.role === 'librarian' ? '#EBF2E9' : '#FFFFFF',
              }}>
                <input
                  type="radio"
                  name="role"
                  value="librarian"
                  checked={formData.role === 'librarian'}
                  onChange={handleChange}
                  style={{ accentColor: '#164B35' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#164B35' }}>
                    📚 Seed Librarian
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>
                    Manage stock, process loans & returns
                  </div>
                </div>
              </label>
            </div>
            <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
              * Security rule: Administrator accounts are provisioned via backend database initialization only.
            </p>
          </div>

          {/* Password & Confirm */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-control"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
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
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength meter */}
              {formData.password && (
                <div style={{ marginTop: '6px' }}>
                  <div style={{ height: '4px', backgroundColor: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${strength.score}%`,
                      height: '100%',
                      backgroundColor: strength.color,
                      transition: 'width 0.25s ease',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginTop: '3px', color: strength.color, fontWeight: 700 }}>
                    <span>Strength</span>
                    <span>{strength.text}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                className="form-control"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#4B5563' }}>
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                style={{ accentColor: '#164B35', width: '18px', height: '18px', marginTop: '2px' }}
                required
              />
              <span>
                I agree to the <strong>Village Seed Library Terms & Conditions</strong>: I will grow open-pollinated heirloom seeds responsibly and endeavor to return harvested seeds to replenish community stock.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginBottom: '20px' }}
          >
            {loading ? 'Creating Account...' : 'Complete Registration (Get 50 Points)'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          fontSize: '13px',
          color: '#6B7280',
          borderTop: '1px solid #E5E7EB',
          paddingTop: '18px',
        }}>
          Already have a Seed Vault account?{' '}
          <button
            type="button"
            onClick={() => navigate('login')}
            style={{ background: 'none', color: '#164B35', fontWeight: 700 }}
          >
            Log in here
          </button>
        </div>
      </div>
    </div>
  );
};

