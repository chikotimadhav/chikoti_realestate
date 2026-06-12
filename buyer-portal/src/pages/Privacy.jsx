import React from 'react';

export default function PrivacyPage({ navigate }) {
  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', color: '#1E293B', padding: '4rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <span className="section-tag">Legal Documents</span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#0A1628', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            Privacy Policy
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
          <p style={{ marginBottom: '1.5rem' }}>
            Chikoti Real Estate ("we," "our," or "us") respects your privacy and is committed to protecting your personal information.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            Information We Collect
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            We may collect:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Property details submitted by users</li>
            <li>Account login information</li>
            <li>IP address and browser information</li>
            <li>Usage analytics and website activity</li>
          </ul>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            How We Use Information
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            We use collected information to:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Provide and improve our services</li>
            <li>Manage user accounts</li>
            <li>Display property listings</li>
            <li>Respond to inquiries</li>
            <li>Prevent fraud and misuse</li>
            <li>Send service-related communications</li>
          </ul>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            Information Sharing
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            We do not sell personal information. We may share information with:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Property buyers and sellers during inquiries</li>
            <li>Service providers supporting website operations</li>
            <li>Government authorities when legally required</li>
          </ul>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            Data Security
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            We implement reasonable security measures to protect user information. However, no online system can guarantee complete security.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            Third-Party Services
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            Our website may use:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Google Maps</li>
            <li>Analytics tools</li>
            <li>Government property verification portals</li>
            <li>Third-party authentication providers</li>
          </ul>
          <p style={{ marginBottom: '1.5rem' }}>
            These services have their own privacy policies.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            User Rights
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            Users may request:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Access to personal data</li>
            <li>Correction of inaccurate data</li>
            <li>Account deletion</li>
          </ul>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            Policy Updates
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            We may update this Privacy Policy from time to time. Continued use of the platform indicates acceptance of updated policies.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            Contact
          </h2>
          <address style={{ fontStyle: 'normal', color: '#374151' }}>
            Email: <a href="mailto:chikoticreations@gmail.com" style={{ color: '#C9A84C' }}>chikoticreations@gmail.com</a><br />
            Website: <a href="https://chikotirealestate.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: '#C9A84C' }}>chikotirealestate.vercel.app</a>
          </address>
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
