import React, { useState, useEffect } from 'react';

export default function ReelsPage() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReel, setActiveReel] = useState(null); // Reel to play in modal

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    async function fetchReels() {
      try {
        const res = await fetch(`${apiBase}/api/reels`);
        const data = await res.json();
        if (data.success) {
          setReels(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching reels:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReels();
  }, []);

  const getEmbedDetails = (url) => {
    if (!url) return null;

    // YouTube Shorts/Videos
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
    const ytMatch = url.match(ytRegex);
    if (ytMatch) {
      const id = ytMatch[1];
      return {
        type: 'youtube',
        embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&enablejsapi=1&rel=0`,
        thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      };
    }

    // Instagram Reels
    const igRegex = /instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/;
    const igMatch = url.match(igRegex);
    if (igMatch) {
      const code = igMatch[1];
      return {
        type: 'instagram',
        embedUrl: `https://www.instagram.com/reel/${code}/embed/`,
        thumbnail: null,
      };
    }

    // Direct Video Link (MP4, etc.)
    if (url.match(/\.(mp4|webm|ogg|mov)(?:\?|$)/i) || url.includes('/uploads/')) {
      return {
        type: 'video',
        embedUrl: url,
        thumbnail: null,
      };
    }

    return {
      type: 'generic',
      embedUrl: url,
      thumbnail: null,
    };
  };

  return (
    <>
      <style>{`
        .reels-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 4rem 1.5rem;
        }
        
        .reels-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        
        .reels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }
        
        .reel-card {
          position: relative;
          aspect-ratio: 9/16;
          border-radius: 20px;
          overflow: hidden;
          background: #0d1e36;
          border: 1px solid rgba(201, 168, 76, 0.15);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .reel-card:hover {
          transform: translateY(-8px);
          border-color: rgba(201, 168, 76, 0.6);
          box-shadow: 0 20px 40px rgba(201, 168, 76, 0.15), 0 15px 30px rgba(0, 0, 0, 0.4);
        }
        
        .reel-thumbnail-wrap {
          width: 100%;
          height: 100%;
          position: relative;
        }
        
        .reel-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .reel-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0d1e36 0%, #1e3a5f 50%, #0d1e36 100%);
          position: relative;
        }
        
        .reel-placeholder::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(201, 168, 76, 0.15) 0%, transparent 70%);
        }
        
        .reel-instagram-gradient {
          background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%);
        }
        
        .reel-youtube-gradient {
          background: linear-gradient(135deg, #991b1b 0%, #ef4444 50%, #7f1d1d 100%);
        }
        
        .reel-play-btn {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          z-index: 2;
        }
        
        .reel-card:hover .reel-play-btn {
          transform: scale(1.15);
          background: #C9A84C;
          border-color: #C9A84C;
          color: #0A1628;
          box-shadow: 0 0 25px rgba(201, 168, 76, 0.6);
        }
        
        .reel-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10, 22, 40, 0.95) 0%, rgba(10, 22, 40, 0.4) 50%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.5rem;
          z-index: 2;
        }
        
        .reel-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          padding: 0.35rem 0.75rem;
          border-radius: 50px;
          font-size: 0.72rem;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          z-index: 2;
        }
        
        .badge-ig {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
        }
        
        .badge-yt {
          background: #FF0000;
        }
        
        .badge-vid {
          background: linear-gradient(135deg, #10B981, #059669);
        }

        .badge-gen {
          background: linear-gradient(135deg, #6366F1, #4F46E5);
        }
        
        .reel-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #F5F0E8;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          line-height: 1.3;
        }
        
        .reel-desc {
          font-size: 0.82rem;
          color: #CBD5E1;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        /* Lightbox Overlay */
        .reel-lightbox {
          position: fixed;
          inset: 0;
          background: rgba(8, 17, 32, 0.95);
          backdrop-filter: blur(16px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: reelFadeIn 0.3s ease-out;
        }
        
        .reel-lightbox-content {
          position: relative;
          width: 90vw;
          max-width: 440px;
          height: 85vh;
          max-height: 780px;
          background: #000;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(201, 168, 76, 0.25);
          border: 2px solid rgba(201, 168, 76, 0.3);
          display: flex;
          flex-direction: column;
          animation: reelScaleUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .reel-player-container {
          flex: 1;
          width: 100%;
          position: relative;
          background: #000;
        }
        
        .reel-player-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        
        .reel-lightbox-close {
          position: absolute;
          top: -48px;
          right: 0;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .reel-lightbox-close:hover {
          background: #ef4444;
          border-color: #ef4444;
          transform: rotate(90deg);
        }

        .reel-lightbox-info {
          padding: 1.25rem 1.5rem;
          background: linear-gradient(to top, #0A1628 0%, #10213d 100%);
          border-top: 1px solid rgba(201, 168, 76, 0.2);
          color: #F5F0E8;
        }

        .reel-lightbox-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          color: #C9A84C;
          margin-bottom: 0.35rem;
          font-weight: 700;
        }

        .reel-lightbox-desc {
          font-size: 0.85rem;
          color: #94A3B8;
          line-height: 1.4;
        }
        
        @keyframes reelFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes reelScaleUp {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .reel-lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: white;
          font-size: 2.2rem;
          font-weight: 300;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10005;
          backdrop-filter: blur(8px);
          user-select: none;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
          line-height: 1;
          padding-bottom: 4px;
        }
        
        .reel-lightbox-nav:hover {
          background: #C9A84C;
          border-color: #C9A84C;
          color: #0A1628;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 0 20px rgba(201, 168, 76, 0.5);
        }
        
        .reel-lightbox-nav-left {
          left: 40px;
        }
        
        .reel-lightbox-nav-right {
          right: 40px;
        }

        @media (max-width: 768px) {
          .reel-lightbox-nav {
            width: 44px;
            height: 44px;
            font-size: 1.8rem;
          }
          .reel-lightbox-nav-left {
            left: 15px;
          }
          .reel-lightbox-nav-right {
            right: 15px;
          }
        }

        @media (max-width: 480px) {
          .reel-lightbox-content {
            width: 100vw;
            height: 100vh;
            max-height: 100vh;
            border-radius: 0;
            border: none;
          }
          .reel-lightbox-close {
            top: 15px;
            right: 15px;
            background: rgba(10, 22, 40, 0.7);
            border-color: rgba(255, 255, 255, 0.3);
            z-index: 10001;
          }
          .reel-lightbox-nav {
            top: 40%;
          }
        }
      `}</style>

      <div className="reels-container">
        <div className="reels-header">
          <span className="section-tag" style={{ color: '#C9A84C', fontWeight: 700, letterSpacing: 1.5 }}>
            🎥 Chikoti Reels
          </span>
          <h1 style={{
            fontFamily: 'Playfair Display',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#F5F0E8',
            marginTop: '0.5rem',
            marginBottom: '1rem',
            fontWeight: 800
          }}>
            Explore Properties <span style={{ color: '#C9A84C' }}>In Action</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            Watch premium video tours, local corridors, and site developments directly from your phone. Click any reel below to play!
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton" style={{ height: '480px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.03)' }} />
            ))}
          </div>
        ) : reels.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '24px', border: '1px dashed rgba(201, 168, 76, 0.15)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📭</span>
            <h3 style={{ fontFamily: 'Playfair Display', color: '#F5F0E8', fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Reels Available</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Check back soon! Our team is capturing gorgeous footage of new listings.</p>
          </div>
        ) : (
          <div className="reels-grid">
            {reels.map((reel) => {
              const details = getEmbedDetails(reel.videoUrl);
              const isIg = details?.type === 'instagram';
              const isYt = details?.type === 'youtube';
              const isVid = details?.type === 'video';

              return (
                <div 
                  key={reel.id || reel._id} 
                  className="reel-card"
                  onClick={() => setActiveReel(reel)}
                >
                  {/* Badge */}
                  <span className={`reel-badge ${isIg ? 'badge-ig' : isYt ? 'badge-yt' : isVid ? 'badge-vid' : 'badge-gen'}`}>
                    {isIg ? 'Instagram' : isYt ? 'YouTube' : isVid ? 'Video' : 'Link'}
                  </span>

                  <div className="reel-thumbnail-wrap">
                    {details?.thumbnail ? (
                      <img 
                        src={details.thumbnail} 
                        alt={reel.title || 'Reel Cover'} 
                        className="reel-thumbnail"
                      />
                    ) : (
                      <div className={`reel-placeholder ${isIg ? 'reel-instagram-gradient' : isYt ? 'reel-youtube-gradient' : ''}`}>
                        <div className="reel-play-btn">▶</div>
                      </div>
                    )}

                    {/* Bottom overlay with text */}
                    <div className="reel-overlay">
                      {/* Show standard play button if there was a thumbnail */}
                      {details?.thumbnail && (
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '1.5rem' }}>
                          <div className="reel-play-btn" style={{ margin: 0 }}>▶</div>
                        </div>
                      )}
                      
                      <h3 className="reel-title">
                        {reel.title || 'Chikoti Real Estate Tour'}
                      </h3>
                      {reel.description && (
                        <p className="reel-desc">{reel.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox / Video Modal */}
      {activeReel && (() => {
        const details = getEmbedDetails(activeReel.videoUrl);
        const activeIndex = reels.findIndex(r => (r.id || r._id) === (activeReel?.id || activeReel?._id));
        return (
          <div className="reel-lightbox" onClick={() => setActiveReel(null)}>
            {/* Left Nav Button */}
            {reels.length > 1 && (
              <button 
                className="reel-lightbox-nav reel-lightbox-nav-left"
                onClick={(e) => {
                  e.stopPropagation();
                  const prevIndex = (activeIndex - 1 + reels.length) % reels.length;
                  setActiveReel(reels[prevIndex]);
                }}
                title="Previous Reel"
              >
                ‹
              </button>
            )}

            <div className="reel-lightbox-content" onClick={e => e.stopPropagation()}>
              
              {/* Close Button */}
              <button className="reel-lightbox-close" onClick={() => setActiveReel(null)}>✕</button>

              <div className="reel-player-container">
                {details?.type === 'youtube' && (
                  <iframe 
                    className="reel-player-iframe"
                    src={details.embedUrl}
                    title="YouTube Video Player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  />
                )}
                
                {details?.type === 'instagram' && (
                  <iframe 
                    className="reel-player-iframe"
                    src={details.embedUrl}
                    title="Instagram Reel Player"
                    allowFullScreen
                    allow="autoplay"
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                    scrolling="no"
                    frameBorder="0"
                  />
                )}

                {details?.type === 'video' && (
                  <video 
                    src={details.embedUrl}
                    controls 
                    autoPlay
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
                  />
                )}

                {details?.type === 'generic' && (
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#0A1628', color: '#fff', textAlign: 'center' }}>
                    <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔗</span>
                    <p style={{ fontSize: '1rem', color: '#F5F0E8', marginBottom: '1.5rem' }}>This link cannot be embedded directly.</p>
                    <a 
                      href={activeReel.videoUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="btn-gold"
                      style={{ padding: '0.6rem 1.5rem', textDecoration: 'none' }}
                      onClick={() => setActiveReel(null)}
                    >
                      Open Link in New Tab ↗
                    </a>
                  </div>
                )}
              </div>

              {/* Reel Info */}
              <div className="reel-lightbox-info">
                <h4 className="reel-lightbox-title">{activeReel.title || 'Chikoti Real Estate Tour'}</h4>
                {activeReel.description && (
                  <p className="reel-lightbox-desc">{activeReel.description}</p>
                )}
              </div>

            </div>

            {/* Right Nav Button */}
            {reels.length > 1 && (
              <button 
                className="reel-lightbox-nav reel-lightbox-nav-right"
                onClick={(e) => {
                  e.stopPropagation();
                  const nextIndex = (activeIndex + 1) % reels.length;
                  setActiveReel(reels[nextIndex]);
                }}
                title="Next Reel"
              >
                ›
              </button>
            )}
          </div>
        );
      })()}
    </>
  );
}
