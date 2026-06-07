import React from 'react';

const NAV = [
  { section: 'Main' },
  { page:'overview',   label:'Overview',    icon:'📊' },
  { section: 'Management' },
  { page:'properties', label:'Properties',  icon:'🏠' },
  { page:'users',      label:'Users',       icon:'👥' },
  { page:'inquiries',  label:'Inquiries',   icon:'📩' },
];

export default function AdminSidebar({ page, navigate }) {
  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <div style={{
            width:38, height:38, borderRadius:10,
            background:'linear-gradient(135deg,#4F46E5,#7C3AED)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'1.2rem',
          }}>🏛️</div>
          <div>
            <div style={{ color:'white', fontWeight:800, fontSize:'0.92rem' }}>Chikoti Admin</div>
            <div style={{ color:'#6366F1', fontSize:'0.68rem', fontWeight:600 }}>Management System</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV.map((item, i) => {
          if (item.section) return (
            <div key={i} className="nav-section-title">{item.section}</div>
          );
          return (
            <div key={item.page}
              className={`nav-item ${page === item.page ? 'active' : ''}`}
              onClick={() => navigate(item.page)}>
              <span style={{ fontSize:'1.1rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding:'1rem 1.5rem', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ color:'#4338CA', fontSize:'0.72rem', fontWeight:600 }}>
          Chikoti Real Estate v1.0
        </div>
        <div style={{ color:'#4338CA', fontSize:'0.65rem', marginTop:'0.15rem' }}>
          © {new Date().getFullYear()} All rights reserved
        </div>
      </div>
    </aside>
  );
}
