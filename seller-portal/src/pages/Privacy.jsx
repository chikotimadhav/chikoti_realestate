import React from 'react';

export default function PrivacyPage({ navigate }) {
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
            Privacy Policy
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>EstateHub Commitment</p>
        </div>

        {/* Content Card */}
        <div className="card card-pad" style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          lineHeight: '1.75',
          fontSize: '0.95rem',
          color: '#475569'
        }}>
          <p style={{ marginBottom: '1.25rem' }}>
            EstateHub ("we," "our," or "us") respects your privacy and is committed to protecting your personal information.
          </p>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            Information We Collect
          </h2>
          <p style={{ marginBottom: '0.5rem' }}>
            We may collect:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Property details submitted by users</li>
            <li>Account login information</li>
            <li>IP address and browser information</li>
            <li>Usage analytics and website activity</li>
          </ul>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            How We Use Information
          </h2>
          <p style={{ marginBottom: '0.5rem' }}>
            We use collected information to:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <li>Provide and improve our services</li>
            <li>Manage user accounts</li>
            <li>Display property listings</li>
            <li>Respond to inquiries</li>
            <li>Prevent fraud and misuse</li>
            <li>Send service-related communications</li>
          </ul>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            Information Sharing
          </h2>
          <p style={{ marginBottom: '0.5rem' }}>
            We do not sell personal information. We may share information with:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <li>Property buyers and sellers during inquiries</li>
            <li>Service providers supporting website operations</li>
            <li>Government authorities when legally required</li>
          </ul>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            Data Security
          </h2>
          <p style={{ marginBottom: '1.25rem' }}>
            We implement reasonable security measures to protect user information. However, no online system can guarantee complete security.
          </p>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            Third-Party Services
          </h2>
          <p style={{ marginBottom: '0.5rem' }}>
            Our website may use:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <li>Google Maps</li>
            <li>Analytics tools</li>
            <li>Government property verification portals</li>
            <li>Third-party authentication providers</li>
          </ul>
          <p style={{ marginBottom: '1.25rem' }}>
            These services have their own privacy policies.
          </p>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            User Rights
          </h2>
          <p style={{ marginBottom: '0.5rem' }}>
            Users may request:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <li>Access to personal data</li>
            <li>Correction of inaccurate data</li>
            <li>Account deletion</li>
          </ul>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            Policy Updates
          </h2>
          <p style={{ marginBottom: '1.25rem' }}>
            We may update this Privacy Policy from time to time. Continued use of the platform indicates acceptance of updated policies.
          </p>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            Contact
          </h2>
          <address style={{ fontStyle: 'normal', color: '#475569' }}>
            Email: <a href="mailto:estatehub@gmail.com" style={{ color: 'var(--teal)' }}>estatehub@gmail.com</a><br />
            Website: <a href="https://estatehub.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)' }}>estatehub.vercel.app</a>
          </address>
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
