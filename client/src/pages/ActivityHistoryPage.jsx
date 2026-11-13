import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Layers,
  Filter,
  RefreshCw,
  Clock,
  User,
  CheckCircle,
  Tag,
  Sprout,
} from 'lucide-react';

export const ActivityHistoryPage = ({ navigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const endpoint = typeFilter === 'All' ? '/dashboard/activity-logs' : `/dashboard/activity-logs?type=${typeFilter}`;
      const res = await api.get(endpoint);
      if (res.success) {
        setLogs(res.logs || []);
      }
    } catch (err) {
      console.error('Failed to load activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [typeFilter]);

  const getActivityBadgeColor = (type) => {
    switch (type) {
      case 'PURCHASE': return 'badge-forest';
      case 'BORROW_REQUEST':
      case 'BORROW_APPROVED': return 'badge-gold';
      case 'RETURN_SUBMITTED':
      case 'RETURN_VERIFIED': return 'badge-success';
      case 'SEED_DEPOSITED':
      case 'SEED_DEPOSIT_APPROVED': return 'badge-heritage';
      case 'STOCK_UPDATE': return 'badge-warning';
      default: return 'badge-forest';
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
            backgroundColor: '#EBF2E9',
            color: '#164B35',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '10px',
          }}>
            <Layers size={14} />
            Transparent Audit Ledger
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#164B35', marginBottom: '6px' }}>
            {t('navActivity')}
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>
            Chronological log of seed library transactions, loans, returns, and inventory modifications.
          </p>
        </div>

        {/* Filter controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={16} color="#6B7280" />
          <select
            className="form-control"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '180px' }}
          >
            <option value="All">All Activities</option>
            <option value="PURCHASE">Seed Purchases</option>
            <option value="BORROW_REQUEST">Borrow Requests</option>
            <option value="BORROW_APPROVED">Borrow Approvals</option>
            <option value="RETURN_SUBMITTED">Return Submissions</option>
            <option value="RETURN_VERIFIED">Return Verifications</option>
            <option value="SEED_DEPOSITED">Seed Deposits</option>
            <option value="STOCK_UPDATE">Stock Updates</option>
            <option value="USER_REGISTRATION">User Registrations</option>
          </select>

          <button
            onClick={fetchLogs}
            className="btn btn-secondary"
            title="Refresh Log"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Activity Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#164B35' }}>
            <Sprout size={36} style={{ animation: 'spin 2s linear infinite', margin: '0 auto 12px' }} />
            <p>Retrieving activity entries...</p>
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
            No activity records found matching this criteria.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Activity Type</th>
                  <th>Description</th>
                  <th>User / Member</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '13px', color: '#4B5563' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <span className={`badge ${getActivityBadgeColor(log.activityType)}`}>
                        {log.activityType.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500, fontSize: '13px' }}>
                      {log.description}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {log.userName || 'System'}
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: '#6B7280', textTransform: 'capitalize' }}>
                        {log.userRole || 'system'}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: log.status === 'Success' || log.status === 'Completed' || log.status === 'Approved' ? '#16A34A' : '#D97706',
                      }}>
                        {log.status || 'Success'}
                      </span>
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

