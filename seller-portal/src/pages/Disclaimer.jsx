import React from 'react';

export default function DisclaimerPage({ navigate }) {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', color: '#1E293B', padding: '2rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        
        {/* Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A, #1E293B)',
          borderRadius: 16,
          padding: '2.5rem',
          marginBottom: '2rem',
          color: 'white',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)'
        }}>
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
            Legal Center
          </span>
          <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Listings & Verification Disclaimer
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>Last Updated: 15-06-2026</p>
        </div>

        {/* Content Card */}
        <div className="card card-pad" style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          lineHeight: '1.75',
          fontSize: '0.95rem',
          color: '#475569'
        }}>
          <p style={{ marginBottom: '1.25rem', fontWeight: 600, color: '#0F172A' }}>
            EstateHub is an online property listing platform.
          </p>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            No Ownership Guarantee
          </h2>
          <p style={{ marginBottom: '1.25rem' }}>
            We do not own, control, or guarantee ownership of properties listed by users.
          </p>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            No Legal Advice
          </h2>
          <p style={{ marginBottom: '1.25rem' }}>
            Information provided on this platform does not constitute legal, financial, investment, or real-estate advice.
          </p>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            Verification Tools
          </h2>
          <p style={{ marginBottom: '0.5rem' }}>
            Any property verification links, maps, satellite imagery, government portals, land records, or external resources are provided for informational purposes only. Users must independently verify:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <li>Ownership documents</li>
            <li>Encumbrance certificates</li>
            <li>Survey records</li>
            <li>Government approvals</li>
            <li>Property boundaries</li>
            <li>Land use permissions</li>
          </ul>
          <p style={{ marginBottom: '1.25rem' }}>
            Before entering into any transaction.
          </p>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            Listing Accuracy
          </h2>
          <p style={{ marginBottom: '1.25rem' }}>
            Property descriptions, images, pricing, location details, and ownership claims are provided by sellers, agents, or listing owners. EstateHub does not guarantee the accuracy or completeness of such information.
          </p>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            User Responsibility
          </h2>
          <p style={{ marginBottom: '1.25rem' }}>
            Buyers, investors, and users are solely responsible for conducting their own due diligence before making any purchase, investment, lease, or agreement.
          </p>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            Limitation of Liability
          </h2>
          <p style={{ marginBottom: '0.5rem' }}>
            EstateHub shall not be liable for:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <li>Property disputes</li>
            <li>Fraudulent listings</li>
            <li>Financial losses</li>
            <li>Documentation issues</li>
            <li>Ownership conflicts</li>
            <li>Investment decisions</li>
          </ul>
          <p style={{ marginBottom: '1.25rem' }}>
            All transactions are conducted at the user's own risk.
          </p>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            External Websites
          </h2>
          <p style={{ marginBottom: '1.25rem' }}>
            We are not responsible for information available on external government portals, mapping services, or third-party websites linked from our platform.
          </p>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            Acceptance
          </h2>
          <p style={{ marginBottom: '0.5rem' }}>
            By using this platform, users acknowledge and accept this disclaimer.
          </p>
        </div>

        {/* Back Button */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button className="btn btn-navy" onClick={() => navigate('dashboard')}>
            ← Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
