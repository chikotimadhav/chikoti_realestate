import React, { useState, useEffect } from 'react';

function token() { return localStorage.getItem('ck_admin_token'); }

export default function ReelsPage() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterProp, setFilterProp] = useState('all'); // 'all', 'pending', 'approved', 'rejected'

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  async function loadReels() {
    try {
      const res = await fetch(`${apiBase}/api/reels/all`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      const data = await res.json();
      if (data.success) {
        setReels(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReels();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${apiBase}/api/reels/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update reel status');

      setSuccess(`Reel status updated to ${newStatus} successfully!`);
      loadReels();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleActive = async (id, currentActive) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${apiBase}/api/reels/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`
        },
        body: JSON.stringify({ isActive: !currentActive })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update reel visibility');

      setSuccess(`Reel visibility toggled successfully!`);
      loadReels();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this Reel?')) return;
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${apiBase}/api/reels/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete Reel');

      setSuccess('Reel deleted successfully!');
      loadReels();
    } catch (err) {
      setError(err.message);
    }
  };

  // Helper to detect URL type for summary display
  const getUrlTypeLabel = (url) => {
    if (!url) return '';
    if (url.includes('instagram.com/')) return '📸 Instagram Reel';
    if (url.includes('youtube.com/') || url.includes('youtu.be/')) return '🎥 YouTube Short/Video';
    if (url.match(/\.(mp4|webm|ogg|mov)(?:\?|$)/i)) return '💾 Direct MP4 Video';
    return '🔗 Web Link';
  };

  const filteredReels = filterProp === 'all'
    ? reels
    : reels.filter(r => r.status === filterProp || (!r.status && filterProp === 'pending'));

  const STATUS_BADGE = {
    pending: { label: 'Pending Approval', style: { background: '#FEF3C7', color: '#B45309' } },
    approved: { label: 'Approved', style: { background: '#D1FAE5', color: '#065F46' } },
    rejected: { label: 'Rejected', style: { background: '#FEE2E2', color: '#991B1B' } },
  };

  return (
    <>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div className="page-title">🎥 Reels Portal (Admin Approval)</div>
          <div className="page-sub">Review, approve, or reject short video uploads submitted by sellers</div>
        </div>
      </div>

      {/* Filter and Messages */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: '#F1F5F9', padding: '0.25rem', borderRadius: 8 }}>
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilterProp(f)}
              style={{
                padding: '0.4rem 1rem', borderRadius: 6, fontSize: '0.82rem', fontWeight: 700, border: 'none',
                background: filterProp === f ? 'white' : 'none',
                color: filterProp === f ? '#0F172A' : '#64748B',
                boxShadow: filterProp === f ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? reels.length : reels.filter(r => r.status === f || (!r.status && f === 'pending')).length})
            </button>
          ))}
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', color: 'var(--danger)', fontSize: '0.8rem', padding: '0.5rem 1rem', borderRadius: 8, fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#ECFDF5', color: 'var(--success)', fontSize: '0.8rem', padding: '0.5rem 1rem', borderRadius: 8, fontWeight: 600 }}>
            ✅ {success}
          </div>
        )}
      </div>

      {/* Reels List Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📋</span> Reels Approval Pipeline
        </h3>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Seller</th>
                <th>Reel Details</th>
                <th>Status</th>
                <th>Visibility</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>
                    Loading reels...
                  </td>
                </tr>
              ) : filteredReels.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>
                    No reels found matching this filter.
                  </td>
                </tr>
              ) : (
                filteredReels.map((reel) => {
                  const currStatus = reel.status || 'pending';
                  const badge = STATUS_BADGE[currStatus] || STATUS_BADGE.pending;
                  
                  return (
                    <tr key={reel.id || reel._id}>
                      <td style={{ width: '130px', fontWeight: 600, fontSize: '0.75rem' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          background: reel.videoUrl.includes('instagram.com') ? '#FDF2F8' : reel.videoUrl.includes('youtube.com') || reel.videoUrl.includes('youtu.be') ? '#FEF2F2' : '#F0FDF4',
                          color: reel.videoUrl.includes('instagram.com') ? '#DB2777' : reel.videoUrl.includes('youtube.com') || reel.videoUrl.includes('youtu.be') ? '#DC2626' : '#16A34A',
                        }}>
                          {getUrlTypeLabel(reel.videoUrl)}
                        </span>
                      </td>
                      <td style={{ maxWidth: '180px' }}>
                        {reel.seller_id ? (
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--navy)' }}>{reel.seller_id.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>{reel.seller_id.email}</div>
                            <span style={{ fontSize: '0.65rem', background: '#E2E8F0', padding: '0.1rem 0.3rem', borderRadius: 4, fontWeight: 700 }}>
                              {reel.seller_id.role?.toUpperCase()}
                            </span>
                          </div>
                        ) : (
                          <div style={{ color: 'var(--gray-400)', fontStyle: 'italic', fontSize: '0.85rem' }}>Seeded/Admin</div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--navy)' }}>
                          {reel.title || <em style={{ color: 'var(--gray-400)' }}>No Title</em>}
                        </div>
                        {reel.description && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.1rem' }}>
                            {reel.description}
                          </div>
                        )}
                        <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', marginTop: '0.2rem' }}>
                          Layout Ratio: <strong>{reel.aspectRatio || '9/16'}</strong>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--indigo)', marginTop: '0.2rem', wordBreak: 'break-all' }}>
                          🔗 <a href={reel.videoUrl} target="_blank" rel="noreferrer">{reel.videoUrl}</a>
                        </div>
                      </td>
                      <td>
                        <span 
                          className="badge" 
                          style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: '999px',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px',
                            ...badge.style
                          }}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td>
                        <span 
                          onClick={() => handleToggleActive(reel.id || reel._id, reel.isActive)}
                          className={`badge ${reel.isActive ? 'badge-approved' : 'badge-rejected'}`}
                          style={{ cursor: 'pointer', userSelect: 'none' }}
                          title="Click to toggle active status"
                        >
                          {reel.isActive ? '🟢 Active' : '🔴 Inactive'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '110px' }}>
                          {currStatus !== 'approved' && (
                            <button 
                              className="btn btn-teal btn-sm"
                              style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', justifyContent: 'center', background: '#0D9488', color: 'white' }}
                              onClick={() => handleUpdateStatus(reel.id || reel._id, 'approved')}
                            >
                              ✓ Approve
                            </button>
                          )}
                          {currStatus !== 'rejected' && (
                            <button 
                              className="btn btn-danger btn-sm"
                              style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', justifyContent: 'center' }}
                              onClick={() => handleUpdateStatus(reel.id || reel._id, 'rejected')}
                            >
                              ✕ Reject
                            </button>
                          )}
                          <button 
                            className="btn btn-ghost btn-sm"
                            style={{ 
                              padding: '0.3rem 0.5rem', fontSize: '0.75rem', justifyContent: 'center',
                              borderColor: 'var(--gray-200)',
                              color: 'var(--slate-600)',
                              background: 'transparent'
                            }}
                            onClick={() => handleDelete(reel.id || reel._id)}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
