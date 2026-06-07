import React, { useState, useEffect } from 'react';

function token() { return localStorage.getItem('ck_admin_token'); }

export default function UsersPage() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  async function load(silent = false) {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      const data = await res.json();
      setUsers(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    load(false);
    const interval = setInterval(() => load(true), 5000);
    return () => clearInterval(interval);
  }, []);

  async function toggleUser(id, field, current) {
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users/${id}`, {
      method:'PATCH',
      headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token()}` },
      body: JSON.stringify({ [field]: !current }),
    });
    setUsers(prev => prev.map(u => u.id === id ? { ...u, [field]: !current } : u));
  }

  const filtered = users.filter(u =>
    (!roleFilter || u.role === roleFilter) &&
    (!search || u.name?.toLowerCase().includes(search.toLowerCase()) ||
                u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const counts = {
    all:    users.length,
    admin:  users.filter(u => u.role === 'admin').length,
    seller: users.filter(u => u.role === 'seller').length,
    buyer:  users.filter(u => u.role === 'buyer').length,
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Users</div>
          <div className="page-sub">{filtered.length} users shown</div>
        </div>
      </div>

      {/* Summary chips */}
      <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {[
          { label:'All',     key:'',       color:'#4F46E5', bg:'#EEF2FF' },
          { label:'Admins',  key:'admin',  color:'#7C3AED', bg:'#FDF4FF' },
          { label:'Sellers', key:'seller', color:'#059669', bg:'#F0FDF4' },
          { label:'Buyers',  key:'buyer',  color:'#D97706', bg:'#FFFBEB' },
        ].map(c => (
          <button key={c.key} onClick={() => setRoleFilter(c.key)} style={{
            padding:'0.4rem 1rem', borderRadius:999,
            background: roleFilter===c.key ? c.color : c.bg,
            color: roleFilter===c.key ? 'white' : c.color,
            fontWeight:700, fontSize:'0.82rem', transition:'all 0.2s',
            border:`1.5px solid ${c.color}`,
          }}>
            {c.label} ({counts[c.key||'all']})
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom:'1.25rem' }}>
        <input className="form-input" style={{ maxWidth:340 }}
          placeholder="🔍  Search by name or email…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th><th>Role</th><th>Phone</th>
                <th>Verified</th><th>Active</th><th>Joined</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign:'center', padding:'3rem', color:'#94A3B8' }}>Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign:'center', padding:'3rem', color:'#94A3B8' }}>No users found.</td></tr>
              ) : filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                      <div style={{
                        width:36, height:36, borderRadius:'50%',
                        background:`hsl(${u.name?.charCodeAt(0)*7 % 360}, 60%, 55%)`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        color:'white', fontWeight:800, fontSize:'0.9rem', flexShrink:0,
                      }}>{u.name?.[0]?.toUpperCase() || '?'}</div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:'0.875rem' }}>{u.name}</div>
                        <div style={{ color:'#94A3B8', fontSize:'0.72rem' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                  <td style={{ color:'#6B7280', fontSize:'0.82rem' }}>{u.phone || '—'}</td>
                  <td>
                    <button onClick={() => toggleUser(u.id,'is_verified',u.is_verified)} style={{
                      padding:'0.2rem 0.6rem', borderRadius:999, fontSize:'0.75rem', fontWeight:700,
                      background: u.is_verified ? '#D1FAE5' : '#F3F4F6',
                      color: u.is_verified ? '#065F46' : '#9CA3AF',
                      border:'none', cursor:'pointer',
                    }}>
                      {u.is_verified ? '✓ Verified' : 'Unverified'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => toggleUser(u.id,'is_active',u.is_active)} style={{
                      padding:'0.2rem 0.6rem', borderRadius:999, fontSize:'0.75rem', fontWeight:700,
                      background: u.is_active ? '#D1FAE5' : '#FEE2E2',
                      color: u.is_active ? '#065F46' : '#991B1B',
                      border:'none', cursor:'pointer',
                    }}>
                      {u.is_active ? 'Active' : 'Suspended'}
                    </button>
                  </td>
                  <td style={{ color:'#94A3B8', fontSize:'0.72rem', whiteSpace:'nowrap' }}>
                    {new Date(u.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'2-digit'})}
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:'0.35rem' }}>
                      <button className="btn btn-ghost btn-sm"
                        onClick={() => toggleUser(u.id,'is_verified',u.is_verified)}>
                        {u.is_verified ? 'Unverify' : 'Verify'}
                      </button>
                      <button className="btn btn-sm"
                        style={{ background: u.is_active ? '#FEE2E2' : '#D1FAE5', color: u.is_active ? '#991B1B' : '#065F46' }}
                        onClick={() => toggleUser(u.id,'is_active',u.is_active)}>
                        {u.is_active ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
