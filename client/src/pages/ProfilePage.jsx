import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Award,
  Shield,
  Save,
  Sprout,
  CheckCircle,
} from 'lucide-react';

export const ProfilePage = ({ navigate }) => {
  const { user, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useNotifications();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    villageCity: user?.villageCity || '',
    district: user?.district || '',
    state: user?.state || '',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', formData);
      if (res.success) {
        showToast('Profile updated successfully!', 'success');
        refreshProfile();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h3>Please log in to view your profile.</h3>
        <button onClick={() => navigate('login')} className="btn btn-primary" style={{ marginTop: '12px' }}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Profile Overview Card */}
      <div className="card" style={{
        padding: '36px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '24px',
        backgroundColor: '#164B35',
        color: '#FFFFFF',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#D9A441',
          color: '#0D3526',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '32px',
          boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
        }}>
          {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-gold" style={{ textTransform: 'uppercase' }}>
              {user.role} Member
            </span>
            <span className="badge badge-heritage">
              ★ {user.guardianPoints || 0} Guardian Points
            </span>
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800 }}>
            {user.fullName}
          </h2>
          <div style={{ fontSize: '13px', color: '#A8BFA3', display: 'flex', gap: '16px', marginTop: '4px', flexWrap: 'wrap' }}>
            <span>📧 {user.email}</span>
            <span>📞 {user.phone}</span>
            <span>📍 {user.villageCity}, {user.district}</span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="card">
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#164B35', marginBottom: '20px' }}>
          Update Member Profile Information
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input
                type="tel"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '22px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Village / City *</label>
              <input
                type="text"
                className="form-control"
                value={formData.villageCity}
                onChange={(e) => setFormData({ ...formData, villageCity: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">District *</label>
              <input
                type="text"
                className="form-control"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">State *</label>
              <input
                type="text"
                className="form-control"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary btn-md"
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>

      {/* Badges Earned */}
      <div className="card">
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#164B35', marginBottom: '14px' }}>
          My Earned Badges ({user.badges?.length || 1})
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {(user.badges || []).map((b, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '10px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Award size={22} color="#16A34A" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#166534' }}>{b.title}</div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>{b.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

