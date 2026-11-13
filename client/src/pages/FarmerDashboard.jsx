import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Sprout,
  ShoppingCart,
  BookOpen,
  Calendar,
  Clock,
  Award,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Plus,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const FarmerDashboard = ({ navigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmerDashboard = async () => {
      try {
        const res = await api.get('/dashboard/farmer');
        if (res.success) setDashboardData(res);
      } catch (err) {
        console.error('Failed to load farmer dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#164B35' }}>
        <Sprout size={48} style={{ animation: 'spin 2s linear infinite', margin: '0 auto 16px' }} />
        <h3>Loading your personal farming dashboard...</h3>
      </div>
    );
  }

  const farmer = dashboardData?.farmer || user || {};
  const counts = dashboardData?.counts || {};
  const activeBorrows = dashboardData?.activeBorrows || [];
  const dueDates = dashboardData?.dueDates || [];
  const gardenPlants = dashboardData?.gardenPlants || [];
  const recommendedSeeds = dashboardData?.recommendedSeeds || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Welcome Banner */}
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
            <Sprout size={14} />
            Village Farmer & Seed Guardian Member
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
            Namaste, {farmer.fullName}!
          </h1>
          <p style={{ fontSize: '14px', color: '#A8BFA3', marginTop: '4px' }}>
            Village: <strong>{farmer.villageCity || 'Ralegan Siddhi'}</strong>, District: <strong>{farmer.district || 'Ahmednagar'}</strong>
          </p>
        </div>

        {/* Guardian Points Pill */}
        <div style={{
          backgroundColor: '#0D3526',
          border: '2px solid #D9A441',
          borderRadius: '16px',
          padding: '16px 24px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        }}>
          <div style={{ fontSize: '12px', color: '#D9A441', fontWeight: 700, textTransform: 'uppercase' }}>
            Seed Guardian Points
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', margin: '2px 0' }}>
            ★ {farmer.guardianPoints || 0}
          </div>
          <button
            onClick={() => navigate('points')}
            style={{ background: 'none', color: '#FDE68A', fontSize: '12px', fontWeight: 600, textDecoration: 'underline' }}
          >
            View Badges & Rewards
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '18px',
      }}>
        <div className="card" style={{ borderLeft: '4px solid #16A34A' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
              My Borrowed Loans
            </span>
            <BookOpen size={18} color="#16A34A" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginTop: '6px' }}>
            {counts.activeBorrows || 0} Active
          </div>
          <button
            onClick={() => navigate('borrows')}
            style={{ background: 'none', color: '#16A34A', fontSize: '12px', fontWeight: 600, marginTop: '6px', textAlign: 'left' }}
          >
            Track Return Dates →
          </button>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #8B5CF6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
              My Purchases
            </span>
            <ShoppingCart size={18} color="#8B5CF6" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginTop: '6px' }}>
            {counts.purchases || 0} Orders
          </div>
          <button
            onClick={() => navigate('catalogue')}
            style={{ background: 'none', color: '#8B5CF6', fontSize: '12px', fontWeight: 600, marginTop: '6px', textAlign: 'left' }}
          >
            Shop Seed Varieties →
          </button>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #D9A441' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
              Plants in My Garden
            </span>
            <Sprout size={18} color="#D9A441" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginTop: '6px' }}>
            {counts.gardenPlants || 0} Growing
          </div>
          <button
            onClick={() => navigate('garden')}
            style={{ background: 'none', color: '#D9A441', fontSize: '12px', fontWeight: 600, marginTop: '6px', textAlign: 'left' }}
          >
            Open Garden Tracker →
          </button>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #EC4899' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
              Community Seeds
            </span>
            <ShieldCheck size={18} color="#EC4899" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginTop: '6px' }}>
            Deposit Seeds
          </div>
          <button
            onClick={() => navigate('deposits')}
            style={{ background: 'none', color: '#EC4899', fontSize: '12px', fontWeight: 600, marginTop: '6px', textAlign: 'left' }}
          >
            Share Heirloom Seeds →
          </button>
        </div>
      </div>

      {/* Due Date Reminders Banner (if borrowed seeds active) */}
      {dueDates.length > 0 && (
        <div style={{
          backgroundColor: '#EFF6FF',
          border: '1.5px solid #93C5FD',
          borderRadius: '16px',
          padding: '20px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Clock size={22} color="#2563EB" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E40AF' }}>
              Seed Return Schedule & Due Dates
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {dueDates.map((d, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
              >
                <div>
                  <strong>{d.items}</strong> (Loan #{d.borrowNumber})
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: d.daysRemaining <= 15 ? '#DC2626' : '#2563EB', fontWeight: 700 }}>
                    Due: {new Date(d.returnDueDate).toLocaleDateString()} ({d.daysRemaining} days remaining)
                  </span>
                  <button
                    onClick={() => navigate('returns')}
                    className="btn btn-primary btn-sm"
                  >
                    Initiate Return
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Garden Growth Progress Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#164B35' }}>
              My Garden & Field Plots ({gardenPlants.length})
            </h3>
            <p style={{ fontSize: '12px', color: '#6B7280' }}>
              Track planting dates, 7 growth stages, and record harvest yields
            </p>
          </div>
          <button
            onClick={() => navigate('garden')}
            className="btn btn-primary btn-sm"
          >
            <Plus size={15} />
            <span>Manage My Garden</span>
          </button>
        </div>

        {gardenPlants.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6B7280' }}>
            <Sprout size={36} style={{ opacity: 0.3, margin: '0 auto 10px' }} />
            <p style={{ fontSize: '14px' }}>No crops logged in your garden yet.</p>
            <button
              onClick={() => navigate('garden')}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '10px' }}
            >
              Add Your First Plant
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {gardenPlants.map((plant) => (
              <div
                key={plant._id}
                style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  padding: '16px',
                  backgroundColor: '#F9FAFB',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#164B35' }}>
                      {plant.seedName}
                    </h4>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>
                      {plant.plotLocation || 'Home Garden Bed'}
                    </div>
                  </div>
                  <span className="badge badge-forest">
                    {plant.stage}
                  </span>
                </div>

                {/* Growth Stage Progress Bar */}
                <div style={{ margin: '12px 0 6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>
                    <span>Growth Progress</span>
                    <span>{plant.progressPercent || 25}%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${plant.progressPercent || 25}%`,
                      height: '100%',
                      backgroundColor: '#164B35',
                      borderRadius: '4px',
                    }} />
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '8px' }}>
                  Planted on: {new Date(plant.plantingDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Seeds for Seasonal Sowing */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#164B35' }}>
              Recommended Seasonal Heritage Seeds
            </h3>
            <p style={{ fontSize: '12px', color: '#6B7280' }}>
              Heirloom varieties well-adapted to local village rainfall and soil conditions
            </p>
          </div>
          <button
            onClick={() => navigate('catalogue')}
            style={{ background: 'none', color: '#164B35', fontSize: '13px', fontWeight: 700 }}
          >
            Explore Catalogue →
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}>
          {recommendedSeeds.map((seed) => (
            <div
              key={seed._id}
              style={{
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: '14px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="badge badge-gold">{seed.category}</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#164B35' }}>
                  ₹{seed.pricePerPacket}
                </span>
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: '4px 0' }}>
                {seed.name}
              </h4>
              <div style={{ fontSize: '11px', color: '#6B7280', fontStyle: 'italic', marginBottom: '8px' }}>
                {seed.scientificName}
              </div>
              <div style={{ fontSize: '12px', color: '#4B5563', marginBottom: '12px' }}>
                Stock: <strong>{seed.availableStock} pkts</strong> • {seed.packetWeightDisplay || '25g'}
              </div>
              <button
                onClick={() => navigate('catalogue')}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: 'auto', width: '100%' }}
              >
                View Guide & Order
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

