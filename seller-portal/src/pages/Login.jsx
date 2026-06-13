import React, { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [tab, setTab]   = useState('login');
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', role:'seller' });
  const [err,  setErr]  = useState('');
  const [loading, setLoading] = useState(false);

  const [resetStep, setResetStep] = useState(1);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  async function handle(e) {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const endpoint = tab === 'login'
        ? `${apiBase}/api/auth/login`
        : `${apiBase}/api/auth/register`;
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
        if (loginData.data.user.role === 'buyer')
          throw new Error('This portal is for sellers. Please register as a seller.');

        onLogin(loginData.data.user, loginData.data.token);
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
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
          <img 
            src="https://res.cloudinary.com/dpkaoxtz3/image/upload/c_crop,w_634,h_545,x_180,y_197/f_auto,q_auto/ChatGPT_Image_Jun_12_2026_10_13_59_PM_kzlegb" 
            alt="Chikoti Real Estate Logo" 
            style={{ width:64, height:64, objectFit:'contain', margin:'0 auto 0.75rem', display:'block' }}
          />
          <h1 style={{ fontFamily:'Plus Jakarta Sans', fontWeight:800, fontSize:'1.4rem', color:'white' }}>
            Chikoti Seller Portal
          </h1>
          <p style={{ color:'#64748B', fontSize:'0.9rem', marginTop:'0.25rem' }}>
            List and manage your properties
          </p>
        </div>

        {/* Card */}
        <div style={{ background:'white', borderRadius:20, padding:'2rem', boxShadow:'0 25px 60px rgba(0,0,0,0.4)' }}>
          {tab !== 'forgot' && (
            /* Tabs */
            <div style={{ display:'flex', marginBottom:'1.5rem', borderBottom:'2px solid #F1F5F9' }}>
              {['login','register'].map(t => (
                <button key={t} onClick={() => { setTab(t); setErr(''); }} style={{
                  flex:1, padding:'0.6rem', background:'none', fontWeight:700,
                  fontSize:'0.9rem',
                  color: tab===t ? '#0D9488' : '#94A3B8',
                  borderBottom: tab===t ? '2px solid #0D9488' : '2px solid transparent',
                  marginBottom:'-2px', transition:'all 0.2s',
                }}>{t === 'login' ? 'Login' : 'Register'}</button>
              ))}
            </div>
          )}

          {tab === 'forgot' ? (
            <form onSubmit={handleForgotReset} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>Reset Password</h2>
              <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Verify your email to set a new password</p>
              {resetStep === 1 ? (
                <>
                  <input className="form-input" type="email" placeholder="Email Address" required
                    value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
                  {err && <p style={{ color:'#EF4444', fontSize:'0.85rem' }}>{err}</p>}
                  <button type="submit" className="btn btn-teal" style={{ justifyContent:'center', padding:'0.8rem' }} disabled={loading}>
                    {loading ? 'Sending code…' : 'Send Verification Code'}
                  </button>
                </>
              ) : (
                <>
                  <p style={{ color:'#10B981', fontSize:'0.85rem', fontWeight:600 }}>✓ Verification code sent to {form.email}</p>
                  <input className="form-input" placeholder="Enter 6-digit verification code" required
                    value={resetCode} onChange={e => setResetCode(e.target.value)} />
                  <input className="form-input" type="password" placeholder="Enter new password" required
                    value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                  {err && <p style={{ color:'#EF4444', fontSize:'0.85rem' }}>{err}</p>}
                  <button type="submit" className="btn btn-teal" style={{ justifyContent:'center', padding:'0.8rem' }} disabled={loading}>
                    {loading ? 'Updating password…' : 'Reset Password'}
                  </button>
                </>
              )}
              <button type="button" onClick={() => { setTab('login'); setErr(''); }} style={{ background:'none', color:'#0D9488', fontSize:'0.88rem', fontWeight:700, marginTop:'0.5rem', cursor:'pointer' }}>
                ← Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handle} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
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
                <button type="button" onClick={() => { setTab('forgot'); setResetStep(1); setErr(''); }} style={{ background:'none', color:'#0D9488', fontSize:'0.82rem', fontWeight:700, alignSelf:'flex-end', marginTop:'-0.5rem', marginBottom:'0.5rem', cursor:'pointer' }}>
                  Forgot Password?
                </button>
              )}

              {err && <p style={{ color:'#EF4444', fontSize:'0.85rem' }}>{err}</p>}
              <button type="submit" className="btn btn-teal"
                style={{ justifyContent:'center', padding:'0.8rem', fontSize:'0.95rem' }}
                disabled={loading}>
                {loading ? 'Please wait…' : tab === 'login' ? 'Sign In to Seller Portal' : 'Create Seller Account'}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign:'center', color:'#475569', fontSize:'0.85rem', marginTop:'1.5rem' }}>
          Looking to buy? Visit{' '}
          <a href="https://chikotirealestate.vercel.app/" style={{ color:'#14B8A6', fontWeight:600 }}>
            Chikoti Buyer Portal
          </a>
        </p>
      </div>
    </div>
  );
}
