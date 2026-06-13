import React, { useState, useEffect } from 'react';
import './styles/seller.css';
import SellerHeader   from './components/SellerHeader.jsx';
import Footer         from './components/Footer.jsx';
import LoginPage      from './pages/Login.jsx';
import DashboardPage  from './pages/Dashboard.jsx';
import ListPage       from './pages/ListProperty.jsx';
import InquiriesPage  from './pages/Inquiries.jsx';
import AboutPage      from './pages/About.jsx';
import TermsPage      from './pages/Terms.jsx';
import PrivacyPage    from './pages/Privacy.jsx';
import DisclaimerPage from './pages/Disclaimer.jsx';
import ReelsPage      from './pages/Reels.jsx';
import ProfilePage    from './pages/Profile.jsx';

export default function App() {
  const [user,  setUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem('ck_seller_user')); } catch { return null; }
  });
  const [page, setPage] = useState('dashboard');
  const [editPropertyId, setEditPropertyId] = useState(null);

  const onLogin  = (userData, token) => {
    localStorage.setItem('ck_seller_user',  JSON.stringify(userData));
    localStorage.setItem('ck_seller_token', token);
    setUser(userData);
    setPage('dashboard');
  };
  const onLogout = () => {
    localStorage.removeItem('ck_seller_user');
    localStorage.removeItem('ck_seller_token');
    setUser(null);
  };

  const onUserUpdate = (updatedUser) => {
    localStorage.setItem('ck_seller_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const navigate = (p, propertyId = null) => {
    setEditPropertyId(propertyId);
    setPage(p);
  };

  if (!user || user.role === 'buyer') {
    return <LoginPage onLogin={onLogin} />;
  }

  const pages = {
    dashboard:  <DashboardPage user={user} navigate={navigate} />,
    list:       <ListPage      user={user} navigate={navigate} editPropertyId={editPropertyId} />,
    inquiries:  <InquiriesPage user={user} />,
    reels:      <ReelsPage     user={user} />,
    profile:    <ProfilePage   user={user} onUserUpdate={onUserUpdate} />,
    about:      <AboutPage      navigate={navigate} />,
    terms:      <TermsPage      navigate={navigate} />,
    privacy:    <PrivacyPage    navigate={navigate} />,
    disclaimer: <DisclaimerPage navigate={navigate} />,
  };

  return (
    <>
      <SellerHeader page={page} navigate={navigate} user={user} onLogout={onLogout} />
      <main style={{ minHeight:'90vh', background:'#F1F5F9', paddingTop:72 }}>
        {pages[page] || pages.dashboard}
      </main>
      <Footer navigate={navigate} />
    </>
  );
}
