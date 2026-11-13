import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Sprout,
  Shield,
  Award,
  Upload,
  CheckCircle,
  Clock,
  ArrowRight,
  Heart,
} from 'lucide-react';

export const DepositPage = ({ navigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showToast, fetchNotifications } = useNotifications();

  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [formData, setFormData] = useState({
    farmerName: user?.fullName || '',
    seedName: '',
    category: 'Vegetables',
    quantityPackets: 10,
    weightGrams: 250,
    harvestDate: new Date().toISOString().split('T')[0],
    seedSource: 'Traditional heirloom harvest - 4th generation landrace',
    description: '',
    contactPhone: user?.phone || '',
    villageLocation: user?.villageCity || 'Ralegan Siddhi',
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const endpoint = user?.role === 'farmer' ? '/deposits/my' : '/deposits';
      const res = await api.get(endpoint);
      if (res.success) {
        setDeposits(res.deposits || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch deposits.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.seedName.trim() || !formData.quantityPackets || !formData.weightGrams) {
      showToast('Please fill in all required deposit fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/deposits', formData);
      if (res.success) {
        showToast('Seed deposit submitted! Librarian will review & approve.', 'success');
        setFormData({
          farmerName: user?.fullName || '',
          seedName: '',
          category: 'Vegetables',
          quantityPackets: 10,
          weightGrams: 250,
          harvestDate: new Date().toISOString().split('T')[0],
          seedSource: 'Traditional heirloom harvest',
          description: '',
          contactPhone: user?.phone || '',
          villageLocation: user?.villageCity || 'Ralegan Siddhi',
        });
        fetchDeposits();
        fetchNotifications();
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit deposit.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Page Header */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#FEF3C7',
            color: '#92400E',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '10px',
          }}>
            <Heart size={14} />
            Community Heritage Preservation
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#164B35', marginBottom: '6px' }}>
            Contribute & Deposit Indigenous Seeds
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280', maxWidth: '750px' }}>
            Share your traditional heirloom seeds with the village bank. Approved deposits directly increase community inventory and award you <strong>50 Seed Guardian Points</strong>!
          </p>
        </div>
      </div>

      <div className="grid-2">
        {/* Deposit Contribution Form */}
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#164B35', marginBottom: '16px' }}>
            Seed Deposit Information
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Farmer / Donor Name *</label>
                <input
                  type="text"
                  name="farmerName"
                  className="form-control"
                  value={formData.farmerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Mobile *</label>
                <input
                  type="tel"
                  name="contactPhone"
                  className="form-control"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Seed Variety Name *</label>
                <input
                  type="text"
                  name="seedName"
                  className="form-control"
                  placeholder="e.g. Gaothan Red Tomato"
                  value={formData.seedName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Herbs">Herbs</option>
                  <option value="Pulses">Pulses</option>
                  <option value="Grains">Grains</option>
                  <option value="Flowers">Flowers</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Quantity Packets *</label>
                <input
                  type="number"
                  name="quantityPackets"
                  className="form-control"
                  min={1}
                  value={formData.quantityPackets}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Total Weight (Grams) *</label>
                <input
                  type="number"
                  name="weightGrams"
                  className="form-control"
                  min={1}
                  value={formData.weightGrams}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Harvest Date *</label>
                <input
                  type="date"
                  name="harvestDate"
                  className="form-control"
                  value={formData.harvestDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Village Location</label>
                <input
                  type="text"
                  name="villageLocation"
                  className="form-control"
                  value={formData.villageLocation}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Seed Lineage & Source *</label>
              <input
                type="text"
                name="seedSource"
                className="form-control"
                placeholder="e.g. Traditional family heirloom grown for 3 generations"
                value={formData.seedSource}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '22px' }}>
              <label className="form-label">Variety Description & Agronomic Traits</label>
              <textarea
                name="description"
                className="form-control"
                rows={2}
                placeholder="Describe drought resistance, taste, pest tolerance, fruit color..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              {submitting ? 'Submitting Deposit...' : 'Submit Seed Deposit for Verification'}
            </button>
          </form>
        </div>

        {/* Community Recognition Card */}
        <div className="card" style={{ backgroundColor: '#F7F5EA', border: '1.5px solid #D9A441' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontWeight: 800, fontSize: '16px', marginBottom: '12px' }}>
            <Award size={22} />
            <span>Community Preservation Rewards</span>
          </div>

          <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.6, marginBottom: '16px' }}>
            Farmers are the true guardians of agricultural heritage. When you contribute seeds to the village library:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#D9A441', color: '#0D3526', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>
                1
              </div>
              <div style={{ fontSize: '13px', color: '#374151' }}>
                <strong>Quality Inspection:</strong> The seed librarian verifies moisture and purity.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#D9A441', color: '#0D3526', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>
                2
              </div>
              <div style={{ fontSize: '13px', color: '#374151' }}>
                <strong>Stock Restocked:</strong> Your variety is added directly to library stock for fellow villagers.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#D9A441', color: '#0D3526', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>
                3
              </div>
              <div style={{ fontSize: '13px', color: '#374151' }}>
                <strong>Points & Badges:</strong> You receive 50 points and the prestigious <em>Heritage Preserver</em> badge.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit History Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#164B35' }}>
            Deposited Varieties Log ({deposits.length})
          </h3>
        </div>

        {deposits.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
            No seed deposits submitted yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Deposit #</th>
                  {['admin', 'librarian'].includes(user?.role) && <th>Farmer</th>}
                  <th>Seed Variety</th>
                  <th>Category</th>
                  <th>Quantity & Weight</th>
                  <th>Harvest Date</th>
                  <th>Status</th>
                  <th>Points Awarded</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((d) => (
                  <tr key={d._id}>
                    <td style={{ fontWeight: 700 }}>{d.depositNumber}</td>
                    {['admin', 'librarian'].includes(user?.role) && <td>{d.farmerName}</td>}
                    <td style={{ fontWeight: 600 }}>{d.seedName}</td>
                    <td><span className="badge badge-forest">{d.category}</span></td>
                    <td style={{ fontWeight: 600 }}>{d.quantityPackets} pkts ({d.weightGrams}g)</td>
                    <td>{new Date(d.harvestDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${
                        d.status === 'Approved'
                          ? 'badge-success'
                          : d.status === 'Rejected'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td>
                      {d.pointsAwarded ? (
                        <strong style={{ color: '#D9A441' }}>+{d.pointsAwarded} pts</strong>
                      ) : (
                        'Pending'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

