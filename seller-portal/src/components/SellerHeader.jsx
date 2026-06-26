import React, { useState, useEffect } from 'react';

const NAV = [
  { label:'Dashboard',  page:'dashboard', icon:'🏠' },
  { label:'List Property', page:'list',   icon:'➕' },
  { label:'Inquiries',  page:'inquiries', icon:'📩' },
  { label:'Reels',      page:'reels',     icon:'🎥' },
  { label:'Profile',    page:'profile',   icon:'👤' },
];

export default function SellerHeader({ page, navigate, user, onLogout }) {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleNavClick = (p) => {
    navigate(p);
    setMobileOpen(false);
  };

  return (
    <header style={{
      position:'fixed', top:0, left:0, right:0, zIndex:200,
      background:'#0F172A',
      borderBottom:'1px solid rgba(13,148,136,0.2)',
      height:72, display:'flex', alignItems:'center',
      justifyContent:'space-between',
      padding:'0 1.5rem',
    }}>
      {/* Brand Logo Container */}
      <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={() => handleNavClick('dashboard')}>
        <img 
          src="/logo.jpg" 
          alt="EstateHub Logo" 
          style={{ width:36, height:36, objectFit:'contain' }}
        />
        <div>
          <div style={{ color:'white', fontWeight:800, fontSize:'0.95rem', lineHeight:1.2 }}>
            EstateHub Seller Portal
          </div>
          <div style={{ color:'#14B8A6', fontSize:'0.72rem', fontWeight:600 }}>
            {user?.email}
          </div>
        </div>
      </div>

      {isMobile ? (
        /* Mobile Layout: Hamburger Menu Button */
        <>
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background:'none', color:'#14B8A6', border:'none',
              fontSize:'1.5rem', padding:'0.5rem', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center'
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>

          {/* Mobile Dropdown Overlay */}
          {mobileOpen && (
            <div style={{
              position:'absolute', top:72, left:0, right:0,
              background:'#0F172A',
              borderBottom:'2px solid rgba(13,148,136,0.3)',
              boxShadow:'0 10px 15px rgba(0,0,0,0.5)',
              display:'flex', flexDirection:'column', padding:'1rem 0'
            }}>
              {NAV.map(n => (
                <button 
                  key={n.page} 
                  onClick={() => handleNavClick(n.page)}
                  style={{
                    background: page === n.page ? 'rgba(13,148,136,0.15)' : 'none',
                    color: page === n.page ? '#14B8A6' : '#94A3B8',
                    padding:'0.8rem 2rem', fontSize:'0.95rem', fontWeight:600,
                    textAlign:'left', border:'none', display:'flex', alignItems:'center', gap:'0.75rem',
                    width:'100%', cursor:'pointer', transition:'all 0.2s'
                  }}
                >
                  <span>
                    {n.page === 'profile' && user?.avatar_url ? (
                      <img 
                        src={getImageUrl(user.avatar_url)} 
                        alt="" 
                        style={{ width:18, height:18, borderRadius:'50%', objectFit:'cover', verticalAlign:'middle' }} 
                      />
                    ) : (
                      n.icon
                    )}
                  </span> {n.label}
                </button>
              ))}
              
              {/* Buyer Portal Navigation Link */}
              <a 
                href="https://chikotirealestate.vercel.app/" 
                target="_blank" 
                rel="noreferrer"
                style={{
                  color:'#E2E8F0', padding:'0.8rem 2rem', fontSize:'0.95rem', fontWeight:700,
                  display:'flex', alignItems:'center', gap:'0.75rem', textDecoration:'none',
                  borderTop:'1px solid rgba(255,255,255,0.05)', marginTop:'0.5rem', paddingTop:'1rem'
                }}
              >
                <span>🌐</span> Visit Buyer Portal ↗
              </a>

              {/* Logout Button */}
              <button 
                onClick={() => { onLogout(); setMobileOpen(false); }}
                style={{
                  background:'rgba(239,68,68,0.1)', color:'#F87171',
                  padding:'0.8rem 2rem', fontSize:'0.95rem', fontWeight:700,
                  textAlign:'left', border:'none', display:'flex', alignItems:'center', gap:'0.75rem',
                  width:'100%', cursor:'pointer', marginTop:'0.5rem'
                }}
              >
                <span>🚪</span> Logout ({user?.name?.split(' ')[0]})
              </button>
            </div>
          )}
        </>
      ) : (
        /* Desktop Layout: Inline Navigation Row */
        <>
          <nav style={{ display:'flex', gap:'0.25rem', flex:1, alignItems:'center', marginLeft:'1.5rem' }}>
            {NAV.map(n => (
              <button key={n.page} onClick={() => handleNavClick(n.page)} style={{
                background: page === n.page ? 'rgba(13,148,136,0.2)' : 'none',
                color: page === n.page ? '#14B8A6' : '#94A3B8',
                padding:'0.5rem 1rem', borderRadius:8,
                fontWeight:600, fontSize:'0.88rem',
                display:'flex', alignItems:'center', gap:'0.4rem',
                transition:'all 0.2s',
                border: page === n.page ? '1px solid rgba(13,148,136,0.3)' : '1px solid transparent',
                cursor:'pointer'
              }}>
                <span>
                  {n.page === 'profile' && user?.avatar_url ? (
                    <img 
                      src={getImageUrl(user.avatar_url)} 
                      alt="" 
                      style={{ width:16, height:16, borderRadius:'50%', objectFit:'cover', verticalAlign:'middle' }} 
                    />
                  ) : (
                    n.icon
                  )}
                </span> {n.label}
              </button>
            ))}
            
            {/* Buyer Portal Navigation Link */}
            <a 
              href="https://chikotirealestate.vercel.app/" 
              target="_blank" 
              rel="noreferrer" 
              style={{
                color: '#94A3B8',
                padding:'0.5rem 1rem', borderRadius:8,
                fontWeight:600, fontSize:'0.88rem',
                display:'flex', alignItems:'center', gap:'0.4rem',
                transition:'all 0.2s',
                border: '1px solid transparent',
                textDecoration: 'none'
              }}
              onMouseEnter={e => e.currentTarget.style.color='#14B8A6'}
              onMouseLeave={e => e.currentTarget.style.color='#94A3B8'}
            >
              🌐 Buyer Portal ↗
            </a>
          </nav>

          {/* User Profile & Logout */}
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginLeft:'auto' }}>
            <span 
              onClick={() => navigate('profile')}
              style={{ color:'#64748B', fontSize:'0.85rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px' }}
              title="View Profile settings"
            >
              {user?.avatar_url ? (
                <img 
                  src={getImageUrl(user.avatar_url)} 
                  alt="Profile" 
                  style={{ width:24, height:24, borderRadius:'50%', objectFit:'cover', border:'1px solid #14B8A6' }} 
                />
              ) : (
                <span>👤</span>
              )}
              {user?.name?.split(' ')[0]}
            </span>
            <button onClick={onLogout} style={{
              background:'rgba(239,68,68,0.1)', color:'#F87171',
              border:'1px solid rgba(239,68,68,0.2)',
              padding:'0.4rem 0.9rem', borderRadius:8,
              fontSize:'0.82rem', fontWeight:700, transition:'all 0.2s',
              cursor:'pointer'
            }}>
              Logout
            </button>
          </div>
        </>
      )}
    </header>
  );
}
