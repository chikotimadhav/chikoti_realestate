import React, { useState, useEffect, useRef } from 'react';

const AGRI_FACILITIES = ['Road Access','Market Nearby','Warehouse','Labour Available','Transport Facility','Irrigation Channel'];
const COMM_AMENITIES  = ['Air Conditioning','Generator Backup','CCTV Security','Fire Safety','WiFi','Signage','Washroom'];
const RES_AMENITIES   = ['Parking','Security','Gym','Swimming Pool','Lift','Garden','Club House','Play Area','Power Backup','Water Supply'];

function token() { return localStorage.getItem('ck_seller_token'); }

export default function ListPage({ navigate }) {
  const mapRef    = useRef(null);
  const leafletRef= useRef(null);
  const markerRef = useRef(null);

  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdTokenId, setCreatedTokenId] = useState(null);
  const [err, setErr] = useState('');

  const [form, setForm] = useState({
    title:'', land_type:'', listing_type:'Sale', price:'',
    location:'', lat:17.385044, lng:78.486671,
    description:'', contact_number:'', whatsapp_number:'',
    // agri
    acres:'', soil_type:'', water_source:'', current_crop:'',
    crop_yield:'', electricity:'Yes', fencing:'',
    agri_facilities:[],
    // commercial
    built_area:'', floor:'', frontage:'', business_type:'',
    parking:'Yes', footfall:'Medium', landmarks:'',
    comm_amenities:[],
    // residential
    area_sqft:'', bedrooms:0, bathrooms:0, furnishing:'Unfurnished',
    res_floor:'', res_amenities:[],
  });

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function toggleArr(key, val) {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
    }));
  }

  // Init Leaflet map
  useEffect(() => {
    if (leafletRef.current) return;
    import('leaflet').then(L => {
      const map = L.default.map(mapRef.current).setView([17.385044, 78.486671], 13);
      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      const marker = L.default.marker([17.385044, 78.486671], { draggable: true }).addTo(map);
      marker.on('dragend', e => updateCoords(e.target.getLatLng().lat, e.target.getLatLng().lng));
      map.on('click', e => { updateCoords(e.latlng.lat, e.latlng.lng); marker.setLatLng(e.latlng); });
      leafletRef.current = map;
      markerRef.current  = marker;
    });
  }, []);

  function updateCoords(lat, lng) {
    set('lat', lat); set('lng', lng);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(r => r.json())
      .then(d => { if (d.display_name) set('location', d.display_name.slice(0,200)); })
      .catch(() => {});
  }

  function useMyLocation() {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      updateCoords(lat, lng);
      markerRef.current?.setLatLng([lat, lng]);
      leafletRef.current?.setView([lat, lng], 15);
    }, () => alert('Location access denied'));
  }

  async function handleImages(e) {
    const files = Array.from(e.target.files).slice(0, 10 - images.length);
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = ev => setImages(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    }
  }

  async function submit(e) {
    e.preventDefault(); setErr(''); setSubmitting(true);
    try {
      if (!form.land_type) throw new Error('Please select Land Type');
      if (images.length === 0) throw new Error('Please upload at least one photo');

      const payload = { ...form, price: parseFloat(form.price), images };

      const res  = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/properties`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token()}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.data?.tokenId) {
        setCreatedTokenId(data.data.tokenId);
      }
      setSuccess(true);
      setTimeout(() => navigate('dashboard'), 4000);
    } catch (e) { setErr(e.message); }
    finally     { setSubmitting(false); }
  }

  if (success) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'80vh' }}>
      <div style={{ textAlign:'center', background:'white', borderRadius:20, padding:'3rem', boxShadow:'0 8px 32px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>🎉</div>
        <h2 style={{ color:'#059669', marginBottom:'0.5rem' }}>Property Submitted!</h2>
        {createdTokenId && (
          <div style={{ margin: '1rem 0', padding: '0.5rem 1rem', background: '#FEF3C7', color: '#92400E', borderRadius: 8, fontWeight: 700, display: 'inline-block' }}>
            Property ID: #{createdTokenId}
          </div>
        )}
        <p style={{ color:'#6B7280' }}>Awaiting admin approval. Redirecting to dashboard…</p>
      </div>
    </div>
  );

  return (
    <div style={{ padding:'2rem 1.5rem', maxWidth:960, margin:'0 auto' }}>
      <div style={{ marginBottom:'1.5rem' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('dashboard')} style={{ marginBottom:'0.75rem' }}>
          ← Back to Dashboard
        </button>
        <h1 style={{ fontSize:'1.5rem', fontWeight:800 }}>List New Property</h1>
        <p style={{ color:'#64748B', fontSize:'0.9rem' }}>Fill in the details — your listing will be reviewed by admin.</p>
      </div>

      <form onSubmit={submit}>
        {/* Basic Info */}
        <div className="card card-pad" style={{ marginBottom:'1.5rem' }}>
          <h3 style={{ fontSize:'1rem', fontWeight:800, marginBottom:'1.25rem', color:'#0D9488' }}>
            📋 Basic Information
          </h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Property Title *</label>
              <input className="form-input" required value={form.title}
                onChange={e => set('title', e.target.value)} placeholder="e.g. 5 Acre Farm Land in Shamshabad" />
            </div>
            <div className="form-group">
              <label className="form-label">Land Type *</label>
              <select className="form-input" required value={form.land_type}
                onChange={e => set('land_type', e.target.value)}>
                <option value="">Select Type</option>
                <option>Agriculture</option>
                <option>Commercial</option>
                <option>Residential</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Listing Type</label>
              <select className="form-input" value={form.listing_type}
                onChange={e => set('listing_type', e.target.value)}>
                <option>Sale</option><option>Rent</option><option>Lease</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input className="form-input" type="number" required value={form.price}
                onChange={e => set('price', e.target.value)} placeholder="e.g. 4500000" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows={3} value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Describe the property, nearby landmarks, special features…" />
          </div>
        </div>

        {/* Location + Map */}
        <div className="card card-pad" style={{ marginBottom:'1.5rem' }}>
          <h3 style={{ fontSize:'1rem', fontWeight:800, marginBottom:'1.25rem', color:'#0D9488' }}>
            📍 Location
          </h3>
          <div className="form-group">
            <label className="form-label">Address (auto-filled from map)</label>
            <input className="form-input" required value={form.location}
              onChange={e => set('location', e.target.value)} placeholder="Click on map to auto-fill" />
          </div>
          <div ref={mapRef} className="map-box" />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'0.75rem' }}>
            <span style={{ color:'#64748B', fontSize:'0.85rem' }}>
              📍 {form.lat.toFixed(5)}, {form.lng.toFixed(5)}
            </span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={useMyLocation}>
              <i className="fas fa-crosshairs" /> Use My Location
            </button>
          </div>
        </div>

        {/* Photos */}
        <div className="card card-pad" style={{ marginBottom:'1.5rem' }}>
          <h3 style={{ fontSize:'1rem', fontWeight:800, marginBottom:'1.25rem', color:'#0D9488' }}>
            📷 Property Photos *
          </h3>
          <div className="upload-area" onClick={() => document.getElementById('photoInput').click()}>
            <div style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>☁️</div>
            <p style={{ fontWeight:600, color:'#475569' }}>Click to upload photos</p>
            <p style={{ color:'#94A3B8', fontSize:'0.82rem' }}>Up to 10 images (JPEG, PNG)</p>
          </div>
          <input id="photoInput" type="file" multiple accept="image/*" style={{ display:'none' }}
            onChange={handleImages} />
          {images.length > 0 && (
            <div className="img-preview-grid">
              {images.map((img, i) => (
                <div key={i} className="img-preview-item">
                  <img src={img} alt="preview" />
                  <button type="button" className="img-remove"
                    onClick={() => setImages(prev => prev.filter((_,j) => j!==i))}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Agriculture Fields */}
        {form.land_type === 'Agriculture' && (
          <div className="dynamic-sec sec-agri" style={{ marginBottom:'1.5rem' }}>
            <div className="sec-title">🌾 Agriculture Land Details</div>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Land Area (Acres) *</label>
                <input className="form-input" type="number" step="0.01" value={form.acres}
                  onChange={e => set('acres', e.target.value)} placeholder="e.g. 5.5" />
              </div>
              <div className="form-group">
                <label className="form-label">Soil Type</label>
                <select className="form-input" value={form.soil_type} onChange={e => set('soil_type', e.target.value)}>
                  <option value="">Select</option>
                  {['Black Soil','Red Soil','Alluvial','Laterite','Sandy','Clay'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Water Source</label>
                <select className="form-input" value={form.water_source} onChange={e => set('water_source', e.target.value)}>
                  <option value="">Select</option>
                  {['Borewell','Open Well','Canal','River','Rainfed','Lake'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Current Crop</label>
                <input className="form-input" value={form.current_crop}
                  onChange={e => set('current_crop', e.target.value)} placeholder="e.g. Cotton, Paddy" />
              </div>
              <div className="form-group">
                <label className="form-label">Yield (tons/acre)</label>
                <input className="form-input" type="number" step="0.1" value={form.crop_yield}
                  onChange={e => set('crop_yield', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Fencing</label>
                <select className="form-input" value={form.fencing} onChange={e => set('fencing', e.target.value)}>
                  <option value="">Select</option>
                  {['Barbed Wire','Chain Link','Stone Wall','Compound Wall','No Fencing'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Nearby Facilities</label>
              <div className="checkbox-grid">
                {AGRI_FACILITIES.map(f => (
                  <label key={f}>
                    <input type="checkbox" checked={form.agri_facilities.includes(f)}
                      onChange={() => toggleArr('agri_facilities', f)} /> {f}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Commercial Fields */}
        {form.land_type === 'Commercial' && (
          <div className="dynamic-sec sec-comm" style={{ marginBottom:'1.5rem' }}>
            <div className="sec-title">🏢 Commercial Property Details</div>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Built-up Area (sq.ft) *</label>
                <input className="form-input" type="number" value={form.built_area}
                  onChange={e => set('built_area', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Floor</label>
                <input className="form-input" value={form.floor}
                  onChange={e => set('floor', e.target.value)} placeholder="Ground, 1st, 2nd…" />
              </div>
              <div className="form-group">
                <label className="form-label">Frontage (ft)</label>
                <input className="form-input" type="number" value={form.frontage}
                  onChange={e => set('frontage', e.target.value)} />
              </div>
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Business Type</label>
                <select className="form-input" value={form.business_type} onChange={e => set('business_type', e.target.value)}>
                  <option value="">Select</option>
                  {['Retail Shop','Office Space','Restaurant','Showroom','Warehouse'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Parking</label>
                <select className="form-input" value={form.parking} onChange={e => set('parking', e.target.value)}>
                  <option>Yes</option><option>No</option><option>Valet</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Footfall</label>
                <select className="form-input" value={form.footfall} onChange={e => set('footfall', e.target.value)}>
                  <option>Low</option><option>Medium</option><option>High</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Nearby Landmarks</label>
              <input className="form-input" value={form.landmarks}
                onChange={e => set('landmarks', e.target.value)} placeholder="Metro, Mall, Highway…" />
            </div>
            <div className="form-group">
              <label className="form-label">Amenities</label>
              <div className="checkbox-grid">
                {COMM_AMENITIES.map(a => (
                  <label key={a}>
                    <input type="checkbox" checked={form.comm_amenities.includes(a)}
                      onChange={() => toggleArr('comm_amenities', a)} /> {a}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Residential Fields */}
        {form.land_type === 'Residential' && (
          <div className="dynamic-sec sec-resi" style={{ marginBottom:'1.5rem' }}>
            <div className="sec-title">🏠 Residential Property Details</div>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Area (sq.ft) *</label>
                <input className="form-input" type="number" value={form.area_sqft}
                  onChange={e => set('area_sqft', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Bedrooms</label>
                <input className="form-input" type="number" min="0" value={form.bedrooms}
                  onChange={e => set('bedrooms', parseInt(e.target.value))} />
              </div>
              <div className="form-group">
                <label className="form-label">Bathrooms</label>
                <input className="form-input" type="number" min="0" value={form.bathrooms}
                  onChange={e => set('bathrooms', parseInt(e.target.value))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Floor</label>
                <input className="form-input" value={form.res_floor}
                  onChange={e => set('res_floor', e.target.value)} placeholder="Ground, 1st, 5th…" />
              </div>
              <div className="form-group">
                <label className="form-label">Furnishing</label>
                <select className="form-input" value={form.furnishing} onChange={e => set('furnishing', e.target.value)}>
                  <option>Unfurnished</option><option>Semi-furnished</option><option>Fully Furnished</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Amenities</label>
              <div className="checkbox-grid">
                {RES_AMENITIES.map(a => (
                  <label key={a}>
                    <input type="checkbox" checked={form.res_amenities.includes(a)}
                      onChange={() => toggleArr('res_amenities', a)} /> {a}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="card card-pad" style={{ marginBottom:'1.5rem' }}>
          <h3 style={{ fontSize:'1rem', fontWeight:800, marginBottom:'1.25rem', color:'#0D9488' }}>
            📞 Contact Details
          </h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Contact Number *</label>
              <input className="form-input" type="tel" required value={form.contact_number}
                onChange={e => set('contact_number', e.target.value)} placeholder="10-digit mobile number" />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp Number</label>
              <input className="form-input" type="tel" value={form.whatsapp_number}
                onChange={e => set('whatsapp_number', e.target.value)} placeholder="If different from above" />
            </div>
          </div>
        </div>

        {err && (
          <div style={{ background:'#FEE2E2', color:'#991B1B', borderRadius:10, padding:'0.9rem 1.25rem', marginBottom:'1rem', fontSize:'0.9rem' }}>
            ⚠️ {err}
          </div>
        )}

        <div style={{ display:'flex', gap:'1rem' }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('dashboard')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-teal" style={{ flex:1, justifyContent:'center', padding:'0.85rem' }}
            disabled={submitting}>
            {submitting ? '⏳ Submitting…' : '🚀 Submit Property for Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
