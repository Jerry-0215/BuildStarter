import { Link } from 'react-router-dom';
import { useFollow } from '../context/FollowContext';
import { CATEGORIES } from '../data/mockRequests';

export default function Following() {
  const { followedDomains, followedRequests, toggleDomain, toggleRequest } = useFollow();
  const followedDomainList = Object.entries(followedDomains).filter(([, v]) => v).map(([k]) => k);
  const followedRequestList = Object.values(followedRequests);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 3rem', maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Following</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center' }}>
        Categories and requests you're following. Add or remove from here.
      </p>

      {/* Categories you follow */}
      <section className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.75rem', fontSize: '1.2rem' }}>Categories you follow</h2>
        {followedDomainList.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>No categories yet. Add one below.</p>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {followedDomainList.map((cat) => (
              <li
                key={cat}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0',
                  borderBottom: '1px solid var(--border-soft)',
                }}
              >
                <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{cat}</span>
                <button type="button" className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.85rem' }} onClick={() => toggleDomain(cat)}>
                  Unfollow
                </button>
              </li>
            ))}
          </ul>
        )}
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-soft)' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Follow a category</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {CATEGORIES.filter((c) => !followedDomains[c]).map((cat) => (
              <button key={cat} type="button" className="btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', textTransform: 'capitalize' }} onClick={() => toggleDomain(cat)}>
                + {cat}
              </button>
            ))}
            {CATEGORIES.every((c) => followedDomains[c]) && (
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>You're following all categories.</span>
            )}
          </div>
        </div>
      </section>

      {/* Requests you follow */}
      <section className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.75rem', fontSize: '1.2rem' }}>Requests you follow</h2>
        {followedRequestList.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>No requests yet. Follow requests from the Browse tab.</p>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {followedRequestList.map((req) => (
              <li
                key={req.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  padding: '0.6rem 0',
                  borderBottom: '1px solid var(--border-soft)',
                }}
              >
                <Link to={`/request/${req.id}`} style={{ flex: 1, minWidth: 0, fontWeight: 500, color: 'var(--accent)', textDecoration: 'none' }}>
                  {req.text}
                </Link>
                <button type="button" className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.85rem' }} onClick={() => toggleRequest(req.id, req.text)}>
                  Unfollow
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
