import React, { useState } from 'react';
import AdminLogin      from './pages/AdminLogin.jsx';
import AdminSidebar    from './components/AdminSidebar.jsx';
import AdminHeader     from './components/AdminHeader.jsx';
import Footer          from './components/Footer.jsx';
import OverviewPage    from './pages/Overview.jsx';
import PropertiesPage  from './pages/Properties.jsx';
import UsersPage       from './pages/Users.jsx';
import InquiriesPage   from './pages/Inquiries.jsx';

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ck_admin_user')); } catch { return null; }
  });
  const [page, setPage] = useState('overview');

  const onLogin  = (u, token) => {
    localStorage.setItem('ck_admin_user',  JSON.stringify(u));
    localStorage.setItem('ck_admin_token', token);
    setUser(u);
  };
  const onLogout = () => {
    localStorage.removeItem('ck_admin_user');
    localStorage.removeItem('ck_admin_token');
    setUser(null);
  };

  if (!user || user.role !== 'admin') return <AdminLogin onLogin={onLogin} />;

  const pages = {
    overview:   <OverviewPage   />,
    properties: <PropertiesPage />,
    users:      <UsersPage      />,
    inquiries:  <InquiriesPage  />,
  };

  return (
    <div className="admin-layout">
      <AdminSidebar page={page} navigate={setPage} />
      <div className="admin-main">
        <AdminHeader user={user} onLogout={onLogout} page={page} />
        <div className="admin-content">
          {pages[page] || pages.overview}
        </div>
        <Footer />
      </div>
    </div>
  );
}
