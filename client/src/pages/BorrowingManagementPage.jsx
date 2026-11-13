import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Repeat,
  Sprout,
  Filter,
} from 'lucide-react';

export const BorrowingManagementPage = ({ navigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useNotifications();

  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchBorrows = async () => {
    setLoading(true);
    try {
      const endpoint = user?.role === 'farmer' ? '/borrows/my' : `/borrows?status=${statusFilter}`;
      const res = await api.get(endpoint);
      if (res.success) {
        setBorrows(res.borrows || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch borrowing records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, [statusFilter]);

  const getStatusBadgeClass = (st) => {
    switch (st) {
      case 'Pending': return 'badge-warning';
      case 'Approved':
      case 'Borrowed': return 'badge-forest';
      case 'Return Requested': return 'badge-gold';
      case 'Returned': return 'badge-success';
      case 'Rejected':
      case 'Overdue': return 'badge-danger';
      default: return 'badge-forest';
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
            <BookOpen size={14} />
            Village Seed Loan Ledger
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#164B35', marginBottom: '6px' }}>
            {user?.role === 'farmer' ? 'My Borrowed Seeds & Due Dates' : 'All Community Borrow Loans'}
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>
            Track seasonal seed loans, issue dates, and harvest return commitments across village farming clusters.
          </p>
        </div>

        {/* Filter for Admin / Librarian */}
        {['admin', 'librarian'].includes(user?.role) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter size={16} color="#6B7280" />
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="All">All Loan Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Borrowed">Active Borrowed</option>
              <option value="Return Requested">Return Requested</option>
              <option value="Returned">Returned</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        )}
      </div>

      {/* Borrows Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#164B35' }}>
            <Sprout size={36} style={{ animation: 'spin 2s linear infinite', margin: '0 auto 12px' }} />
            <p>Loading borrowing transactions...</p>
          </div>
        ) : borrows.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6B7280' }}>
            <BookOpen size={48} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
              No Borrowing Records Found
            </h3>
            <p style={{ fontSize: '13px', marginBottom: '16px' }}>
              {user?.role === 'farmer'
                ? 'You have not borrowed any seed packets yet. Browse the catalogue to request seeds!'
                : 'No borrowing transactions match the selected filter.'}
            </p>
            {user?.role === 'farmer' && (
              <button onClick={() => navigate('catalogue')} className="btn btn-gold btn-sm">
                Browse Seeds to Borrow
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Loan #</th>
                  {['admin', 'librarian'].includes(user?.role) && <th>Farmer</th>}
                  <th>Borrowed Varieties</th>
                  <th>Total Packets</th>
                  <th>Request Date</th>
                  <th>Issue Date</th>
                  <th>Return Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {borrows.map((b) => (
                  <tr key={b._id}>
                    <td style={{ fontWeight: 700, color: '#164B35' }}>
                      {b.borrowNumber}
                    </td>
                    {['admin', 'librarian'].includes(user?.role) && (
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.user?.fullName}</div>
                        <div style={{ fontSize: '11px', color: '#6B7280' }}>{b.user?.villageCity || 'Village'}</div>
                      </td>
                    )}
                    <td>
                      {b.items?.map((it, idx) => (
                        <div key={idx} style={{ fontSize: '13px', fontWeight: 500 }}>
                          • {it.seedName} ({it.quantity} pkts)
                        </div>
                      ))}
                    </td>
                    <td style={{ fontWeight: 700 }}>{b.totalQuantity} pkts</td>
                    <td>{new Date(b.requestDate).toLocaleDateString()}</td>
                    <td>{b.issueDate ? new Date(b.issueDate).toLocaleDateString() : '—'}</td>
                    <td>
                      {b.returnDueDate ? (
                        <span style={{
                          fontWeight: 700,
                          color: new Date(b.returnDueDate) < new Date() && b.status === 'Borrowed' ? '#DC2626' : '#111827',
                        }}>
                          {new Date(b.returnDueDate).toLocaleDateString()}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {/* Farmer can initiate return if status is Borrowed */}
                      {user?.role === 'farmer' && (b.status === 'Borrowed' || b.status === 'Approved') && (
                        <button
                          onClick={() => navigate('returns')}
                          className="btn btn-primary btn-sm"
                        >
                          <Repeat size={13} />
                          <span>Return Seeds</span>
                        </button>
                      )}
                      {['admin', 'librarian'].includes(user?.role) && (
                        <button
                          onClick={() => navigate('librarian-dashboard')}
                          className="btn btn-secondary btn-sm"
                        >
                          Review in Desk
                        </button>
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

