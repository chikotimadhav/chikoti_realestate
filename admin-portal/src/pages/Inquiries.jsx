import React, { useState, useEffect } from 'react';

function token() { return localStorage.getItem('ck_admin_token'); }

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');

  useEffect(() => {
    function fetchInquiries(silent = false) {
      if (!silent) setLoading(true);
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/inquiries`, {
        headers: { Authorization: `Bearer ${token()}` }
      })
        .then(r => r.json())
        .then(d => setInquiries(d.data || []))
        .catch(console.error)
        .finally(() => {
          if (!silent) setLoading(false);
        });
    }
    fetchInquiries(false);
    const interval = setInterval(() => fetchInquiries(true), 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = inquiries.filter(i =>
    !search ||
    i.buyer_name?.toLowerCase().includes(search.toLowerCase()) ||
    i.buyer_email?.toLowerCase().includes(search.toLowerCase()) ||
    i.property_title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">All Inquiries</div>
          <div className="page-sub">{filtered.length} total inquiries</div>
        </div>
      </div>

      <div style={{ marginBottom:'1.25rem' }}>
        <input className="form-input" style={{ maxWidth:360 }}
          placeholder="🔍  Search by name, email or property…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Buyer</th><th>Contact</th>
                <th>Property</th><th>Type</th>
                <th>Message</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:'3rem', color:'#94A3B8' }}>Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:'3rem', color:'#94A3B8' }}>No inquiries found.</td></tr>
              ) : filtered.map(i => (
                <tr key={i.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                      <div style={{
                        width:34, height:34, borderRadius:'50%',
                        background:`hsl(${i.buyer_name?.charCodeAt(0)*7 % 360}, 55%, 60%)`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        color:'white', fontWeight:800, fontSize:'0.85rem', flexShrink:0,
                      }}>{i.buyer_name?.[0]?.toUpperCase()}</div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:'0.875rem' }}>{i.buyer_name}</div>
                        <div style={{ color:'#94A3B8', fontSize:'0.72rem' }}>{i.buyer_email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <a href={`tel:${i.buyer_phone}`} style={{
                      display:'inline-flex', alignItems:'center', gap:'0.3rem',
                      background:'#F0FDF4', color:'#059669',
                      padding:'0.25rem 0.6rem', borderRadius:6,
                      fontSize:'0.8rem', fontWeight:700,
                    }}>📞 {i.buyer_phone}</a>
                  </td>
                  <td style={{ fontSize:'0.82rem', fontWeight:600, maxWidth:160 }}>{i.property_title}</td>
                  <td>
                    <span style={{
                      fontSize:'0.72rem', background:'#F1F5F9',
                      padding:'0.15rem 0.5rem', borderRadius:6, color:'#6B7280',
                    }}>{i.land_type}</span>
                  </td>
                  <td style={{ color:'#4B5563', fontSize:'0.82rem', maxWidth:200 }}>
                    {i.message
                      ? <span title={i.message}>{i.message.slice(0,60)}{i.message.length>60?'…':''}</span>
                      : <span style={{ color:'#CBD5E1' }}>—</span>
                    }
                  </td>
                  <td style={{ color:'#94A3B8', fontSize:'0.72rem', whiteSpace:'nowrap' }}>
                    {new Date(i.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
