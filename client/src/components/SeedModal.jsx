import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  X,
  ShoppingCart,
  BookOpen,
  Calendar,
  Clock,
  Sun,
  Droplets,
  Layers,
  Sprout,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const SeedModal = ({ seed, onClose, onPromptLogin }) => {
  const { language, t } = useLanguage();
  const { addToPurchaseCart, addToBorrowCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);

  if (!seed) return null;

  const isLowStock = seed.availableStock > 0 && seed.availableStock <= (seed.lowStockThreshold || 15);
  const isOutOfStock = seed.availableStock <= 0;

  const handlePurchase = () => {
    if (!isAuthenticated) {
      if (onPromptLogin) onPromptLogin();
      return;
    }
    addToPurchaseCart(seed, quantity);
    onClose();
  };

  const handleBorrow = () => {
    if (!isAuthenticated) {
      if (onPromptLogin) onPromptLogin();
      return;
    }
    addToBorrowCart(seed, quantity);
    onClose();
  };

  const vernacularName = seed.vernacularNames?.[language] || seed.vernacularNames?.en || seed.name;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', padding: '0', overflow: 'hidden' }}
      >
        {/* Modal Header Image */}
        <div style={{ position: 'relative', width: '100%', height: '260px' }}>
          <img
            src={seed.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'}
            alt={seed.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(13, 53, 38, 0.9) 0%, rgba(13, 53, 38, 0.3) 60%, transparent 100%)',
          }} />

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: '#FFFFFF',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>

          {/* Title overlay */}
          <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px', color: '#FFFFFF' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-gold">{seed.category}</span>
              <span className="badge badge-heritage">Desi Heritage Landrace</span>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, lineHeight: 1.1 }}>
              {seed.name}
            </h2>
            <div style={{ fontSize: '15px', color: '#FDE68A', fontWeight: 600 }}>
              {vernacularName} • <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#A8BFA3' }}>{seed.scientificName}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px', maxHeight: '60vh', overflowY: 'auto' }}>
          {/* Pricing & Stock Summary Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F7F5EA',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            border: '1px solid #E5E7EB',
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>
                {t('price')} per Packet
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#164B35' }}>
                ₹{seed.pricePerPacket}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>
                {t('pktWeight')}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#1F2937' }}>
                {seed.packetWeightDisplay || `${seed.packetWeightGrams}g`}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>
                Library Availability
              </div>
              <div style={{
                fontSize: '15px',
                fontWeight: 700,
                color: isOutOfStock ? '#DC2626' : isLowStock ? '#D97706' : '#166534',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}>
                {isOutOfStock ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                <span>{seed.availableStock} packets ready</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#164B35', marginBottom: '8px' }}>
              Variety Overview & Agricultural Importance
            </h4>
            <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7 }}>
              {seed.description?.[language] || seed.description?.en || seed.description}
            </p>
          </div>

          {/* Cultivation Specifications Grid */}
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#164B35', marginBottom: '12px' }}>
            Agronomic & Cultivation Parameters
          </h4>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            marginBottom: '24px',
          }}>
            <div style={specCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#164B35', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                <Calendar size={16} />
                <span>{t('season')}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#4B5563' }}>{seed.growingSeason || 'Kharif / Rabi'}</div>
            </div>

            <div style={specCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#164B35', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                <Clock size={16} />
                <span>{t('germination')}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#4B5563' }}>{seed.germinationPeriod || '6 - 10 Days'}</div>
            </div>

            <div style={specCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#164B35', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                <Sprout size={16} />
                <span>{t('harvest')}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#4B5563' }}>{seed.harvestPeriod || '65 - 80 Days'}</div>
            </div>

            <div style={specCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#164B35', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                <Sun size={16} />
                <span>{t('sunlight')}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#4B5563' }}>{seed.sunlight || 'Full Sun'}</div>
            </div>

            <div style={specCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#164B35', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                <Layers size={16} />
                <span>{t('soil')}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#4B5563' }}>{seed.soilRequirements || 'Fertile loamy soil'}</div>
            </div>

            <div style={specCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#164B35', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                <Droplets size={16} />
                <span>{t('watering')}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#4B5563' }}>{seed.watering || 'Moderate irrigation'}</div>
            </div>
          </div>

          {/* Sowing Instructions */}
          <div style={{
            backgroundColor: '#EBF2E9',
            padding: '16px 20px',
            borderRadius: '12px',
            borderLeft: '4px solid #164B35',
            marginBottom: '24px',
          }}>
            <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#164B35', marginBottom: '6px' }}>
              🌾 {t('instructions')}
            </h5>
            <p style={{ fontSize: '13px', color: '#1F2937', lineHeight: 1.6 }}>
              {seed.growingInstructions || 'Sow in well-manured soil at 1-2cm depth. Keep moist until germination. Thin seedlings for optimal root aeration.'}
            </p>
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            paddingTop: '16px',
            borderTop: '1px solid #E5E7EB',
          }}>
            {/* Quantity Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563' }}>
                Packets:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #D1D5DB', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '36px', height: '36px', background: '#F3F4F6', fontSize: '16px', fontWeight: 700 }}
                >
                  -
                </button>
                <span style={{ width: '44px', textAlign: 'center', fontSize: '14px', fontWeight: 700 }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(seed.availableStock, quantity + 1))}
                  disabled={quantity >= seed.availableStock}
                  style={{ width: '36px', height: '36px', background: '#F3F4F6', fontSize: '16px', fontWeight: 700 }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handlePurchase}
                disabled={isOutOfStock}
                className="btn btn-primary btn-md"
                style={{ opacity: isOutOfStock ? 0.5 : 1 }}
              >
                <ShoppingCart size={16} />
                <span>Purchase ({quantity} pkts • ₹{seed.pricePerPacket * quantity})</span>
              </button>

              <button
                onClick={handleBorrow}
                disabled={isOutOfStock}
                className="btn btn-gold btn-md"
                style={{ opacity: isOutOfStock ? 0.5 : 1 }}
              >
                <BookOpen size={16} />
                <span>Borrow ({quantity} pkts)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const specCardStyle = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  padding: '12px 14px',
  borderRadius: '10px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

