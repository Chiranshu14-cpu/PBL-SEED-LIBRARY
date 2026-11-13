import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Users,
  Sprout,
  Package,
  BookOpen,
  ShoppingCart,
  Scale,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
  Award,
  CheckCircle,
} from 'lucide-react';

export const AdminDashboard = ({ navigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [dashboardData, setDashboardData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users'

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, usersRes] = await Promise.all([
          api.get('/dashboard/admin'),
          api.get('/auth/users'),
        ]);

        if (dashRes.success) setDashboardData(dashRes);
        if (usersRes.success) setUsersList(usersRes.users || []);
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#164B35' }}>
        <Sprout size={48} style={{ animation: 'spin 2s linear infinite', margin: '0 auto 16px' }} />
        <h3>Loading Administrator Intelligence Dashboard...</h3>
      </div>
    );
  }

  const metrics = dashboardData?.metrics || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#164B35',
        color: '#FFFFFF',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: 'var(--shadow-md)',
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
            backgroundColor: 'rgba(217, 164, 65, 0.25)',
            color: '#FDE68A',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '10px',
          }}>
            <Shield size={14} />
            Administrator Control Center
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
            Namaste, {user?.fullName}!
          </h1>
          <p style={{ fontSize: '14px', color: '#A8BFA3', marginTop: '4px' }}>
            Seed Vault Central Repository • Village Panchayat Agronomic Monitoring
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('inventory')}
            className="btn btn-gold"
          >
            Manage Seed Inventory
          </button>
          <button
            onClick={() => navigate('borrows')}
            className="btn btn-secondary"
            style={{ backgroundColor: 'transparent', color: '#FFFFFF', borderColor: '#FFFFFF' }}
          >
            Review Borrow Requests ({metrics.pendingBorrows || 0})
          </button>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '18px',
      }}>
        <div className="card" style={{ borderLeft: '4px solid #3B82F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
              Registered Users
            </span>
            <Users size={18} color="#3B82F6" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827' }}>
            {metrics.totalUsers || 0}
          </div>
          <div style={{ fontSize: '11px', color: '#4B5563', marginTop: '4px' }}>
            {metrics.totalFarmers || 0} Farmers • {metrics.totalLibrarians || 0} Librarians
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #16A34A' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
              Available Stock
            </span>
            <Package size={18} color="#16A34A" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827' }}>
            {metrics.totalAvailablePackets || 0}
          </div>
          <div style={{ fontSize: '11px', color: '#4B5563', marginTop: '4px' }}>
            {metrics.totalVarieties || 15} Varieties in Catalogue
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #D9A441' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
              Borrowed Packets
            </span>
            <BookOpen size={18} color="#D9A441" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827' }}>
            {metrics.totalBorrowedPackets || 0}
          </div>
          <div style={{ fontSize: '11px', color: '#4B5563', marginTop: '4px' }}>
            Currently with village farmers
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #8B5CF6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
              Purchased Packets
            </span>
            <ShoppingCart size={18} color="#8B5CF6" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827' }}>
            {metrics.totalPurchasedPackets || 0}
          </div>
          <div style={{ fontSize: '11px', color: '#4B5563', marginTop: '4px' }}>
            Direct homestead purchases
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
              Combined Seed Weight
            </span>
            <Scale size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827' }}>
            {metrics.totalSeedWeightKg || '51.05'} kg
          </div>
          <div style={{ fontSize: '11px', color: '#4B5563', marginTop: '4px' }}>
            Strictly segregated from monetary bill
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #DC2626' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
              Pending Approvals
            </span>
            <AlertTriangle size={18} color="#DC2626" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#DC2626' }}>
            {metrics.totalPendingApprovals || 0}
          </div>
          <div style={{ fontSize: '11px', color: '#4B5563', marginTop: '4px' }}>
            {metrics.pendingBorrows || 0} Borrows • {metrics.pendingReturns || 0} Returns
          </div>
        </div>
      </div>

      {/* Low Stock Alerts Banner (if any) */}
      {dashboardData?.lowStockAlerts?.length > 0 && (
        <div style={{
          backgroundColor: '#FEF3C7',
          border: '1.5px solid #F59E0B',
          borderRadius: '16px',
          padding: '20px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <AlertTriangle size={22} color="#D97706" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#92400E' }}>
              Low-Stock Inventory Warnings ({dashboardData.lowStockAlerts.length} Varieties)
            </h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {dashboardData.lowStockAlerts.map((it) => (
              <span
                key={it._id}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#92400E',
                  border: '1px solid #FDE68A',
                }}
              >
                {it.name}: <strong>{it.availableStock} packets remaining</strong> (Threshold: {it.threshold})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Sections: Category Distribution & Activity Logs */}
      <div className="grid-2">
        {/* Category Breakdown & Progress */}
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#164B35', marginBottom: '16px' }}>
            Seed Varieties & Category Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {dashboardData?.categoryDistribution?.map((cat) => {
              const maxStock = 450;
              const percent = Math.min(100, Math.round((cat.stock / maxStock) * 100));
              return (
                <div key={cat._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    <span style={{ color: '#111827' }}>{cat._id} ({cat.count} Varieties)</span>
                    <span style={{ color: '#164B35' }}>{cat.stock} Available Packets</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${percent}%`,
                      height: '100%',
                      backgroundColor: '#164B35',
                      borderRadius: '4px',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#164B35' }}>
              Recent Platform Transactions
            </h3>
            <button
              onClick={() => navigate('activity')}
              style={{ background: 'none', color: '#164B35', fontSize: '12px', fontWeight: 700 }}
            >
              View All Logs
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dashboardData?.recentPurchases?.map((p) => (
              <div
                key={p._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>
                    Order #{p.orderNumber}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>
                    {p.user?.fullName} ({p.user?.villageCity || 'Ralegan Siddhi'}) • {p.totalQuantity} pkts
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#164B35' }}>
                    ₹{p.totalPrice}
                  </div>
                  <div style={{ fontSize: '10px', color: '#047857' }}>
                    {p.totalWeightGrams}g seeds
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="card">
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#164B35', marginBottom: '16px' }}>
          Registered Community Members ({usersList.length})
        </h3>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Village & District</th>
                <th>Guardian Points</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 600 }}>{u.fullName}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-forest' : u.role === 'librarian' ? 'badge-gold' : 'badge-success'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>{u.villageCity}, {u.district}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#D9A441' }}>
                      ★ {u.guardianPoints || 0}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

