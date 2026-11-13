import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CataloguePage } from './pages/CataloguePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { LibrarianDashboard } from './pages/LibrarianDashboard';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { InventoryPage } from './pages/InventoryPage';
import { BorrowingManagementPage } from './pages/BorrowingManagementPage';
import { ReturnManagementPage } from './pages/ReturnManagementPage';
import { DepositPage } from './pages/DepositPage';
import { MyGardenPage } from './pages/MyGardenPage';
import { SeedGuardianPointsPage } from './pages/SeedGuardianPointsPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { ActivityHistoryPage } from './pages/ActivityHistoryPage';
import { ProfilePage } from './pages/ProfilePage';

const AppContent = () => {
  const { user, isAuthenticated, loading } = useAuth();

  // Hash-based router
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.replace('#', '').trim();
    return hash || 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      setCurrentRoute(hash || 'home');
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  // Protected Route Guards
  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'home':
        return <LandingPage navigate={navigate} />;

      case 'login':
        return <LoginPage navigate={navigate} />;

      case 'register':
        return <RegisterPage navigate={navigate} />;

      case 'catalogue':
        return <CataloguePage navigate={navigate} />;

      case 'admin-dashboard':
        if (!isAuthenticated) return <LoginPage navigate={navigate} />;
        if (user?.role !== 'admin') {
          return (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '500px', margin: '40px auto' }}>
              <h3 style={{ color: '#DC2626' }}>Access Restricted</h3>
              <p style={{ marginTop: '8px', color: '#6B7280' }}>
                Administrator privileges are required to access this dashboard. Your current role is <strong>{user?.role}</strong>.
              </p>
              <button onClick={() => navigate('home')} className="btn btn-primary" style={{ marginTop: '16px' }}>
                Return to Home
              </button>
            </div>
          );
        }
        return <AdminDashboard navigate={navigate} />;

      case 'librarian-dashboard':
        if (!isAuthenticated) return <LoginPage navigate={navigate} />;
        if (!['librarian', 'admin'].includes(user?.role)) {
          return (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '500px', margin: '40px auto' }}>
              <h3 style={{ color: '#DC2626' }}>Access Restricted</h3>
              <p style={{ marginTop: '8px', color: '#6B7280' }}>
                Seed Librarian or Admin privileges are required to access the desk.
              </p>
              <button onClick={() => navigate('home')} className="btn btn-primary" style={{ marginTop: '16px' }}>
                Return to Home
              </button>
            </div>
          );
        }
        return <LibrarianDashboard navigate={navigate} />;

      case 'farmer-dashboard':
        if (!isAuthenticated) return <LoginPage navigate={navigate} />;
        return <FarmerDashboard navigate={navigate} />;

      case 'inventory':
        if (!isAuthenticated) return <LoginPage navigate={navigate} />;
        if (!['librarian', 'admin'].includes(user?.role)) {
          return (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '500px', margin: '40px auto' }}>
              <h3 style={{ color: '#DC2626' }}>Staff Only</h3>
              <p style={{ marginTop: '8px', color: '#6B7280' }}>
                Inventory administration is reserved for Seed Librarians and Agricultural Officers.
              </p>
              <button onClick={() => navigate('catalogue')} className="btn btn-primary" style={{ marginTop: '16px' }}>
                Browse Seed Catalogue Instead
              </button>
            </div>
          );
        }
        return <InventoryPage navigate={navigate} />;

      case 'borrows':
        if (!isAuthenticated) return <LoginPage navigate={navigate} />;
        return <BorrowingManagementPage navigate={navigate} />;

      case 'returns':
        if (!isAuthenticated) return <LoginPage navigate={navigate} />;
        return <ReturnManagementPage navigate={navigate} />;

      case 'deposits':
        if (!isAuthenticated) return <LoginPage navigate={navigate} />;
        return <DepositPage navigate={navigate} />;

      case 'garden':
        if (!isAuthenticated) return <LoginPage navigate={navigate} />;
        return <MyGardenPage navigate={navigate} />;

      case 'points':
        return <SeedGuardianPointsPage navigate={navigate} />;

      case 'feedback':
        return <FeedbackPage navigate={navigate} />;

      case 'activity':
        return <ActivityHistoryPage navigate={navigate} />;

      case 'profile':
        if (!isAuthenticated) return <LoginPage navigate={navigate} />;
        return <ProfilePage navigate={navigate} />;

      default:
        return <LandingPage navigate={navigate} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar currentRoute={currentRoute} navigate={navigate} />

      <main style={{ flex: 1, padding: '36px 0' }}>
        <div className="container">
          {renderCurrentPage()}
        </div>
      </main>

      <CartDrawer navigate={navigate} />
      <Footer navigate={navigate} />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
