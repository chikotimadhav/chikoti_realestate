import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard.jsx';

const TYPES    = ['','Agriculture','Commercial','Residential'];
const LISTINGS = ['','Sale','Rent','Lease'];

export default function PropertiesPage({ openDetail }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [type,    setType]    = useState('');
  const [listing, setListing] = useState('');
  const [sort,    setSort]    = useState('');

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
    <div style={{ minHeight:'100vh', background:'#F9FAFB', paddingTop:'3rem', paddingBottom:'4rem' }}>
      <div className="container">
        {/* Page header */}
        <div style={{ marginBottom:'2.5rem' }}>
          <span className="section-tag">Browse Properties</span>
          <h1 className="section-title">Premium Inventory</h1>
          <p style={{ color:'#6B7280' }}>
            {loading ? 'Loading…' : `${properties.length} properties found`}
          </p>
        </div>

        {/* Filters */}
        <div style={{
          background:'white', borderRadius:16, padding:'1.25rem 1.5rem',
          boxShadow:'0 4px 24px rgba(0,0,0,0.06)', marginBottom:'2.5rem',
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

        {/* Grid */}
        {loading ? (
          <div className="grid-3">
            {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height:400 }} />)}
          </div>
        ) : properties.length ? (
          <div className="grid-3">
            {properties.map(p => (
              <PropertyCard key={p.id} property={p} onClick={() => openDetail(p)} />
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
