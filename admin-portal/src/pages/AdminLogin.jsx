import React, { useState } from 'react';

export default function AdminLogin({ onLogin }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [err,      setErr]      = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handle(e) {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.data.user.role !== 'admin')
        throw new Error('Access denied. Admin credentials required.');
      onLogin(data.data.user, data.data.token);
    } catch (e) { setErr(e.message); }
    finally     { setLoading(false); }
  }

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #1E1B4B 100%)',
      padding:'1.5rem',
    }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{
            width:64, height:64, borderRadius:16,
            background:'linear-gradient(135deg,#4F46E5,#7C3AED)',
            display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 1rem',
            fontSize:'1.75rem',
          }}>🏛️</div>
          <h1 style={{ color:'white', fontWeight:800, fontSize:'1.5rem', marginBottom:'0.25rem' }}>
            Admin Control Panel
          </h1>
          <p style={{ color:'#A5B4FC', fontSize:'0.88rem' }}>
            EstateHub Management System
          </p>
        </div>

        <div style={{
          background:'rgba(255,255,255,0.05)',
          border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:20, padding:'2rem',
          backdropFilter:'blur(12px)',
        }}>
          <form onSubmit={handle} style={{ display:'flex', flexDirection:'column', gap:'1.1rem' }}>
            <div>
              <label style={{ display:'block', color:'#C7D2FE', fontSize:'0.82rem', fontWeight:600, marginBottom:'0.4rem' }}>
                Admin Email
              </label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@estatehub.com"
                style={{
                  width:'100%', padding:'0.75rem 1rem',
                  background:'rgba(255,255,255,0.08)',
                  border:'1.5px solid rgba(255,255,255,0.15)',
                  borderRadius:10, color:'white', fontSize:'0.9rem',
                  outline:'none',
                }}
                onFocus={e => e.target.style.borderColor='#6366F1'}
                onBlur={e  => e.target.style.borderColor='rgba(255,255,255,0.15)'}
              />
            </div>
            <div>
              <label style={{ display:'block', color:'#C7D2FE', fontSize:'0.82rem', fontWeight:600, marginBottom:'0.4rem' }}>
                Password
              </label>
              <input
                type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width:'100%', padding:'0.75rem 1rem',
                  background:'rgba(255,255,255,0.08)',
                  border:'1.5px solid rgba(255,255,255,0.15)',
                  borderRadius:10, color:'white', fontSize:'0.9rem',
                  outline:'none',
                }}
                onFocus={e => e.target.style.borderColor='#6366F1'}
                onBlur={e  => e.target.style.borderColor='rgba(255,255,255,0.15)'}
              />
            </div>
            {err && (
              <div style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'0.6rem 0.9rem', color:'#FCA5A5', fontSize:'0.85rem' }}>
                ⚠️ {err}
              </div>
            )}
            <button type="submit" disabled={loading} style={{
              background:'linear-gradient(135deg,#4F46E5,#7C3AED)',
              color:'white', padding:'0.85rem', borderRadius:10,
              fontWeight:700, fontSize:'0.95rem', transition:'all 0.2s',
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? '⏳ Authenticating…' : '🔐 Access Admin Panel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
