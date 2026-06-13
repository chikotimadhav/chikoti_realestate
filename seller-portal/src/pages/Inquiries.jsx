import React, { useState, useEffect } from 'react';

function token() { return localStorage.getItem('ck_seller_token'); }

const PIPELINE_STAGES = [
  { key: 'New', label: 'New', color: '#3B82F6', bg: '#EFF6FF', dot: '#2563EB' },
  { key: 'Contacted', label: 'Contacted', color: '#6366F1', bg: '#EEF2F6', dot: '#4F46E5' },
  { key: 'Site Visit Scheduled', label: 'Site Visit Scheduled', color: '#D97706', bg: '#FEF3C7', dot: '#B45309' },
  { key: 'Negotiation', label: 'Negotiation', color: '#EA580C', bg: '#FFEDD5', dot: '#C2410C' },
  { key: 'Closed', label: 'Closed/Won', color: '#16A34A', bg: '#D1FAE5', dot: '#15803D' }
];

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [viewMode,  setViewMode]  = useState('kanban'); // 'kanban' or 'list'
  const [filterProp, setFilterProp] = useState(''); // filter by property

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

  useEffect(() => {
    loadInquiries(false);
    const interval = setInterval(() => loadInquiries(true), 5000);
    return () => clearInterval(interval);
  }, []);

  async function updateStatus(inquiryId, newStatus) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token()}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Update local state immediately
      setInquiries(prev => prev.map(i => i.id === inquiryId ? { ...i, status: newStatus } : i));
    } catch (e) {
      alert(e.message);
    }
  }

  // Helper to normalize legacy statuses to our new CRM pipeline
  const normalizeStatus = (status) => {
    if (!status) return 'New';
    if (status === 'new') return 'New';
    if (status === 'read' || status === 'replied') return 'Contacted';
    return status;
  };

  // Get unique properties for filtering
  const uniqueProperties = Array.from(new Set(inquiries.map(i => i.property_title).filter(Boolean)));

  // Filtered inquiries list
  const filteredInquiries = filterProp
    ? inquiries.filter(i => i.property_title === filterProp)
    : inquiries;

  // Render quick advance button action details
  const getNextStage = (curr) => {
    const norm = normalizeStatus(curr);
    const idx = PIPELINE_STAGES.findIndex(s => s.key === norm);
    if (idx !== -1 && idx < PIPELINE_STAGES.length - 1) {
      return PIPELINE_STAGES[idx + 1];
    }
    return null;
  };

  // Render a single inquiry card
  const InquiryCard = ({ i }) => {
    const currentNormStatus = normalizeStatus(i.status);
    const nextStage = getNextStage(currentNormStatus);

    return (
      <div className="card" style={{ padding:'1.25rem', boxShadow:'0 2px 10px rgba(0,0,0,0.04)', display:'flex', flexDirection:'column', gap:'0.85rem' }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'0.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <div style={{
              width:34, height:34, borderRadius:'50%',
              background:'linear-gradient(135deg,#0D9488,#14B8A6)',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'white', fontWeight:800, fontSize:'0.9rem', flexShrink:0
            }}>{i.buyer_name[0].toUpperCase()}</div>
            <div>
              <div style={{ fontWeight:700, fontSize:'0.9rem', color:'#0F172A' }}>{i.buyer_name}</div>
              <div style={{ fontSize:'0.72rem', color:'#94A3B8' }}>
                {new Date(i.createdAt || i.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })}
              </div>
            </div>
          </div>
          
          {/* Status badge in List View */}
          {viewMode === 'list' && (
            <span style={{
              padding:'0.2rem 0.6rem', borderRadius:999, fontSize:'0.7rem', fontWeight:800,
              background: PIPELINE_STAGES.find(s => s.key === currentNormStatus)?.bg || '#EFF6FF',
              color: PIPELINE_STAGES.find(s => s.key === currentNormStatus)?.color || '#3B82F6',
              textTransform:'uppercase'
            }}>
              {currentNormStatus}
            </span>
          )}
        </div>

        {/* Message / Details */}
        <div>
          <div style={{ color:'#64748B', fontSize:'0.78rem', display:'flex', alignItems:'center', gap:'0.25rem', marginBottom:'0.35rem' }}>
            🏠 <strong>{i.property_title}</strong>
          </div>
          {i.message && (
            <p style={{
              color:'#475569', fontSize:'0.82rem', lineHeight:1.5,
              background:'#F8FAFC', borderRadius:8, padding:'0.5rem 0.75rem',
              margin:0, fontStyle:'italic'
            }}>"{i.message}"</p>
          )}
        </div>

        {/* Action Contacts */}
        <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
          <a href={`tel:${i.buyer_phone}`}
            style={{
              padding:'0.35rem 0.65rem', borderRadius:6,
              background:'#0D9488', color:'white',
              fontSize:'0.75rem', fontWeight:700,
              display:'flex', alignItems:'center', gap:'0.25rem'
            }}>
            📞 Call
          </a>
          <a href={`https://wa.me/91${i.buyer_phone}`} target="_blank" rel="noreferrer"
            style={{
              padding:'0.35rem 0.65rem', borderRadius:6,
              background:'#DCFCE7', color:'#15803D',
              fontSize:'0.75rem', fontWeight:700,
              display:'flex', alignItems:'center', gap:'0.25rem'
            }}>
            WhatsApp
          </a>
          <a href={`mailto:${i.buyer_email}`}
            style={{
              padding:'0.35rem 0.65rem', borderRadius:6,
              background:'#EFF6FF', color:'#2563EB',
              fontSize:'0.75rem', fontWeight:700,
              display:'flex', alignItems:'center', gap:'0.25rem'
            }}>
            ✉️ Email
          </a>
        </div>

        {/* CRM Status Transition Actions */}
        <div style={{
          borderTop:'1px solid #F1F5F9', paddingTop:'0.75rem',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          gap:'0.5rem'
        }}>
          {/* Status Dropdown */}
          <select
            value={currentNormStatus}
            onChange={(e) => updateStatus(i.id, e.target.value)}
            style={{
              fontSize:'0.78rem', padding:'0.25rem 0.5rem', borderRadius:6,
              border:'1px solid #CBD5E1', color:'#475569', background:'white',
              outline:'none', cursor:'pointer', flex:1
            }}
          >
            {PIPELINE_STAGES.map(stage => (
              <option key={stage.key} value={stage.key}>{stage.label}</option>
            ))}
          </select>

          {/* Quick Progress Button */}
          {nextStage && (
            <button
              onClick={() => updateStatus(i.id, nextStage.key)}
              style={{
                padding:'0.3rem 0.6rem', borderRadius:6,
                background:'linear-gradient(135deg, #0D9488, #14B8A6)', color:'white',
                fontSize:'0.75rem', fontWeight:700, cursor:'pointer', border:'none',
                display:'flex', alignItems:'center', gap:2
              }}
              title={`Move to ${nextStage.label}`}
            >
              Move to {nextStage.label.split(' ')[0]} →
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding:'2rem 1.5rem', maxWidth:1200, margin:'0 auto' }}>
      {/* Page Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'1.4rem', fontWeight:800, marginBottom:'0.25rem' }}>🎯 Lead Management CRM</h1>
          <p style={{ color:'#64748B', fontSize:'0.9rem', margin:0 }}>
            Track your buyers through the sales pipeline stages
          </p>
        </div>

        {/* Controls: View Toggle */}
        <div style={{ display:'flex', gap:'0.5rem', background:'#E2E8F0', padding:'0.25rem', borderRadius:8 }}>
          <button
            onClick={() => setViewMode('kanban')}
            style={{
              padding:'0.35rem 0.85rem', borderRadius:6, fontSize:'0.82rem', fontWeight:700,
              background: viewMode === 'kanban' ? 'white' : 'none',
              color: viewMode === 'kanban' ? '#0F172A' : '#64748B',
              boxShadow: viewMode === 'kanban' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition:'all 0.2s'
            }}
          >
            📋 Pipeline Board
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding:'0.35rem 0.85rem', borderRadius:6, fontSize:'0.82rem', fontWeight:700,
              background: viewMode === 'list' ? 'white' : 'none',
              color: viewMode === 'list' ? '#0F172A' : '#64748B',
              boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition:'all 0.2s'
            }}
          >
            ☰ List View
          </button>
        </div>
      </div>

      {/* Filters Area */}
      <div style={{
        background:'white', borderRadius:12, padding:'0.75rem 1.25rem',
        boxShadow:'0 1px 5px rgba(0,0,0,0.05)', marginBottom:'1.5rem',
        display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap'
      }}>
        <span style={{ fontSize:'0.82rem', fontWeight:700, color:'#64748B' }}>Filter by Listing:</span>
        <select
          value={filterProp}
          onChange={(e) => setFilterProp(e.target.value)}
          style={{
            padding:'0.4rem 0.8rem', borderRadius:8, fontSize:'0.85rem',
            border:'1px solid #CBD5E1', background:'white', outline:'none', cursor:'pointer'
          }}
        >
          <option value="">All Properties</option>
          {uniqueProperties.map(pName => (
            <option key={pName} value={pName}>{pName}</option>
          ))}
        </select>
        {filterProp && (
          <button
            onClick={() => setFilterProp('')}
            style={{ background:'none', color:'#EF4444', fontSize:'0.82rem', fontWeight:700, cursor:'pointer' }}
          >
            Clear Filter
          </button>
        )}
        <span style={{ marginLeft:'auto', fontSize:'0.82rem', color:'#64748B', fontWeight:600 }}>
          Total Leads: {filteredInquiries.length}
        </span>
      </div>

      {/* Main Content */}
      {loading && inquiries.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem', color:'#94A3B8' }}>Loading CRM Pipeline…</div>
      ) : inquiries.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem', background:'white', borderRadius:16 }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📭</div>
          <p style={{ color:'#94A3B8', fontSize:'1.05rem' }}>No inquiries yet.</p>
          <p style={{ color:'#CBD5E1', fontSize:'0.88rem', marginTop:'0.4rem' }}>
            When buyers contact you about your properties, they will appear here as CRM leads.
          </p>
        </div>
      ) : viewMode === 'kanban' ? (
        /* Kanban CRM Board */
        <div style={{
          display:'flex', gap:'1.25rem', overflowX:'auto',
          paddingBottom:'1.5rem', alignItems:'flex-start', minHeight:'60vh'
        }}>
          {PIPELINE_STAGES.map(stage => {
            const stageInquiries = filteredInquiries.filter(i => normalizeStatus(i.status) === stage.key);
            
            return (
              <div
                key={stage.key}
                style={{
                  flex:'0 0 280px', background:'#F1F5F9', borderRadius:14,
                  padding:'1rem', display:'flex', flexDirection:'column', gap:'0.85rem',
                  maxHeight:'75vh', overflowY:'auto', borderTop:`4px solid ${stage.color}`
                }}
              >
                {/* Column Header */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:'0.25rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                    <span style={{ width:8, height:8, borderRadius:'50%', background:stage.dot }} />
                    <h3 style={{ fontSize:'0.9rem', fontWeight:800, color:'#1E293B' }}>{stage.label}</h3>
                  </div>
                  <span style={{
                    background:'white', color:'#475569', fontSize:'0.75rem',
                    fontWeight:700, padding:'0.15rem 0.5rem', borderRadius:6, boxShadow:'0 1px 2px rgba(0,0,0,0.05)'
                  }}>
                    {stageInquiries.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', overflowY:'auto', flex:1 }}>
                  {stageInquiries.length === 0 ? (
                    <div style={{
                      textAlign:'center', padding:'2.5rem 1rem', border:'2px dashed #E2E8F0',
                      borderRadius:10, color:'#94A3B8', fontSize:'0.78rem'
                    }}>
                      Drop leads here
                    </div>
                  ) : (
                    stageInquiries.map(i => (
                      <InquiryCard key={i.id} i={i} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
          {filteredInquiries.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem', color:'#94A3B8' }}>No inquiries match this filter.</div>
          ) : (
            filteredInquiries.map(i => (
              <InquiryCard key={i.id} i={i} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
