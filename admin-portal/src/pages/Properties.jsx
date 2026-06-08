import React, { useState, useEffect } from 'react';

function token() { return localStorage.getItem('ck_admin_token'); }
function fmtPrice(n) {
  if (!n) return '—';
  if (n >= 1_00_00_000) return `₹${(n/1_00_00_000).toFixed(2)}Cr`;
  return `₹${(n/1_00_000).toFixed(1)}L`;
}

const TABS = ['all','pending','approved','rejected'];

export default function PropertiesPage() {
  const [tab,        setTab]        = useState('pending');
  const [properties, setProperties] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [selected,   setSelected]   = useState(null);

  async function load(silent = false) {
    if (!silent) setLoading(true);
    try {
      const qs = tab !== 'all' ? `?status=${tab}` : '';
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/properties${qs}`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      const data = await res.json();
      setProperties(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    load(false);
    const interval = setInterval(() => load(true), 5000);
    return () => clearInterval(interval);
  }, [tab]);

  async function updateStatus(id, status, is_featured = false) {
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/properties/${id}/status`, {
      method:'PATCH',
      headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token()}` },
      body: JSON.stringify({ status, is_featured }),
    });
    load();
    setSelected(null);
  }

  async function deleteProperty(id) {
    if (!confirm('Permanently delete this property?')) return;
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/properties/${id}`, {
      method:'DELETE', headers:{ Authorization:`Bearer ${token()}` }
    });
    load();
  }

  const filtered = properties.filter(p =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.location?.toLowerCase().includes(search.toLowerCase()) ||
    p.seller_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Properties</div>
          <div className="page-sub">{filtered.length} properties shown</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', borderBottom:'2px solid #E2E8F0', paddingBottom:'-2px' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:'0.5rem 1.25rem', background:'none',
            color: tab===t ? '#4F46E5' : '#94A3B8',
            fontWeight: tab===t ? 700 : 500, fontSize:'0.875rem',
            borderBottom: tab===t ? '2px solid #4F46E5' : '2px solid transparent',
            marginBottom:'-2px', textTransform:'capitalize', transition:'all 0.2s',
          }}>{t}</button>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom:'1.25rem' }}>
        <input className="form-input" style={{ maxWidth:340 }}
          placeholder="🔍  Search title, location, seller…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Property</th><th>Type</th><th>Seller</th>
                <th>Price</th><th>Status</th><th>Featured</th>
                <th>Views</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ textAlign:'center', padding:'3rem', color:'#94A3B8' }}>Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign:'center', padding:'3rem', color:'#94A3B8' }}>No properties found.</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                      {p.images?.[0]
                        ? <img src={p.images[0]} alt="" style={{ width:48,height:38,objectFit:'cover',borderRadius:8,flexShrink:0 }} />
                        : <div style={{ width:48,height:38,background:'#F1F5F9',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>📷</div>
                      }
                      <div>
                        <div style={{ fontWeight:600, fontSize:'0.875rem', maxWidth:180 }}>{p.title}</div>
                        {p.tokenId && (
                          <div style={{ color:'#4F46E5', fontSize:'0.72rem', fontWeight:700, margin:'0.1rem 0' }}>
                            ID: #{p.tokenId}
                          </div>
                        )}
                        <div style={{ color:'#94A3B8', fontSize:'0.72rem' }}>{p.location?.split(',')[0]}</div>
                      </div>
                    </div>
                  </td>
                  <td><span style={{ fontSize:'0.78rem', background:'#F1F5F9', padding:'0.2rem 0.5rem', borderRadius:6 }}>{p.land_type}</span></td>
                  <td style={{ fontSize:'0.82rem' }}>{p.seller_name || '—'}</td>
                  <td style={{ fontWeight:700, color:'#059669', fontSize:'0.875rem' }}>{fmtPrice(p.price)}</td>
                  <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                  <td>{p.is_featured ? '⭐' : <span style={{ color:'#CBD5E1' }}>—</span>}</td>
                  <td style={{ color:'#6B7280', fontSize:'0.82rem' }}>{p.views||0}</td>
                  <td style={{ color:'#94A3B8', fontSize:'0.72rem', whiteSpace:'nowrap' }}>
                    {new Date(p.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'2-digit'})}
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:'0.3rem', flexWrap:'nowrap' }}>
                      {p.status !== 'approved' && (
                        <button className="btn btn-success btn-sm"
                          onClick={() => updateStatus(p.id,'approved', true)}>✓</button>
                      )}
                      {p.status !== 'rejected' && (
                        <button className="btn btn-danger btn-sm"
                          onClick={() => updateStatus(p.id,'rejected')}>✕</button>
                      )}
                      {p.status === 'approved' && (
                        <button className="btn btn-warn btn-sm"
                          onClick={() => updateStatus(p.id,'approved',!p.is_featured)}>
                          {p.is_featured ? '★' : '☆'}
                        </button>
                      )}
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelected(p)}>👁</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteProperty(p.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ padding:0 }}>
            <button onClick={() => setSelected(null)} style={{
              position:'absolute', top:12, right:12, zIndex:10,
              background:'rgba(0,0,0,0.5)', color:'white',
              borderRadius:'50%', width:32, height:32, fontSize:14,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>✕</button>
            {selected.images?.[0] && (
              <img src={selected.images[0]} alt="" style={{ width:'100%', height:220, objectFit:'cover' }} />
            )}
            <div style={{ padding:'1.5rem' }}>
              <h3 style={{ fontSize:'1.2rem', marginBottom:'0.25rem' }}>{selected.title}</h3>
              {selected.tokenId && (
                <div style={{ color:'#4F46E5', fontSize:'0.82rem', fontWeight:700, marginBottom:'0.4rem', textTransform:'uppercase' }}>
                  Property ID: #{selected.tokenId}
                </div>
              )}
              <p style={{ color:'#6B7280', fontSize:'0.875rem', marginBottom:'1rem' }}>
                📍 {selected.location}
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem', background:'#F8FAFC', borderRadius:10, padding:'1rem', marginBottom:'1rem', fontSize:'0.85rem' }}>
                <div><strong>Type:</strong> {selected.land_type}</div>
                <div><strong>Price:</strong> {fmtPrice(selected.price)}</div>
                <div><strong>Status:</strong> <span className={`badge badge-${selected.status}`}>{selected.status}</span></div>
                <div><strong>Views:</strong> {selected.views||0}</div>
                <div><strong>Seller:</strong> {selected.seller_name}</div>
                <div><strong>Contact:</strong> {selected.contact_number}</div>
              </div>
              {selected.description && (
                <p style={{ color:'#4B5563', fontSize:'0.875rem', lineHeight:1.6, marginBottom:'1.25rem' }}>
                  {selected.description}
                </p>
              )}
              <div style={{ display:'flex', gap:'0.75rem' }}>
                {selected.status !== 'approved' && (
                  <button className="btn btn-success" style={{ flex:1, justifyContent:'center' }}
                    onClick={() => updateStatus(selected.id,'approved',true)}>
                    ✓ Approve & Feature
                  </button>
                )}
                {selected.status !== 'rejected' && (
                  <button className="btn btn-danger" style={{ flex:1, justifyContent:'center' }}
                    onClick={() => updateStatus(selected.id,'rejected')}>
                    ✕ Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
