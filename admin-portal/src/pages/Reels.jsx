import React, { useState, useEffect } from 'react';

function token() { return localStorage.getItem('ck_admin_token'); }

export default function ReelsPage() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoUrl) {
      setError('Please provide a Reel video URL.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${apiBase}/api/reels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`
        },
        body: JSON.stringify({
          title,
          videoUrl,
          description
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add Reel');

      setSuccess('Reel added and published successfully!');
      setTitle('');
      setVideoUrl('');
      setDescription('');
      
      loadReels();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
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
      if (!res.ok) throw new Error(data.error || 'Failed to update reel status');

      setSuccess(`Reel ${!currentActive ? 'activated' : 'deactivated'} successfully!`);
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

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">🎥 Reels Portal</div>
          <div className="page-sub">Manage short video links and reels showing on the buyer portal</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Reel Form Card */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>➕</span> Add New Reel Link
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)' }}>Reel Video URL *</label>
              <input 
                type="url" 
                className="form-input" 
                placeholder="e.g. https://www.instagram.com/reel/C8..." 
                value={videoUrl} 
                onChange={e => setVideoUrl(e.target.value)} 
                required
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>
                Supports Instagram Reels, YouTube Shorts/Videos, or direct video file URLs (.mp4)
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)' }}>Reel Title (Optional)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Luxury Villa Tour in Siddipet" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)' }}>Description (Optional)</label>
              <textarea 
                className="form-input" 
                rows={3}
                placeholder="Brief description of the reel..." 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', color: 'var(--danger)', fontSize: '0.8rem', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius)', fontWeight: 500 }}>
                ⚠️ {error}
              </div>
            )}

            {success && (
              <div style={{ background: '#ECFDF5', color: 'var(--success)', fontSize: '0.8rem', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius)', fontWeight: 500 }}>
                ✅ {success}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-indigo" 
              style={{ justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem' }}
              disabled={submitting}
            >
              {submitting ? 'Adding Reel...' : '🚀 Publish Reel'}
            </button>
          </form>
        </div>

        {/* Reels List Card */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📋</span> Active & Past Reels
          </h3>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>
                      Loading reels...
                    </td>
                  </tr>
                ) : reels.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>
                      No reels added yet.
                    </td>
                  </tr>
                ) : (
                  reels.map((reel) => (
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
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--navy)' }}>
                          {reel.title || <em style={{ color: 'var(--gray-400)' }}>No Title</em>}
                        </div>
                        {reel.description && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.1rem' }}>
                            {reel.description}
                          </div>
                        )}
                        <div style={{ fontSize: '0.72rem', color: 'var(--indigo)', marginTop: '0.2rem', wordBreak: 'break-all' }}>
                          🔗 <a href={reel.videoUrl} target="_blank" rel="noreferrer">{reel.videoUrl}</a>
                        </div>
                      </td>
                      <td>
                        <span 
                          onClick={() => handleToggleActive(reel.id || reel._id, reel.isActive)}
                          className={`badge ${reel.isActive ? 'badge-approved' : 'badge-rejected'}`}
                          style={{ cursor: 'pointer', userSelect: 'none' }}
                          title="Click to toggle status"
                        >
                          {reel.isActive ? '🟢 Active' : '🔴 Inactive'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button 
                            className="btn btn-ghost btn-sm"
                            style={{
                              borderColor: 'var(--gray-200)',
                              color: reel.isActive ? 'var(--gray-400)' : 'var(--indigo)',
                              background: 'transparent'
                            }}
                            onClick={() => handleToggleActive(reel.id || reel._id, reel.isActive)}
                          >
                            {reel.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.35rem 0.5rem' }}
                            onClick={() => handleDelete(reel.id || reel._id)}
                            title="Delete reel"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}
