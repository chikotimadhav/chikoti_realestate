import React, { useState, useEffect } from 'react';

function token() { return localStorage.getItem('ck_seller_token'); }

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    function loadInquiries(silent = false) {
      if (!silent) setLoading(true);
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inquiries/seller`, {
        headers: { Authorization: `Bearer ${token()}` }
      })
        .then(r => r.json())
        .then(d => setInquiries(d.data || []))
        .catch(() => {})
        .finally(() => {
          if (!silent) setLoading(false);
        });
    }
    loadInquiries(false);
    const interval = setInterval(() => loadInquiries(true), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding:'2rem 1.5rem', maxWidth:1000, margin:'0 auto' }}>
      <h1 style={{ fontSize:'1.4rem', fontWeight:800, marginBottom:'0.25rem' }}>Inquiries</h1>
      <p style={{ color:'#64748B', fontSize:'0.9rem', marginBottom:'2rem' }}>
        All buyer inquiries for your properties
      </p>

      {loading ? (
        <div style={{ textAlign:'center', padding:'3rem', color:'#94A3B8' }}>Loading…</div>
      ) : inquiries.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem', background:'white', borderRadius:16 }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📭</div>
          <p style={{ color:'#94A3B8', fontSize:'1.05rem' }}>No inquiries yet.</p>
          <p style={{ color:'#CBD5E1', fontSize:'0.88rem', marginTop:'0.4rem' }}>
            Inquiries from buyers will appear here once your properties are approved.
          </p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {inquiries.map(i => (
            <div key={i.id} className="card" style={{ padding:'1.5rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'0.75rem' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.4rem' }}>
                    <div style={{
                      width:38, height:38, borderRadius:'50%',
                      background:'linear-gradient(135deg,#0D9488,#14B8A6)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      color:'white', fontWeight:800, fontSize:'1rem',
                    }}>{i.buyer_name[0].toUpperCase()}</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:'0.95rem' }}>{i.buyer_name}</div>
                      <div style={{ color:'#64748B', fontSize:'0.78rem' }}>
                        🏠 {i.property_title}
                      </div>
                    </div>
                  </div>

                  {i.message && (
                    <p style={{
                      color:'#475569', fontSize:'0.9rem', lineHeight:1.6,
                      background:'#F8FAFC', borderRadius:8, padding:'0.6rem 0.9rem',
                      marginTop:'0.5rem', fontStyle:'italic',
                    }}>"{i.message}"</p>
                  )}
                </div>

                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontSize:'0.78rem', color:'#94A3B8', marginBottom:'0.5rem' }}>
                    {new Date(i.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                  </div>
                  <div style={{ display:'flex', gap:'0.5rem', justifyContent:'flex-end' }}>
                    <a href={`tel:${i.buyer_phone}`}
                      style={{
                        padding:'0.4rem 0.85rem', borderRadius:8,
                        background:'#0D9488', color:'white',
                        fontSize:'0.82rem', fontWeight:700,
                        display:'flex', alignItems:'center', gap:'0.3rem',
                      }}>
                      📞 {i.buyer_phone}
                    </a>
                    <a href={`mailto:${i.buyer_email}`}
                      style={{
                        padding:'0.4rem 0.85rem', borderRadius:8,
                        background:'#EFF6FF', color:'#2563EB',
                        fontSize:'0.82rem', fontWeight:700,
                        display:'flex', alignItems:'center', gap:'0.3rem',
                      }}>
                      ✉️ Email
                    </a>
                    <a href={`https://wa.me/91${i.buyer_phone}`} target="_blank" rel="noreferrer"
                      style={{
                        padding:'0.4rem 0.85rem', borderRadius:8,
                        background:'#DCFCE7', color:'#15803D',
                        fontSize:'0.82rem', fontWeight:700,
                        display:'flex', alignItems:'center', gap:'0.3rem',
                      }}>
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
