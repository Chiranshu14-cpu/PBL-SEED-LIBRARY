import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Award,
  Crown,
  ShieldCheck,
  Sparkles,
  Sprout,
  Users,
  Trophy,
  CheckCircle,
  Lock,
  ArrowRight,
} from 'lucide-react';

export const SeedGuardianPointsPage = ({ navigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [pointsData, setPointsData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [myRes, leadRes] = await Promise.all([
          user ? api.get('/points/my') : Promise.resolve({ success: false }),
          api.get('/points/leaderboard'),
        ]);

        if (myRes.success) setPointsData(myRes);
        if (leadRes.success) setLeaderboard(leadRes.leaderboard || []);
      } catch (err) {
        console.error('Failed to load points data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getBadgeIcon = (iconName) => {
    switch (iconName) {
      case 'Crown': return <Crown size={28} color="#D9A441" />;
      case 'ShieldCheck': return <ShieldCheck size={28} color="#16A34A" />;
      case 'Sparkles': return <Sparkles size={28} color="#8B5CF6" />;
      case 'Award': return <Award size={28} color="#EC4899" />;
      default: return <Sprout size={28} color="#164B35" />;
    }
  };

  const points = pointsData?.points || user?.guardianPoints || 50;
  const tier = pointsData?.tier || 'Bronze Sower';
  const badges = pointsData?.badges || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#0D3526',
        color: '#FFFFFF',
        borderRadius: '24px',
        padding: '36px 32px',
        borderBottom: '4px solid #D9A441',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ maxWidth: '600px' }}>
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
            marginBottom: '12px',
          }}>
            <Trophy size={14} />
            Community Gamification & Rewards
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
            {t('pointsTitle')}
          </h1>
          <p style={{ fontSize: '15px', color: '#A8BFA3', lineHeight: 1.6 }}>
            {t('pointsSubtitle')}
          </p>
        </div>

        {/* User Current Standing Card */}
        {user ? (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(4px)',
            border: '2px solid #D9A441',
            borderRadius: '20px',
            padding: '24px 32px',
            textAlign: 'center',
            minWidth: '220px',
          }}>
            <div style={{ fontSize: '12px', color: '#D9A441', fontWeight: 700, textTransform: 'uppercase' }}>
              Your Tier Status
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
              {tier}
            </div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: '#FDE68A', margin: '4px 0' }}>
              ★ {points}
            </div>
            <div style={{ fontSize: '11px', color: '#A8BFA3' }}>
              Seed Guardian Points Earned
            </div>
          </div>
        ) : (
          <button onClick={() => navigate('login')} className="btn btn-gold btn-lg">
            Login to Track Points
          </button>
        )}
      </div>

      {/* Badges Collection */}
      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#164B35' }}>
            {t('badgesTitle')}
          </h3>
          <p style={{ fontSize: '13px', color: '#6B7280' }}>
            Unlock recognized community credentials by actively borrowing, harvesting, and returning seeds.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}>
          {badges.map((b) => (
            <div
              key={b.id}
              style={{
                border: b.isUnlocked ? '1.5px solid #16A34A' : '1px solid #E5E7EB',
                borderRadius: '14px',
                padding: '20px',
                backgroundColor: b.isUnlocked ? '#F0FDF4' : '#F9FAFB',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                opacity: b.isUnlocked ? 1 : 0.6,
                position: 'relative',
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: b.isUnlocked ? '#FFFFFF' : '#E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                boxShadow: b.isUnlocked ? '0 4px 10px rgba(0,0,0,0.1)' : 'none',
              }}>
                {b.isUnlocked ? getBadgeIcon(b.icon) : <Lock size={24} color="#9CA3AF" />}
              </div>

              <h4 style={{ fontSize: '16px', fontWeight: 800, color: b.isUnlocked ? '#164B35' : '#4B5563', marginBottom: '4px' }}>
                {b.title}
              </h4>

              <p style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.5, marginBottom: '10px' }}>
                {b.description}
              </p>

              <span className={`badge ${b.isUnlocked ? 'badge-success' : 'badge-gold'}`} style={{ marginTop: 'auto' }}>
                {b.isUnlocked ? '✓ Unlocked' : `Requirement: ${b.threshold} pts`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Community Leaderboard */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#164B35' }}>
              {t('leaderboardTitle')}
            </h3>
            <p style={{ fontSize: '13px', color: '#6B7280' }}>
              Top village farmers recognized for landrace conservation & punctual returns
            </p>
          </div>
          <span className="badge badge-gold">
            Top 10 Guardians
          </span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Rank</th>
                <th>Guardian Farmer</th>
                <th>Village & District</th>
                <th>Badges Earned</th>
                <th style={{ textAlign: 'right' }}>Total Guardian Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item) => (
                <tr key={item._id} style={{ backgroundColor: item.rank === 1 ? '#FFFBEB' : '#FFFFFF' }}>
                  <td>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: item.rank === 1 ? '#FDE68A' : item.rank === 2 ? '#E5E7EB' : item.rank === 3 ? '#FED7AA' : '#F3F4F6',
                      color: '#111827',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '13px',
                    }}>
                      {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : item.rank}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#164B35' }}>
                    {item.name}
                  </td>
                  <td>{item.location}</td>
                  <td>
                    <span className="badge badge-forest">
                      {item.badgesCount} Badges
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '16px', color: '#D9A441' }}>
                    ★ {item.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* How to Earn Points Guide */}
      <div className="card" style={{ backgroundColor: '#F7F5EA', border: '1.5px solid #D9A441' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#92400E', marginBottom: '14px' }}>
          How to Earn Seed Guardian Points
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#164B35', marginBottom: '4px' }}>
              +30 to 50 Points
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
              Punctual Seed Returns
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              Awarded once the librarian inspects and verifies returned seed viability.
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#164B35', marginBottom: '4px' }}>
              +50 Points
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
              Heirloom Seed Deposits
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              Contribute indigenous traditional seeds to expand community inventory.
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#164B35', marginBottom: '4px' }}>
              +20 Points
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
              Log Harvest in Garden
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              Record final crop harvest yields in the <em>My Garden</em> section.
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#164B35', marginBottom: '4px' }}>
              +15 Points
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
              Community Feedback
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              Review seed quality and provide suggestions for library improvements.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

