import React, { useState, useEffect } from 'react';

function token() { return localStorage.getItem('ck_token'); }

export default function ProfilePage({ user, onUserUpdate, onClose }) {
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
    <>
      <style>{`
        .profile-container {
          max-width: 700px;
          margin: 0 auto;
          padding: 4rem 1.5rem;
        }
        .profile-card {
          position: relative;
          background: #0d1e36;
          border: 1px solid rgba(201, 168, 76, 0.2);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), 0 0 30px rgba(201, 168, 76, 0.05);
        }
        .profile-close-btn {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: none;
          border: none;
          color: #94A3B8;
          font-size: 1.25rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          transition: all 0.2s;
        }
        .profile-close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #F5F0E8;
        }
        .profile-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .profile-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          color: #F5F0E8;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .profile-subtitle {
          color: #94A3B8;
          font-size: 0.9rem;
        }
        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
        }
        .avatar-container {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #C9A84C;
          background: #0A1628;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          cursor: pointer;
        }
        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94A3B8;
          font-size: 2.5rem;
          background: #0d1e36;
        }
        .avatar-overlay {
          position: absolute;
          inset: 0;
          background: rgba(10, 22, 40, 0.6);
          color: #F5F0E8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 600;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .avatar-container:hover .avatar-overlay {
          opacity: 1;
        }
        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 640px) {
          .form-row {
            grid-template-columns: 1fr 1fr;
          }
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .field-label {
          color: #CBD5E1;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .field-input {
          background: #0A1628;
          border: 1px solid rgba(201, 168, 76, 0.15);
          color: #F5F0E8;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.92rem;
          transition: all 0.2s;
        }
        .field-input:focus {
          border-color: #C9A84C;
          outline: none;
          box-shadow: 0 0 10px rgba(201, 168, 76, 0.2);
        }
        .field-input:disabled {
          background: rgba(10, 22, 40, 0.5);
          color: #64748B;
          border-color: rgba(201, 168, 76, 0.05);
          cursor: not-allowed;
        }
      `}</style>

      <div className="profile-container">
        <div className="profile-card">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="profile-close-btn"
              title="Close Profile"
            >
              ✕
            </button>
          )}
          <div className="profile-header">
            <h1 className="profile-title">Profile Settings</h1>
            <p className="profile-subtitle">Update your personal preferences, photo, and contact details</p>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            {/* Avatar upload */}
            <div className="avatar-section">
              <div className="avatar-container" onClick={() => document.getElementById('avatar-input').click()}>
                {imagePreview ? (
                  <img src={getImageUrl(imagePreview)} alt="Avatar" className="avatar-img" />
                ) : (
                  <div className="avatar-placeholder">👤</div>
                )}
                <div className="avatar-overlay">Change Photo</div>
              </div>
              <input
                id="avatar-input"
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
                    background: 'none',
                    border: 'none',
                    color: '#EF4444',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  Remove Photo
                </button>
              )}
            </div>

            {/* Fields */}
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Full Name *</label>
                <input
                  type="text"
                  className="field-input"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="field-label">Email Address (Read-only)</label>
                <input
                  type="email"
                  className="field-input"
                  disabled
                  value={email}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="field-label">Phone Number *</label>
              <input
                type="tel"
                className="field-input"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="field-label">Living Address</label>
              <textarea
                className="field-input"
                rows={3}
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
                placeholder="Enter your current address details..."
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', color: '#EF4444', fontSize: '0.85rem', padding: '0.75rem 1rem', borderRadius: 12, fontWeight: 600 }}>
                ⚠️ {error}
              </div>
            )}

            {success && (
              <div style={{ background: '#ECFDF5', color: '#10B981', fontSize: '0.85rem', padding: '0.75rem 1rem', borderRadius: 12, fontWeight: 600 }}>
                ✓ {success}
              </div>
            )}

            <button
              type="submit"
              className="btn-gold"
              style={{ padding: '0.85rem', justifyContent: 'center', marginTop: '0.5rem', width: '100%', fontSize: '0.95rem' }}
              disabled={updating}
            >
              {updating ? 'Updating profile details...' : '💾 Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
