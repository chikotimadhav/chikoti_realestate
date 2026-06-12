import React from 'react';

export default function Footer({ navigate }) {
  return (
    <footer style={{ background:'#0A1628', color:'#94A3B8', padding:'3rem 1.5rem 1.5rem' }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'2rem', marginBottom:'2rem' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'0.75rem' }}>
              <img 
                src="https://res.cloudinary.com/dpkaoxtz3/image/upload/c_crop,w_634,h_545,x_180,y_197/f_auto,q_auto/ChatGPT_Image_Jun_12_2026_10_13_59_PM_kzlegb" 
                alt="Chikoti Real Estate Logo" 
                style={{ width:36, height:36, objectFit:'contain' }}
              />
              <span style={{ fontFamily:'Playfair Display', fontWeight:700, color:'#F5F0E8', fontSize:'1.1rem' }}>
                Chikoti Real Estate
              </span>
            </div>
            <p style={{ fontSize:'0.88rem', lineHeight:1.65 }}>
              Trusted partner in property investments since 2025.
            </p>
          </div>
          <div>
            <h4 style={{ color:'#C9A84C', fontWeight:700, marginBottom:'0.75rem' }}>Quick Links</h4>
            {['Home','Properties','About Us'].map(l => (
              <div key={l} style={{ marginBottom:'0.4rem' }}>
                <button onClick={() => navigate(l === 'About Us' ? 'about' : l.toLowerCase())} style={{
                  background:'none', color:'#94A3B8', fontSize:'0.9rem', transition:'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color='#C9A84C'}
                onMouseLeave={e => e.target.style.color='#94A3B8'}>{l}</button>
              </div>
            ))}
            <div style={{ marginTop:'0.4rem' }}>
              <a href="https://chikoti-realestate-seller-portal.vercel.app/" target="_blank" rel="noreferrer"
                style={{ color:'#94A3B8', fontSize:'0.9rem' }}>Seller Portal</a>
            </div>
          </div>
          <div>
            <h4 style={{ color:'#C9A84C', fontWeight:700, marginBottom:'0.75rem' }}>Legal</h4>
            {[
              { label: 'Terms & Conditions', page: 'terms' },
              { label: 'Privacy Policy', page: 'privacy' },
              { label: 'Disclaimer', page: 'disclaimer' }
            ].map(l => (
              <div key={l.page} style={{ marginBottom:'0.4rem' }}>
                <button onClick={() => navigate(l.page)} style={{
                  background:'none', color:'#94A3B8', fontSize:'0.9rem', transition:'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color='#C9A84C'}
                onMouseLeave={e => e.target.style.color='#94A3B8'}>{l.label}</button>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ color:'#C9A84C', fontWeight:700, marginBottom:'0.75rem' }}>Contact</h4>
            <p style={{ fontSize:'0.9rem', marginBottom:'0.5rem' }}>📞 +91 7013368379</p>
            <p style={{ fontSize:'0.9rem', marginBottom:'0.5rem' }}>📧 chikotirealestates@gmail.com</p>
            <p style={{ fontSize:'0.9rem' }}>📍 Hyderabad, Telangana</p>
          </div>
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'1.25rem', textAlign:'center', fontSize:'0.82rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem' }}>
          <div>© {new Date().getFullYear()} Chikoti Real Estate. All rights reserved. | RERA Certified</div>
          <div className="designer-credit">
            <span>designed by</span>
            <a href="https://www.instagram.com/chikoti_creations?igsh=MWU3eGZ6c3Zyam1taA%3D%3D" target="_blank" rel="noopener noreferrer" className="instagram-icon-link">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.332.014 7.052.072 5.197.157 3.618.525 2.345 1.799 1.072 3.072.704 4.651.619 6.51.561 7.79.547 8.199.547 11.452s.014 3.662.072 4.942c.085 1.859.453 3.438 1.726 4.711s2.852 1.641 4.711 1.726c1.28.058 1.689.072 4.942.072s3.662-.014 4.942-.072c1.859-.085 3.438-.453 4.711-1.726s1.641-2.852 1.726-4.711c.058-1.28.072-1.689.072-4.942s-.014-3.662-.072-4.942c-.085-1.859-.453-3.438-1.726-4.711C20.337.525 18.758.157 16.899.072 15.619.014 15.21 0 11.96 0h.04z" />
                <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
              @chikoti_creations
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
