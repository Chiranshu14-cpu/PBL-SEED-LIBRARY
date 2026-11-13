import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { SeedCard } from '../components/SeedCard';
import { SeedModal } from '../components/SeedModal';
import {
  Search,
  Filter,
  ArrowUpDown,
  Sprout,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const CataloguePage = ({ navigate }) => {
  const { t, language } = useLanguage();

  const [seeds, setSeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availability, setAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('nameAsc');

  // Selected Seed for Modal
  const [selectedSeed, setSelectedSeed] = useState(null);

  const categories = [
    { id: 'All', label: t('actionAll') },
    { id: 'Vegetables', label: t('catVegetables') },
    { id: 'Herbs', label: t('catHerbs') },
    { id: 'Pulses', label: t('catPulses') },
    { id: 'Grains', label: t('catGrains') },
    { id: 'Flowers', label: t('catFlowers') },
  ];

  const fetchSeeds = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);
      if (search.trim()) queryParams.append('search', search.trim());
      if (availability !== 'all') queryParams.append('availability', availability);
      if (sortBy) queryParams.append('sort', sortBy);

      const res = await api.get(`/seeds?${queryParams.toString()}`);
      if (res.success) {
        setSeeds(res.seeds || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load seeds from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSeeds();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, selectedCategory, availability, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setAvailability('all');
    setSortBy('nameAsc');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Title & Introduction */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid rgba(22, 75, 53, 0.08)',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#EBF2E9',
          color: '#164B35',
          padding: '4px 12px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: 700,
          marginBottom: '12px',
        }}>
          <Sprout size={15} />
          <span>Village Germplasm Collection</span>
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#164B35', marginBottom: '8px' }}>
          {t('navCatalogue')}
        </h1>
        <p style={{ fontSize: '15px', color: '#4B5563', maxWidth: '800px', lineHeight: 1.6 }}>
          Browse our preserved 15 traditional village heirloom varieties. Certified non-hybrid, open-pollinated seeds adapted to local soil and rainfall conditions. Available for seasonal borrowing and purchase.
        </p>

        {/* Search & Filter Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto auto',
          gap: '12px',
          marginTop: '24px',
          alignItems: 'center',
        }} className="catalogue-filter-bar">
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by seed name, botanical name, or Marathi/Hindi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '40px', height: '44px' }}
            />
            <Search
              size={18}
              color="#9CA3AF"
              style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '12px',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  color: '#9CA3AF',
                  fontSize: '14px',
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Availability Filter */}
          <select
            className="form-control"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            style={{ height: '44px', minWidth: '150px' }}
          >
            <option value="all">All Availability</option>
            <option value="inStock">In Stock Only</option>
            <option value="lowStock">Low Stock Alert</option>
            <option value="outOfStock">Out of Stock</option>
          </select>

          {/* Sort By Dropdown */}
          <select
            className="form-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ height: '44px', minWidth: '170px' }}
          >
            <option value="nameAsc">Alphabetical (A - Z)</option>
            <option value="nameDesc">Alphabetical (Z - A)</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="stockHigh">Available Stock (High)</option>
          </select>

          {/* Reset Filters */}
          <button
            onClick={handleResetFilters}
            className="btn btn-secondary"
            style={{ height: '44px', padding: '0 16px' }}
            title="Reset All Filters"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>

        {/* Category Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '16px',
        }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                backgroundColor: selectedCategory === cat.id ? '#164B35' : '#F3F4F6',
                color: selectedCategory === cat.id ? '#FFFFFF' : '#374151',
                border: selectedCategory === cat.id ? '1px solid #164B35' : '1px solid #E5E7EB',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Seed Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#164B35' }}>
          <Sprout size={48} style={{ animation: 'spin 2s linear infinite', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Retrieving Seed Inventory from MongoDB...</h3>
        </div>
      ) : error ? (
        <div style={{
          backgroundColor: '#FEE2E2',
          padding: '24px',
          borderRadius: '12px',
          color: '#991B1B',
          textAlign: 'center',
        }}>
          <AlertTriangle size={32} style={{ margin: '0 auto 10px' }} />
          <h4 style={{ fontWeight: 700 }}>Database Connection Notice</h4>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>{error}</p>
        </div>
      ) : seeds.length === 0 ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '60px 20px',
          textAlign: 'center',
          color: '#6B7280',
        }}>
          <Sprout size={48} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
            No Matching Seed Varieties Found
          </h3>
          <p style={{ fontSize: '13px', marginBottom: '20px' }}>
            Try adjusting your search criteria or resetting the category filter.
          </p>
          <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {seeds.map((seed) => (
            <SeedCard
              key={seed._id}
              seed={seed}
              onOpenDetail={(s) => setSelectedSeed(s)}
              onPromptLogin={() => navigate('login')}
            />
          ))}
        </div>
      )}

      {/* Seed Detail Modal */}
      {selectedSeed && (
        <SeedModal
          seed={selectedSeed}
          onClose={() => setSelectedSeed(null)}
          onPromptLogin={() => navigate('login')}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .catalogue-filter-bar {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

