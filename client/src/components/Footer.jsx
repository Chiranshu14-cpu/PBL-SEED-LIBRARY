import React from 'react';
import { Sprout, Heart, Shield, Award, MapPin, Phone, Mail } from 'lucide-react';

export const Footer = ({ navigate }) => {
  return (
    <footer style={{
      backgroundColor: '#0D3526',
      color: '#E5E7EB',
      padding: '50px 0 24px',
      marginTop: '60px',
      borderTop: '4px solid #D9A441',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '36px',
          marginBottom: '40px',
        }}>
          {/* Brand & Purpose */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '14px',
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#D9A441',
                color: '#0D3526',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Sprout size={24} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>
                SEED VAULT
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#A8BFA3', lineHeight: 1.6, marginBottom: '14px' }}>
              Village Seed Library Management Platform. Safeguarding indigenous heritage varieties, empowering rural farmer autonomy, and digitizing community seed bank exchanges for sustainable agriculture.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(217, 164, 65, 0.15)',
              color: '#FDE68A',
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700,
              border: '1px solid rgba(217, 164, 65, 0.3)',
            }}>
              <Shield size={13} />
              B.Tech CSE Project-Based Learning (PBL)
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ fontSize: '15px', color: '#FFFFFF', fontWeight: 700, marginBottom: '16px' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <li>
                <button onClick={() => navigate('catalogue')} style={footerLinkStyle}>
                  🌱 15 Indigenous Seed Varieties
                </button>
              </li>
              <li>
                <button onClick={() => navigate('inventory')} style={footerLinkStyle}>
                  📊 Real-time Stock Inventory
                </button>
              </li>
              <li>
                <button onClick={() => navigate('borrows')} style={footerLinkStyle}>
                  📋 Seasonal Borrowing Workflow
                </button>
              </li>
              <li>
                <button onClick={() => navigate('deposits')} style={footerLinkStyle}>
                  🌾 Community Seed Contribution
                </button>
              </li>
              <li>
                <button onClick={() => navigate('points')} style={footerLinkStyle}>
                  🏆 Seed Guardian Gamification
                </button>
              </li>
              <li>
                <button onClick={() => navigate('feedback')} style={footerLinkStyle}>
                  💬 Community Feedback & Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Community Standards */}
          <div>
            <h4 style={{ fontSize: '15px', color: '#FFFFFF', fontWeight: 700, marginBottom: '16px' }}>
              Seed Library Ethos
            </h4>
            <p style={{ fontSize: '13px', color: '#A8BFA3', lineHeight: 1.6, marginBottom: '10px' }}>
              1. <strong>Borrow:</strong> Take what you need for this planting season.<br/>
              2. <strong>Grow:</strong> Cultivate organically with traditional care.<br/>
              3. <strong>Return:</strong> Return double the seeds from your best plants to keep the library thriving!
            </p>
            <div style={{ fontSize: '12px', color: '#D9A441' }}>
              ★ 100% Heirloom & Open-Pollinated Non-GMO Varieties
            </div>
          </div>

          {/* Contact & Desk Info */}
          <div>
            <h4 style={{ fontSize: '15px', color: '#FFFFFF', fontWeight: 700, marginBottom: '16px' }}>
              Village Agri Desk
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#A8BFA3' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="#D9A441" />
                <span>Panchayat Seed Center, Ralegan Siddhi, Ahmednagar</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="#D9A441" />
                <span>Farmer Toll-Free Helpline: 1800-SEED-VAULT</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#D9A441" />
                <span>support@seedvault.village.org</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#9CA3AF',
          gap: '12px',
        }}>
          <div>
            © {new Date().getFullYear()} <strong>Seed Vault</strong>. Academic B.Tech Computer Science and Engineering PBL Project.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Clean Code Architecture</span>
            <span>•</span>
            <span>MERN Stack</span>
            <span>•</span>
            <span>Full Multilingual Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const footerLinkStyle = {
  background: 'none',
  color: '#A8BFA3',
  textAlign: 'left',
  padding: '2px 0',
  fontSize: '13px',
  transition: 'color 0.18s ease',
};

