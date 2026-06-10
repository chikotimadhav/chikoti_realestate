import React, { useState, useEffect, useCallback } from 'react';
import Header      from './components/Header.jsx';
import Footer      from './components/Footer.jsx';
import HomePage    from './pages/Home.jsx';
import PropertiesPage from './pages/Properties.jsx';
import PropertyDetailModal from './components/PropertyDetailModal.jsx';

export default function App() {
  const [page,     setPage]     = useState('home');
  const [detail,   setDetail]   = useState(null);   // property to show in modal
  const [showLogin, setShowLogin] = useState(false);
  const [user,     setUser]     = useState(() => {
    try { return JSON.parse(localStorage.getItem('ck_user')); } catch { return null; }
  });

  const [activeAd, setActiveAd] = useState(null);
  const [showAd, setShowAd]     = useState(false);

  const navigate = useCallback((p) => { setPage(p); window.scrollTo(0, 0); }, []);

  const openDetail  = (property) => setDetail(property);
  const closeDetail = ()          => setDetail(null);

  const onLogin  = (userData, token) => {
    localStorage.setItem('ck_user',  JSON.stringify(userData));
    localStorage.setItem('ck_token', token);
    setUser(userData);
  };
  const onLogout = () => {
    localStorage.removeItem('ck_user');
    localStorage.removeItem('ck_token');
    setUser(null);
    navigate('home');
  };

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

  // Advertisement display logic
  useEffect(() => {
    if (!user && !showLogin) {
      const hasSeen = sessionStorage.getItem('ck_seen_ad');
      if (!hasSeen) {
        fetch(`${apiBase}/api/advertisements/active`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.data) {
              setActiveAd(data.data);
              setShowAd(true);
            }
          })
          .catch(err => console.error('Error fetching active ad:', err));
      }
    } else {
      if (user) {
        sessionStorage.removeItem('ck_seen_ad');
      }
      setShowAd(false);
      setActiveAd(null);
    }
  }, [user, showLogin]);

  const handleAdClick = () => {
    sessionStorage.setItem('ck_seen_ad', 'true');
    setShowAd(false);
    if (activeAd?.link) {
      window.open(activeAd.link, '_blank', 'noopener,noreferrer');
    }
  };

  const pages = {
    home:       <HomePage    navigate={navigate} openDetail={openDetail} />,
    properties: <PropertiesPage navigate={navigate} openDetail={openDetail} user={user} />,
  };

  return (
    <>
      <Header
        page={page}
        navigate={navigate}
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
        showLogin={showLogin}
        setShowLogin={setShowLogin}
      />
      <main style={{ minHeight: '80vh' }}>
        {pages[page] || pages.home}
      </main>
      <Footer navigate={navigate} />
      {detail && (
        <PropertyDetailModal
          property={detail}
          onClose={closeDetail}
          user={user}
          onLoginRequired={() => setShowLogin(true)}
        />
      )}

      {/* Advertisement Pop-up Overlay */}
      {showAd && activeAd && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(10, 22, 40, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease-out',
        }}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleUp {
              from { transform: scale(0.9); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}</style>
          
          <div style={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            animation: 'scaleUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            {/* Close Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                sessionStorage.setItem('ck_seen_ad', 'true');
                setShowAd(false);
              }}
              style={{
                position: 'absolute',
                top: -45,
                right: 0,
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '50%',
                width: 36,
                height: 36,
                fontSize: 16,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                backdropFilter: 'blur(4px)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.85)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.9)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              }}
              title="Close Ad"
            >
              ✕
            </button>

            {/* Clickable Ad Container */}
            <div 
              onClick={handleAdClick}
              style={{
                cursor: 'pointer',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(201, 168, 76, 0.15)',
                border: '2px solid rgba(201, 168, 76, 0.4)',
                backgroundColor: '#0a1628',
                transition: 'transform 0.25s ease, border-color 0.25s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.015)';
                e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.8)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.4)';
              }}
            >
              <img 
                src={getImageUrl(activeAd.imageUrl)} 
                alt={activeAd.title || 'Advertisement'} 
                style={{
                  display: 'block',
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                }}
              />
              {activeAd.title && (
                <div style={{
                  padding: '1.25rem 1.5rem',
                  background: 'linear-gradient(to top, rgba(10,22,40,0.95), rgba(10,22,40,0.8))',
                  borderTop: '1px solid rgba(201, 168, 76, 0.2)',
                  color: '#F5F0E8',
                  textAlign: 'center',
                }}>
                  <h4 style={{ margin: 0, fontFamily: 'Playfair Display', fontSize: '1.2rem', color: '#F0C040', fontWeight: 600 }}>
                    {activeAd.title}
                  </h4>
                  {activeAd.link && (
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.25rem', display: 'inline-block' }}>
                      Click image to learn more ↗
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
