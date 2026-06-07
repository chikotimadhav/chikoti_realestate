import React, { useState, useEffect, useCallback } from 'react';
import Header      from './components/Header.jsx';
import Footer      from './components/Footer.jsx';
import HomePage    from './pages/Home.jsx';
import PropertiesPage from './pages/Properties.jsx';
import PropertyDetailModal from './components/PropertyDetailModal.jsx';

export default function App() {
  const [page,     setPage]     = useState('home');
  const [detail,   setDetail]   = useState(null);   // property to show in modal
  const [showLogin, setShowLogin] = useState(false);
  const [user,     setUser]     = useState(() => {
    try { return JSON.parse(localStorage.getItem('ck_user')); } catch { return null; }
  });

  const navigate = useCallback((p) => { setPage(p); window.scrollTo(0, 0); }, []);

  const openDetail  = (property) => setDetail(property);
  const closeDetail = ()          => setDetail(null);

  const onLogin  = (userData, token) => {
    localStorage.setItem('ck_user',  JSON.stringify(userData));
    localStorage.setItem('ck_token', token);
    setUser(userData);
  };
  const onLogout = () => {
    localStorage.removeItem('ck_user');
    localStorage.removeItem('ck_token');
    setUser(null);
    navigate('home');
  };

  const pages = {
    home:       <HomePage    navigate={navigate} openDetail={openDetail} />,
    properties: <PropertiesPage navigate={navigate} openDetail={openDetail} user={user} />,
  };

  return (
    <>
      <Header
        page={page}
        navigate={navigate}
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
        showLogin={showLogin}
        setShowLogin={setShowLogin}
      />
      <main style={{ minHeight: '80vh' }}>
        {pages[page] || pages.home}
      </main>
      <Footer navigate={navigate} />
      {detail && (
        <PropertyDetailModal
          property={detail}
          onClose={closeDetail}
          user={user}
          onLoginRequired={() => setShowLogin(true)}
        />
      )}
    </>
  );
}
