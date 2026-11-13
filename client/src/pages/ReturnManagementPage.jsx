import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Repeat,
  CheckCircle,
  AlertCircle,
  Award,
  Sprout,
  Star,
  Scale,
} from 'lucide-react';

export const ReturnManagementPage = ({ navigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showToast, fetchNotifications } = useNotifications();

  const [activeBorrows, setActiveBorrows] = useState([]);
  const [returnHistory, setReturnHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Return submission form
  const [selectedBorrowId, setSelectedBorrowId] = useState('');
  const [returnedQuantity, setReturnedQuantity] = useState(1);
  const [returnedWeightGrams, setReturnedWeightGrams] = useState(50);
  const [germinationRate, setGerminationRate] = useState(90);
  const [qualityRating, setQualityRating] = useState(5);
  const [farmerNotes, setFarmerNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [borrowsRes, returnsRes] = await Promise.all([
        api.get('/borrows/my'),
        api.get('/returns'),
      ]);

      if (borrowsRes.success) {
        // Active borrowed seeds
        const active = (borrowsRes.borrows || []).filter(
          (b) => b.status === 'Borrowed' || b.status === 'Approved'
        );
        setActiveBorrows(active);
        if (active.length > 0) setSelectedBorrowId(active[0]._id);
      }

      if (returnsRes.success) {
        setReturnHistory(returnsRes.returns || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch return records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    if (!selectedBorrowId) {
      showToast('Please select a borrowed seed loan to return.', 'error');
      return;
    }

    const selectedBorrow = activeBorrows.find((b) => b._id === selectedBorrowId);
    if (!selectedBorrow) return;

    setSubmitting(true);
    try {
      const payload = {
        borrowRequestId: selectedBorrowId,
        items: selectedBorrow.items.map((it) => ({
          seed: it.seed._id || it.seed,
          seedName: it.seedName,
          borrowedQuantity: it.quantity,
          returnedQuantity: parseInt(returnedQuantity, 10),
          returnedWeightGrams: parseFloat(returnedWeightGrams),
          germinationRateReported: parseFloat(germinationRate),
          seedQualityRating: parseInt(qualityRating, 10),
        })),
        farmerNotes,
      };

      const res = await api.post('/returns', payload);
      if (res.success) {
        showToast('Seed return logged successfully! Awaiting librarian verification.', 'success');
        setFarmerNotes('');
        fetchData();
        fetchNotifications();
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit return request.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Title */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#DCFCE7',
          color: '#166534',
          padding: '4px 12px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: 700,
          marginBottom: '10px',
        }}>
          <Repeat size={14} />
          Village Seed Return & Replenishment
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#164B35', marginBottom: '6px' }}>
          Seed Return & Quality Verification
        </h1>
        <p style={{ fontSize: '14px', color: '#4B5563', maxWidth: '800px' }}>
          Return viable harvested seeds from your mature crops. Once verified by the librarian, available stock is automatically replenished and <strong>Seed Guardian Points</strong> are credited to your account!
        </p>
      </div>

      <div className="grid-2">
        {/* Form: Submit Return */}
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#164B35', marginBottom: '16px' }}>
            Submit Borrowed Seeds Return
          </h3>

          {activeBorrows.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: '12px', color: '#6B7280' }}>
              <CheckCircle size={36} color="#16A34A" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontWeight: 600, color: '#111827', marginBottom: '4px' }}>No Active Loans Due</div>
              <p style={{ fontSize: '13px' }}>You currently have no unreturned seed loans on record.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReturn}>
              <div className="form-group">
                <label className="form-label">Select Active Borrowed Seed Record *</label>
                <select
                  className="form-control"
                  value={selectedBorrowId}
                  onChange={(e) => setSelectedBorrowId(e.target.value)}
                  required
                >
                  {activeBorrows.map((b) => (
                    <option key={b._id} value={b._id}>
                      Loan #{b.borrowNumber} — {b.items.map((i) => `${i.seedName} (${i.quantity} pkts)`).join(', ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Quantity Returned (Packets) *</label>
                  <input
                    type="number"
                    className="form-control"
                    min={1}
                    value={returnedQuantity}
                    onChange={(e) => setReturnedQuantity(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Seed Weight Returned (Grams) *</label>
                  <input
                    type="number"
                    className="form-control"
                    min={1}
                    value={returnedWeightGrams}
                    onChange={(e) => setReturnedWeightGrams(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Reported Germination Viability (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    min={50}
                    max={100}
                    value={germinationRate}
                    onChange={(e) => setGerminationRate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Harvested Seed Quality Rating (1-5)</label>
                  <select
                    className="form-control"
                    value={qualityRating}
                    onChange={(e) => setQualityRating(e.target.value)}
                  >
                    <option value={5}>★★★★★ 5 - Exceptional Purity</option>
                    <option value={4}>★★★★☆ 4 - High Viability</option>
                    <option value={3}>★★★☆☆ 3 - Good Standard</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '22px' }}>
                <label className="form-label">Crop Notes & Harvesting Feedback</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="e.g. Harvested from 20 healthy plants, sun dried for 3 days, winnowed cleanly..."
                  value={farmerNotes}
                  onChange={(e) => setFarmerNotes(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                {submitting ? 'Submitting Return...' : 'Submit Seeds for Librarian Verification'}
              </button>
            </form>
          )}
        </div>

        {/* Verification Policy Notice */}
        <div className="card" style={{ backgroundColor: '#F7F5EA', border: '1.5px solid #D9A441' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontWeight: 800, fontSize: '16px', marginBottom: '12px' }}>
            <Award size={20} />
            <span>Community Return & Quality Protocol</span>
          </div>

          <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.6, marginBottom: '14px' }}>
            In accordance with village seed library rules, returned seeds undergo manual inspection:
          </p>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#374151' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} color="#16A34A" />
              <span><strong>Physical Purity:</strong> Clean of chaff, husk, weed seeds, or dirt.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} color="#16A34A" />
              <span><strong>Moisture Content:</strong> Thoroughly shade-dried to below 9% moisture.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} color="#16A34A" />
              <span><strong>Restocking Rule:</strong> Inventory is updated ONLY after librarian verification.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={16} color="#D9A441" />
              <span><strong>Points Reward:</strong> 30 to 50 Guardian points awarded per verified batch!</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Return Submissions History Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#164B35' }}>
            Returns Ledger & Verification Status ({returnHistory.length})
          </h3>
        </div>

        {returnHistory.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
            No seed return submissions logged yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Return #</th>
                  {['admin', 'librarian'].includes(user?.role) && <th>Farmer</th>}
                  <th>Returned Varieties</th>
                  <th>Quantity & Weight</th>
                  <th>Status</th>
                  <th>Points Credited</th>
                  <th>Return Date</th>
                </tr>
              </thead>
              <tbody>
                {returnHistory.map((ret) => (
                  <tr key={ret._id}>
                    <td style={{ fontWeight: 700 }}>{ret.returnNumber}</td>
                    {['admin', 'librarian'].includes(user?.role) && <td>{ret.user?.fullName}</td>}
                    <td>{ret.items.map((i) => i.seedName).join(', ')}</td>
                    <td style={{ fontWeight: 600 }}>
                      {ret.items.reduce((s, i) => s + i.returnedQuantity, 0)} pkts ({ret.items.reduce((s, i) => s + i.returnedWeightGrams, 0)}g)
                    </td>
                    <td>
                      <span className={`badge ${
                        ret.status === 'Verified & Accepted'
                          ? 'badge-success'
                          : ret.status === 'Rejected'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}>
                        {ret.status}
                      </span>
                    </td>
                    <td>
                      {ret.pointsAwarded ? (
                        <strong style={{ color: '#D9A441' }}>+{ret.pointsAwarded} pts</strong>
                      ) : (
                        'Pending'
                      )}
                    </td>
                    <td>{new Date(ret.returnDate).toLocaleDateString()}</td>
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

