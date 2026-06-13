import React, { useState, useEffect } from 'react';

function token() { return localStorage.getItem('ck_seller_token'); }

export default function ProfilePage({ user, onUserUpdate }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [imagePreview, setImagePreview] = useState(user?.avatar_url || '');
  
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setAvatarUrl(user.avatar_url || '');
      setImagePreview(user.avatar_url || '');
    }
  }, [user]);

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('data:image')) return url;
    if (url.includes('localhost:5000') && !apiBase.includes('localhost:5000')) {
      const cleanBase = apiBase.replace(/\/api\/?$/, '');
      return url.replace('http://localhost:5000', cleanBase);
    }
    return url;
  };

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
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      let finalAvatarUrl = avatarUrl;
      // If avatar preview is a new base64 string, save it directly in the DB
      if (imagePreview && imagePreview.startsWith('data:image')) {
        finalAvatarUrl = imagePreview;
        setAvatarUrl(finalAvatarUrl);
      } else if (!imagePreview) {
        finalAvatarUrl = '';
        setAvatarUrl('');
      }

      const res = await fetch(`${apiBase}/api/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`
        },
        body: JSON.stringify({
          name,
          phone,
          address,
          avatar_url: finalAvatarUrl
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      setSuccess('Profile updated successfully!');
      onUserUpdate(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>👤 Profile Settings</h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
          Update your contact details, living address, and profile photo
        </p>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Avatar Area */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
            <div 
              onClick={() => document.getElementById('avatar-input-seller').click()}
              style={{
                width: 110,
                height: 110,
                borderRadius: '50%',
                border: '2px solid #0D9488',
                position: 'relative',
                overflow: 'hidden',
                background: '#F8FAFC',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}
            >
              {imagePreview ? (
                <img src={getImageUrl(imagePreview)} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '2.2rem', color: '#94A3B8' }}>👤</span>
              )}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(15, 23, 42, 0.6)',
                color: 'white', fontSize: '0.72rem', fontWeight: 'bold',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: 'opacity 0.2s'
              }}
              className="avatar-hover-layer"
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0}
              >
                Change Photo
              </div>
            </div>
            
            <input 
              id="avatar-input-seller"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImagePreview('');
                  setAvatarUrl('');
                }}
                style={{
                  background: 'none', border: 'none',
                  color: '#EF4444', fontSize: '0.75rem',
                  fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem'
                }}
              >
                Remove Photo
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Full Name *</label>
              <input 
                type="text"
                className="form-input"
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label className="form-label" style={{ margin: 0, color: '#94A3B8' }}>Email Address (Read-only)</label>
              <input 
                type="email"
                className="form-input"
                disabled
                value={email}
                style={{ background: '#F1F5F9', color: '#64748B', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label className="form-label" style={{ margin: 0 }}>Phone Number *</label>
            <input 
              type="tel"
              className="form-input"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label className="form-label" style={{ margin: 0 }}>Living Address</label>
            <textarea 
              className="form-input"
              rows={3}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
              placeholder="Enter your current contact/living address..."
              value={address}
              onChange={e => setAddress(e.target.value)}
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
            disabled={updating}
          >
            {updating ? 'Updating profile details...' : '💾 Save Profile Changes'}
          </button>

        </form>
      </div>
    </div>
  );
}
