import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
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
          background: 'linear-gradient(90deg, var(--accent-soft) 0%, var(--surface) 50%, var(--accent-soft) 100%)',
          borderBottom: '2px solid var(--border-soft)',
          padding: '0.75rem 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 1px 3px rgba(37, 99, 235, 0.06)',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--blue-dark)', fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.02em' }}>
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
                      padding: '0.5rem 1rem',
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      borderRadius: 8,
                      background: isActive ? 'var(--accent)' : 'transparent',
                      color: isActive ? 'white' : 'var(--text-muted)',
                      fontWeight: isActive ? 600 : 500,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'var(--border-soft)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = '';
                    }}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
            <Link
              to="/account"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.6rem',
                borderRadius: 9999,
                background: 'var(--accent-muted)',
                border: '1px solid var(--border-soft)',
                transition: 'box-shadow 0.2s, background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent-soft)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent) 0%, var(--blue-dark) 100%)',
                  color: 'white',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                J
              </div>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>John</span>
            </Link>
          </div>
        </div>
      </header>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
