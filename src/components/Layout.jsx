import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const location = useLocation();
  const { user, profile } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  // Reset scrolled when route changes so transparent state is fresh
  useEffect(() => { setScrolled(window.scrollY > 8); }, [location.pathname]);
  const isHomePage = location.pathname === '/';
  const transparent = isHomePage && !scrolled;
  const displayName = profile?.name || user?.email?.split('@')[0] || null;
  const initial = displayName?.[0]?.toUpperCase() ?? '?';
  const navTabs = [
    { path: '/', label: 'Browse' },
    { path: '/following', label: 'Following' },
    { path: '/ladder', label: 'Ladder' },
    { path: '/friends', label: 'Friends' },
  ];
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          background: transparent ? 'transparent' : 'white',
          borderBottom: transparent ? 'none' : '1px solid var(--border-soft)',
          padding: '0 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          transition: 'background 0.3s, border-color 0.3s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <Link to="/" style={{ textDecoration: 'none', color: transparent ? 'white' : 'var(--text-primary)', fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.02em', transition: 'color 0.3s' }}>
            BuildStarter
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <nav style={{ display: 'flex', gap: '0.5rem' }}>
              {navTabs.map((tab) => {
                const isActive = location.pathname === tab.path || (tab.path === '/' && location.pathname === '/') || (tab.path === '/following' && location.pathname === '/following') || (tab.path === '/friends' && location.pathname.startsWith('/friend'));
                return (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    style={{
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      borderRadius: 6,
                      background: transparent
                        ? (isActive ? 'rgba(255,255,255,0.18)' : 'transparent')
                        : (isActive ? 'var(--accent-soft)' : 'transparent'),
                      color: transparent
                        ? (isActive ? 'white' : 'rgba(255,255,255,0.72)')
                        : (isActive ? 'var(--accent)' : 'var(--text-muted)'),
                      fontWeight: isActive ? 600 : 400,
                      transition: 'background 0.3s, color 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = transparent ? 'white' : 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = transparent ? 'rgba(255,255,255,0.72)' : '';
                    }}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
            {user ? (
              <Link
                to="/account"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.3rem 0.5rem',
                  borderRadius: 8,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = transparent ? 'rgba(255,255,255,0.12)' : 'var(--border-soft)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
              >
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', color: 'white', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {initial}
                </div>
                <span style={{ fontWeight: 500, color: transparent ? 'white' : 'var(--text-primary)', fontSize: '0.875rem', transition: 'color 0.3s' }}>{displayName}</span>
              </Link>
            ) : (
              <Link to="/login" className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.9rem', textDecoration: 'none' }}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
