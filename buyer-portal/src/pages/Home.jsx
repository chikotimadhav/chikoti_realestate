import React, { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard.jsx';

const STATS = [
  { icon:'🏠', value:'6', label:'Properties Transacted' },
  { icon:'👥', value:'15', label:'Happy Buyers' },
  { icon:'🏙️', value:'5', label:'Cities Covered' },
  { icon:'⭐', value:'1 yrs', label:'Of Excellence' },
];

const TYPES = [
  { icon:'🏡', label:'Residential', desc:'Apartments, Villas & Plots', color:'#2563EB' },
  { icon:'🏢', label:'Commercial',  desc:'Offices, Shops & Showrooms', color:'#D97706' },
  { icon:'🌾', label:'Agriculture', desc:'Farm Lands & Open Plots',    color:'#059669' },
];

const TESTIMONIALS = [
  { name:'Venu',    city:'Hyderabad', text:'Found my dream plot within 2 weeks! The team was incredibly professional.', rating:5 },
  { name:'Ramesh',   city:'Siddipet',  text:'Best real estate platform in India. Transparent pricing, zero hidden costs.', rating:5 },
  { name:'Ram Reddy',     city:'RagaReddy',     text:'Excellent service. Closed commercial deal in record time.', rating:5 },
];

const PORTALS = [
  { label:'Bhubharati', sub:'Telangana Land Records', href:'https://bhubharati.telangana.gov.in/knowLandStatus', icon:'🗺️' },
  { label:'Bhuvan ISRO', sub:'Satellite Imagery',    href:'https://bhuvan-app1.nrsc.gov.in/bhuvan2d/bhuvan/bhuvan2d.php', icon:'🛰️' },
  { label:'Google Maps', sub:'Hyderabad Region',      href:'https://maps.google.com', icon:'📍' },
];

export default function HomePage({ navigate, openDetail }) {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadFeatured(silent = false) {
      if (!silent) setLoading(true);
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/properties/featured`)
        .then(r => r.json())
        .then(d => setFeatured(d.data || []))
        .catch(() => setFeatured([]))
        .finally(() => {
          if (!silent) setLoading(false);
        });
    }
    loadFeatured(false);
    const interval = setInterval(() => loadFeatured(true), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-section">
        {/* Background texture */}
        <div style={{
          position:'absolute', inset:0, opacity:0.04,
          backgroundImage:'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize:'32px 32px',
        }} />

        <div className="container fade-up hero-content">
          <span className="section-tag">Premium Real Estate</span>
          <h1 style={{
            fontFamily:'Playfair Display', fontSize:'clamp(2.2rem, 5vw, 4rem)',
            fontWeight:900, color:'#F5F0E8', lineHeight:1.15, marginBottom:'1.25rem',
          }}>
            Find Your Perfect<br />
            <span style={{ color:'#C9A84C' }}>Property in Telangana</span>
          </h1>
          <p className="hero-subtitle">
            Premium verified plots, residential lands, and commercial properties across Telangana's fastest-growing corridors.
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate('properties')} className="btn-gold" style={{ fontSize:'1rem', padding:'0.9rem 2rem' }}>
              <i className="fas fa-search" /> Explore Listings
            </button>
            <a href="https://chikoti-realestate-seller-portal.vercel.app/" target="_blank" rel="noreferrer"
               className="btn-outline" style={{ fontSize:'1rem', padding:'0.9rem 2rem', display:'inline-flex', alignItems:'center', gap:'0.5rem' }}>
              <i className="fas fa-home" /> List Your Property
            </a>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            {STATS.map(s => (
              <div key={s.label} className="stats-col">
                <div style={{ fontSize:'1.75rem', marginBottom:'0.25rem' }}>{s.icon}</div>
                <div style={{ fontFamily:'Playfair Display', fontSize:'1.75rem', fontWeight:900, color:'#C9A84C' }}>{s.value}</div>
                <div style={{ color:'#64748B', fontSize:'0.8rem', marginTop:'0.2rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Official Portals ──────────────────────────────── */}
      <section style={{ background:'#F5F0E8', padding:'2rem 1.5rem' }}>
        <div className="container">
          <p style={{ textAlign:'center', color:'#8B6914', fontWeight:700, fontSize:'0.78rem', letterSpacing:2, textTransform:'uppercase', marginBottom:'1rem' }}>
            Official Land Verification Portals
          </p>
          <div className="portals-grid">
            {PORTALS.map(p => (
              <a key={p.label} href={p.href} target="_blank" rel="noreferrer" className="portal-card"
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                <span style={{ fontSize:'1.75rem' }}>{p.icon}</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:'0.9rem', color:'#0A1628' }}>{p.label}</div>
                  <div style={{ color:'#6B7280', fontSize:'0.78rem' }}>{p.sub}</div>
                </div>
                <span style={{ marginLeft:'auto', color:'#C9A84C' }}>↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Property Types ────────────────────────────────── */}
      <section style={{ padding:'5rem 1.5rem' }}>
        <div className="container" style={{ textAlign:'center' }}>
          <span className="section-tag">Browse By Type</span>
          <h2 className="section-title" style={{ marginBottom:'0.75rem' }}>What Are You Looking For?</h2>
          <p className="section-sub" style={{ marginBottom:'3rem' }}>Choose from our curated inventory of verified properties</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'1.5rem' }}>
            {TYPES.map(t => (
              <div key={t.label}
                onClick={() => navigate('properties')}
                className="card"
                style={{ padding:'2.5rem 2rem', cursor:'pointer', textAlign:'center' }}>
                <div style={{
                  width:70, height:70, borderRadius:'50%',
                  background:`${t.color}15`, margin:'0 auto 1.25rem',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'2rem',
                }}>{t.icon}</div>
                <h3 style={{ fontSize:'1.2rem', marginBottom:'0.5rem' }}>{t.label}</h3>
                <p style={{ color:'#6B7280', fontSize:'0.9rem' }}>{t.desc}</p>
                <div style={{
                  marginTop:'1.25rem', display:'inline-flex', alignItems:'center',
                  gap:'0.4rem', color:t.color, fontWeight:700, fontSize:'0.9rem',
                }}>Explore →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Properties ───────────────────────────── */}
      <section style={{ padding:'5rem 1.5rem', background:'#F9FAFB' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <span className="section-tag">Featured</span>
            <h2 className="section-title">Premium Listings</h2>
          </div>
          {loading ? (
            <div className="grid-3">
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:380 }} />)}
            </div>
          ) : featured.length ? (
            <div className="grid-3">
              {featured.map(p => <PropertyCard key={p.id} property={p} onClick={() => openDetail(p)} />)}
            </div>
          ) : (
            <p style={{ textAlign:'center', color:'#9CA3AF' }}>No featured properties at the moment.</p>
          )}
          <div style={{ textAlign:'center', marginTop:'3rem' }}>
            <button onClick={() => navigate('properties')} className="btn-gold" style={{ fontSize:'1rem' }}>
              View All Properties →
            </button>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section style={{ padding:'5rem 1.5rem', background:'#0A1628' }}>
        <div className="container" style={{ textAlign:'center' }}>
          <span className="section-tag">Client Stories</span>
          <h2 className="section-title" style={{ color:'#F5F0E8', marginBottom:'0.75rem' }}>What Our Buyers Say</h2>
          <div className="grid-3" style={{ marginTop:'3rem' }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{
                background:'rgba(255,255,255,0.05)',
                border:'1px solid rgba(201,168,76,0.2)',
                borderRadius:16, padding:'2rem',
              }}>
                <div style={{ color:'#C9A84C', fontSize:'1.25rem', marginBottom:'1rem' }}>{'★'.repeat(t.rating)}</div>
                <p style={{ color:'#CBD5E1', lineHeight:1.7, marginBottom:'1.25rem', fontStyle:'italic' }}>"{t.text}"</p>
                <div style={{ fontWeight:700, color:'#F5F0E8' }}>{t.name}</div>
                <div style={{ color:'#64748B', fontSize:'0.85rem' }}>{t.city}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
