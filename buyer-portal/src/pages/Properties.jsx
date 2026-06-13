import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard.jsx';

const TYPES    = ['','Agriculture','Commercial','Residential'];
const LISTINGS = ['','Sale','Rent','Lease'];

export default function PropertiesPage({ openDetail, user, onLoginRequired }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [type,    setType]    = useState('');
  const [listing, setListing] = useState('');
  const [sort,    setSort]    = useState('');

  // Mobile layout detection
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function load(silent = false) {
    if (!silent) setLoading(true);
    const params = new URLSearchParams();
    if (search)  params.set('search', search);
    if (type)    params.set('type', type);
    if (listing) params.set('listing', listing);
    if (sort)    params.set('sort', sort);
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/properties?${params}`)
      .then(r => r.json())
      .then(d => setProperties(d.data || []))
      .catch(() => setProperties([]))
      .finally(() => {
        if (!silent) setLoading(false);
      });
  }

  useEffect(() => {
    load(false);
    const interval = setInterval(() => load(true), 5000);
    return () => clearInterval(interval);
  }, [search, type, listing, sort]);

  return (
    <div style={{ minHeight:'100vh', background:'#F9FAFB', paddingTop:'1.5rem', paddingBottom:'4rem' }}>
      <div className="container">
        {/* Page header */}
        <div style={{ marginBottom:'1.5rem' }}>
          <span className="section-tag">Browse Properties</span>
          <h1 className="section-title">Premium Inventory</h1>
          <p style={{ color:'#6B7280', fontSize:'0.9rem' }}>
            {loading ? 'Loading…' : `${properties.length} properties found`}
          </p>
        </div>

        {/* Sticky Filters Container */}
        <div style={{
          position:'sticky',
          top:68,
          zIndex:100,
          background:'#F9FAFB',
          padding:'0.5rem 0 1rem 0',
          marginBottom:'1.5rem',
        }}>
          {isMobile ? (
            /* Mobile Sticky Search & Filter layout */
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
                <input
                  className="form-input"
                  style={{ flex:1, margin:0, padding:'0.8rem 1rem', fontSize:'0.95rem' }}
                  placeholder="🔍 Search location or name…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  style={{
                    background: showMobileFilters ? 'var(--gold)' : 'var(--navy)',
                    color: showMobileFilters ? 'var(--navy)' : 'white',
                    padding:'0.8rem 1.1rem',
                    borderRadius:12,
                    fontWeight:700,
                    fontSize:'0.9rem',
                    display:'flex',
                    alignItems:'center',
                    gap:'0.3rem',
                    transition:'all 0.2s',
                    boxShadow:'0 2px 8px rgba(0,0,0,0.1)',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-filter" /> Filters
                </button>
              </div>

              {/* Collapsible Mobile Dropdowns */}
              {showMobileFilters && (
                <div style={{
                  background:'white',
                  borderRadius:16,
                  padding:'1rem',
                  boxShadow:'0 10px 25px rgba(0,0,0,0.08)',
                  display:'flex',
                  flexDirection:'column',
                  gap:'0.75rem',
                  border:'1px solid rgba(201,168,76,0.15)',
                  animation:'fadeIn 0.2s ease-out'
                }}>
                  <div>
                    <label style={{ fontSize:'0.75rem', fontWeight:800, color:'#4B5563', textTransform:'uppercase', display:'block', marginBottom:'0.25rem' }}>Property Type</label>
                    <select className="form-input" style={{ margin:0, background:'#F3F4F6' }}
                      value={type} onChange={e => setType(e.target.value)}>
                      <option value="">All Types</option>
                      {TYPES.filter(Boolean).map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:'0.75rem', fontWeight:800, color:'#4B5563', textTransform:'uppercase', display:'block', marginBottom:'0.25rem' }}>Listing Category</label>
                    <select className="form-input" style={{ margin:0, background:'#F3F4F6' }}
                      value={listing} onChange={e => setListing(e.target.value)}>
                      <option value="">Sale / Rent / Lease</option>
                      {LISTINGS.filter(Boolean).map(l => <option key={l}>For {l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:'0.75rem', fontWeight:800, color:'#4B5563', textTransform:'uppercase', display:'block', marginBottom:'0.25rem' }}>Sort Listings</label>
                    <select className="form-input" style={{ margin:0, background:'#F3F4F6' }}
                      value={sort} onChange={e => setSort(e.target.value)}>
                      <option value="">Default sorting</option>
                      <option value="price_asc">Price: Low → High</option>
                      <option value="price_desc">Price: High → Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>
                  <button className="btn-outline" style={{ width:'100%', justifyContent:'center', padding:'0.75rem', marginTop:'0.25rem' }}
                    onClick={() => { setSearch(''); setType(''); setListing(''); setSort(''); setShowMobileFilters(false); }}>
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Desktop Filters Layout */
            <div style={{
              background:'white', borderRadius:16, padding:'1.25rem 1.5rem',
              boxShadow:'0 4px 24px rgba(0,0,0,0.06)',
              display:'flex', flexWrap:'wrap', gap:'1rem', alignItems:'center',
            }}>
              <input
                className="form-input"
                style={{ flex:'1 1 240px', margin:0 }}
                placeholder="🔍  Search by location or name…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select className="form-input" style={{ flex:'0 0 auto', width:'auto', margin:0 }}
                value={type} onChange={e => setType(e.target.value)}>
                <option value="">All Types</option>
                {TYPES.filter(Boolean).map(t => <option key={t}>{t}</option>)}
              </select>
              <select className="form-input" style={{ flex:'0 0 auto', width:'auto', margin:0 }}
                value={listing} onChange={e => setListing(e.target.value)}>
                <option value="">Sale / Rent / Lease</option>
                {LISTINGS.filter(Boolean).map(l => <option key={l}>For {l}</option>)}
              </select>
              <select className="form-input" style={{ flex:'0 0 auto', width:'auto', margin:0 }}
                value={sort} onChange={e => setSort(e.target.value)}>
                <option value="">Sort By</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="newest">Newest First</option>
              </select>
              <button className="btn-outline" style={{ padding:'0.65rem 1.25rem' }}
                onClick={() => { setSearch(''); setType(''); setListing(''); setSort(''); }}>
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid-3">
            {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height:400 }} />)}
          </div>
        ) : properties.length ? (
          <div className="grid-3">
            {properties.map(p => (
              <PropertyCard key={p.id} property={p} onClick={() => openDetail(p)} user={user} onLoginRequired={onLoginRequired} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'4rem', color:'#9CA3AF' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🏚️</div>
            <p style={{ fontSize:'1.1rem' }}>No properties match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
