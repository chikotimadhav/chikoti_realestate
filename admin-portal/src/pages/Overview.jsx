import React, { useState, useEffect } from 'react';

function token() { return localStorage.getItem('ck_admin_token'); }

const STAT_CONFIG = [
  { key:'properties', label:'Total Properties', icon:'🏠', color:'#4F46E5', bg:'#EEF2FF' },
  { key:'pending',    label:'Pending Review',   icon:'⏳', color:'#D97706', bg:'#FFFBEB' },
  { key:'approved',   label:'Live Listings',    icon:'✅', color:'#059669', bg:'#F0FDF4' },
  { key:'users',      label:'Total Users',      icon:'👥', color:'#7C3AED', bg:'#FDF4FF' },
  { key:'sellers',    label:'Active Sellers',   icon:'🏢', color:'#0891B2', bg:'#ECFEFF' },
  { key:'inquiries',  label:'Total Inquiries',  icon:'📩', color:'#DC2626', bg:'#FEF2F2' },
  { key:'views',      label:'Property Views',   icon:'👁️', color:'#059669', bg:'#F0FDF4' },
];

export default function OverviewPage() {
  const [stats,   setStats]   = useState({});
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    function fetchData() {
      Promise.all([
        fetch(`${apiBase}/api/admin/stats`, { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()),
        fetch(`${apiBase}/api/admin/properties?status=pending`, { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()),
      ]).then(([s, p]) => {
        setStats(s.data || {});
        setPending((p.data || []).slice(0, 5));
      }).catch(console.error)
      .finally(() => setLoading(false));
    }
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Stats Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
        {STAT_CONFIG.map(s => (
          <div key={s.key} className="stat-card" style={{ borderLeftColor: s.color }}>
            <div style={{
              width:44, height:44, borderRadius:12,
              background:s.bg, display:'flex', alignItems:'center',
              justifyContent:'center', fontSize:'1.3rem', marginBottom:'0.75rem',
            }}>{s.icon}</div>
            <div style={{ fontSize:'1.9rem', fontWeight:800, color:s.color, lineHeight:1 }}>
              {loading ? '…' : (s.key === 'views' ? (stats[s.key]||0).toLocaleString() : stats[s.key] || 0)}
            </div>
            <div style={{ color:'#64748B', fontSize:'0.78rem', marginTop:'0.25rem', fontWeight:500 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Pending Properties */}
      <div className="card" style={{ marginBottom:'2rem' }}>
        <div style={{ padding:'1.25rem 1.5rem', borderBottom:'1px solid #F1F5F9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontWeight:800, fontSize:'1rem' }}>Pending Approvals</div>
            <div style={{ color:'#94A3B8', fontSize:'0.78rem' }}>Latest properties awaiting review</div>
          </div>
          <span className="badge badge-pending">{stats.pending || 0} pending</span>
        </div>
        {pending.length === 0 ? (
          <div style={{ padding:'2.5rem', textAlign:'center', color:'#94A3B8' }}>
            {loading ? 'Loading…' : '🎉 No pending properties!'}
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Property</th><th>Type</th><th>Seller</th>
                  <th>Price</th><th>Submitted</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pending.map(p => (
                  <PendingRow key={p.id} property={p} onAction={() => {
                    setPending(prev => prev.filter(x => x.id !== p.id));
                    setStats(s => ({ ...s, pending: (s.pending||1)-1, approved: (s.approved||0)+1 }));
                  }} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem' }}>
        {[
          { icon:'🏠', title:'Manage Properties', sub:'View & moderate all listings', color:'#4F46E5' },
          { icon:'👥', title:'Manage Users',      sub:'Verify & control accounts',    color:'#7C3AED' },
          { icon:'📩', title:'All Inquiries',     sub:'Monitor buyer activity',       color:'#DC2626' },
        ].map(c => (
          <div key={c.title} className="card" style={{ padding:'1.5rem', cursor:'pointer' }}
            onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
            <div style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>{c.icon}</div>
            <div style={{ fontWeight:700, marginBottom:'0.25rem', color:c.color }}>{c.title}</div>
            <div style={{ color:'#94A3B8', fontSize:'0.82rem' }}>{c.sub}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function PendingRow({ property: p, onAction }) {
  const [acting, setActing] = useState(false);

  async function act(status, is_featured = false) {
    setActing(true);
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    await fetch(`${apiBase}/api/admin/properties/${p.id}/status`, {
      method:'PATCH',
      headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token()}` },
      body: JSON.stringify({ status, is_featured }),
    });
    setActing(false);
    onAction();
  }

  return (
    <tr>
      <td>
        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
          {p.images?.[0]
            ? <img src={p.images[0]} alt="" style={{ width:40,height:34,objectFit:'cover',borderRadius:6 }} />
            : <div style={{ width:40,height:34,background:'#F1F5F9',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center' }}>📷</div>
          }
          <span style={{ fontWeight:600, fontSize:'0.875rem' }}>{p.title}</span>
        </div>
      </td>
      <td><span style={{ fontSize:'0.82rem', color:'#6B7280' }}>{p.land_type}</span></td>
      <td style={{ fontSize:'0.82rem', color:'#6B7280' }}>{p.seller_name || '—'}</td>
      <td style={{ fontWeight:700, color:'#0D9488', fontSize:'0.875rem' }}>
        ₹{(p.price/100000).toFixed(1)}L
      </td>
      <td style={{ fontSize:'0.78rem', color:'#94A3B8' }}>
        {new Date(p.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })}
      </td>
      <td>
        <div style={{ display:'flex', gap:'0.35rem' }}>
          <button className="btn btn-success btn-sm" disabled={acting} onClick={() => act('approved', true)}>
            ✓ Approve
          </button>
          <button className="btn btn-danger btn-sm" disabled={acting} onClick={() => act('rejected')}>
            ✕ Reject
          </button>
        </div>
      </td>
    </tr>
  );
}
