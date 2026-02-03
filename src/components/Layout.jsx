import { Link } from 'react-router-dom';

export default function Layout({ children }) {
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
      </header>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
