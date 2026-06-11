import React, { useState } from 'react';

// Business templates for the Keyword Simulator
const BUSINESSES = {
  bakery: {
    name: "Golden Crust Bakery",
    location: "Bangalore",
    type: "Bakery & Confectionery",
    broadKeyword: "bakery bangalore",
    broadVolume: "12,000",
    broadDifficulty: "Very High (Hard to rank)",
    longTailKeyword: "best chocolate cake in Bangalore",
    longTailVolume: "1,500",
    longTailDifficulty: "Medium-Low (Highly targeted)",
    defaultTitle: "Delicious Cakes & Pastries | Golden Crust Bakery Bangalore",
    defaultMeta: "Looking for the best cakes in town? Golden Crust Bakery offers fresh bread, custom wedding cakes, and pastries in Bangalore. Order online today!",
    optimizedTitle: "Best Chocolate Cake in Bangalore | Golden Crust Bakery",
    optimizedMeta: "Craving the best chocolate cake in Bangalore? Indulge in Golden Crust's award-winning premium chocolate truffle cakes. Order online for instant delivery!"
  },
  realestate: {
    name: "Chikoti Premium Properties",
    location: "Hyderabad",
    type: "Real Estate Brokerage",
    broadKeyword: "hyderabad plots",
    broadVolume: "25,000",
    broadDifficulty: "Extremely High (Large Aggregators)",
    longTailKeyword: "luxury gated community villas in Hyderabad",
    longTailVolume: "2,200",
    longTailDifficulty: "Medium (High intent buyers)",
    defaultTitle: "Plots & Homes for Sale - Chikoti Real Estate Hyderabad",
    defaultMeta: "Browse real estate listings with Chikoti Real Estate. We have residential properties, plots, agricultural land, and commercial space in Hyderabad.",
    optimizedTitle: "Luxury Gated Community Villas in Hyderabad | Chikoti Real Estate",
    optimizedMeta: "Discover exclusive luxury gated community villas in Hyderabad's prime corridors. HMDA-approved, premium amenities, and verified titles. Book a tour!"
  },
  agriculture: {
    name: "Chikoti Agro Lands",
    location: "Siddipet",
    type: "Agricultural Land Specialist",
    broadKeyword: "land in telangana",
    broadVolume: "8,000",
    broadDifficulty: "High",
    longTailKeyword: "verified agricultural land for sale in Siddipet",
    longTailVolume: "950",
    longTailDifficulty: "Low-Medium (High value conversions)",
    defaultTitle: "Telangana Land Listings | Chikoti Lands",
    defaultMeta: "Check out various land listings for sale in Telangana. Buy agricultural farms, open commercial plots, and investments with Chikoti Lands.",
    optimizedTitle: "Verified Agricultural Land for Sale in Siddipet | Chikoti Lands",
    optimizedMeta: "Clear title, RERA-registered, and verified agricultural land for sale in Siddipet. Direct seller listings, road access, and water facilities."
  }
};

