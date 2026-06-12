import React from 'react';

const NAV = [
  { label:'Dashboard',  page:'dashboard', icon:'🏠' },
  { label:'List Property', page:'list',   icon:'➕' },
  { label:'Inquiries',  page:'inquiries', icon:'📩' },
];

export default function SellerHeader({ page, navigate, user, onLogout }) {
  return (
    <header style={{
      position:'fixed', top:0, left:0, right:0, zIndex:200,
      background:'#0F172A',
      borderBottom:'1px solid rgba(13,148,136,0.2)',
      height:72, display:'flex', alignItems:'center',
      padding:'0 1.5rem',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginRight:'2rem' }}>
        <img 
          src="https://res.cloudinary.com/dpkaoxtz3/image/upload/c_crop,w_634,h_545,x_180,y_197/f_auto,q_auto/ChatGPT_Image_Jun_12_2026_10_13_59_PM_kzlegb" 
          alt="Chikoti Real Estate Logo" 
          style={{ width:36, height:36, objectFit:'contain' }}
        />
        <div>
          <div style={{ color:'white', fontWeight:800, fontSize:'0.95rem', lineHeight:1.2 }}>
            Chikoti Seller Portal
          </div>
          <div style={{ color:'#14B8A6', fontSize:'0.72rem', fontWeight:600 }}>
            {user?.email}
          </div>
        </div>
      </div>

      <nav style={{ display:'flex', gap:'0.25rem', flex:1 }}>
        {NAV.map(n => (
          <button key={n.page} onClick={() => navigate(n.page)} style={{
            background: page === n.page ? 'rgba(13,148,136,0.2)' : 'none',
            color: page === n.page ? '#14B8A6' : '#94A3B8',
            padding:'0.5rem 1rem', borderRadius:8,
            fontWeight:600, fontSize:'0.88rem',
            display:'flex', alignItems:'center', gap:'0.4rem',
            transition:'all 0.2s',
            border: page === n.page ? '1px solid rgba(13,148,136,0.3)' : '1px solid transparent',
          }}>
            <span>{n.icon}</span> {n.label}
          </button>
        ))}
      </nav>

      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginLeft:'auto' }}>
        <span style={{ color:'#64748B', fontSize:'0.85rem' }}>
          👤 {user?.name?.split(' ')[0]}
        </span>
        <button onClick={onLogout} style={{
          background:'rgba(239,68,68,0.1)', color:'#F87171',
          border:'1px solid rgba(239,68,68,0.2)',
          padding:'0.4rem 0.9rem', borderRadius:8,
          fontSize:'0.82rem', fontWeight:700, transition:'all 0.2s',
        }}>
          Logout
        </button>
      </div>
    </header>
  );
}
