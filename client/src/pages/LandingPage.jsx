import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  Shield,
  BookOpen,
  Award,
  Users,
  Scale,
  ArrowRight,
  CheckCircle,
  Repeat,
  Heart,
  TrendingUp,
} from 'lucide-react';

export const LandingPage = ({ navigate }) => {
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
      {/* Hero Banner Section */}
      <section style={{
        backgroundColor: '#164B35',
        color: '#FFFFFF',
        borderRadius: '24px',
        padding: '60px 40px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(13, 53, 38, 0.25)',
      }}>
        {/* Subtle decorative background circle */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217, 164, 65, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(217, 164, 65, 0.2)',
            color: '#FDE68A',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '20px',
            border: '1px solid rgba(217, 164, 65, 0.35)',
          }}>
            <Sprout size={16} />
            Village Seed Library & Indigenous Germplasm Bank
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 50px)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '20px',
            color: '#FFFFFF',
          }}>
            Preserving Heritage Seeds, Empowering Village Farmers.
          </h1>

          <p style={{
            fontSize: '17px',
            color: '#A8BFA3',
            lineHeight: 1.7,
            marginBottom: '32px',
          }}>
            Seed Vault is a community-driven digital platform for village seed libraries. Borrow traditional open-pollinated seed varieties, track crop cycles, purchase non-hybrid packets, and return multiplied seeds to safeguard rural agricultural biodiversity.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <button
              onClick={() => navigate('catalogue')}
              className="btn btn-gold btn-lg"
            >
              <span>Explore 15 Heritage Seed Varieties</span>
              <ArrowRight size={18} />
            </button>

            {!isAuthenticated ? (
              <button
                onClick={() => navigate('register')}
                className="btn btn-secondary btn-lg"
                style={{ backgroundColor: 'transparent', color: '#FFFFFF', borderColor: '#FFFFFF' }}
              >
                Join as a Farmer / Member
              </button>
            ) : (
              <button
                onClick={() => {
                  if (user?.role === 'admin') navigate('admin-dashboard');
                  else if (user?.role === 'librarian') navigate('librarian-dashboard');
                  else navigate('farmer-dashboard');
                }}
                className="btn btn-secondary btn-lg"
                style={{ backgroundColor: 'transparent', color: '#FFFFFF', borderColor: '#FFFFFF' }}
              >
                Open My Dashboard
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Preservation Figures Counter */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
      }}>
        <div className="card" style={{ textAlign: 'center', padding: '30px 20px', borderTop: '4px solid #164B35' }}>
          <div style={{ fontSize: '38px', fontWeight: 800, color: '#164B35', marginBottom: '4px' }}>
            15
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>
            Indigenous Seed Varieties
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280' }}>
            Vegetables, Herbs, Pulses, Grains & Flowers
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '30px 20px', borderTop: '4px solid #D9A441' }}>
          <div style={{ fontSize: '38px', fontWeight: 800, color: '#D9A441', marginBottom: '4px' }}>
            1,440
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>
            Initial Seed Packets
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280' }}>
            Catalogued and ready for village distribution
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '30px 20px', borderTop: '4px solid #10B981' }}>
          <div style={{ fontSize: '38px', fontWeight: 800, color: '#10B981', marginBottom: '4px' }}>
            51.05 kg
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>
            Combined Seed Weight
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280' }}>
            Preserved in high-viability village containers
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '30px 20px', borderTop: '4px solid #3B82F6' }}>
          <div style={{ fontSize: '38px', fontWeight: 800, color: '#3B82F6', marginBottom: '4px' }}>
            100%
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>
            Community Managed
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280' }}>
            Governed by Village Panchayat & Seed Librarians
          </div>
        </div>
      </section>

      {/* How the Seed Library Model Works */}
      <section>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#D9A441', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Sustainable Village Cycle
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#164B35', marginTop: '6px' }}>
            How Village Seed Banking Works
          </h2>
          <p style={{ fontSize: '15px', color: '#4B5563', marginTop: '10px' }}>
            A regenerative cycle that replaces commercial hybrid dependency with village-owned seed sovereignty.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
        }}>
          <div className="card card-hover" style={{ backgroundColor: '#FFFFFF', padding: '30px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: '#EBF2E9',
              color: '#164B35',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px',
            }}>
              <BookOpen size={26} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#164B35', marginBottom: '10px' }}>
              1. Borrow or Purchase
            </h3>
            <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.6 }}>
              Borrow seed packets for seasonal planting, or purchase small batches for your garden. Seed weights and bills are kept strictly distinct.
            </p>
          </div>

          <div className="card card-hover" style={{ backgroundColor: '#FFFFFF', padding: '30px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px',
            }}>
              <Sprout size={26} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#164B35', marginBottom: '10px' }}>
              2. Cultivate & Track
            </h3>
            <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.6 }}>
              Use the built-in <strong>My Garden</strong> tracker across 7 growth stages from seed planting to flowering and harvest readiness.
            </p>
          </div>

          <div className="card card-hover" style={{ backgroundColor: '#FFFFFF', padding: '30px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: '#DCFCE7',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px',
            }}>
              <Repeat size={26} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#164B35', marginBottom: '10px' }}>
              3. Harvest & Return
            </h3>
            <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.6 }}>
              Harvest the healthiest plants, extract viable seeds, and return them to the library desk for librarian physical purity verification.
            </p>
          </div>

          <div className="card card-hover" style={{ backgroundColor: '#FFFFFF', padding: '30px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: '#E0E7FF',
              color: '#3730A3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px',
            }}>
              <Award size={26} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#164B35', marginBottom: '10px' }}>
              4. Earn Guardian Points
            </h3>
            <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.6 }}>
              Earn gamified <strong>Seed Guardian Points</strong>, unlock achievement badges, and climb the village community leaderboard!
            </p>
          </div>
        </div>
      </section>

      {/* Featured Varieties Preview CTA */}
      <section style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '50px 40px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '30px',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid rgba(22, 75, 53, 0.1)',
      }}>
        <div style={{ maxWidth: '600px' }}>
          <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#164B35', marginBottom: '10px' }}>
            Explore Our Comprehensive Seed Bank
          </h3>
          <p style={{ fontSize: '15px', color: '#4B5563', lineHeight: 1.6 }}>
            Featuring Tomato, Brinjal, Okra, Green Chilli, Cucumber, Pumpkin, Spinach, Radish, Carrot, Fenugreek, Coriander, Chickpea, Green Gram, Maize, and Sunflower. Complete with full botanical profiles and organic cultivation instructions in English, Marathi, and Hindi.
          </p>
        </div>

        <button
          onClick={() => navigate('catalogue')}
          className="btn btn-primary btn-lg"
        >
          View Full Seed Catalogue
        </button>
      </section>
    </div>
  );
};