export default function SeoGuidePage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Interactive Metrics States
  const [searchVolume, setSearchVolume] = useState(5000);
  const [ctr, setCtr] = useState(2.5);
  const [convRate, setConvRate] = useState(1.5);

  // Keyword Simulator States
  const [selectedBiz, setSelectedBiz] = useState('bakery');
  const [simOnPage, setSimOnPage] = useState(false);
  const [simOffPage, setSimOffPage] = useState(false);
  const [simTechnical, setSimTechnical] = useState(false);
  const [userTitle, setUserTitle] = useState('');
  const [userMeta, setUserMeta] = useState('');
  const [customKeywordMode, setCustomKeywordMode] = useState(false);

  // Checklist States
  const [checklist, setChecklist] = useState({
    https: false,
    mobile: false,
    sitemap: false,
    altTags: false,
    schema: false,
    speed: false,
    metaTags: false,
  });

  // Schema Generator States
  const [schemaBizName, setSchemaBizName] = useState('Chikoti Real Estate');
  const [schemaBizUrl, setSchemaBizUrl] = useState('https://www.chikotirealestate.com');
  const [schemaPhone, setSchemaPhone] = useState('+91 7013368379');
  const [schemaCity, setSchemaCity] = useState('Hyderabad');

  // Calculations for Metrics Slider
  const calculatedTraffic = Math.round(searchVolume * (ctr / 100));
  const calculatedLeads = Math.round(calculatedTraffic * (convRate / 100));

  // Business template details
  const bizData = BUSINESSES[selectedBiz];

  // Calculation for Position in Search Simulator
  // Base position is 80 (not ranking). Each optimization moves it closer to 1.
  const calculatePosition = () => {
    let position = 82;
    if (simOnPage) position -= 30;
    if (simOffPage) position -= 28;
    if (simTechnical) position -= 20;
    
    // Add variations based on title optimizations
    const currentTitle = userTitle || (simOnPage ? bizData.optimizedTitle : bizData.defaultTitle);
    const targetKW = bizData.longTailKeyword.toLowerCase();
    if (currentTitle.toLowerCase().includes(targetKW)) {
      position -= 3;
    }
    return Math.max(1, position);
  };

  const currentPosition = calculatePosition();

  // Checklist Calculations
  const checklistItems = [
    { key: 'https', label: 'Use Secure HTTPS Connection', points: 14, desc: 'Encrypts communication, building trust and matching Google\'s ranking signal.' },
    { key: 'mobile', label: 'Ensure Mobile-Responsive Layout', points: 15, desc: 'Google uses Mobile-First Indexing. Sites must look premium on smartphones.' },
    { key: 'sitemap', label: 'Create and Submit XML Sitemap', points: 14, desc: 'Gives search engines a roadmap to easily locate and index all your pages.' },
    { key: 'altTags', label: 'Add Image Alt Text & Compress File Sizes', points: 14, desc: 'Helps search crawlers read images while ensuring rapid loading speeds.' },
    { key: 'schema', label: 'Implement Schema Markup (Structured Data)', points: 14, desc: 'Enables rich snippets (stars, pricing, events) directly in search results.' },
    { key: 'speed', label: 'Improve Page Loading Speed', points: 15, desc: 'Boosts rankings and retains visitors. Slow load times skyrocket bounce rates.' },
    { key: 'metaTags', label: 'Optimize Page Titles & Meta Descriptions', points: 14, desc: 'Directly dictates search result presentation and improves Click-Through Rates (CTR).' }
  ];

  const handleChecklistChange = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalScore = Object.keys(checklist).reduce((sum, key) => {
    if (checklist[key]) {
      const item = checklistItems.find(i => i.key === key);
      return sum + (item ? item.points : 0);
    }
    return sum;
  }, 0);

  // Schema Generator code
  const generatedSchema = `{
  "@context": "https://schema.org",
  "@type": "${selectedBiz === 'realestate' ? 'RealEstateAgent' : 'LocalBusiness'}",
  "name": "${schemaBizName}",
  "url": "${schemaBizUrl}",
  "telephone": "${schemaPhone}",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "${schemaCity}",
    "addressRegion": "Telangana",
    "addressCountry": "IN"
  }
}`;

  return (
    <div style={{ background: '#0A1628', color: '#F5F0E8', minHeight: '100vh', paddingTop: '3rem', paddingBottom: '5rem' }}>
      <div className="container">
        
        {/* Style block for local interactive styles */}
        <style>{`
          .seo-tab-btn {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(201, 168, 76, 0.15);
            color: #CBD5E1;
            padding: 0.85rem 1.5rem;
            font-size: 0.95rem;
            font-weight: 600;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(8px);
          }
          .seo-tab-btn:hover {
            border-color: rgba(201, 168, 76, 0.5);
            color: #F5F0E8;
            background: rgba(201, 168, 76, 0.05);
          }
          .seo-tab-btn.active {
            background: linear-gradient(135deg, #C9A84C, #F0C040);
            color: #0A1628;
            border-color: #F0C040;
            box-shadow: 0 4px 20px rgba(201, 168, 76, 0.3);
          }
          .glass-panel {
            background: rgba(19, 32, 64, 0.6);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(201, 168, 76, 0.15);
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease, border-color 0.3s ease;
          }
          .glass-panel:hover {
            border-color: rgba(201, 168, 76, 0.3);
          }
          .metric-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 6px;
            border-radius: 5px;
            background: rgba(255, 255, 255, 0.1);
            outline: none;
            margin: 1.2rem 0;
            transition: background 0.3s;
          }
          .metric-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #F0C040;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(240, 192, 64, 0.8);
            transition: transform 0.1s ease;
          }
          .metric-slider::-webkit-slider-thumb:hover {
            transform: scale(1.25);
          }
          .google-serp-box {
            background: #ffffff;
            color: #1a0dab;
            border-radius: 8px;
            padding: 1.25rem;
            border: 1px solid #dadce0;
            font-family: Arial, sans-serif;
            text-align: left;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          }
          .google-title {
            font-size: 20px;
            line-height: 1.3;
            color: #1a0dab;
            text-decoration: none;
            margin-bottom: 3px;
            font-weight: normal;
            display: inline-block;
          }
          .google-title:hover {
            text-decoration: underline;
          }
          .google-url {
            color: #202124;
            font-size: 14px;
            line-height: 1.3;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 4px;
          }
          .google-desc {
            color: #4d5156;
            font-size: 14px;
            line-height: 1.58;
            word-wrap: break-word;
          }
          .score-gauge-container {
            position: relative;
            width: 140px;
            height: 140px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
          }
          .score-svg {
            transform: rotate(-90deg);
            width: 100%;
            height: 100%;
          }
          .score-bg-circle {
            fill: none;
            stroke: rgba(255, 255, 255, 0.05);
            stroke-width: 10;
          }
          .score-fill-circle {
            fill: none;
            stroke: url(#goldGradient);
            stroke-width: 10;
            stroke-linecap: round;
            transition: stroke-dashoffset 0.8s ease-in-out;
          }
          .code-box {
            background: #060d1a;
            border: 1px solid rgba(201, 168, 76, 0.2);
            color: #a5b4fc;
            padding: 1rem;
            border-radius: 8px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.85rem;
            overflow-x: auto;
            white-space: pre;
          }
        `}</style>

        {/* ── Page Header ───────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-tag" style={{ background: 'linear-gradient(135deg, #C9A84C, #F0C040)', color: '#0A1628' }}>
            Interactive SEO Hub
          </span>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)', fontWeight: 900, color: '#F5F0E8', marginBottom: '1rem', lineHeight: 1.15 }}>
            Mastering <span style={{ color: '#C9A84C' }}>Search Engine Optimization</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.15rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
            Discover how On-Page, Off-Page, and Technical SEO drive visibility, traffic, and high-value customer acquisitions. Put metrics to the test using our real-time calculators and SERP rank simulators.
          </p>
        </div>

        {/* ── Tabbed Navigation ─────────────────────────────── */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
          <button 
            className={`seo-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Why SEO Matters & Metrics
          </button>
          <button 
            className={`seo-tab-btn ${activeTab === 'pillars' ? 'active' : ''}`}
            onClick={() => setActiveTab('pillars')}
          >
            🏛️ The 3 Pillars of SEO
          </button>
          <button 
            className={`seo-tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
          >
            🔮 Google SERP Rank Simulator
          </button>
          <button 
            className={`seo-tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
            onClick={() => setActiveTab('checklist')}
          >
            🛡️ Technical Health Checker
          </button>
        </div>

        {/* ── Tab Content: Overview & Importance ─────────────── */}
        {activeTab === 'overview' && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* Why SEO Matters Cards */}
            <div>
              <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.85rem', color: '#C9A84C', marginBottom: '1.5rem', textAlign: 'center' }}>
                Why Search Optimization Matters
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📈</div>
                  <h3 style={{ fontSize: '1.15rem', color: '#F5F0E8', marginBottom: '0.5rem', fontFamily: 'Playfair Display' }}>Increases Website Visibility</h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Positions your site prominently on Google pages where 90% of searches take place, capturing maximum attention.
                  </p>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
                  <h3 style={{ fontSize: '1.15rem', color: '#F5F0E8', marginBottom: '0.5rem', fontFamily: 'Playfair Display' }}>Attracts Targeted Visitors</h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Connects directly with customers seeking specific services exactly when they display intent, ensuring high-quality traffic.
                  </p>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤝</div>
                  <h3 style={{ fontSize: '1.15rem', color: '#F5F0E8', marginBottom: '0.5rem', fontFamily: 'Playfair Display' }}>Builds Credibility & Trust</h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Securing top-ranking positions establishes authority. Users trust organic Google search rankings over paid advertisements.
                  </p>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💸</div>
                  <h3 style={{ fontSize: '1.15rem', color: '#F5F0E8', marginBottom: '0.5rem', fontFamily: 'Playfair Display' }}>Generates Cost-Free Traffic</h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Creates recurring organic traffic without pay-per-click fees. Provides stable, compounding returns on investment.
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics Interactive Slider Simulator */}
            <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(19,32,64,0.7) 0%, rgba(10,22,40,0.85) 100%)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
                
                {/* Sliders Side */}
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#C9A84C', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700 }}>Interactive Estimator</span>
                  <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.6rem', color: '#F5F0E8', margin: '0.25rem 0 1.5rem' }}>
                    SEO Organic Performance Calculator
                  </h3>
                  
                  {/* Slider 1: Search Volume */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#CBD5E1' }}>
                      <span>Monthly Search Volume (Keyword Demand)</span>
                      <strong style={{ color: '#C9A84C' }}>{searchVolume.toLocaleString()} searches</strong>
                    </div>
                    <input 
                      type="range" min="500" max="50000" step="500"
                      className="metric-slider" 
                      value={searchVolume} 
                      onChange={(e) => setSearchVolume(Number(e.target.value))}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', marginTop: '-10px' }}>
                      <span>500 (Niche)</span>
                      <span>50,000 (Massive)</span>
                    </div>
                  </div>

                  {/* Slider 2: CTR */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#CBD5E1' }}>
                      <span>Click-Through Rate (CTR)</span>
                      <strong style={{ color: '#C9A84C' }}>{ctr}%</strong>
                    </div>
                    <input 
                      type="range" min="0.5" max="30" step="0.5"
                      className="metric-slider" 
                      value={ctr} 
                      onChange={(e) => setCtr(Number(e.target.value))}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', marginTop: '-10px' }}>
                      <span>0.5% (Low visibility)</span>
                      <span>30% (Google Position #1 average)</span>
                    </div>
                  </div>

                  {/* Slider 3: Conversion Rate */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#CBD5E1' }}>
                      <span>Visitor-to-Lead Conversion Rate</span>
                      <strong style={{ color: '#C9A84C' }}>{convRate}%</strong>
                    </div>
                    <input 
                      type="range" min="0.2" max="10" step="0.1"
                      className="metric-slider" 
                      value={convRate} 
                      onChange={(e) => setConvRate(Number(e.target.value))}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', marginTop: '-10px' }}>
                      <span>0.2% (Unoptimized Landing Page)</span>
                      <span>10% (High-Converting Page)</span>
                    </div>
                  </div>
                </div>

                {/* Outputs Display Side */}
                <div style={{
                  background: 'rgba(10, 22, 40, 0.6)',
                  border: '1px solid rgba(201, 168, 76, 0.25)',
                  borderRadius: '12px',
                  padding: '2rem',
                  textAlign: 'center',
                  boxShadow: 'inset 0 4px 24px rgba(0,0,0,0.4)'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase' }}>Simulated Monthly Outputs</span>
                  
                  {/* Traffic Output */}
                  <div style={{ margin: '1.5rem 0' }}>
                    <div style={{ color: '#CBD5E1', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Estimated Organic Traffic</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#F0C040', fontFamily: 'Playfair Display' }}>
                      {calculatedTraffic.toLocaleString()}
                      <span style={{ fontSize: '1rem', color: '#94A3B8', fontWeight: 500, marginLeft: '0.3rem' }}>visitors</span>
                    </div>
                  </div>

                  {/* Separator line */}
                  <div style={{ height: '1px', background: 'rgba(201,168,76,0.15)', margin: '1.5rem auto', width: '80%' }}></div>

                  {/* Conversion Output */}
                  <div style={{ margin: '1.5rem 0' }}>
                    <div style={{ color: '#CBD5E1', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Estimated Customer Leads</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#C9A84C', fontFamily: 'Playfair Display' }}>
                      {calculatedLeads.toLocaleString()}
                      <span style={{ fontSize: '1rem', color: '#94A3B8', fontWeight: 500, marginLeft: '0.3rem' }}>leads</span>
                    </div>
                  </div>

                  <p style={{ color: '#64748B', fontSize: '0.8rem', fontStyle: 'italic', margin: '0' }}>
                    *Estimates based on traditional marketing conversion funnels. Real results depend on landing page user interface excellence and listing trust signals.
                  </p>
                </div>

              </div>

              {/* Informational callout on Metrics */}
              <div style={{
                marginTop: '2rem',
                padding: '1.25rem',
                borderRadius: '8px',
                background: 'rgba(201, 168, 76, 0.05)',
                borderLeft: '4px solid #C9A84C',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start'
              }}>
                <div style={{ fontSize: '1.3rem' }}>💡</div>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#CBD5E1' }}>
                  <strong>Key SEO Metric Breakdown:</strong> Improving your site's search ranking shifts you from CTR position #10 (~1% CTR) to position #1 (~30% CTR). That simple ranking shift multiplies your traffic by <strong>30x</strong> without costing you a single rupee in paid ads!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab Content: Three Pillars of SEO ────────────────── */}
        {activeTab === 'pillars' && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.85rem', color: '#C9A84C', marginBottom: '0.5rem' }}>
                The Three Pillars of Search Engine Success
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>SEO is categorized into three major operational areas. Balancing all three is key to search domination.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              
              {/* On-Page SEO Card */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '2rem' }}>📝</span>
                  <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.4rem', color: '#F0C040', margin: '0' }}>1. On-Page SEO</h3>
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Optimizing individual web pages and their source HTML code to match intent. You have full direct control over On-Page elements.
                </p>
                <ul style={{ paddingLeft: '1.25rem', color: '#94A3B8', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flexGrow: 1 }}>
                  <li><strong>High-Quality Content:</strong> Write deep, informative listings that answer users' layout, water source, and documentation questions.</li>
                  <li><strong>Keyword Integration:</strong> Place critical phrases naturally inside headers, introductions, and URL slugs.</li>
                  <li><strong>Page Titles & Meta Descriptions:</strong> Write click-enticing titles and taglines that search engines show in search results.</li>
                  <li><strong>Header Hierarchy (H1, H2, H3):</strong> Organize your pages with logical heading tags for easy crawler reading.</li>
                  <li><strong>Internal Linking:</strong> Link related properties, guides, and contact pages to spread domain page authority.</li>
                  <li><strong>Alt Text & Filesizes:</strong> Name every image (e.g. <code>alt="Luxury 3BHK Villa Hyderabad"</code>) and compress file sizes for swift loading.</li>
                </ul>
              </div>

              {/* Off-Page SEO Card */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '2rem' }}>🌐</span>
                  <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.4rem', color: '#F0C040', margin: '0' }}>2. Off-Page SEO</h3>
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Actions taken outside of your own website to impact your search rankings. This represents your web authority and reputation signals.
                </p>
                <ul style={{ paddingLeft: '1.25rem', color: '#94A3B8', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flexGrow: 1 }}>
                  <li><strong>Reputable Backlinks:</strong> Secure links pointing to your site from authoritative portals, news sites, and property directories.</li>
                  <li><strong>Brand Mentions:</strong> Build brand search volume when users search "Chikoti Real Estate" directly on Google.</li>
                  <li><strong>Social Media Sharing:</strong> Propel viral shares of property listings, reels, and video walkthroughs across social platforms.</li>
                  <li><strong>Digital PR:</strong> Publish press releases, project launches, and agricultural investment advice guides on popular blogs.</li>
                  <li><strong>Local SEO signals:</strong> Set up and maintain Google Business profile, ensuring consistent Name, Address, and Phone data.</li>
                </ul>
              </div>

              {/* Technical SEO Card */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '2rem' }}>⚙️</span>
                  <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.4rem', color: '#F0C040', margin: '0' }}>3. Technical SEO</h3>
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Improving the backend infrastructure of your website to help search engine crawlers find, parse, and index your pages seamlessly.
                </p>
                <ul style={{ paddingLeft: '1.25rem', color: '#94A3B8', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flexGrow: 1 }}>
                  <li><strong>Loading Speed:</strong> Serve pages instantly. Google penalizes slow websites that delay mobile rendering.</li>
                  <li><strong>Mobile-Friendliness:</strong> Ensure the layout scales fluidly on mobile viewports.</li>
                  <li><strong>Secure HTTPS:</strong> Protect visitor data using SSL certificates. Safe sites rank higher.</li>
                  <li><strong>XML Sitemaps:</strong> Automatically publish an XML page indexing all active listings to direct web crawler spiders.</li>
                  <li><strong>Structured Data Schema:</strong> Inject code formats (JSON-LD) to clearly describe your listings, price, location, and stars.</li>
                  <li><strong>Crawlability & Indexing:</strong> Configure robot instruction rules and fix broken links (404 errors) promptly.</li>
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* ── Tab Content: Keyword & SERP Simulator ────────────────── */}
        {activeTab === 'simulator' && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#C9A84C', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700 }}>Keyword Strategy & SEO SERP Sandbox</span>
              <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.85rem', color: '#F5F0E8', marginTop: '0.25rem' }}>
                Google Rank & Keyword Simulator
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: '650px', margin: '0.5rem auto 0' }}>
                Test the classic keyword example (Bakery in Bangalore) or real estate scenarios. Toggle optimizations below to see how search placement and Google snippets transform.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              
              {/* Simulator Controls */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* 1. Choose Business Template */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '0.5rem', fontWeight: 600 }}>
                    Select Demo Scenario:
                  </label>
                  <select 
                    className="form-input" 
                    style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(201,168,76,0.3)', color: '#F5F0E8', margin: 0 }}
                    value={selectedBiz}
                    onChange={(e) => {
                      setSelectedBiz(e.target.value);
                      setUserTitle('');
                      setUserMeta('');
                    }}
                  >
                    <option value="bakery">🎂 Bangalore Bakery ("best chocolate cake in Bangalore")</option>
                    <option value="realestate">🏠 Hyderabad Real Estate ("gated community villas in Hyderabad")</option>
                    <option value="agriculture">🌾 Siddipet Agri Plots ("agricultural land for sale in Siddipet")</option>
                  </select>
                </div>

                {/* Info about keyword strategy */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.85rem', color: '#C9A84C', fontWeight: 700, marginBottom: '0.4rem' }}>
                    Broad Match Keyword vs Long-Tail Phrase:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <div>
                      <span style={{ color: '#94A3B8' }}>Broad Target:</span><br />
                      <strong>"{bizData.broadKeyword}"</strong><br />
                      <span style={{ color: '#ef4444' }}>Difficulty: {bizData.broadDifficulty}</span>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8' }}>Long-Tail Niche:</span><br />
                      <strong>"{bizData.longTailKeyword}"</strong><br />
                      <span style={{ color: '#22c55e' }}>Difficulty: {bizData.longTailDifficulty}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.6rem', lineHeight: '1.4', margin: '0.6rem 0 0' }}>
                    <strong>Why it works:</strong> Optimizing for the specific long-tail keyword brings <em>highly targeted</em> searchers with intense buying intent, bypassing giant aggregators.
                  </p>
                </div>

                {/* 2. Choose Optimizations */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '0.75rem', fontWeight: 600 }}>
                    Apply SEO Optimizations:
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                      <input 
                        type="checkbox" 
                        checked={simOnPage} 
                        onChange={() => setSimOnPage(!simOnPage)}
                        style={{ accentColor: '#C9A84C', width: 16, height: 16 }}
                      />
                      <span>On-Page SEO (Add target keyword in URL & H1)</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                      <input 
                        type="checkbox" 
                        checked={simOffPage} 
                        onChange={() => setSimOffPage(!simOffPage)}
                        style={{ accentColor: '#C9A84C', width: 16, height: 16 }}
                      />
                      <span>Off-Page SEO (Secure blogger backlink reference)</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                      <input 
                        type="checkbox" 
                        checked={simTechnical} 
                        onChange={() => setSimTechnical(!simTechnical)}
                        style={{ accentColor: '#C9A84C', width: 16, height: 16 }}
                      />
                      <span>Technical SEO (Fast load speed & HTTPS SSL)</span>
                    </label>

                  </div>
                </div>

                {/* 3. Customize Google snippet text */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 600 }}>
                      Write Custom Google Title & Meta:
                    </label>
                    <button 
                      onClick={() => {
                        setUserTitle(bizData.optimizedTitle);
                        setUserMeta(bizData.optimizedMeta);
                      }}
                      style={{ background: 'none', color: '#C9A84C', fontSize: '0.75rem', fontWeight: 600 }}
                    >
                      Fill Optimized Template
                    </button>
                  </div>
                  <input 
                    className="form-input" 
                    placeholder="Enter meta title..."
                    style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#F5F0E8', marginBottom: '0.5rem' }}
                    value={userTitle}
                    onChange={(e) => setUserTitle(e.target.value)}
                  />
                  <textarea 
                    className="form-input" 
                    placeholder="Enter meta description..."
                    rows="2"
                    style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#F5F0E8', resize: 'none', margin: 0 }}
                    value={userMeta}
                    onChange={(e) => setUserMeta(e.target.value)}
                  />
                </div>

              </div>

              {/* SERP Sandbox Preview Output */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
                
                {/* Search Rank Placement Header */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>Google Ranking Position for:</div>
                  <div style={{ color: '#F0C040', fontSize: '1rem', fontWeight: 700, margin: '0.2rem 0' }}>
                    "{bizData.longTailKeyword}"
                  </div>
                  
                  {/* Position Badge display */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '1rem 0' }}>
                    <div style={{
                      width: 90, height: 90, borderRadius: '50%',
                      background: currentPosition <= 5 ? 'radial-gradient(circle, #22c55e 0%, #059669 100%)' : currentPosition <= 30 ? 'radial-gradient(circle, #eab308 0%, #ca8a04 100%)' : 'radial-gradient(circle, #ef4444 0%, #dc2626 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.2)'
                    }}>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', fontWeight: 600 }}>Google</span>
                      <span style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.1 }}>#{currentPosition}</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.88rem', color: '#94A3B8', fontStyle: 'italic' }}>
                    {currentPosition === 1 ? "🥇 Position #1: Search traffic goldmine!" : 
                     currentPosition <= 5 ? "🔥 Top 5: Massive organic visitors guaranteed!" : 
                     currentPosition <= 30 ? "⚡ Page 2/3: Moderate visibility. Optimize more elements to break onto Page 1." : 
                     "❌ Page 8+: invisible. Users rarely browse past Page 1."}
                  </div>
                </div>

                <div style={{ height: '1.5px', background: 'rgba(201,168,76,0.15)', width: '100%' }}></div>

                {/* Mockup Google Search Result Box */}
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem', fontWeight: 600 }}>
                    Google SERP Preview (Desktop):
                  </div>
                  
                  <div className="google-serp-box">
                    <div className="google-url">
                      <div style={{ background: '#f1f3f4', width: 26, height: 26, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#3c4043', fontSize: '11px', fontWeight: 'bold' }}>
                        {selectedBiz === 'bakery' ? 'GC' : 'C'}
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '12px', color: '#202124', lineHeight: 1 }}>{bizData.name}</span>
                        <span style={{ display: 'block', fontSize: '11px', color: '#4d5156', lineHeight: 1.2 }}>
                          {selectedBiz === 'bakery' ? 'https://www.goldencrustbakery.in' : 'https://www.chikotirealestate.com'} › menu
                        </span>
                      </div>
                    </div>
                    <a href="#serp-click" className="google-title" onClick={(e) => e.preventDefault()}>
                      {userTitle || (simOnPage ? bizData.optimizedTitle : bizData.defaultTitle)}
                    </a>
                    <div className="google-desc">
                      {userMeta || (simOnPage ? bizData.optimizedMeta : bizData.defaultMeta)}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ── Tab Content: Technical Health Checker ────────────── */}
        {activeTab === 'checklist' && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#C9A84C', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700 }}>Technical Diagnostics</span>
              <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.85rem', color: '#F5F0E8', marginTop: '0.25rem' }}>
                Interactive Technical SEO Audit Tool
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>Verify technical checklist criteria. See how your SEO audit score changes dynamically.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
              
              {/* Checklist Form */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', color: '#F0C040', marginBottom: '0.5rem', borderBottom: '1px solid rgba(201,168,76,0.15)', paddingBottom: '0.5rem' }}>
                  Auditing Checkpoints:
                </h3>

                {checklistItems.map(item => (
                  <div 
                    key={item.key} 
                    onClick={() => handleChecklistChange(item.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      background: checklist[item.key] ? 'rgba(34, 197, 94, 0.05)' : 'rgba(255,255,255,0.01)',
                      border: checklist[item.key] ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input 
                      type="checkbox"
                      checked={checklist[item.key]}
                      onChange={() => {}} // Handled by outer click
                      style={{ accentColor: '#22c55e', marginTop: '3px', width: '16px', height: '16px' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: checklist[item.key] ? '#ffffff' : '#CBD5E1' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.2rem', lineHeight: '1.4' }}>
                        {item.desc}
                      </div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#C9A84C', fontWeight: 600 }}>
                      +{item.points} pts
                    </span>
                  </div>
                ))}
              </div>

              {/* Health Score Output & Schema Generator */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Score Gauge Panel */}
                <div className="glass-panel" style={{ textAlign: 'center' }}>
                  <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.25rem', color: '#F5F0E8', marginBottom: '1.2rem' }}>
                    SEO Audit Health Score
                  </h3>
                  
                  {/* Gauge SVG */}
                  <div className="score-gauge-container">
                    <svg className="score-svg" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#C9A84C" />
                          <stop offset="100%" stopColor="#F0C040" />
                        </linearGradient>
                      </defs>
                      <circle className="score-bg-circle" cx="50" cy="50" r="40" />
                      <circle 
                        className="score-fill-circle" 
                        cx="50" 
                        cy="50" 
                        r="40"
                        strokeDasharray="251.2"
                        // Score calculation: strokeDashoffset = 251.2 - (251.2 * totalScore) / 100
                        strokeDashoffset={251.2 - (251.2 * totalScore) / 100}
                      />
                    </svg>
                    
                    {/* Centered Score text */}
                    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F0C040', fontFamily: 'Playfair Display', lineHeight: 1 }}>
                        {totalScore}%
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.2rem' }}>
                        SEO Health
                      </span>
                    </div>
                  </div>

                  {/* Diagnostic status label */}
                  <div style={{ marginTop: '1.5rem' }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '0.3rem 1rem',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: totalScore >= 80 ? 'rgba(34, 197, 94, 0.15)' : totalScore >= 40 ? 'rgba(234, 179, 8, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: totalScore >= 80 ? '#22c55e' : totalScore >= 40 ? '#eab308' : '#ef4444',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      {totalScore >= 80 ? '🔒 Production Optimized' : totalScore >= 40 ? '⚠️ Optimization Required' : '🛑 Critical Action Needed'}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.8rem', lineHeight: '1.5' }}>
                      {totalScore === 100 ? 'Magnificent! Your technical SEO conforms to highest Google Standards.' : 
                       totalScore >= 80 ? 'Excellent score. Most critical crawling signals are fully active.' : 
                       totalScore >= 40 ? 'Acceptable foundation, but search engines will index content slowly. Resolve mobile & loading issues first.' : 
                       'Unsecure and unoptimized setup. Crawlers are unable to parse metadata or trust your secure connection.'}
                    </p>
                  </div>
                </div>

                {/* Local Business JSON-LD Schema Generator */}
                <div className="glass-panel">
                  <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.25rem', color: '#F0C040', marginBottom: '0.25rem' }}>
                    Structured Schema Code Generator
                  </h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '1rem' }}>
                    Generate valid JSON-LD code for search result rich snippets.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Business Name</label>
                      <input 
                        className="form-input" 
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', background: 'rgba(10,22,40,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                        value={schemaBizName}
                        onChange={(e) => setSchemaBizName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Website URL</label>
                      <input 
                        className="form-input" 
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', background: 'rgba(10,22,40,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                        value={schemaBizUrl}
                        onChange={(e) => setSchemaBizUrl(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Phone Number</label>
                      <input 
                        className="form-input" 
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', background: 'rgba(10,22,40,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                        value={schemaPhone}
                        onChange={(e) => setSchemaPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#94A3B8' }}>HQ City</label>
                      <input 
                        className="form-input" 
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', background: 'rgba(10,22,40,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                        value={schemaCity}
                        onChange={(e) => setSchemaCity(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="code-box">
                    {generatedSchema}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>*Embed this code inside your page &lt;head&gt; tags.</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(generatedSchema);
                        alert('JSON-LD Schema copied to clipboard!');
                      }}
                      style={{
                        background: 'rgba(201, 168, 76, 0.1)',
                        color: '#C9A84C',
                        border: '1px solid #C9A84C',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}
                    >
                      Copy Code
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
