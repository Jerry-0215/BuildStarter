import { LEADERBOARD_TOP_FRC, LEADERBOARD_FASTEST_SHIPPERS } from '../data/mockDemo';

export default function Ladder() {
  return (
    <div className="container" style={{ padding: '2rem 1.5rem 3rem', maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Developer Ladder</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center' }}>
        Rankings based on merit: solutions shipped, upvotes received, and shipping speed.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Top FRC Creators (Last 30 Days)</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Merit-based: solutions shipped and upvotes received.</p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {LEADERBOARD_TOP_FRC.map((row) => (
              <li key={row.rank} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border-soft)' }}>
                <span style={{ fontWeight: 700, color: 'var(--accent)', width: 24 }}>#{row.rank}</span>
                <span style={{ flex: 1, fontWeight: 500 }}>{row.name}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{row.upvotes} ↑</span>
                <span className="badge badge-count" style={{ fontSize: '0.7rem' }}>{row.badge}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Fastest Shippers This Week</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Creators who shipped solutions quickly.</p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {LEADERBOARD_FASTEST_SHIPPERS.map((row) => (
              <li key={row.rank} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border-soft)' }}>
                <span style={{ fontWeight: 700, color: 'var(--accent)', width: 24 }}>#{row.rank}</span>
                <span style={{ flex: 1, fontWeight: 500 }}>{row.name}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{row.shippedIn}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {LEADERBOARD_FASTEST_SHIPPERS.map((row) => (
              <div key={row.rank} style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>→ {row.request}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
