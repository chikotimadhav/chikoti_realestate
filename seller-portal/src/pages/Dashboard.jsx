import React, { useState, useEffect } from 'react';

function token() { return localStorage.getItem('ck_seller_token'); }

function formatPrice(n) {
  if (!n) return '—';
  if (n >= 1_00_00_000) return `₹${(n/1_00_00_000).toFixed(2)} Cr`;
  if (n >= 1_00_000)    return `₹${(n/1_00_000).toFixed(1)} L`;
  return '₹' + Number(n).toLocaleString('en-IN');
}

const STATUS_CLASS = { pending:'badge-pending', approved:'badge-approved', rejected:'badge-rejected', sold:'badge-sold' };

export default function DashboardPage({ user, navigate }) {
  const [props,    setProps]    = useState([]);
  const [inquiries,setInquiries]= useState([]);
  const [loading,  setLoading]  = useState(true);

  async function load(silent = false) {
    if (!silent) setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const [pRes, iRes] = await Promise.all([
        fetch(`${apiBase}/api/properties/seller/mine`, {
          headers: { Authorization: `Bearer ${token()}` }
        }),
        fetch(`${apiBase}/api/inquiries/seller`, {
          headers: { Authorization: `Bearer ${token()}` }
        }),
      ]);
      const pData = await pRes.json();
      const iData = await iRes.json();
      setProps(pData.data || []);
      setInquiries(iData.data || []);
    } catch (e) { console.error(e); }
    finally { if (!silent) setLoading(false); }
  }

  useEffect(() => {
    load(false);
    const interval = setInterval(() => load(true), 5000);
    return () => clearInterval(interval);
  }, []);

  async function deleteProp(id) {
    if (!confirm('Delete this property?')) return;
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    await fetch(`${apiBase}/api/properties/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token()}` }
    });
    load();
  }

  const stats = [
    { label:'Total Properties', value: props.length, icon:'🏠', bg:'#EFF6FF', color:'#2563EB' },
    { label:'Pending Approval', value: props.filter(p => p.status==='pending').length,  icon:'⏳', bg:'#FFFBEB', color:'#D97706' },
    { label:'Approved',         value: props.filter(p => p.status==='approved').length, icon:'✅', bg:'#F0FDF4', color:'#059669' },
    { label:'Total Inquiries',  value: inquiries.length, icon:'📩', bg:'#FDF2F8', color:'#7C3AED' },
  ];

  return (
    <div style={{ padding:'2rem 1.5rem', maxWidth:1200, margin:'0 auto' }}>
      {/* Welcome */}
      <div style={{
        background:'linear-gradient(135deg, #0F172A, #1E293B)',
        borderRadius:16, padding:'1.75rem 2rem',
        marginBottom:'2rem', color:'white',
        display:'flex', justifyContent:'space-between', alignItems:'center',
      }}>
        <div>
          <h1 style={{ color:'white', fontSize:'1.5rem', fontWeight:800, marginBottom:'0.25rem' }}>
            Welcome back, {user.name} 👋
          </h1>
          <p style={{ color:'#64748B', fontSize:'0.9rem' }}>Manage your property listings</p>
        </div>
        <button className="btn btn-teal" onClick={() => navigate('list')}>
          + Add New Property
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background:s.bg, color:s.color }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:'1.8rem', fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ color:'#64748B', fontSize:'0.82rem', marginTop:'0.1rem' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Properties Table */}
      <div className="card" style={{ marginBottom:'2rem' }}>
        <div style={{ padding:'1.25rem 1.5rem', borderBottom:'1px solid #F1F5F9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h2 style={{ fontSize:'1.05rem', fontWeight:800 }}>My Properties</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('list')}>+ Add</button>
        </div>
        {loading ? (
          <div style={{ padding:'2rem', textAlign:'center', color:'#94A3B8' }}>Loading…</div>
        ) : props.length === 0 ? (
          <div style={{ padding:'3rem', textAlign:'center' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>🏚️</div>
            <p style={{ color:'#94A3B8' }}>No properties yet. Start by adding one!</p>
            <button className="btn btn-teal" style={{ marginTop:'1rem' }} onClick={() => navigate('list')}>
              Add First Property
            </button>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Image</th><th>Title</th><th>Type</th>
                  <th>Price</th><th>Status</th><th>Views</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {props.map(p => (
                  <tr key={p.id}>
                    <td>
                      {p.images?.[0]
                        ? <img src={p.images[0]} alt="" style={{ width:52,height:42,objectFit:'cover',borderRadius:8 }} />
                        : <div style={{ width:52,height:42,background:'#F1F5F9',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem' }}>📷</div>
                      }
                    </td>
                    <td style={{ fontWeight:600, maxWidth:200 }}>
                      <div>{p.title}</div>
                      {p.tokenId && (
                        <div style={{ fontSize:'0.75rem', color:'#8B6914', fontWeight:700, marginTop:'0.2rem' }}>
                          ID: #{p.tokenId}
                        </div>
                      )}
                    </td>
                    <td><span style={{ fontSize:'0.82rem', color:'#6B7280' }}>{p.land_type}</span></td>
                    <td style={{ fontWeight:700, color:'#0D9488' }}>{formatPrice(p.price)}</td>
                    <td><span className={`badge ${STATUS_CLASS[p.status] || ''}`}>{p.status}</span></td>
                    <td style={{ color:'#6B7280' }}>{p.views || 0}</td>
                    <td>
                      <div style={{ display:'flex', gap:'0.4rem' }}>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--teal)', borderColor: 'rgba(13,148,136,0.3)' }} onClick={() => navigate('list', p.id)}>
                          Edit
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate('inquiries')}>
                          Inquiries
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteProp(p.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Inquiries */}
      <div className="card">
        <div style={{ padding:'1.25rem 1.5rem', borderBottom:'1px solid #F1F5F9' }}>
          <h2 style={{ fontSize:'1.05rem', fontWeight:800 }}>Recent Inquiries</h2>
        </div>
        {inquiries.length === 0 ? (
          <div style={{ padding:'2rem', textAlign:'center', color:'#94A3B8' }}>No inquiries yet.</div>
        ) : (
          <div style={{ padding:'1rem 1.5rem', display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {inquiries.slice(0,5).map(i => (
              <div key={i.id} style={{
                background:'#F8FAFC', borderRadius:12, padding:'1rem',
                display:'flex', justifyContent:'space-between', alignItems:'flex-start',
              }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:'0.92rem' }}>{i.buyer_name}</div>
                  <div style={{ color:'#64748B', fontSize:'0.82rem' }}>
                    📞 {i.buyer_phone} | ✉️ {i.buyer_email}
                  </div>
                  {i.message && <div style={{ color:'#475569', fontSize:'0.85rem', marginTop:'0.25rem' }}>{i.message}</div>}
                </div>
                <div style={{ fontSize:'0.78rem', color:'#94A3B8', whiteSpace:'nowrap', marginLeft:'1rem' }}>
                  {new Date(i.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
