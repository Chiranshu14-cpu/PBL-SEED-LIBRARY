import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import {
  BookOpen,
  Repeat,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sprout,
  Search,
} from 'lucide-react';

export const LibrarianDashboard = ({ navigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showToast, fetchNotifications } = useNotifications();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review modal states
  const [activeBorrowModal, setActiveBorrowModal] = useState(null);
  const [borrowReviewNotes, setBorrowReviewNotes] = useState('');
  const [borrowDueDateDays, setBorrowDueDateDays] = useState(90);

  const [activeReturnModal, setActiveReturnModal] = useState(null);
  const [returnStatus, setReturnStatus] = useState('Verified & Accepted');
  const [returnNotes, setReturnNotes] = useState('Seeds inspected. Pure, dry and viable.');
  const [returnPoints, setReturnPoints] = useState(30);

  const [activeDepositModal, setActiveDepositModal] = useState(null);
  const [depositStatus, setDepositStatus] = useState('Approved');
  const [depositNotes, setDepositNotes] = useState('Indigenous heirloom verified.');
  const [depositPoints, setDepositPoints] = useState(50);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard/librarian');
      if (res.success) setDashboardData(res);
    } catch (err) {
      console.error('Failed to load librarian dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Process Borrow Approval / Rejection
  const handleBorrowAction = async (status) => {
    if (!activeBorrowModal) return;
    try {
      const res = await api.put(`/borrows/${activeBorrowModal._id}/status`, {
        status,
        reviewNotes: borrowReviewNotes,
        dueDateDays: borrowDueDateDays,
      });
      if (res.success) {
        showToast(`Borrow request marked as ${status}!`, 'success');
        setActiveBorrowModal(null);
        setBorrowReviewNotes('');
        fetchDashboard();
        fetchNotifications();
      }
    } catch (err) {
      showToast(err.message || 'Action failed.', 'error');
    }
  };

  // Process Return Verification
  const handleReturnAction = async () => {
    if (!activeReturnModal) return;
    try {
      const res = await api.put(`/returns/${activeReturnModal._id}/verify`, {
        status: returnStatus,
        verificationNotes: returnNotes,
        pointsToAward: returnPoints,
      });
      if (res.success) {
        showToast(`Seed return ${returnStatus}! Inventory restocked.`, 'success');
        setActiveReturnModal(null);
        fetchDashboard();
        fetchNotifications();
      }
    } catch (err) {
      showToast(err.message || 'Return verification failed.', 'error');
    }
  };

  // Process Deposit Review
  const handleDepositAction = async () => {
    if (!activeDepositModal) return;
    try {
      const res = await api.put(`/deposits/${activeDepositModal._id}/review`, {
        status: depositStatus,
        reviewNotes: depositNotes,
        pointsToAward: depositPoints,
      });
      if (res.success) {
        showToast(`Seed deposit marked as ${depositStatus}!`, 'success');
        setActiveDepositModal(null);
        fetchDashboard();
        fetchNotifications();
      }
    } catch (err) {
      showToast(err.message || 'Deposit review failed.', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#164B35' }}>
        <Sprout size={48} style={{ animation: 'spin 2s linear infinite', margin: '0 auto 16px' }} />
        <h3>Loading Seed Librarian Desk...</h3>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#0D3526',
        color: '#FFFFFF',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        borderBottom: '4px solid #D9A441',
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(217, 164, 65, 0.25)',
            color: '#FDE68A',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '10px',
          }}>
            <BookOpen size={14} />
            Village Seed Librarian Workstation
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
            Librarian Desk — {user?.fullName}
          </h1>
          <p style={{ fontSize: '14px', color: '#A8BFA3', marginTop: '4px' }}>
            Process Loans • Verify Seed Viability & Purity • Restock Community Inventory
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('inventory')} className="btn btn-gold">
            Open Inventory Table
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '18px',
      }}>
        <div className="card" style={{ borderLeft: '4px solid #16A34A' }}>
          <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
            Available Library Stock
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginTop: '4px' }}>
            {stats.totalAvailableInventory || 0}
          </div>
          <div style={{ fontSize: '11px', color: '#4B5563' }}>Packets in storage ready for sowing</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #D9A441' }}>
          <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
            Pending Borrow Loans
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#92400E', marginTop: '4px' }}>
            {stats.pendingBorrowsCount || 0}
          </div>
          <div style={{ fontSize: '11px', color: '#4B5563' }}>Awaiting librarian issue approval</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #3B82F6' }}>
          <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
            Pending Returns to Verify
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#2563EB', marginTop: '4px' }}>
            {stats.pendingReturnsCount || 0}
          </div>
          <div style={{ fontSize: '11px', color: '#4B5563' }}>Seeds waiting for viability inspection</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #8B5CF6' }}>
          <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
            Pending Seed Deposits
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#6D28D9', marginTop: '4px' }}>
            {stats.pendingDepositsCount || 0}
          </div>
          <div style={{ fontSize: '11px', color: '#4B5563' }}>Farmer community heirloom donations</div>
        </div>
      </div>

      {/* Pending Borrow Requests Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#164B35', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="#D9A441" />
            <span>Pending Borrow Requests ({dashboardData?.pendingBorrows?.length || 0})</span>
          </h3>
          <button onClick={() => navigate('borrows')} style={{ background: 'none', color: '#164B35', fontSize: '12px', fontWeight: 700 }}>
            View All Borrows
          </button>
        </div>

        {dashboardData?.pendingBorrows?.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
            ✨ All seed borrow requests have been processed! No pending loans.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request #</th>
                  <th>Farmer</th>
                  <th>Village</th>
                  <th>Varieties Requested</th>
                  <th>Total Packets</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.pendingBorrows.map((b) => (
                  <tr key={b._id}>
                    <td style={{ fontWeight: 700 }}>{b.borrowNumber}</td>
                    <td>{b.user?.fullName}</td>
                    <td>{b.user?.villageCity || 'Ralegan Siddhi'}</td>
                    <td>
                      {b.items.map((i) => `${i.seedName} (${i.quantity})`).join(', ')}
                    </td>
                    <td style={{ fontWeight: 700 }}>{b.totalQuantity} pkts</td>
                    <td>{new Date(b.requestDate).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => setActiveBorrowModal(b)}
                        className="btn btn-primary btn-sm"
                      >
                        Review & Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pending Seed Returns Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#164B35', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Repeat size={20} color="#2563EB" />
            <span>Pending Seed Returns for Verification ({dashboardData?.pendingReturns?.length || 0})</span>
          </h3>
          <button onClick={() => navigate('returns')} style={{ background: 'none', color: '#164B35', fontSize: '12px', fontWeight: 700 }}>
            View Returns Record
          </button>
        </div>

        {dashboardData?.pendingReturns?.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
            ✨ No returns awaiting verification.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Return #</th>
                  <th>Farmer</th>
                  <th>Returned Seeds</th>
                  <th>Qty / Weight</th>
                  <th>Germination Reported</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.pendingReturns.map((r) => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 700 }}>{r.returnNumber}</td>
                    <td>{r.user?.fullName}</td>
                    <td>{r.items.map((i) => i.seedName).join(', ')}</td>
                    <td style={{ fontWeight: 700 }}>
                      {r.items.reduce((s, i) => s + i.returnedQuantity, 0)} pkts ({r.items.reduce((s, i) => s + i.returnedWeightGrams, 0)}g)
                    </td>
                    <td>
                      <span className="badge badge-success">
                        {r.items[0]?.germinationRateReported || 85}% viability
                      </span>
                    </td>
                    <td>{new Date(r.returnDate).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => setActiveReturnModal(r)}
                        className="btn btn-gold btn-sm"
                      >
                        Verify & Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pending Seed Deposits */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#164B35', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sprout size={20} color="#16A34A" />
            <span>Community Seed Deposits for Review ({dashboardData?.pendingDeposits?.length || 0})</span>
          </h3>
          <button onClick={() => navigate('deposits')} style={{ background: 'none', color: '#164B35', fontSize: '12px', fontWeight: 700 }}>
            View Deposits Log
          </button>
        </div>

        {dashboardData?.pendingDeposits?.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
            ✨ No community seed deposits awaiting approval.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Deposit #</th>
                  <th>Farmer</th>
                  <th>Seed Variety</th>
                  <th>Category</th>
                  <th>Quantity / Weight</th>
                  <th>Seed Provenance</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.pendingDeposits.map((d) => (
                  <tr key={d._id}>
                    <td style={{ fontWeight: 700 }}>{d.depositNumber}</td>
                    <td>{d.farmerName}</td>
                    <td style={{ fontWeight: 600 }}>{d.seedName}</td>
                    <td><span className="badge badge-forest">{d.category}</span></td>
                    <td style={{ fontWeight: 700 }}>{d.quantityPackets} pkts ({d.weightGrams}g)</td>
                    <td style={{ fontSize: '12px', color: '#6B7280' }}>{d.seedSource}</td>
                    <td>
                      <button
                        onClick={() => setActiveDepositModal(d)}
                        className="btn btn-primary btn-sm"
                      >
                        Review Deposit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Review Borrow Modal --- */}
      {activeBorrowModal && (
        <div className="modal-overlay" onClick={() => setActiveBorrowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#164B35', marginBottom: '6px' }}>
              Review Borrow Loan #{activeBorrowModal.borrowNumber}
            </h3>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '18px' }}>
              Applicant: <strong>{activeBorrowModal.user?.fullName}</strong> ({activeBorrowModal.user?.phone})
            </p>

            <div style={{ backgroundColor: '#F9FAFB', padding: '14px', borderRadius: '10px', marginBottom: '16px' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>Requested Items:</div>
              {activeBorrowModal.items.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span>{it.quantity}x {it.seedName}</span>
                  <span style={{ color: '#166534', fontWeight: 600 }}>Library Available: {it.seed?.availableStock ?? 'Checked'}</span>
                </div>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Return Due Date Duration (Days)</label>
              <input
                type="number"
                className="form-control"
                value={borrowDueDateDays}
                onChange={(e) => setBorrowDueDateDays(e.target.value)}
                min={30}
                max={180}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Librarian Endorsement Notes</label>
              <textarea
                className="form-control"
                rows={2}
                value={borrowReviewNotes}
                onChange={(e) => setBorrowReviewNotes(e.target.value)}
                placeholder="Approved for seasonal multiplication..."
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleBorrowAction('Rejected')}
                className="btn btn-danger"
                style={{ flex: 1 }}
              >
                Reject Request
              </button>
              <button
                onClick={() => handleBorrowAction('Approved')}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Approve & Issue Seeds
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Review Return Modal --- */}
      {activeReturnModal && (
        <div className="modal-overlay" onClick={() => setActiveReturnModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#164B35', marginBottom: '6px' }}>
              Verify Seed Return #{activeReturnModal.returnNumber}
            </h3>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '18px' }}>
              Submitted by <strong>{activeReturnModal.user?.fullName}</strong>
            </p>

            <div style={{ backgroundColor: '#F0FDF4', padding: '14px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #BBF7D0' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#166534', marginBottom: '4px' }}>
                Reported Return Quality:
              </div>
              <div style={{ fontSize: '13px', color: '#166534' }}>
                Farmer reported: {activeReturnModal.items[0]?.germinationRateReported || 85}% germination rate.
              </div>
              <div style={{ fontSize: '12px', color: '#4B5563', marginTop: '6px' }}>
                Farmer Notes: "{activeReturnModal.farmerNotes || 'Seeds harvested from mature vigorous plants.'}"
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Verification Outcome</label>
              <select
                className="form-control"
                value={returnStatus}
                onChange={(e) => setReturnStatus(e.target.value)}
              >
                <option value="Verified & Accepted">Verified & Accepted (Restock to Library)</option>
                <option value="Rejected">Reject Return (Purity or Viability Failure)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Seed Guardian Points to Award</label>
              <input
                type="number"
                className="form-control"
                value={returnPoints}
                onChange={(e) => setReturnPoints(e.target.value)}
                min={0}
                max={100}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Librarian Physical Purity Inspection Notes</label>
              <textarea
                className="form-control"
                rows={2}
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setActiveReturnModal(null)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleReturnAction}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Save & Update Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Review Deposit Modal --- */}
      {activeDepositModal && (
        <div className="modal-overlay" onClick={() => setActiveDepositModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#164B35', marginBottom: '6px' }}>
              Review Seed Deposit #{activeDepositModal.depositNumber}
            </h3>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '18px' }}>
              Contributed by <strong>{activeDepositModal.farmerName}</strong>
            </p>

            <div style={{ backgroundColor: '#FEF3C7', padding: '14px', borderRadius: '10px', marginBottom: '16px' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#92400E' }}>
                {activeDepositModal.seedName} ({activeDepositModal.category})
              </div>
              <div style={{ fontSize: '13px', color: '#78350F' }}>
                Quantity: {activeDepositModal.quantityPackets} packets • Weight: {activeDepositModal.weightGrams}g
              </div>
              <div style={{ fontSize: '12px', color: '#78350F', marginTop: '4px' }}>
                Harvest: {new Date(activeDepositModal.harvestDate).toLocaleDateString()} • Source: {activeDepositModal.seedSource}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Decision</label>
              <select
                className="form-control"
                value={depositStatus}
                onChange={(e) => setDepositStatus(e.target.value)}
              >
                <option value="Approved">Approved (Add to Library Inventory)</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Guardian Points for Farmer</label>
              <input
                type="number"
                className="form-control"
                value={depositPoints}
                onChange={(e) => setDepositPoints(e.target.value)}
                min={10}
                max={150}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Review Endorsement</label>
              <textarea
                className="form-control"
                rows={2}
                value={depositNotes}
                onChange={(e) => setDepositNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setActiveDepositModal(null)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleDepositAction}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Complete Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

