import React from 'react';

export default function DisclaimerPage({ navigate }) {
  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', color: '#1E293B', padding: '4rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <span className="section-tag">Legal Documents</span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#0A1628', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            Disclaimer
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>Last Updated: 15-06-2026</p>
        </div>

        {/* Content Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '3rem 2.5rem',
          boxShadow: '0 8px 30px rgba(10, 22, 40, 0.05)',
          border: '1px solid rgba(201, 168, 76, 0.12)',
          lineHeight: '1.75',
          fontSize: '0.98rem',
          color: '#374151'
        }}>
          <p style={{ marginBottom: '1.5rem', fontWeight: 500 }}>
            EstateHub is an online property listing platform.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            No Ownership Guarantee
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            We do not own, control, or guarantee ownership of properties listed by users.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            No Legal Advice
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Information provided on this platform does not constitute legal, financial, investment, or real-estate advice.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            Verification Tools
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            Any property verification links, maps, satellite imagery, government portals, land records, or external resources are provided for informational purposes only. Users must independently verify:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Ownership documents</li>
            <li>Encumbrance certificates</li>
            <li>Survey records</li>
            <li>Government approvals</li>
            <li>Property boundaries</li>
            <li>Land use permissions</li>
          </ul>
          <p style={{ marginBottom: '1.5rem' }}>
            Before entering into any transaction.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            Listing Accuracy
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Property descriptions, images, pricing, location details, and ownership claims are provided by sellers, agents, or listing owners. EstateHub does not guarantee the accuracy or completeness of such information.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            User Responsibility
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Buyers, investors, and users are solely responsible for conducting their own due diligence before making any purchase, investment, lease, or agreement.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            Limitation of Liability
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            EstateHub shall not be liable for:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Property disputes</li>
            <li>Fraudulent listings</li>
            <li>Financial losses</li>
            <li>Documentation issues</li>
            <li>Ownership conflicts</li>
            <li>Investment decisions</li>
          </ul>
          <p style={{ marginBottom: '1.5rem' }}>
            All transactions are conducted at the user's own risk.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            External Websites
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            We are not responsible for information available on external government portals, mapping services, or third-party websites linked from our platform.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            Acceptance
          </h2>
          <p style={{ marginBottom: '0.5rem' }}>
            By using this platform, users acknowledge and accept this disclaimer.
          </p>
        </div>

        {/* Back Button */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="btn-outline" onClick={() => navigate('home')}>
            ← Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}
