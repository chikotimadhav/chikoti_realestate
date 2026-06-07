import React from 'react';

const PAGE_TITLES = {
  overview:   { title:'Overview',         sub:'Platform statistics at a glance' },
  properties: { title:'Property Manager', sub:'Approve, reject & feature listings' },
  users:      { title:'User Management',  sub:'Manage sellers, buyers and admins' },
  inquiries:  { title:'All Inquiries',    sub:'Buyer inquiries across all properties' },
};

export default function AdminHeader({ user, onLogout, page }) {
  const info = PAGE_TITLES[page] || PAGE_TITLES.overview;

  return (
    <header className="admin-header">
      <div style={{ flex:1 }}>
        <div style={{ fontWeight:800, fontSize:'1.1rem', color:'#0F172A' }}>{info.title}</div>
        <div style={{ color:'#94A3B8', fontSize:'0.78rem' }}>{info.sub}</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontWeight:700, fontSize:'0.88rem', color:'#0F172A' }}>{user.name}</div>
          <div style={{ fontSize:'0.72rem', color:'#94A3B8' }}>Administrator</div>
        </div>
        <div style={{
          width:36, height:36, borderRadius:'50%',
          background:'linear-gradient(135deg,#4F46E5,#7C3AED)',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'white', fontWeight:800, fontSize:'0.95rem',
        }}>{user.name[0]}</div>
        <button className="btn btn-ghost btn-sm" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}
