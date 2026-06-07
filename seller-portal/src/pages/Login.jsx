import React, { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [tab, setTab]   = useState('login');
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', role:'seller' });
  const [err,  setErr]  = useState('');
  const [loading, setLoading] = useState(false);

  async function handle(e) {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      const endpoint = tab === 'login'
        ? 'http://localhost:5000/api/auth/login'
        : 'http://localhost:5000/api/auth/register';
      const body = tab === 'login'
        ? { email: form.email, password: form.password }
        : { ...form, role: 'seller' };
      const res  = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.data.user.role === 'buyer')
        throw new Error('This portal is for sellers. Please register as a seller.');
      onLogin(data.data.user, data.data.token);
    } catch (e) { setErr(e.message); }
    finally     { setLoading(false); }
  }

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0D4D47 100%)',
      padding:'1.5rem',
    }}>
      <div style={{ width:'100%', maxWidth:440 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{
            width:60, height:60, borderRadius:'50%',
            background:'linear-gradient(135deg,#0D9488,#14B8A6)',
            display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 0.75rem',
            fontSize:'1.6rem', fontWeight:900, color:'white', fontFamily:'serif',
          }}>C</div>
          <h1 style={{ fontFamily:'Plus Jakarta Sans', fontWeight:800, fontSize:'1.4rem', color:'white' }}>
            Chikoti Seller Portal
          </h1>
          <p style={{ color:'#64748B', fontSize:'0.9rem', marginTop:'0.25rem' }}>
            List and manage your properties
          </p>
        </div>

        {/* Card */}
        <div style={{ background:'white', borderRadius:20, padding:'2rem', boxShadow:'0 25px 60px rgba(0,0,0,0.4)' }}>
          {/* Tabs */}
          <div style={{ display:'flex', marginBottom:'1.5rem', borderBottom:'2px solid #F1F5F9' }}>
            {['login','register'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex:1, padding:'0.6rem', background:'none', fontWeight:700,
                fontSize:'0.9rem',
                color: tab===t ? '#0D9488' : '#94A3B8',
                borderBottom: tab===t ? '2px solid #0D9488' : '2px solid transparent',
                marginBottom:'-2px', transition:'all 0.2s',
              }}>{t === 'login' ? 'Login' : 'Register'}</button>
            ))}
          </div>

          <form onSubmit={handle} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
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
            {err && <p style={{ color:'#EF4444', fontSize:'0.85rem' }}>{err}</p>}
            <button type="submit" className="btn btn-teal"
              style={{ justifyContent:'center', padding:'0.8rem', fontSize:'0.95rem' }}
              disabled={loading}>
              {loading ? 'Please wait…' : tab === 'login' ? 'Sign In to Seller Portal' : 'Create Seller Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center', color:'#475569', fontSize:'0.85rem', marginTop:'1.5rem' }}>
          Looking to buy? Visit{' '}
          <a href="https://www.chikotirealestate.com" style={{ color:'#14B8A6', fontWeight:600 }}>
            www.chikotirealestate.com
          </a>
        </p>
      </div>
    </div>
  );
}
