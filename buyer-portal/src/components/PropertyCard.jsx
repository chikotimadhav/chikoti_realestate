import React from 'react';

const TYPE_COLORS = { Agriculture:'#059669', Commercial:'#D97706', Residential:'#2563EB' };

export default function PropertyCard({ property: p, onClick }) {
  const img = p.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400';

  function formatPrice(n) {
    if (!n) return '—';
    if (n >= 1_00_00_000) return `₹${(n/1_00_00_000).toFixed(2)} Cr`;
    if (n >= 1_00_000)    return `₹${(n/1_00_000).toFixed(1)} L`;
    return '₹' + Number(n).toLocaleString('en-IN');
  }

  return (
    <div className="card" style={{ cursor:'pointer' }} onClick={onClick}>
      {/* Image */}
      <div style={{ position:'relative', height:220, overflow:'hidden' }}>
        <img src={img} alt={p.title}
          style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s ease' }}
          onMouseEnter={e => e.target.style.transform='scale(1.07)'}
          onMouseLeave={e => e.target.style.transform='scale(1)'}
        />
        {p.status === 'sold' && (
          <div style={{
            position:'absolute', top:0, left:0, right:0, bottom:0,
            background:'rgba(15, 23, 42, 0.65)', backdropFilter:'blur(2px)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'white', fontSize:'1.4rem', fontWeight:900,
            letterSpacing:'3px', textTransform:'uppercase',
            zIndex:2
          }}>
            <span style={{ border:'2px solid white', padding:'0.4rem 1.2rem', borderRadius:6 }}>SOLD</span>
          </div>
        )}
        <span style={{
          position:'absolute', top:12, left:12,
          background: TYPE_COLORS[p.land_type] || '#6B7280',
          color:'white', padding:'0.2rem 0.65rem',
          borderRadius:999, fontSize:'0.72rem', fontWeight:800,
          textTransform:'uppercase', letterSpacing:0.5,
        }}>{p.land_type}</span>
        <span style={{
          position:'absolute', top:12, right:12,
          background: p.listing_type === 'Sale' ? '#0A1628' : '#7C3AED',
          color:'white', padding:'0.2rem 0.65rem',
          borderRadius:999, fontSize:'0.72rem', fontWeight:700,
        }}>For {p.listing_type}</span>
      </div>

      {/* Content */}
      <div style={{ padding:'1.25rem' }}>
        {p.tokenId && (
          <div style={{ color:'#C9A84C', fontSize:'0.75rem', fontWeight:800, textTransform:'uppercase', marginBottom:'0.25rem' }}>
            ID: #{p.tokenId}
          </div>
        )}
        <h3 style={{ fontSize:'1.05rem', fontWeight:700, marginBottom:'0.4rem', color:'#0A1628', lineHeight:1.3 }}>
          {p.title}
        </h3>
        <p style={{ color:'#6B7280', fontSize:'0.88rem', display:'flex', alignItems:'center', gap:'0.3rem', marginBottom:'0.75rem' }}>
          <i className="fas fa-map-marker-alt" style={{ color:'#C9A84C' }} />
          {p.location?.split(',').slice(0,2).join(',')}
        </p>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'0.75rem', borderTop:'1px solid #F3F4F6' }}>
          <span className="price-tag">{formatPrice(p.price)}</span>
          <span style={{ color:'#9CA3AF', fontSize:'0.8rem' }}>
            <i className="fas fa-eye" /> {p.views || 0} views
          </span>
        </div>
        <button className="btn-gold" style={{
          width:'100%', justifyContent:'center', marginTop:'1rem',
          padding:'0.65rem', fontSize:'0.9rem',
        }}>View Details</button>
      </div>
    </div>
  );
}
