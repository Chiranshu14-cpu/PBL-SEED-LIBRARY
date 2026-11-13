import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, BookOpen, Info, ShieldCheck, Sun, Droplets } from 'lucide-react';

export const SeedCard = ({ seed, onOpenDetail, onPromptLogin }) => {
  const { language, t } = useLanguage();
  const { addToPurchaseCart, addToBorrowCart } = useCart();
  const { isAuthenticated } = useAuth();

  const getVernacularName = () => {
    if (language === 'hi' && seed.vernacularNames?.hi) return seed.vernacularNames.hi;
    if (language === 'mr' && seed.vernacularNames?.mr) return seed.vernacularNames.mr;
    return seed.vernacularNames?.en || seed.name;
  };

  const isLowStock = seed.availableStock > 0 && seed.availableStock <= (seed.lowStockThreshold || 15);
  const isOutOfStock = seed.availableStock <= 0;

  const handlePurchase = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      if (onPromptLogin) onPromptLogin();
      return;
    }
    addToPurchaseCart(seed, 1);
  };

  const handleBorrow = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      if (onPromptLogin) onPromptLogin();
      return;
    }
    addToBorrowCart(seed, 1);
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Vegetables': return '#166534';
      case 'Herbs': return '#047857';
      case 'Pulses': return '#B45309';
      case 'Grains': return '#92400E';
      case 'Flowers': return '#BE185D';
      default: return '#1F2937';
    }
  };

  return (
    <div
      className="card card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        overflow: 'hidden',
        border: '1px solid rgba(22, 75, 53, 0.1)',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Image Container with Badges */}
      <div style={{ position: 'relative', width: '100%', height: '190px', overflow: 'hidden', backgroundColor: '#F3F4F6' }}>
        <img
          src={seed.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'}
          alt={seed.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.35s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        
        {/* Category Pill */}
        <span style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: '#FFFFFF',
          color: getCategoryColor(seed.category),
          fontSize: '11px',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: '999px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
        }}>
          {seed.category}
        </span>

        {/* Stock Badge */}
        <span style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: isOutOfStock ? '#DC2626' : isLowStock ? '#D97706' : '#166534',
          color: '#FFFFFF',
          fontSize: '11px',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: '999px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        }}>
          {isOutOfStock ? t('statusOutOfStock') : isLowStock ? `${t('statusLowStock')} (${seed.availableStock})` : `${seed.availableStock} in stock`}
        </span>

        {/* Heritage Tag */}
        {seed.isHeritageVariety && (
          <span style={{
            position: 'absolute',
            bottom: '10px',
            left: '12px',
            backgroundColor: 'rgba(13, 53, 38, 0.85)',
            backdropFilter: 'blur(2px)',
            color: '#FDE68A',
            fontSize: '10px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <ShieldCheck size={12} />
            Desi Landrace
          </span>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#164B35', lineHeight: 1.2 }}>
              {seed.name}
            </h3>
            <div style={{ fontSize: '13px', color: '#B45309', fontWeight: 600 }}>
              {getVernacularName()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '19px', fontWeight: 800, color: '#0D3526' }}>
              ₹{seed.pricePerPacket}
            </span>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>
              / packet
            </div>
          </div>
        </div>

        <div style={{
          fontSize: '12px',
          fontStyle: 'italic',
          color: '#6B7280',
          marginBottom: '10px',
        }}>
          {seed.scientificName}
        </div>

        <p style={{
          fontSize: '13px',
          color: '#4B5563',
          lineHeight: 1.5,
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}>
          {seed.description?.[language] || seed.description?.en || seed.description}
        </p>

        {/* Quick Attributes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          backgroundColor: '#F9FAFB',
          padding: '10px',
          borderRadius: '8px',
          fontSize: '11px',
          color: '#4B5563',
          marginBottom: '16px',
        }}>
          <div>
            <span style={{ fontWeight: 600, color: '#111827' }}>Weight: </span>
            {seed.packetWeightDisplay || `${seed.packetWeightGrams}g`}
          </div>
          <div>
            <span style={{ fontWeight: 600, color: '#111827' }}>Harvest: </span>
            {seed.harvestPeriod || '60-80 Days'}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              onClick={handlePurchase}
              disabled={isOutOfStock}
              className="btn btn-primary btn-sm"
              style={{
                width: '100%',
                opacity: isOutOfStock ? 0.5 : 1,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              }}
            >
              <ShoppingCart size={14} />
              <span>{t('actionAddCart')}</span>
            </button>

            <button
              onClick={handleBorrow}
              disabled={isOutOfStock}
              className="btn btn-gold btn-sm"
              style={{
                width: '100%',
                opacity: isOutOfStock ? 0.5 : 1,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              }}
            >
              <BookOpen size={14} />
              <span>{t('actionBorrow')}</span>
            </button>
          </div>

          <button
            onClick={() => onOpenDetail(seed)}
            style={{
              background: 'none',
              color: '#164B35',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '6px 0',
            }}
          >
            <Info size={14} />
            <span>{t('actionViewDetails')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

