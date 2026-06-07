import React, { useState } from 'react';

function formatPrice(n) {
  if (!n) return '—';
  if (n >= 1_00_00_000) return `₹${(n/1_00_00_000).toFixed(2)} Cr`;
  if (n >= 1_00_000)    return `₹${(n/1_00_000).toFixed(1)} L`;
  return '₹' + Number(n).toLocaleString('en-IN');
}

export default function PropertyDetailModal({ property: p, onClose }) {
  const [form, setForm] = useState({ buyer_name:'', buyer_email:'', buyer_phone:'', message:'' });
  const [sent, setSent] = useState(false);
  const [err,  setErr]  = useState('');
  const [imgIdx, setImgIdx] = useState(0);

  const imgs = p.images?.length ? p.images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'];

  async function sendInquiry(e) {
    e.preventDefault(); setErr('');
    if (!form.buyer_name || !form.buyer_email || !form.buyer_phone) {
      setErr('Please fill all fields'); return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/inquiries', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ...form, property_id: p.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSent(true);
    } catch (e) { setErr(e.message); }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth:680, padding:0 }}>
        <button onClick={onClose} style={{
          position:'absolute', top:14, right:14, zIndex:10,
          background:'rgba(0,0,0,0.6)', color:'white',
          borderRadius:'50%', width:34, height:34, fontSize:16,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>✕</button>

        {/* Image slider */}
        <div style={{ position:'relative', height:280, background:'#0A1628' }}>
          <img src={imgs[imgIdx]} alt={p.title}
            style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.9 }} />
          {imgs.length > 1 && (
            <div style={{ position:'absolute', bottom:12, left:'50%', transform:'translateX(-50%)', display:'flex', gap:6 }}>
              {imgs.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)} style={{
                  width: i===imgIdx ? 20 : 8, height:8, borderRadius:999,
                  background: i===imgIdx ? '#C9A84C' : 'rgba(255,255,255,0.5)',
                  transition:'all 0.2s',
                }} />
              ))}
            </div>
          )}
        </div>

        <div style={{ padding:'1.75rem' }}>
          {/* Title + Price */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
            <div style={{ flex:1, marginRight:'1rem' }}>
              <h2 style={{ fontFamily:'Playfair Display', fontSize:'1.4rem', color:'#0A1628', marginBottom:'0.3rem' }}>
                {p.title}
              </h2>
              <p style={{ color:'#6B7280', fontSize:'0.9rem' }}>
                <i className="fas fa-map-marker-alt" style={{color:'#C9A84C', marginRight:4}} />
                {p.location}
              </p>
            </div>
            <div style={{ textAlign:'right' }}>
              <div className="price-tag" style={{ fontSize:'1.6rem' }}>{formatPrice(p.price)}</div>
              <span style={{
                display:'inline-block', padding:'0.15rem 0.6rem', borderRadius:999,
                background:'#D1FAE5', color:'#065F46', fontSize:'0.75rem', fontWeight:700,
              }}>For {p.listing_type}</span>
            </div>
          </div>

          {/* Details grid */}
          <div style={{
            display:'grid', gridTemplateColumns:'1fr 1fr',
            gap:'0.6rem', background:'#F9FAFB', borderRadius:12,
            padding:'1rem', marginBottom:'1.25rem',
          }}>
            <div style={{ fontSize:'0.88rem' }}><strong>Type:</strong> {p.land_type}</div>
            <div style={{ fontSize:'0.88rem' }}><strong>Status:</strong> For {p.listing_type}</div>
            {p.land_type === 'Agriculture' && (
              <>
                <div style={{ fontSize:'0.88rem' }}><strong>🌾 Acres:</strong> {p.acres || '—'}</div>
                <div style={{ fontSize:'0.88rem' }}><strong>💧 Water:</strong> {p.water_source || '—'}</div>
                <div style={{ fontSize:'0.88rem' }}><strong>🌱 Soil:</strong> {p.soil_type || '—'}</div>
                <div style={{ fontSize:'0.88rem' }}><strong>🌽 Crop:</strong> {p.current_crop || '—'}</div>
              </>
            )}
            {p.land_type === 'Commercial' && (
              <>
                <div style={{ fontSize:'0.88rem' }}><strong>📐 Area:</strong> {p.built_area} sq.ft</div>
                <div style={{ fontSize:'0.88rem' }}><strong>🏢 Type:</strong> {p.business_type || '—'}</div>
                <div style={{ fontSize:'0.88rem' }}><strong>🅿️ Parking:</strong> {p.parking || '—'}</div>
                <div style={{ fontSize:'0.88rem' }}><strong>👥 Footfall:</strong> {p.footfall || '—'}</div>
              </>
            )}
            {p.land_type === 'Residential' && (
              <>
                <div style={{ fontSize:'0.88rem' }}><strong>📐 Area:</strong> {p.area_sqft} sq.ft</div>
                <div style={{ fontSize:'0.88rem' }}><strong>🛏️ Beds:</strong> {p.bedrooms || '—'}</div>
                <div style={{ fontSize:'0.88rem' }}><strong>🛁 Baths:</strong> {p.bathrooms || '—'}</div>
                <div style={{ fontSize:'0.88rem' }}><strong>🪑 Furnishing:</strong> {p.furnishing || '—'}</div>
              </>
            )}
          </div>

          {p.description && (
            <p style={{ color:'#4B5563', fontSize:'0.9rem', lineHeight:1.65, marginBottom:'1.25rem' }}>{p.description}</p>
          )}

          {/* Contact */}
          <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.25rem' }}>
            <a href={`tel:${p.contact_number}`} className="btn-gold" style={{ flex:1, justifyContent:'center', padding:'0.65rem' }}>
              <i className="fas fa-phone" /> {p.contact_number}
            </a>
            {p.whatsapp_number && (
              <a href={`https://wa.me/91${p.whatsapp_number}`} target="_blank" rel="noreferrer"
                style={{
                  flex:1, justifyContent:'center', padding:'0.65rem',
                  background:'#25D366', color:'white', borderRadius:12,
                  display:'flex', alignItems:'center', gap:'0.5rem', fontWeight:700,
                }}>
                <i className="fab fa-whatsapp" /> WhatsApp
              </a>
            )}
          </div>

          {/* Inquiry Form */}
          {sent ? (
            <div style={{
              background:'#D1FAE5', borderRadius:12, padding:'1.25rem',
              textAlign:'center', color:'#065F46', fontWeight:600,
            }}>
              ✅ Inquiry sent! The seller will contact you shortly.
            </div>
          ) : (
            <div style={{ background:'#F9FAFB', borderRadius:12, padding:'1.25rem' }}>
              <h4 style={{ marginBottom:'1rem', color:'#0A1628' }}>📩 Send an Inquiry</h4>
              <form onSubmit={sendInquiry} style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                  <input className="form-input" placeholder="Your Name" required
                    value={form.buyer_name} onChange={e => setForm({...form, buyer_name:e.target.value})} />
                  <input className="form-input" type="tel" placeholder="Phone Number" required
                    value={form.buyer_phone} onChange={e => setForm({...form, buyer_phone:e.target.value})} />
                </div>
                <input className="form-input" type="email" placeholder="Email Address" required
                  value={form.buyer_email} onChange={e => setForm({...form, buyer_email:e.target.value})} />
                <textarea className="form-input" placeholder="Your message…" rows={3}
                  value={form.message} onChange={e => setForm({...form, message:e.target.value})} />
                {err && <p style={{ color:'#DC2626', fontSize:'0.85rem' }}>{err}</p>}
                <button type="submit" className="btn-gold" style={{ justifyContent:'center', padding:'0.75rem' }}>
                  <i className="fas fa-paper-plane" /> Send Inquiry
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
