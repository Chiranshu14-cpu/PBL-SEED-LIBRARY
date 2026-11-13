import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import api from '../services/api';
import confetti from 'canvas-confetti';
import {
  X,
  ShoppingCart,
  BookOpen,
  Trash2,
  CheckCircle,
  AlertCircle,
  Scale,
  Receipt,
  MapPin,
  CreditCard,
  Sprout,
  Printer,
} from 'lucide-react';

export const CartDrawer = ({ navigate }) => {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    activeTab,
    setActiveTab,
    purchaseCart,
    borrowCart,
    updatePurchaseQty,
    removeFromPurchaseCart,
    clearPurchaseCart,
    purchaseTotalQty,
    purchaseTotalPrice,
    purchaseTotalWeightGrams,
    updateBorrowQty,
    removeFromBorrowCart,
    clearBorrowCart,
    borrowTotalQty,
    borrowTotalWeightGrams,
  } = useCart();

  const { user, isAuthenticated, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const { showToast, fetchNotifications } = useNotifications();

  // Simulated Checkout Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Village Seed Desk / Cash on Pickup');
  const [deliveryMethod, setDeliveryMethod] = useState('Self-Pickup at Village Library');
  const [borrowPurpose, setBorrowPurpose] = useState('Traditional Farm Multiplication & Community Return');
  const [orderReceipt, setOrderReceipt] = useState(null); // When set, receipt modal pops up

  if (!isDrawerOpen) return null;

  // Process Simulated Purchase Checkout
  const handlePurchaseCheckout = async () => {
    if (!isAuthenticated) {
      showToast('Please log in to complete purchase.', 'error');
      setIsDrawerOpen(false);
      navigate('login');
      return;
    }

    if (purchaseCart.length === 0) return;

    setIsSubmitting(true);
    try {
      const payload = {
        items: purchaseCart.map((item) => ({
          seedId: item.seed._id,
          quantity: item.quantity,
          seedName: item.seed.name,
        })),
        paymentMethod,
        deliveryMethod,
        deliveryAddress: {
          villageCity: user.villageCity || 'Ralegan Siddhi',
          district: user.district || 'Ahmednagar',
          state: user.state || 'Maharashtra',
          phone: user.phone || '9876543210',
        },
      };

      const res = await api.post('/purchases', payload);
      if (res.success) {
        // Trigger celebratory confetti for academic demonstration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}

        setOrderReceipt(res.purchase);
        clearPurchaseCart();
        refreshProfile();
        fetchNotifications();
        showToast(`Order Confirmed! ${res.pointsEarned} Guardian Points awarded!`, 'success');
      }
    } catch (err) {
      showToast(err.message || 'Checkout failed. Check stock availability.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Borrowing Request
  const handleBorrowSubmit = async () => {
    if (!isAuthenticated) {
      showToast('Please log in to submit borrow request.', 'error');
      setIsDrawerOpen(false);
      navigate('login');
      return;
    }

    if (borrowCart.length === 0) return;

    setIsSubmitting(true);
    try {
      const payload = {
        items: borrowCart.map((item) => ({
          seedId: item.seed._id,
          seedName: item.seed.name,
          quantity: item.quantity,
        })),
        purpose: borrowPurpose,
      };

      const res = await api.post('/borrows', payload);
      if (res.success) {
        clearBorrowCart();
        setIsDrawerOpen(false);
        fetchNotifications();
        showToast('Borrow request submitted to librarian for approval!', 'success');
        navigate('borrows');
      }
    } catch (err) {
      showToast(err.message || 'Borrow request failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
        <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
          {/* Drawer Header */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#164B35',
            color: '#FFFFFF',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sprout size={24} color="#D9A441" />
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
                Seed Vault Desk
              </h3>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              style={{ background: 'none', color: '#FFFFFF', padding: '4px' }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Drawer Tabs: Purchase vs Borrow */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderBottom: '1px solid #E5E7EB',
            backgroundColor: '#F9FAFB',
          }}>
            <button
              onClick={() => setActiveTab('purchase')}
              style={{
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: activeTab === 'purchase' ? 700 : 500,
                borderBottom: activeTab === 'purchase' ? '3px solid #164B35' : '3px solid transparent',
                backgroundColor: activeTab === 'purchase' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'purchase' ? '#164B35' : '#6B7280',
              }}
            >
              <ShoppingCart size={16} />
              <span>{t('purchaseCart')} ({purchaseTotalQty})</span>
            </button>

            <button
              onClick={() => setActiveTab('borrow')}
              style={{
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: activeTab === 'borrow' ? 700 : 500,
                borderBottom: activeTab === 'borrow' ? '3px solid #D9A441' : '3px solid transparent',
                backgroundColor: activeTab === 'borrow' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'borrow' ? '#92400E' : '#6B7280',
              }}
            >
              <BookOpen size={16} />
              <span>{t('borrowCart')} ({borrowTotalQty})</span>
            </button>
          </div>

          {/* Drawer Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {activeTab === 'purchase' ? (
              /* --- PURCHASE CART CONTENT --- */
              purchaseCart.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6B7280' }}>
                  <ShoppingCart size={48} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Your Purchase Cart is Empty
                  </h4>
                  <p style={{ fontSize: '13px', marginBottom: '20px' }}>
                    Browse our 15 indigenous heritage seed varieties and add packets to purchase.
                  </p>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      navigate('catalogue');
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    Explore Seed Catalogue
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600 }}>
                      Selected Varieties ({purchaseCart.length})
                    </span>
                    <button
                      onClick={clearPurchaseCart}
                      style={{ background: 'none', color: '#DC2626', fontSize: '12px', fontWeight: 600 }}
                    >
                      {t('actionClearCart')}
                    </button>
                  </div>

                  {/* Cart Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {purchaseCart.map((item) => (
                      <div
                        key={item.seed._id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '10px',
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <img
                          src={item.seed.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200'}
                          alt={item.seed.name}
                          style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: '#164B35' }}>
                            {item.seed.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#6B7280' }}>
                            {item.packetWeightGrams}g/pkt • ₹{item.pricePerPacket}
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827', marginTop: '2px' }}>
                            ₹{item.pricePerPacket * item.quantity} (Total {item.packetWeightGrams * item.quantity}g)
                          </div>
                        </div>

                        {/* Qty Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #D1D5DB', borderRadius: '6px' }}>
                          <button
                            onClick={() => updatePurchaseQty(item.seed._id, item.quantity - 1)}
                            style={{ width: '28px', height: '28px', background: '#F3F4F6', fontSize: '14px' }}
                          >
                            -
                          </button>
                          <span style={{ width: '30px', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updatePurchaseQty(item.seed._id, item.quantity + 1)}
                            disabled={item.quantity >= item.seed.availableStock}
                            style={{ width: '28px', height: '28px', background: '#F3F4F6', fontSize: '14px' }}
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromPurchaseCart(item.seed._id)}
                          style={{ background: 'none', color: '#9CA3AF', padding: '6px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Delivery & Payment Options */}
                  <div style={{ backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
                    <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '10px' }}>
                      Simulated Checkout Details
                    </h5>
                    
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                      <label className="form-label">Pickup / Delivery Option</label>
                      <select
                        className="form-control"
                        value={deliveryMethod}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                      >
                        <option value="Self-Pickup at Village Library">Self-Pickup at Village Seed Desk</option>
                        <option value="Panchayat Farmer Distribution">Panchayat Farmer Distribution Counter</option>
                        <option value="Direct Farm Dispatch">Direct Farm Cluster Dispatch</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '0' }}>
                      <label className="form-label">Payment Method (Academic Demonstration)</label>
                      <select
                        className="form-control"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="Village Seed Desk / Cash on Pickup">Cash on Pickup at Village Desk</option>
                        <option value="Simulated UPI / Rural Bank Transfer">Simulated UPI / Rural Bank Transfer</option>
                        <option value="Community Seed Credit">Community Seed Bank Credit Points</option>
                      </select>
                    </div>
                  </div>

                  {/* Important Separate Billing & Weight Section */}
                  <div style={{
                    backgroundColor: '#F7F5EA',
                    padding: '18px',
                    borderRadius: '12px',
                    border: '1.5px solid #D9A441',
                    marginBottom: '20px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span style={{ color: '#4B5563' }}>{t('totalQuantity')}:</span>
                      <strong style={{ color: '#111827' }}>{purchaseTotalQty} Packets</strong>
                    </div>

                    {/* Weight Display Strictly Distinct from Bill */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '12px', color: '#047857' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                        <Scale size={15} />
                        {t('totalWeight')}:
                      </span>
                      <strong>
                        {purchaseTotalWeightGrams >= 1000
                          ? `${(purchaseTotalWeightGrams / 1000).toFixed(2)} kg`
                          : `${purchaseTotalWeightGrams} grams`}
                      </strong>
                    </div>

                    <div style={{ borderTop: '1px dashed #D1D5DB', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#164B35' }}>
                        Estimated Bill ({t('totalPrice')}):
                      </span>
                      <span style={{ fontSize: '24px', fontWeight: 800, color: '#164B35' }}>
                        ₹{purchaseTotalPrice}
                      </span>
                    </div>

                    <p style={{ fontSize: '11px', color: '#B45309', marginTop: '10px', lineHeight: 1.4 }}>
                      ⚠️ <strong>Note:</strong> {t('monetaryBillNotice')}
                    </p>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handlePurchaseCheckout}
                    disabled={isSubmitting}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%' }}
                  >
                    {isSubmitting ? 'Confirming Order...' : `${t('actionCheckout')} (₹${purchaseTotalPrice})`}
                  </button>
                </div>
              )
            ) : (
              /* --- BORROW CART CONTENT --- */
              borrowCart.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6B7280' }}>
                  <BookOpen size={48} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Your Borrow Cart is Empty
                  </h4>
                  <p style={{ fontSize: '13px', marginBottom: '20px' }}>
                    Select seed varieties to borrow for this planting season. You return harvested seeds after maturity!
                  </p>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      navigate('catalogue');
                    }}
                    className="btn btn-gold btn-sm"
                  >
                    Browse Seeds to Borrow
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600 }}>
                      Seeds for Seasonal Borrowing ({borrowCart.length})
                    </span>
                    <button
                      onClick={clearBorrowCart}
                      style={{ background: 'none', color: '#DC2626', fontSize: '12px', fontWeight: 600 }}
                    >
                      {t('actionClearCart')}
                    </button>
                  </div>

                  {/* Borrow Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {borrowCart.map((item) => (
                      <div
                        key={item.seed._id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '10px',
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <img
                          src={item.seed.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200'}
                          alt={item.seed.name}
                          style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: '#92400E' }}>
                            {item.seed.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#6B7280' }}>
                            {item.packetWeightGrams}g/packet
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#166534', marginTop: '2px' }}>
                            Free Borrow (Return after Harvest)
                          </div>
                        </div>

                        {/* Qty Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #D1D5DB', borderRadius: '6px' }}>
                          <button
                            onClick={() => updateBorrowQty(item.seed._id, item.quantity - 1)}
                            style={{ width: '28px', height: '28px', background: '#F3F4F6', fontSize: '14px' }}
                          >
                            -
                          </button>
                          <span style={{ width: '30px', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateBorrowQty(item.seed._id, item.quantity + 1)}
                            disabled={item.quantity >= item.seed.availableStock}
                            style={{ width: '28px', height: '28px', background: '#F3F4F6', fontSize: '14px' }}
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromBorrowCart(item.seed._id)}
                          style={{ background: 'none', color: '#9CA3AF', padding: '6px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Borrow Request Form */}
                  <div style={{ backgroundColor: '#FEF3C7', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
                    <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#92400E', marginBottom: '8px' }}>
                      Borrowing Commitment
                    </h5>
                    <p style={{ fontSize: '12px', color: '#78350F', lineHeight: 1.5, marginBottom: '12px' }}>
                      By borrowing, you agree to sow these seeds, follow organic practices, and return viable cleaned seeds after harvest to keep the library replenished!
                    </p>

                    <div className="form-group" style={{ marginBottom: '0' }}>
                      <label className="form-label" style={{ color: '#78350F' }}>Farming Purpose</label>
                      <input
                        type="text"
                        className="form-control"
                        value={borrowPurpose}
                        onChange={(e) => setBorrowPurpose(e.target.value)}
                        placeholder="e.g. Traditional farm trial / Kitchen garden"
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div style={{
                    backgroundColor: '#F9FAFB',
                    padding: '16px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    border: '1px solid #E5E7EB',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span>Total Packets Requested:</span>
                      <strong>{borrowTotalQty} Packets</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#047857' }}>
                      <span>Total Seed Weight:</span>
                      <strong>{borrowTotalWeightGrams} grams</strong>
                    </div>
                  </div>

                  <button
                    onClick={handleBorrowSubmit}
                    disabled={isSubmitting}
                    className="btn btn-gold btn-lg"
                    style={{ width: '100%' }}
                  >
                    {isSubmitting ? 'Submitting Request...' : `Submit Borrow Request (${borrowTotalQty} pkts)`}
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Order Confirmation & Printable Receipt Modal */}
      {orderReceipt && (
        <div className="modal-overlay" onClick={() => setOrderReceipt(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
              }}>
                <CheckCircle size={36} />
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#164B35' }}>
                Order Receipt & Confirmation
              </h3>
              <p style={{ fontSize: '13px', color: '#4B5563' }}>
                Order #{orderReceipt.orderNumber}
              </p>
            </div>

            <div style={{
              backgroundColor: '#F9FAFB',
              border: '1px dashed #D1D5DB',
              borderRadius: '10px',
              padding: '18px',
              fontSize: '13px',
              marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6B7280' }}>Date:</span>
                <span>{new Date(orderReceipt.createdAt).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6B7280' }}>Payment:</span>
                <span>{orderReceipt.paymentMethod}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ color: '#6B7280' }}>Delivery:</span>
                <span>{orderReceipt.deliveryMethod}</span>
              </div>

              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '10px', marginBottom: '10px' }}>
                <div style={{ fontWeight: 700, marginBottom: '6px', color: '#374151' }}>Purchased Varieties:</div>
                {orderReceipt.items?.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>{it.quantity}x {it.seedName} ({it.packetWeightGrams || 25}g)</span>
                    <strong>₹{it.totalItemPrice}</strong>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#047857', fontWeight: 600 }}>Combined Seed Weight:</span>
                <strong style={{ color: '#047857' }}>{orderReceipt.totalWeightGrams} grams</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '16px' }}>
                <strong style={{ color: '#164B35' }}>Total Amount Paid:</strong>
                <strong style={{ color: '#164B35', fontSize: '20px' }}>₹{orderReceipt.totalPrice}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                <Printer size={16} />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => {
                  setOrderReceipt(null);
                  setIsDrawerOpen(false);
                }}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

