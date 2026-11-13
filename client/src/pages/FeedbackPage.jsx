import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Star,
  MessageSquare,
  Send,
  CornerDownRight,
  Shield,
  Heart,
  CheckCircle,
  Sprout,
} from 'lucide-react';

export const FeedbackPage = ({ navigate }) => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { showToast, fetchNotifications } = useNotifications();

  const [feedbacks, setFeedbacks] = useState([]);
  const [averages, setAverages] = useState({ overall: 5, seedQuality: 5, platformExperience: 5 });
  const [loading, setLoading] = useState(true);

  // Form State
  const [overallRating, setOverallRating] = useState(5);
  const [seedQualityRating, setSeedQualityRating] = useState(5);
  const [platformRating, setPlatformRating] = useState(5);
  const [comment, setComment] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Admin Reply State
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await api.get('/feedback');
      if (res.success) {
        setFeedbacks(res.feedbacks || []);
        if (res.averages) setAverages(res.averages);
      }
    } catch (err) {
      console.error('Failed to load feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please log in to submit community feedback.', 'error');
      navigate('login');
      return;
    }

    if (!comment.trim()) {
      showToast('Please write your comments or experience.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/feedback', {
        overallRating,
        seedQualityRating,
        platformExperienceRating: platformRating,
        comment,
        suggestions,
      });

      if (res.success) {
        showToast('Thank you! 15 Guardian Points awarded for your review.', 'success');
        setComment('');
        setSuggestions('');
        fetchFeedback();
        fetchNotifications();
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit feedback.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostReply = async (feedbackId) => {
    if (!replyText.trim()) return;
    try {
      const res = await api.put(`/feedback/${feedbackId}/reply`, {
        adminReply: replyText,
      });
      if (res.success) {
        showToast('Reply published successfully.', 'success');
        setReplyingId(null);
        setReplyText('');
        fetchFeedback();
      }
    } catch (err) {
      showToast(err.message || 'Failed to post reply.', 'error');
    }
  };

  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', gap: '2px', color: '#D9A441' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= rating ? '#D9A441' : 'none'}
            strokeWidth={1.5}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Title Bar */}
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
            <MessageSquare size={14} />
            Community Voice & Transparency
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#164B35', marginBottom: '6px' }}>
            {t('feedbackTitle')}
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>
            {t('feedbackSubtitle')}
          </p>
        </div>

        {/* Aggregate Ratings Scorecard */}
        <div style={{
          display: 'flex',
          gap: '16px',
          backgroundColor: '#F7F5EA',
          border: '1.5px solid #D9A441',
          padding: '16px 20px',
          borderRadius: '16px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#164B35' }}>
              ★ {averages.overall}
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>Overall Satisfaction</div>
          </div>
          <div style={{ width: '1px', backgroundColor: '#D9A441' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#166534' }}>
              ★ {averages.seedQuality}
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>Seed Germination Rate</div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Submit Review Card */}
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#164B35', marginBottom: '16px' }}>
            Submit Your Seed Viability & Platform Review
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">{t('overallRating')}</label>
                <div style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setOverallRating(s)}
                      style={{ background: 'none', padding: '2px' }}
                    >
                      <Star size={24} color="#D9A441" fill={s <= overallRating ? '#D9A441' : 'none'} />
                    </button>
                  ))}
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#D9A441', alignSelf: 'center', marginLeft: '6px' }}>
                    {overallRating} / 5 Stars
                  </span>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">{t('seedQualityRating')}</label>
                  <select
                    className="form-control"
                    value={seedQualityRating}
                    onChange={(e) => setSeedQualityRating(Number(e.target.value))}
                  >
                    <option value={5}>★★★★★ 5 - Superb Viability</option>
                    <option value={4}>★★★★☆ 4 - Good Germination</option>
                    <option value={3}>★★★☆☆ 3 - Average Germination</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">{t('platformRating')}</label>
                  <select
                    className="form-control"
                    value={platformRating}
                    onChange={(e) => setPlatformRating(Number(e.target.value))}
                  >
                    <option value={5}>★★★★★ 5 - Very Easy to Use</option>
                    <option value={4}>★★★★☆ 4 - Good</option>
                    <option value={3}>★★★☆☆ 3 - Standard</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('feedbackComment')} *</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Share your practical experience with seed germination, seedling vigor, disease resistance..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '22px' }}>
              <label className="form-label">{t('feedbackSuggestions')}</label>
              <input
                type="text"
                className="form-control"
                placeholder="Suggestions for village seed fairs, new varieties to stock..."
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              {submitting ? 'Submitting...' : `${t('submitFeedback')} (+15 Points)`}
            </button>
          </form>
        </div>

        {/* Community Feedback Thread */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#164B35', marginBottom: '16px' }}>
            Farmer Community Reviews ({feedbacks.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflowY: 'auto', maxHeight: '550px' }}>
            {feedbacks.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                No feedback reviews yet. Be the first to share your experience!
              </div>
            ) : (
              feedbacks.map((f) => (
                <div
                  key={f._id}
                  style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    padding: '16px',
                    backgroundColor: '#F9FAFB',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#164B35' }}>{f.userName}</strong>
                      <div style={{ fontSize: '11px', color: '#6B7280' }}>
                        {f.user?.villageCity || 'Ralegan Siddhi'} • {new Date(f.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {renderStars(f.overallRating)}
                  </div>

                  <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.5, margin: '8px 0' }}>
                    "{f.comment}"
                  </p>

                  {f.suggestions && (
                    <div style={{ fontSize: '12px', color: '#047857', marginBottom: '6px' }}>
                      💡 Suggestion: {f.suggestions}
                    </div>
                  )}

                  {/* Admin Reply */}
                  {f.adminReply && (
                    <div style={{
                      marginTop: '10px',
                      padding: '10px 14px',
                      backgroundColor: '#FFFFFF',
                      borderLeft: '3px solid #164B35',
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}>
                      <div style={{ fontWeight: 700, color: '#164B35', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CornerDownRight size={13} />
                        Seed Vault Administration Reply:
                      </div>
                      <div style={{ color: '#4B5563', marginTop: '3px' }}>
                        {f.adminReply}
                      </div>
                    </div>
                  )}

                  {/* Admin reply trigger */}
                  {user?.role === 'admin' && !f.adminReply && (
                    <div style={{ marginTop: '8px' }}>
                      {replyingId === f._id ? (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Write official administration response..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            style={{ height: '36px', fontSize: '12px' }}
                          />
                          <button
                            onClick={() => handlePostReply(f._id)}
                            className="btn btn-primary btn-sm"
                          >
                            Post
                          </button>
                          <button
                            onClick={() => setReplyingId(null)}
                            className="btn btn-secondary btn-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setReplyingId(f._id);
                            setReplyText('');
                          }}
                          style={{ background: 'none', color: '#164B35', fontSize: '12px', fontWeight: 700 }}
                        >
                          + Reply as Administrator
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

