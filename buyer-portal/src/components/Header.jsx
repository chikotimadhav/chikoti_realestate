import React, { useState } from 'react';

const NAV = [
  { label: 'Home',       page: 'home' },
  { label: 'Properties', page: 'properties' },
  { label: 'Reels',      page: 'reels' },
];

export default function Header({ page, navigate, user, onLogin, onLogout, showLogin, setShowLogin }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tab, setTab]   = useState('login');
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', role:'buyer' });
  const [err,  setErr]  = useState('');
  const [loading, setLoading] = useState(false);

  const [resetStep, setResetStep] = useState(1);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  async function handleAuth(e) {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const endpoint = tab === 'login'
        ? `${apiBase}/api/auth/login`
        : `${apiBase}/api/auth/register`;
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

  async function handleForgotReset(e) {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      if (resetStep === 1) {
        const res = await fetch(`${apiBase}/api/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setResetStep(2);
      } else {
        const res = await fetch(`${apiBase}/api/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, code: resetCode, newPassword }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        // Auto-login after password reset
        const loginRes = await fetch(`${apiBase}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: newPassword }),
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(loginData.error);
        
        onLogin(loginData.data.user, loginData.data.token);
        setShowLogin(false);
        setTab('login');
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
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
          <nav className="nav-desktop">
            {NAV.map(n => (
              <button key={n.page} onClick={() => navigate(n.page)} style={{
                background: 'none', color: page === n.page ? '#C9A84C' : '#CBD5E1',
                fontWeight: page === n.page ? 700 : 500,
                fontSize: '0.95rem', borderBottom: page === n.page ? '2px solid #C9A84C' : '2px solid transparent',
                paddingBottom: '2px', transition: 'all 0.2s',
              }}>{n.label}</button>
            ))}
            <a href="https://chikoti-realestate-seller-portal.vercel.app/" target="_blank" rel="noreferrer"
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

          {/* Mobile Nav Toggle */}
          <button className="nav-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <i className={mobileOpen ? "fas fa-times" : "fas fa-bars"} />
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
          {NAV.map(n => (
            <button key={n.page} onClick={() => { navigate(n.page); setMobileOpen(false); }} style={{
              background: 'none', color: page === n.page ? '#C9A84C' : '#CBD5E1',
              fontWeight: page === n.page ? 700 : 500,
              fontSize: '1.1rem', textAlign: 'left',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              paddingBottom: '0.75rem', width: '100%',
            }}>{n.label}</button>
          ))}
          <a href="https://chikoti-realestate-seller-portal.vercel.app/" target="_blank" rel="noreferrer"
             onClick={() => setMobileOpen(false)}
             style={{ color:'#94A3B8', fontSize:'1.1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem', width: '100%' }}>
            List Property ↗
          </a>
          {user ? (
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem', marginTop:'0.5rem' }}>
              <span style={{ color:'#C9A84C', fontWeight:600, fontSize:'1.1rem' }}>
                👤 {user.name}
              </span>
              <button onClick={() => { onLogout(); setMobileOpen(false); }} className="btn-outline" style={{ padding:'0.6rem 1.5rem', width:'100%', textAlign:'center' }}>
                Logout
              </button>
            </div>
          ) : (
            <button onClick={() => { setShowLogin(true); setMobileOpen(false); }} className="btn-gold" style={{ padding:'0.75rem 1.5rem', width:'100%', justifyContent:'center', marginTop:'0.5rem' }}>
              Login
            </button>
          )}
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
              {tab === 'login' ? 'Welcome back' : tab === 'register' ? 'Create account' : 'Reset Password'}
            </h2>
            <p style={{ color:'#6B7280', fontSize:'0.9rem', marginBottom:'1.5rem' }}>
              {tab === 'login' ? 'Sign in to your buyer account' : tab === 'register' ? 'Start finding your dream property' : 'Verify your email to set a new password'}
            </p>

            {tab !== 'forgot' && (
              /* Tabs */
              <div style={{ display:'flex', borderBottom:'2px solid #F3F4F6', marginBottom:'1.5rem' }}>
                {['login','register'].map(t => (
                  <button key={t} onClick={() => { setTab(t); setErr(''); }} style={{
                    flex:1, padding:'0.6rem', background:'none',
                    color: tab===t ? '#C9A84C' : '#6B7280',
                    borderBottom: tab===t ? '2px solid #C9A84C' : '2px solid transparent',
                    fontWeight:600, fontSize:'0.9rem', marginBottom:'-2px',
                  }}>{t === 'login' ? 'Login' : 'Register'}</button>
                ))}
              </div>
            )}

            {tab === 'forgot' ? (
              <form onSubmit={handleForgotReset} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                {resetStep === 1 ? (
                  <>
                    <input className="form-input" type="email" placeholder="Email Address" required
                      value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
                    {err && <p style={{ color:'#DC2626', fontSize:'0.85rem' }}>{err}</p>}
                    <button type="submit" className="btn-gold" style={{ justifyContent:'center', padding:'0.8rem' }} disabled={loading}>
                      {loading ? 'Sending code…' : 'Send Verification Code'}
                    </button>
                  </>
                ) : (
                  <>
                    <p style={{ color:'#059669', fontSize:'0.85rem', fontWeight:600 }}>✓ Verification code sent to {form.email}</p>
                    <input className="form-input" placeholder="Enter 6-digit verification code" required
                      value={resetCode} onChange={e => setResetCode(e.target.value)} />
                    <input className="form-input" type="password" placeholder="Enter new password" required
                      value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    {err && <p style={{ color:'#DC2626', fontSize:'0.85rem' }}>{err}</p>}
                    <button type="submit" className="btn-gold" style={{ justifyContent:'center', padding:'0.8rem' }} disabled={loading}>
                      {loading ? 'Updating password…' : 'Reset Password'}
                    </button>
                  </>
                )}
                <button type="button" onClick={() => { setTab('login'); setErr(''); }} style={{ background:'none', color:'#C9A84C', fontSize:'0.88rem', fontWeight:600, marginTop:'0.5rem', cursor:'pointer' }}>
                  ← Back to Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleAuth} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                {tab === 'register' && (
                  <>
                    <input className="form-input" placeholder="Full Name" required
                      value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
                    <input className="form-input" placeholder="Phone Number"
                      value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} />
                  </>
                )}
                {tab === 'register' ? (
                  <input key="reg-email" className="form-input" type="email" placeholder="Email Address" required
                    value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
                ) : (
                  <input key="login-email" className="form-input" type="text" placeholder="Email Address or Phone Number" required
                    value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
                )}
                <input className="form-input" type="password" placeholder="Password" required
                  value={form.password} onChange={e => setForm({...form, password:e.target.value})} />
                
                {tab === 'login' && (
                  <button type="button" onClick={() => { setTab('forgot'); setResetStep(1); setErr(''); }} style={{ background:'none', color:'#C9A84C', fontSize:'0.82rem', fontWeight:600, alignSelf:'flex-end', marginTop:'-0.5rem', marginBottom:'0.5rem', cursor:'pointer' }}>
                    Forgot Password?
                  </button>
                )}

                {err && <p style={{ color:'#DC2626', fontSize:'0.85rem' }}>{err}</p>}
                <button type="submit" className="btn-gold" style={{ justifyContent:'center', padding:'0.8rem' }} disabled={loading}>
                  {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
                </button>
                <p style={{ textAlign:'center', fontSize:'0.8rem', color:'#9CA3AF' }}>
                  Demo: use any email & password to test
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
