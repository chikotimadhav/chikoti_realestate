import React, { useState, useEffect } from 'react';

function token() { return localStorage.getItem('ck_admin_token'); }

export default function AdvertisePage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('data:image')) return url;
    if (url.includes('localhost:5000') && !apiBase.includes('localhost:5000')) {
      const cleanBase = apiBase.replace(/\/api\/?$/, '');
      return url.replace('http://localhost:5000', cleanBase);
    }
    return url;
  };

  async function loadAds() {
    try {
      const res = await fetch(`${apiBase}/api/advertisements`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      const data = await res.json();
      if (data.success) {
        setAds(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAds();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target.result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imagePreview) {
      setError('Please select an image to upload.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${apiBase}/api/advertisements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`
        },
        body: JSON.stringify({
          image: imagePreview,
          title,
          link
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload advertisement');

      setSuccess('Advertisement uploaded and activated successfully!');
      setImagePreview(null);
      setTitle('');
      setLink('');
      
      // Reset file input element
      const fileInput = document.getElementById('ad-image-input');
      if (fileInput) fileInput.value = '';

      loadAds();
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
      const res = await fetch(`${apiBase}/api/advertisements/${id}/active`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`
        },
        body: JSON.stringify({ isActive: !currentActive })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update advertisement status');

      setSuccess(`Advertisement ${!currentActive ? 'activated' : 'deactivated'} successfully!`);
      loadAds();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this advertisement?')) return;
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${apiBase}/api/advertisements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete advertisement');

      setSuccess('Advertisement deleted successfully!');
      loadAds();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">📢 Advertise Portal</div>
          <div className="page-sub">Manage the advertisement overlays showing on the buyer portal</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Ad Upload Card */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>➕</span> Upload New Advertisement
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)' }}>Ad Image *</label>
              
              <div 
                onClick={() => document.getElementById('ad-image-input').click()}
                style={{
                  border: '2px dashed var(--gray-200)',
                  borderRadius: 'var(--radius)',
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  background: 'var(--gray-50)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--indigo)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--gray-200)'}
              >
                {!imagePreview ? (
                  <>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-800)' }}>Click to upload ad image</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: '0.2rem' }}>Supports JPG, PNG, WEBP</div>
                  </>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: 'var(--radius)', objectFit: 'contain' }} 
                    />
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                        const fileInput = document.getElementById('ad-image-input');
                        if (fileInput) fileInput.value = '';
                      }}
                      style={{
                        position: 'absolute', top: -10, right: -10,
                        background: 'var(--danger)', color: 'white',
                        border: 'none', borderRadius: '50%', width: 24, height: 24,
                        fontSize: 12, fontWeight: 'bold', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    >✕</button>
                  </div>
                )}
              </div>
              
              <input 
                id="ad-image-input" 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleFileChange} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)' }}>Ad Title (Optional)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Summer Special 10% Discount" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)' }}>Redirect URL Link (Optional)</label>
              <input 
                type="url" 
                className="form-input" 
                placeholder="e.g. https://www.chikotirealestate.com/offers" 
                value={link} 
                onChange={e => setLink(e.target.value)} 
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
              {submitting ? 'Uploading Ad...' : '🚀 Publish Advertisement'}
            </button>
          </form>
        </div>

        {/* Ads List Card */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📋</span> Advertisement History
          </h3>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Ad Preview</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>
                      Loading ads...
                    </td>
                  </tr>
                ) : ads.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>
                      No advertisements uploaded yet.
                    </td>
                  </tr>
                ) : (
                  ads.map((ad) => (
                    <tr key={ad.id || ad._id}>
                      <td style={{ width: '120px' }}>
                        <img 
                          src={getImageUrl(ad.imageUrl)} 
                          alt="Ad" 
                          style={{ width: '100px', height: '65px', objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)' }} 
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--navy)' }}>
                          {ad.title || <em style={{ color: 'var(--gray-400)' }}>No Title</em>}
                        </div>
                        {ad.link && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--indigo)', marginTop: '0.15rem', wordBreak: 'break-all' }}>
                            🔗 <a href={ad.link} target="_blank" rel="noreferrer">{ad.link}</a>
                          </div>
                        )}
                        <div style={{ fontSize: '0.68rem', color: 'var(--gray-400)', marginTop: '0.25rem' }}>
                          Uploaded: {new Date(ad.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td>
                        <span 
                          onClick={() => handleToggleActive(ad.id || ad._id, ad.isActive)}
                          className={`badge ${ad.isActive ? 'badge-approved' : 'badge-rejected'}`}
                          style={{ cursor: 'pointer', userSelect: 'none' }}
                          title="Click to toggle status"
                        >
                          {ad.isActive ? '🟢 Active' : '🔴 Inactive'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button 
                            className="btn btn-ghost btn-sm"
                            style={{
                              borderColor: ad.isActive ? 'var(--gray-200)' : 'var(--indigo)',
                              color: ad.isActive ? 'var(--gray-400)' : 'var(--indigo)',
                              background: 'transparent'
                            }}
                            disabled={ad.isActive}
                            onClick={() => handleToggleActive(ad.id || ad._id, ad.isActive)}
                            title={ad.isActive ? "Ad is already active" : "Set as active ad"}
                          >
                            Set Active
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.35rem 0.5rem' }}
                            onClick={() => handleDelete(ad.id || ad._id)}
                            title="Delete ad"
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
