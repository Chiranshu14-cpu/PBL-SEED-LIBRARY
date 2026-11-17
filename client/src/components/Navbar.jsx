import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Sprout,
  ShoppingCart,
  BookOpen,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Globe,
  Award,
  ShieldAlert,
  Leaf,
  Layers,
  Repeat,
  Package,
} from 'lucide-react';

export const Navbar = ({ currentRoute, navigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t, languages } = useLanguage();
  const { purchaseTotalQty, borrowTotalQty, setIsDrawerOpen, setActiveTab } = useCart();
  const { unreadCount, notifications, markAsRead, markAllRead } = useNotifications();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleNav = (route) => {
    navigate(route);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setNotifOpen(false);
  };

  const openCart = (tab) => {
    setActiveTab(tab);
    setIsDrawerOpen(true);
  };

  const getDashboardRoute = () => {
    if (!user) return 'login';
    if (user.role === 'admin') return 'admin-dashboard';
    if (user.role === 'librarian') return 'librarian-dashboard';
    return 'farmer-dashboard';
  };

  return (
    <header style={{
      backgroundColor: '#164B35',
      color: '#FFFFFF',
      position: 'sticky',
      top: 0,
      zIndex: 500,
      boxShadow: '0 4px 15px rgba(13, 53, 38, 0.25)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px',
      }}>
        {/* Logo & Brand */}
        <div
          onClick={() => handleNav('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: '#D9A441',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0D3526',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          }}>
            <Sprout size={28} strokeWidth={2.4} />
          </div>
          <div>
            <div style={{
              fontSize: '22px',
              fontWeight: '800',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span>SEED VAULT</span>
              <span style={{
                fontSize: '10px',
                backgroundColor: 'rgba(217, 164, 65, 0.25)',
                color: '#D9A441',
                padding: '2px 8px',
                borderRadius: '999px',
                border: '1px solid rgba(217, 164, 65, 0.4)',
                fontWeight: 700,
              }}>
                PBL
              </span>
            </div>
            <div style={{
              fontSize: '11px',
              color: '#A8BFA3',
              fontWeight: 500,
              letterSpacing: '0.2px',
            }}>
              {t('appTagline')}
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '6px',
        }} className="desktop-nav">
          <button
            onClick={() => handleNav('home')}
            style={navItemStyle(currentRoute === 'home')}
          >
            {t('navHome')}
          </button>

          <button
            onClick={() => handleNav('catalogue')}
            style={navItemStyle(currentRoute === 'catalogue')}
          >
            {t('navCatalogue')}
          </button>

          {isAuthenticated && (
            <button
              onClick={() => handleNav(getDashboardRoute())}
              style={navItemStyle(currentRoute.includes('dashboard'))}
            >
              {t('navDashboard')}
            </button>
          )}

          {/* Librarian & Admin links */}
          {isAuthenticated && ['admin', 'librarian'].includes(user?.role) && (
            <button
              onClick={() => handleNav('inventory')}
              style={navItemStyle(currentRoute === 'inventory')}
            >
              {t('navInventory')}
            </button>
          )}

          {/* Shared Workflows */}
          {isAuthenticated && (
            <>
              <button
                onClick={() => handleNav('borrows')}
                style={navItemStyle(currentRoute === 'borrows')}
              >
                {t('navBorrows')}
              </button>
              <button
                onClick={() => handleNav('returns')}
                style={navItemStyle(currentRoute === 'returns')}
              >
                {t('navReturns')}
              </button>
              <button
                onClick={() => handleNav('deposits')}
                style={navItemStyle(currentRoute === 'deposits')}
              >
                {t('navDeposits')}
              </button>
              {user?.role === 'farmer' && (
                <button
                  onClick={() => handleNav('garden')}
                  style={navItemStyle(currentRoute === 'garden')}
                >
                  {t('navGarden')}
                </button>
              )}
            </>
          )}

          <button
            onClick={() => handleNav('points')}
            style={navItemStyle(currentRoute === 'points')}
          >
            {t('navPoints')}
          </button>

          <button
            onClick={() => handleNav('feedback')}
            style={navItemStyle(currentRoute === 'feedback')}
          >
            {t('navFeedback')}
          </button>
        </nav>

        {/* Right Action Icons & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Language Selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <Globe size={16} />
              <span>{languages.find((l) => l.code === language)?.label || 'EN'}</span>
            </button>
            {langMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: '#FFFFFF',
                color: '#1F2937',
                borderRadius: '10px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                padding: '6px',
                width: '130px',
                zIndex: 600,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: language === l.code ? '#EBF2E9' : 'transparent',
                      color: language === l.code ? '#164B35' : '#1F2937',
                      fontSize: '13px',
                      fontWeight: language === l.code ? 700 : 500,
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart Buttons: Purchase & Borrow */}
          <button
            onClick={() => openCart('purchase')}
            title="Purchase Cart"
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <ShoppingCart size={19} />
            {purchaseTotalQty > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: '#D9A441',
                color: '#0D3526',
                fontSize: '11px',
                fontWeight: 800,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
              }}>
                {purchaseTotalQty}
              </span>
            )}
          </button>

          <button
            onClick={() => openCart('borrow')}
            title="Borrowing Cart"
            style={{
              position: 'relative',
              background: 'rgba(217, 164, 65, 0.18)',
              color: '#FDE68A',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(217, 164, 65, 0.35)',
            }}
          >
            <BookOpen size={19} />
            {borrowTotalQty > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 800,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
              }}>
                {borrowTotalQty}
              </span>
            )}
          </button>

          {/* Notifications Bell */}
          {isAuthenticated && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                style={{
                  position: 'relative',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <Bell size={19} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 800,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Popover */}
              {notifOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '10px',
                  backgroundColor: '#FFFFFF',
                  color: '#1F2937',
                  borderRadius: '14px',
                  boxShadow: '0 12px 35px rgba(0,0,0,0.22)',
                  width: '320px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  zIndex: 700,
                  padding: '16px',
                  border: '1px solid #E5E7EB',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #E5E7EB',
                    paddingBottom: '10px',
                    marginBottom: '10px',
                  }}>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: '#164B35' }}>
                      {t('notificationsTitle')} ({unreadCount})
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        style={{
                          background: 'none',
                          color: '#2563EB',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {t('markAllRead')}
                      </button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '20px 0', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
                      {t('noNotifications')}
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => {
                          if (!n.isRead) markAsRead(n._id);
                          if (n.link) handleNav(n.link.replace('/', ''));
                          setNotifOpen(false);
                        }}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          backgroundColor: n.isRead ? '#FFFFFF' : '#F0FDF4',
                          borderLeft: n.isRead ? '3px solid transparent' : '3px solid #16A34A',
                          marginBottom: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                          {n.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#4B5563', marginTop: '2px' }}>
                          {n.message}
                        </div>
                        <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '4px' }}>
                          {new Date(n.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* User Account / Login Button */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#D9A441',
                  color: '#0D3526',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '13px',
                }}>
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.fullName.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '10px', color: '#A8BFA3', textTransform: 'capitalize' }}>
                    {user.role}
                  </div>
                </div>
              </button>

              {userMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '10px',
                  backgroundColor: '#FFFFFF',
                  color: '#1F2937',
                  borderRadius: '12px',
                  boxShadow: '0 12px 35px rgba(0,0,0,0.22)',
                  width: '230px',
                  padding: '12px',
                  zIndex: 700,
                  border: '1px solid #E5E7EB',
                }}>
                  <div style={{
                    padding: '8px 10px',
                    borderBottom: '1px solid #E5E7EB',
                    marginBottom: '8px',
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#164B35' }}>
                      {user.fullName}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>
                      {user.email}
                    </div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#FEF3C7',
                      color: '#92400E',
                      padding: '3px 8px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      marginTop: '6px',
                    }}>
                      <Award size={13} />
                      {user.guardianPoints || 0} Points
                    </div>
                  </div>

                  <button
                    onClick={() => handleNav('profile')}
                    style={dropdownItemStyle}
                  >
                    <User size={15} />
                    {t('navProfile')}
                  </button>

                  <button
                    onClick={() => handleNav('activity')}
                    style={dropdownItemStyle}
                  >
                    <Layers size={15} />
                    {t('navActivity')}
                  </button>

                  <button
                    onClick={() => handleNav('feedback')}
                    style={dropdownItemStyle}
                  >
                    <Leaf size={15} />
                    {t('navFeedback')}
                  </button>

                  <div style={{ borderTop: '1px solid #E5E7EB', margin: '6px 0' }} />

                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                      navigate('home');
                    }}
                    style={{
                      ...dropdownItemStyle,
                      color: '#DC2626',
                    }}
                  >
                    <LogOut size={15} />
                    {t('navLogout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleNav('login')}
                className="btn btn-secondary btn-sm"
                style={{ backgroundColor: 'transparent', color: '#FFFFFF', borderColor: '#FFFFFF' }}
              >
                {t('navLogin')}
              </button>
              <button
                onClick={() => handleNav('register')}
                className="btn btn-gold btn-sm"
              >
                {t('navRegister')}
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              background: 'none',
              color: '#FFFFFF',
              padding: '6px',
            }}
            className="mobile-hamburger"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#0D3526',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <button onClick={() => handleNav('home')} style={mobileNavItemStyle}>
            {t('navHome')}
          </button>
          <button onClick={() => handleNav('catalogue')} style={mobileNavItemStyle}>
            {t('navCatalogue')}
          </button>
          {isAuthenticated && (
            <button onClick={() => handleNav(getDashboardRoute())} style={mobileNavItemStyle}>
              {t('navDashboard')}
            </button>
          )}
          {isAuthenticated && ['admin', 'librarian'].includes(user?.role) && (
            <button onClick={() => handleNav('inventory')} style={mobileNavItemStyle}>
              {t('navInventory')}
            </button>
          )}
          {isAuthenticated && (
            <>
              <button onClick={() => handleNav('borrows')} style={mobileNavItemStyle}>
                {t('navBorrows')}
              </button>
              <button onClick={() => handleNav('returns')} style={mobileNavItemStyle}>
                {t('navReturns')}
              </button>
              <button onClick={() => handleNav('deposits')} style={mobileNavItemStyle}>
                {t('navDeposits')}
              </button>
              {user?.role === 'farmer' && (
                <button onClick={() => handleNav('garden')} style={mobileNavItemStyle}>
                  {t('navGarden')}
                </button>
              )}
            </>
          )}
          <button onClick={() => handleNav('points')} style={mobileNavItemStyle}>
            {t('navPoints')}
          </button>
          <button onClick={() => handleNav('feedback')} style={mobileNavItemStyle}>
            {t('navFeedback')}
          </button>
          <button onClick={() => handleNav('activity')} style={mobileNavItemStyle}>
            {t('navActivity')}
          </button>
        </div>
      )}

      {/* Custom responsive style tags */}
      <style>{`
        @media (min-width: 992px) {
          .desktop-nav { display: flex !important; }
          .mobile-hamburger { display: none !important; }
        }
      `}</style>
    </header>
  );
};

const navItemStyle = (isActive) => ({
  background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
  color: isActive ? '#FFFFFF' : '#E5E7EB',
  padding: '8px 14px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: isActive ? 700 : 500,
  transition: 'all 0.18s ease',
});

const mobileNavItemStyle = {
  background: 'none',
  color: '#FFFFFF',
  textAlign: 'left',
  padding: '10px 0',
  fontSize: '15px',
  fontWeight: 600,
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
};

const dropdownItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '8px 10px',
  borderRadius: '6px',
  background: 'none',
  color: '#374151',
  fontSize: '13px',
  fontWeight: 500,
  width: '100%',
  textAlign: 'left',
};

