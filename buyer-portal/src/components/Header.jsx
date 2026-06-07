import React, { useState } from 'react';

const NAV = [
  { label: 'Home',       page: 'home' },
  { label: 'Properties', page: 'properties' },
];

export default function Header({ page, navigate, user, onLogin, onLogout }) {
  const [showLogin, setShowLogin]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tab, setTab]   = useState('login');
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', role:'buyer' });
  const [err,  setErr]  = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAuth(e) {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const endpoint = tab === 'login'
        ? 'http://localhost:5000/api/auth/login'
        : 'http://localhost:5000/api/auth/register';
      const body = tab === 'login'
        ? { email: form.email, password: form.password }
        : form;
      const res  = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onLogin(data.data.user, data.data.token);
      setShowLogin(false);
    } catch (e) { setErr(e.message); }
    finally      { setLoading(false); }
  }

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 500,
        background: 'rgba(10,22,40,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(201,168,76,0.2)',
        padding: '0 1.5rem',
      }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', height:68 }}>
          {/* Logo */}
          <div onClick={() => navigate('home')} style={{ cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{
              width:40, height:40, borderRadius:'50%',
              background:'linear-gradient(135deg,#C9A84C,#F0C040)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'Playfair Display', fontWeight:900, fontSize:20, color:'#0A1628',
            }}>C</div>
            <span style={{ fontFamily:'Playfair Display', fontWeight:700, fontSize:'1.2rem', color:'#F5F0E8', letterSpacing:'0.5px' }}>
              Chikoti Real Estate
            </span>
          </div>

          {/* Desktop Nav */}
          <nav style={{ display:'flex', alignItems:'center', gap:'1.75rem' }}>
            {NAV.map(n => (
              <button key={n.page} onClick={() => navigate(n.page)} style={{
                background: 'none', color: page === n.page ? '#C9A84C' : '#CBD5E1',
                fontWeight: page === n.page ? 700 : 500,
                fontSize: '0.95rem', borderBottom: page === n.page ? '2px solid #C9A84C' : '2px solid transparent',
                paddingBottom: '2px', transition: 'all 0.2s',
              }}>{n.label}</button>
            ))}
            <a href="https://seller.chikotirealestate.com" target="_blank" rel="noreferrer"
               style={{ color:'#94A3B8', fontSize:'0.9rem', transition:'color 0.2s' }}
               onMouseEnter={e => e.target.style.color='#C9A84C'}
               onMouseLeave={e => e.target.style.color='#94A3B8'}>
              List Property ↗
            </a>
            {user ? (
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <span style={{ color:'#C9A84C', fontWeight:600, fontSize:'0.9rem' }}>
                  👤 {user.name.split(' ')[0]}
                </span>
                <button onClick={onLogout} className="btn-outline" style={{ padding:'0.4rem 1rem', fontSize:'0.85rem' }}>
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className="btn-gold" style={{ padding:'0.5rem 1.25rem', fontSize:'0.9rem' }}>
                Login
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ padding:'2rem' }}>
            <button onClick={() => setShowLogin(false)} style={{
              position:'absolute', top:16, right:16,
              background:'none', fontSize:20, color:'#6B7280',
            }}>✕</button>

            <h2 style={{ fontFamily:'Playfair Display', fontSize:'1.6rem', marginBottom:'0.25rem' }}>
              {tab === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p style={{ color:'#6B7280', fontSize:'0.9rem', marginBottom:'1.5rem' }}>
              {tab === 'login' ? 'Sign in to your buyer account' : 'Start finding your dream property'}
            </p>

            {/* Tabs */}
            <div style={{ display:'flex', borderBottom:'2px solid #F3F4F6', marginBottom:'1.5rem' }}>
              {['login','register'].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  flex:1, padding:'0.6rem', background:'none',
                  color: tab===t ? '#C9A84C' : '#6B7280',
                  borderBottom: tab===t ? '2px solid #C9A84C' : '2px solid transparent',
                  fontWeight:600, fontSize:'0.9rem', marginBottom:'-2px',
                }}>{t === 'login' ? 'Login' : 'Register'}</button>
              ))}
            </div>

            <form onSubmit={handleAuth} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              {tab === 'register' && (
                <>
                  <input className="form-input" placeholder="Full Name" required
                    value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
                  <input className="form-input" placeholder="Phone Number"
                    value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} />
                </>
              )}
              <input className="form-input" type="email" placeholder="Email Address" required
                value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
              <input className="form-input" type="password" placeholder="Password" required
                value={form.password} onChange={e => setForm({...form, password:e.target.value})} />
              {err && <p style={{ color:'#DC2626', fontSize:'0.85rem' }}>{err}</p>}
              <button type="submit" className="btn-gold" style={{ justifyContent:'center', padding:'0.8rem' }} disabled={loading}>
                {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
              <p style={{ textAlign:'center', fontSize:'0.8rem', color:'#9CA3AF' }}>
                Demo: use any email & password to test
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
