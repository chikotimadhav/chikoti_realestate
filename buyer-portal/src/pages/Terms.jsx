import React from 'react';

export default function TermsPage({ navigate }) {
  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', color: '#1E293B', padding: '4rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <span className="section-tag">Legal Documents</span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#0A1628', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            Terms & Conditions
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
            Welcome to EstateHub. By accessing or using our website, mobile applications, and services, you agree to comply with and be bound by these Terms and Conditions.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            1. Acceptance of Terms
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            By using EstateHub, you acknowledge that you have read, understood, and agree to these Terms and Conditions. If you do not agree, please do not use our services.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            2. About the Platform
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            EstateHub is an online platform that enables property owners, agents, brokers, and buyers to discover, list, and inquire about real estate properties. We act solely as a technology platform and do not own, sell, purchase, lease, or broker properties unless explicitly stated.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            3. User Accounts
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            Users may be required to create an account to access certain features. You agree to:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Provide accurate and complete information.</li>
            <li>Maintain the confidentiality of your login credentials.</li>
            <li>Be responsible for all activities conducted through your account.</li>
          </ul>
          <p style={{ marginBottom: '1.5rem' }}>
            We reserve the right to suspend or terminate accounts that violate these terms.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            4. Property Listings
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            Property owners, agents, and authorized representatives may submit listings. By posting a listing, you represent that:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>You have the legal authority to advertise the property.</li>
            <li>Information provided is accurate and truthful.</li>
            <li>Photos, videos, and descriptions do not infringe on third-party rights.</li>
          </ul>
          <p style={{ marginBottom: '1.5rem' }}>
            We reserve the right to edit, reject, suspend, or remove listings at our discretion.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            5. Property Information Disclaimer
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            EstateHub does not guarantee the accuracy, completeness, legality, ownership status, market value, or availability of any property listed on the platform. Users must independently verify:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Property ownership</li>
            <li>Land records</li>
            <li>Government approvals</li>
            <li>Legal documents</li>
            <li>Property boundaries</li>
            <li>Taxes and encumbrances</li>
          </ul>
          <p style={{ marginBottom: '1.5rem' }}>
            Before making any purchase, investment, or transaction.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            6. Verification Services
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Any verification tools, maps, external government resources, or property information displayed are provided for informational purposes only. Users remain responsible for conducting independent due diligence before entering into any transaction.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            7. Prohibited Activities
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            Users shall not:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Post false, misleading, or fraudulent listings.</li>
            <li>Impersonate another individual or business.</li>
            <li>Upload unlawful, offensive, or harmful content.</li>
            <li>Attempt unauthorized access to our systems.</li>
            <li>Use the platform for illegal activities.</li>
          </ul>
          <p style={{ marginBottom: '1.5rem' }}>
            Violations may result in account termination and legal action.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            8. Payments and Fees
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Certain services may be offered for a fee. All payments are subject to applicable terms displayed at the time of purchase. Unless otherwise specified, fees are non-refundable.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            9. Intellectual Property
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            All website content, branding, logos, software, graphics, and designs are the property of EstateHub or its licensors. Users may not copy, distribute, modify, or reproduce content without prior written permission.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            10. Third-Party Links
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Our platform may contain links to third-party websites, government portals, mapping services, or external resources. We are not responsible for the content, accuracy, or practices of third-party services.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            11. Limitation of Liability
          </h2>
          <p style={{ marginBottom: '0.75rem' }}>
            To the maximum extent permitted by law, EstateHub shall not be liable for:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Property disputes</li>
            <li>Financial losses</li>
            <li>Fraudulent listings</li>
            <li>Transaction failures</li>
            <li>Data inaccuracies</li>
            <li>Business interruptions</li>
          </ul>
          <p style={{ marginBottom: '1.5rem' }}>
            Users access and use the platform at their own risk.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            12. Indemnification
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            You agree to indemnify and hold harmless EstateHub, its founders, employees, and affiliates from claims, damages, liabilities, and expenses arising from your use of the platform or violation of these Terms.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            13. Privacy
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Your use of the platform is also governed by our Privacy Policy.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            14. Changes to Terms
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            We reserve the right to modify these Terms and Conditions at any time. Updated versions will be posted on this page and become effective immediately upon publication.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            15. Governing Law
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            These Terms shall be governed by and interpreted in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the jurisdiction of the courts located in Telangana, India.
          </p>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#0A1628', marginTop: '2rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.4rem' }}>
            16. Contact Information
          </h2>
          <p style={{ marginBottom: '0.5rem' }}>
            For questions regarding these Terms and Conditions, contact:
          </p>
          <address style={{ fontStyle: 'normal', color: '#374151' }}>
            <strong>EstateHub</strong><br />
            Email: <a href="mailto:estatehub@gmail.com" style={{ color: '#C9A84C' }}>estatehub@gmail.com</a><br />
            Website: <a href="https://estatehub.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: '#C9A84C' }}>estatehub.vercel.app</a><br />
            Location: Telangana, India
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
