import { Link } from 'react-router-dom';
import { MOCK_FRIENDS } from '../data/mockFriends';

export default function Friends() {
  return (
    <div className="container" style={{ padding: '2rem 1.5rem 3rem', maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Friends</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center' }}>
        Creators you're connected with and their recent work.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {Object.entries(MOCK_FRIENDS).map(([key, friend]) => (
          <Link key={key} to={`/friend/${key}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'box-shadow 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(37, 99, 235, 0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ''; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent) 0%, var(--blue-dark) 100%)',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {friend.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{friend.name}</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{friend.email}</p>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.5 }}>{friend.bio}</p>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Recent apps</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {friend.recentApps.map((app, i) => (
                    <div key={i} style={{ padding: '0.5rem 0.75rem', background: 'var(--accent-soft)', borderRadius: 8, fontSize: '0.9rem' }}>
                      <div style={{ fontWeight: 500 }}>{app.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {app.requestTitle} · {app.upvotes} upvotes · {app.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {(friend.badges || []).map((b) => (
                  <span key={b} className="badge badge-ai" style={{ fontSize: '0.7rem' }}>{b}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
