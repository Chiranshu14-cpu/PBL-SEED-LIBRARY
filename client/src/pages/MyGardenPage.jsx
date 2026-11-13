import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import confetti from 'canvas-confetti';
import {
  Sprout,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Heart,
  Award,
} from 'lucide-react';

const STAGES = [
  'Seed Planted',
  'Germination',
  'Seedling',
  'Vegetative Growth',
  'Flowering',
  'Harvest Ready',
  'Harvested',
];

export const MyGardenPage = ({ navigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showToast, fetchNotifications } = useNotifications();

  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Plant Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newPlant, setNewPlant] = useState({
    seedName: 'Tomato',
    varietyName: 'Traditional Desi Heirloom',
    plotLocation: 'Home Garden Plot Bed #1',
    plantingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: '',
    stage: 'Seed Planted',
    healthStatus: 'Healthy',
    notes: '',
  });

  // Edit / Harvest Modal
  const [editingPlant, setEditingPlant] = useState(null);
  const [editStage, setEditStage] = useState('Seed Planted');
  const [editHealth, setEditHealth] = useState('Healthy');
  const [editNotes, setEditNotes] = useState('');
  const [harvestYield, setHarvestYield] = useState('');

  const fetchGarden = async () => {
    setLoading(true);
    try {
      const res = await api.get('/garden');
      if (res.success) {
        setPlants(res.plants || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load garden entries.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGarden();
  }, []);

  const handleAddPlantSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/garden', newPlant);
      if (res.success) {
        showToast(`${newPlant.seedName} added to your garden tracker!`, 'success');
        setAddModalOpen(false);
        fetchGarden();
        fetchNotifications();
      }
    } catch (err) {
      showToast(err.message || 'Failed to add plant.', 'error');
    }
  };

  const handleOpenEdit = (plant) => {
    setEditingPlant(plant);
    setEditStage(plant.stage);
    setEditHealth(plant.healthStatus || 'Healthy');
    setEditNotes(plant.notes || '');
    setHarvestYield(plant.harvestYieldNotes || '');
  };

  const handleUpdatePlantSubmit = async (e) => {
    e.preventDefault();
    if (!editingPlant) return;

    try {
      const isNewlyHarvested = editStage === 'Harvested' && editingPlant.stage !== 'Harvested';
      const res = await api.put(`/garden/${editingPlant._id}`, {
        stage: editStage,
        healthStatus: editHealth,
        notes: editNotes,
        harvestYieldNotes: harvestYield,
        actualHarvestDate: editStage === 'Harvested' ? new Date() : null,
      });

      if (res.success) {
        if (isNewlyHarvested) {
          try {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
          } catch {}
          showToast('Harvest recorded! 20 Guardian Points awarded!', 'success');
        } else {
          showToast('Plant progress updated!', 'success');
        }
        setEditingPlant(null);
        fetchGarden();
        fetchNotifications();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update plant.', 'error');
    }
  };

  const handleDeletePlant = async (id, name) => {
    if (!window.confirm(`Remove ${name} from your garden?`)) return;
    try {
      const res = await api.delete(`/garden/${id}`);
      if (res.success) {
        showToast(`${name} removed.`, 'info');
        fetchGarden();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete plant.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: 'var(--shadow-sm)',
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
            backgroundColor: '#DCFCE7',
            color: '#166534',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '10px',
          }}>
            <Sprout size={14} />
            7-Stage Crop Lifecycle Monitor
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#164B35', marginBottom: '6px' }}>
            {t('gardenTitle')}
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>
            {t('gardenSubtitle')}
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="btn btn-primary btn-md"
        >
          <Plus size={16} />
          <span>{t('addPlantBtn')}</span>
        </button>
      </div>

      {/* Plants Grid */}
      {loading ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#164B35' }}>
          <Sprout size={40} style={{ animation: 'spin 2s linear infinite', margin: '0 auto 12px' }} />
          <p>Loading your garden plots...</p>
        </div>
      ) : plants.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
          <Sprout size={48} style={{ opacity: 0.3, margin: '0 auto 14px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
            Your Garden is Ready for Sowing
          </h3>
          <p style={{ fontSize: '13px', marginBottom: '20px', maxWidth: '500px', margin: '0 auto 20px' }}>
            Log seeds you have borrowed or purchased. Track each crop across 7 visual growth stages and record harvest yields for community points!
          </p>
          <button onClick={() => setAddModalOpen(true)} className="btn btn-primary btn-md">
            <Plus size={16} />
            <span>Add Your First Crop</span>
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {plants.map((plant) => {
            const currentStageIndex = STAGES.indexOf(plant.stage);
            return (
              <div
                key={plant._id}
                className="card"
                style={{
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '24px',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#164B35' }}>
                      {plant.seedName}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>
                      {plant.varietyName} • {plant.plotLocation || 'Garden Bed'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleOpenEdit(plant)}
                      className="btn btn-secondary btn-sm"
                      title="Update Growth Stage"
                    >
                      <Edit2 size={13} />
                      <span>Update</span>
                    </button>
                    <button
                      onClick={() => handleDeletePlant(plant._id, plant.seedName)}
                      style={{ background: 'none', color: '#DC2626', padding: '6px' }}
                      title="Remove Crop"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Status Badges */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <span className="badge badge-forest">{plant.stage}</span>
                  <span className="badge badge-gold">{plant.healthStatus || 'Healthy'}</span>
                </div>

                {/* Visual 7-Stage Stepper Progress Bar */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                    <span>Growth Cycle Progress</span>
                    <span>{plant.progressPercent || 10}%</span>
                  </div>

                  {/* Visual 7 segments */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                    {STAGES.map((st, sIdx) => {
                      const isComplete = sIdx <= currentStageIndex;
                      return (
                        <div
                          key={sIdx}
                          title={st}
                          style={{
                            height: '8px',
                            borderRadius: '4px',
                            backgroundColor: isComplete ? '#164B35' : '#E5E7EB',
                            transition: 'all 0.25s ease',
                          }}
                        />
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#9CA3AF', marginTop: '4px' }}>
                    <span>1. Seed Planted</span>
                    <span>4. Vegetative</span>
                    <span>7. Harvested</span>
                  </div>
                </div>

                {/* Details Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  backgroundColor: '#F9FAFB',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  marginBottom: '14px',
                }}>
                  <div>
                    <span style={{ color: '#6B7280' }}>Planted: </span>
                    <strong>{new Date(plant.plantingDate).toLocaleDateString()}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280' }}>Expected Harvest: </span>
                    <strong>
                      {plant.expectedHarvestDate ? new Date(plant.expectedHarvestDate).toLocaleDateString() : 'In ~60-80 days'}
                    </strong>
                  </div>
                </div>

                {/* Notes or Harvest yield */}
                {plant.notes && (
                  <p style={{ fontSize: '13px', color: '#4B5563', fontStyle: 'italic', marginBottom: '10px' }}>
                    "{plant.notes}"
                  </p>
                )}

                {plant.harvestYieldNotes && (
                  <div style={{
                    backgroundColor: '#FEF3C7',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#92400E',
                    fontWeight: 600,
                  }}>
                    🌾 Recorded Harvest: {plant.harvestYieldNotes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Plant Modal */}
      {addModalOpen && (
        <div className="modal-overlay" onClick={() => setAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#164B35', marginBottom: '6px' }}>
              Add Crop to Garden Tracker
            </h3>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '18px' }}>
              Log a variety you planted in your field or home garden bed.
            </p>

            <form onSubmit={handleAddPlantSubmit}>
              <div className="form-group">
                <label className="form-label">Seed Variety Name *</label>
                <select
                  className="form-control"
                  value={newPlant.seedName}
                  onChange={(e) => setNewPlant({ ...newPlant, seedName: e.target.value })}
                >
                  <option value="Tomato">Tomato (टमाटर / टोमॅटो)</option>
                  <option value="Brinjal">Brinjal (बैंगन / वांगी)</option>
                  <option value="Okra">Okra (भिंडी / भेंडी)</option>
                  <option value="Green Chilli">Green Chilli (हरी मिर्च / मिरची)</option>
                  <option value="Cucumber">Cucumber (खीरा / काकडी)</option>
                  <option value="Pumpkin">Pumpkin (कद्दू / भोपळा)</option>
                  <option value="Spinach">Spinach (पालक / पालक)</option>
                  <option value="Radish">Radish (मूली / मुळा)</option>
                  <option value="Carrot">Carrot (गाजर / गाजर)</option>
                  <option value="Fenugreek">Fenugreek (मेथी / मेथी)</option>
                  <option value="Coriander">Coriander (धनिया / कोथिंबीर)</option>
                  <option value="Chickpea">Chickpea (चना / हरभरा)</option>
                  <option value="Green Gram">Green Gram (मूंग / मूग)</option>
                  <option value="Maize">Maize (मक्का / मका)</option>
                  <option value="Sunflower">Sunflower (सूरजमुखी / सूर्यफूल)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Field / Plot Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={newPlant.plotLocation}
                  onChange={(e) => setNewPlant({ ...newPlant, plotLocation: e.target.value })}
                  placeholder="e.g. East Bed #3 / Raised Backyard Plot"
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Planting Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newPlant.plantingDate}
                    onChange={(e) => setNewPlant({ ...newPlant, plantingDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Current Stage</label>
                  <select
                    className="form-control"
                    value={newPlant.stage}
                    onChange={(e) => setNewPlant({ ...newPlant, stage: e.target.value })}
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '22px' }}>
                <label className="form-label">Garden Notes</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={newPlant.notes}
                  onChange={(e) => setNewPlant({ ...newPlant, notes: e.target.value })}
                  placeholder="e.g. Drip irrigated with organic compost mulching..."
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Add Crop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Progress Modal */}
      {editingPlant && (
        <div className="modal-overlay" onClick={() => setEditingPlant(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#164B35', marginBottom: '6px' }}>
              Update Crop Growth: {editingPlant.seedName}
            </h3>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '18px' }}>
              Advance your plant through the 7 growth stages.
            </p>

            <form onSubmit={handleUpdatePlantSubmit}>
              <div className="form-group">
                <label className="form-label">Select Growth Stage *</label>
                <select
                  className="form-control"
                  value={editStage}
                  onChange={(e) => setEditStage(e.target.value)}
                >
                  {STAGES.map((s, idx) => (
                    <option key={s} value={s}>Stage {idx + 1}: {s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Crop Health Status</label>
                <select
                  className="form-control"
                  value={editHealth}
                  onChange={(e) => setEditHealth(e.target.value)}
                >
                  <option value="Thriving">🌿 Thriving (Vigorous growth)</option>
                  <option value="Healthy">🌱 Healthy</option>
                  <option value="Needs Water">💧 Needs Water / Dry Soil</option>
                  <option value="Pest Concern">🐛 Pest / Insect Concern</option>
                  <option value="Harvested">🏆 Harvested</option>
                </select>
              </div>

              {editStage === 'Harvested' && (
                <div className="form-group" style={{ backgroundColor: '#FEF3C7', padding: '12px', borderRadius: '8px' }}>
                  <label className="form-label" style={{ color: '#92400E' }}>Harvest Yield Details *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 15 kg ripe tomatoes, extracted 200g seeds"
                    value={harvestYield}
                    onChange={(e) => setHarvestYield(e.target.value)}
                    required={editStage === 'Harvested'}
                  />
                  <div style={{ fontSize: '11px', color: '#78350F', marginTop: '4px' }}>
                    ★ Recording harvest awards you +20 Seed Guardian Points!
                  </div>
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '22px' }}>
                <label className="form-label">Agronomic Notes</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingPlant(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Save Progress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

