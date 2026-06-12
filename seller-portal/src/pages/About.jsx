import React from 'react';

export default function AboutPage({ navigate }) {
  const services = [
    { title: 'Property Listings', desc: 'Browse verified agricultural land, commercial sites, and residential plots in Telangana.', icon: '📋' },
    { title: 'Seller Portal Management', desc: 'Empowering owners and agents to list, modify, and track their properties effortlessly.', icon: '🔑' },
    { title: 'Property Discovery', desc: 'Smart filtering and intuitive UI design to match buyers with their perfect property.', icon: '🔍' },
    { title: 'Property Inquiry Management', desc: 'Seamless communication interface connecting buyers directly to sellers.', icon: '📩' },
    { title: 'Location & Map Integration', desc: 'Detailed spatial insights and geographic views for precision investments.', icon: '🗺️' },
    { title: 'Property Verification Resources', desc: 'Promoting trust and transparency with verified developer details and listing audits.', icon: '🛡️' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', color: '#1E293B', padding: '2rem 1.5rem 5rem' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <div style={{ maxWidth: 1000, margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
        
        {/* Welcome Section */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A, #1E293B)',
          borderRadius: 16,
          padding: '2.5rem 2.5rem',
          marginBottom: '2rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '100%',
            background: 'radial-gradient(circle, rgba(13, 148, 110, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div>
            <span style={{
              background: 'rgba(13, 148, 136, 0.2)',
              color: '#5EEAD4',
              padding: '0.3rem 0.8rem',
              borderRadius: 999,
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'inline-block',
              marginBottom: '0.75rem'
            }}>
              Seller Resource
            </span>
            <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              About Chikoti Real Estate
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '1rem', maxWidth: 700, lineHeight: 1.5 }}>
              Connecting verified property sellers directly with prospective buyers and smart investors across Telangana.
            </p>
          </div>
        </div>

        {/* Content Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginBottom: '2.5rem' }}>
          
          {/* Mission & Vision Card */}
          <div className="card card-pad" style={{ border: '1px solid #E2E8F0' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🎯</span> Mission & Platform Vision
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', lineHeight: 1.7, color: '#475569', fontSize: '0.95rem' }}>
              <p>
                Chikoti Real Estate is a digital property platform focused on helping buyers, sellers, and investors discover real estate opportunities in Telangana.
              </p>
              <p>
                Our mission is to make property discovery easier by providing verified listings, transparent information, and modern technology tools that help users make informed decisions.
              </p>
              <p>
                The platform allows property owners and authorized representatives to list agricultural lands, residential plots, commercial properties, and investment opportunities while enabling buyers to connect directly with sellers.
              </p>
              <p style={{ fontWeight: 600, color: '#0F172A' }}>
                We strive to promote transparency, accessibility, and convenience in the real estate ecosystem through innovative digital solutions.
              </p>
            </div>
          </div>

          {/* Services Card */}
          <div className="card card-pad" style={{ border: '1px solid #E2E8F0' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🚀</span> Services Offered
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}>
              {services.map(s => (
                <div key={s.title} style={{
                  background: '#F8FAFC',
                  borderRadius: 12,
                  padding: '1.25rem',
                  border: '1px solid #E2E8F0',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--teal)';
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 148, 136, 0.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Card */}
          <div className="card card-pad" style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            color: 'white',
            border: 'none',
            boxShadow: '0 8px 25px rgba(15, 23, 42, 0.15)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📞</span> Contact Information
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
              marginTop: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>✉️</span>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Email Support</div>
                  <a href="mailto:chikoticreations@gmail.com" style={{ color: '#5EEAD4', fontWeight: 600, fontSize: '0.92rem' }}>
                    chikoticreations@gmail.com
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🌐</span>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Website URL</div>
                  <a href="https://chikotirealestate.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: '#5EEAD4', fontWeight: 600, fontSize: '0.92rem' }}>
                    chikotirealestate.vercel.app
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📍</span>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Main Office</div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '0.92rem' }}>Telangana, India</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Back Button */}
        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-navy" onClick={() => navigate('dashboard')}>
            ← Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
