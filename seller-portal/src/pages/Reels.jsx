import React, { useState, useEffect } from 'react';

function token() { return localStorage.getItem('ck_seller_token'); }

export default function ReelsPage() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'link'
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [aspectRatio, setAspectRatio] = useState('9/16');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  async function loadReels(silent = false) {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/reels/seller/mine`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      const data = await res.json();
      if (data.success) {
        setReels(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    loadReels(false);
    const interval = setInterval(() => loadReels(true), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let finalVideoUrl = videoUrl;

    if (uploadType === 'file') {
      if (!videoFile) {
        setError('Please select a video file to upload.');
        return;
      }
    } else {
      if (!videoUrl) {
        setError('Please provide a video URL.');
        return;
      }
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      if (uploadType === 'file') {
        // Upload the file first
        const formData = new FormData();
        formData.append('video', videoFile);

        const uploadRes = await fetch(`${apiBase}/api/upload/video`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token()}`
          },
          body: formData
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Failed to upload video file');
        finalVideoUrl = uploadData.data.url;
      }

      const res = await fetch(`${apiBase}/api/reels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`
        },
        body: JSON.stringify({
          title,
          videoUrl: finalVideoUrl,
          description,
          aspectRatio
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit Reel');

      setSuccess('Reel submitted successfully! Awaiting administrator approval.');
      setTitle('');
      setVideoUrl('');
      setVideoFile(null);
      const fileInput = document.getElementById('video-file-input');
      if (fileInput) fileInput.value = '';

      setDescription('');
      setAspectRatio('9/16');
      
      loadReels(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this Reel link?')) return;
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
      loadReels(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const getUrlTypeLabel = (url) => {
    if (!url) return '';
    if (url.includes('instagram.com/')) return '📸 Instagram Reel';
    if (url.includes('youtube.com/') || url.includes('youtu.be/')) return '🎥 YouTube Short';
    if (url.match(/\.(mp4|webm|ogg|mov)(?:\?|$)/i) || url.includes('/uploads/')) return '💾 Direct MP4 Video';
    return '🔗 Web Link';
  };

  const STATUS_BADGE = {
    pending: { label: '⏳ Pending Approval', style: { background: '#FEF3C7', color: '#B45309' } },
    approved: { label: '✅ Approved & Live', style: { background: '#D1FAE5', color: '#065F46' } },
    rejected: { label: '❌ Rejected', style: { background: '#FEE2E2', color: '#991B1B' } },
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>🎥 Reels Portal</h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
          Upload property videos or virtual tours as short vertical clips
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* Submit form card */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>
            ➕ Submit Reel Video
          </h3>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', background: '#F1F5F9', padding: '0.25rem', borderRadius: '8px' }}>
            <button
              type="button"
              onClick={() => { setUploadType('file'); setError(''); }}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                background: uploadType === 'file' ? '#0F172A' : 'transparent',
                color: uploadType === 'file' ? '#FFFFFF' : '#475569',
                transition: 'all 0.2s'
              }}
            >
              📹 Upload Video File
            </button>
            <button
              type="button"
              onClick={() => { setUploadType('link'); setError(''); }}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                background: uploadType === 'link' ? '#0F172A' : 'transparent',
                color: uploadType === 'link' ? '#FFFFFF' : '#475569',
                transition: 'all 0.2s'
              }}
            >
              🔗 Paste Video Link
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {uploadType === 'file' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Select Video File *</label>
                <input 
                  id="video-file-input"
                  type="file" 
                  accept="video/*"
                  className="form-input" 
                  onChange={e => setVideoFile(e.target.files[0])}
                  required
                />
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  Supports MP4, MOV, WebM, etc. Recommended: portrait (9:16) format. Max 50MB.
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Reel Video URL *</label>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="e.g. https://www.instagram.com/reel/..." 
                  value={videoUrl} 
                  onChange={e => setVideoUrl(e.target.value)} 
                  required
                />
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  Supports Instagram Reels, YouTube Shorts, or direct video file links (.mp4)
                </span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Reel Title (Optional)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Luxury Agricultural Land Tour" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Video Layout Aspect Ratio</label>
              <select 
                className="form-input" 
                value={aspectRatio} 
                onChange={e => setAspectRatio(e.target.value)}
                style={{ background: '#F8FAFC' }}
              >
                <option value="9/16">Portrait (9:16) - Instagram Reels / YouTube Shorts</option>
                <option value="1/1">Square (1:1)</option>
                <option value="16/9">Landscape (16:9)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Description (Optional)</label>
              <textarea 
                className="form-input" 
                rows={3}
                placeholder="Brief summary or crop/property details..." 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', color: '#EF4444', fontSize: '0.82rem', padding: '0.6rem 0.8rem', borderRadius: 8, fontWeight: 600 }}>
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div style={{ background: '#ECFDF5', color: '#10B981', fontSize: '0.82rem', padding: '0.6rem 0.8rem', borderRadius: 8, fontWeight: 600 }}>
                ✓ {success}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-teal" 
              style={{ justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem', width: '100%' }}
              disabled={submitting}
            >
              {submitting ? 'Submitting Reel...' : '🚀 Submit Reel for Approval'}
            </button>
          </form>
        </div>

        {/* List card */}
        <div className="card" style={{ padding: '1.5rem', minHeight: '350px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            📋 My Submitted Reels
          </h3>

          {loading && reels.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>Loading your reels…</div>
          ) : reels.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎬</div>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>No reels submitted yet.</p>
              <p style={{ color: '#CBD5E1', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                Reels are short vertical property videos that display on the buyer portal home screen.
              </p>
            </div>
          ) : (
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
                  {reels.map(reel => {
                    const currStatus = reel.status || 'pending';
                    const badge = STATUS_BADGE[currStatus] || STATUS_BADGE.pending;
                    return (
                      <tr key={reel.id || reel._id}>
                        <td style={{ fontWeight: 600, fontSize: '0.75rem', verticalAlign: 'top' }}>
                          <span style={{
                            padding: '0.2rem 0.4rem',
                            borderRadius: '4px',
                            background: reel.videoUrl.includes('instagram.com') ? '#FDF2F8' : reel.videoUrl.includes('youtube.com') || reel.videoUrl.includes('youtu.be') ? '#FEF2F2' : '#F0FDF4',
                            color: reel.videoUrl.includes('instagram.com') ? '#DB2777' : reel.videoUrl.includes('youtube.com') || reel.videoUrl.includes('youtu.be') ? '#DC2626' : '#16A34A',
                          }}>
                            {getUrlTypeLabel(reel.videoUrl)}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1E293B' }}>
                            {reel.title || <em>No Title</em>}
                          </div>
                          {reel.description && (
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.1rem' }}>
                              {reel.description}
                            </div>
                          )}
                          <div style={{ fontSize: '0.72rem', color: '#0D9488', marginTop: '0.25rem', wordBreak: 'break-all' }}>
                            🔗 <a href={reel.videoUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>{reel.videoUrl.substring(0, 45)}...</a>
                          </div>
                        </td>
                        <td>
                          <span className="badge" style={{ ...badge.style, fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: 999 }}>
                            {badge.label}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(reel.id || reel._id)}
                            style={{ padding: '0.35rem 0.5rem' }}
                            title="Delete Reel"
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
