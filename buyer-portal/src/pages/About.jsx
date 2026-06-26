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
    <div style={{ minHeight: '100vh', background: '#FDFBF7', color: '#1E293B', paddingBottom: '5rem' }}>
      {/* Dynamic Keyframes injected into DOM */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes hoverCard {
          to { transform: translateY(-6px); box-shadow: 0 12px 30px rgba(10, 22, 40, 0.12); }
        }
      `}</style>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #132040 100%)',
        color: '#F5F0E8',
        padding: '6rem 1.5rem 5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle glowing gold background effect */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-20%',
          width: '140%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(201, 168, 76, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ maxWidth: '800px', position: 'relative', zIndex: 2 }}>
          <span className="section-tag" style={{
            background: 'linear-gradient(135deg, #C9A84C, #F0C040)',
            color: '#0A1628',
            animation: 'fadeInDown 0.8s ease-out'
          }}>
            Since 2025
          </span>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '3rem',
            color: '#F5F0E8',
            marginBottom: '1.5rem',
            lineHeight: 1.2,
            animation: 'fadeInDown 0.8s ease-out 0.1s both'
          }}>
            About EstateHub
          </h1>
          <p style={{
            fontSize: '1.2rem',
            lineHeight: 1.6,
            color: '#94A3B8',
            maxWidth: '700px',
            margin: '0 auto',
            animation: 'fadeInUp 0.8s ease-out 0.2s both'
          }}>
            A premier digital property platform dedicated to transforming property discovery and investments across Telangana.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ maxWidth: '1000px', marginTop: '-3rem', position: 'relative', zIndex: 10 }}>
        {/* Intro Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '3rem 2.5rem',
          boxShadow: '0 10px 40px rgba(10, 22, 40, 0.06)',
          border: '1px solid rgba(201, 168, 76, 0.15)',
          marginBottom: '4rem',
          animation: 'fadeInUp 0.8s ease-out 0.3s both'
        }}>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            color: '#0A1628',
            fontSize: '2rem',
            marginBottom: '1.5rem',
            borderBottom: '2px solid rgba(201, 168, 76, 0.2)',
            paddingBottom: '0.75rem'
          }}>
            Our Vision & Mission
          </h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: '#374151', marginBottom: '1.5rem' }}>
            EstateHub is a digital property platform focused on helping buyers, sellers, and investors discover real estate opportunities in Telangana. Our mission is to make property discovery easier by providing verified listings, transparent information, and modern technology tools that help users make informed decisions.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: '#374151', marginBottom: '1.5rem' }}>
            The platform allows property owners and authorized representatives to list agricultural lands, residential plots, commercial properties, and investment opportunities while enabling buyers to connect directly with sellers.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: '#374151', fontWeight: 500 }}>
            We strive to promote transparency, accessibility, and convenience in the real estate ecosystem through innovative digital solutions.
          </p>
        </div>

        {/* Services Section */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="section-tag" style={{ background: '#0A1628', color: '#C9A84C' }}>What We Do</span>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#0A1628', fontSize: '2.2rem', marginTop: '0.5rem' }}>
              Our Premium Services
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {services.map((s, idx) => (
              <div
                key={s.title}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '2rem 1.5rem',
                  border: '1px solid rgba(10, 22, 40, 0.05)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(10, 22, 40, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(10, 22, 40, 0.05)';
                }}
              >
                <div style={{
                  fontSize: '2rem',
                  marginBottom: '1rem',
                  background: '#FDFBF7',
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(201, 168, 76, 0.15)'
                }}>{s.icon}</div>
                <h3 style={{ fontSize: '1.2rem', color: '#0A1628', marginBottom: '0.5rem', fontWeight: 700 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#4B5563' }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Footer Section */}
        <div style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)',
          borderRadius: '20px',
          padding: '3.5rem 3rem',
          color: '#F5F0E8',
          boxShadow: '0 15px 40px rgba(10, 22, 40, 0.25)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '3rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ flex: '1 1 400px' }}>
            <span className="section-tag" style={{ background: 'rgba(201, 168, 76, 0.15)', color: '#F0C040' }}>Get In Touch</span>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#F5F0E8', fontSize: '2.2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Connect With Us
            </h2>
            <p style={{ color: '#94A3B8', lineHeight: 1.6, fontSize: '1.05rem', margin: 0 }}>
              Have questions about properties or interested in listings? Drop us a line or visit our support channels.
            </p>
          </div>

          <div style={{
            flex: '1 1 300px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📧</span>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</div>
                <a href="mailto:estatehub@gmail.com" style={{ color: '#F0C040', fontWeight: 600, fontSize: '0.95rem', transition: 'color 0.2s' }}
                   onMouseEnter={e => e.target.style.color = '#F5F0E8'}
                   onMouseLeave={e => e.target.style.color = '#F0C040'}>
                  estatehub@gmail.com
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🌐</span>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Website</div>
                <a href="https://estatehub.vercel.app/" target="_blank" rel="noopener noreferrer" 
                   style={{ color: '#F0C040', fontWeight: 600, fontSize: '0.95rem', transition: 'color 0.2s' }}
                   onMouseEnter={e => e.target.style.color = '#F5F0E8'}
                   onMouseLeave={e => e.target.style.color = '#F0C040'}>
                  estatehub.vercel.app
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📍</span>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Location</div>
                <div style={{ color: '#F5F0E8', fontWeight: 600, fontSize: '0.95rem' }}>Telangana, India</div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="btn-outline" onClick={() => navigate('home')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
