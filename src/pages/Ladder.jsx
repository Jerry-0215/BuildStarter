import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getRankFromUpvotes } from '../utils/rank';
import RankBadge from '../components/RankBadge';

export default function Ladder() {
  const [topCreators, setTopCreators] = useState([]);
  const [topShippers, setTopShippers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboards() {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, upvotes_received, solutions_submitted')
        .order('upvotes_received', { ascending: false })
        .limit(20);

      if (!error && data) {
        // Top Creators: sort by composite score (same formula as getRankFromUpvotes)
        const byScore = [...data]
          .sort((a, b) => {
            const scoreA = (a.upvotes_received ?? 0) + (a.solutions_submitted ?? 0) * 5;
            const scoreB = (b.upvotes_received ?? 0) + (b.solutions_submitted ?? 0) * 5;
            return scoreB - scoreA;
          })
          .slice(0, 10);

        // Top Shippers: sort by solutions submitted
        const byShipped = [...data]
          .sort((a, b) => (b.solutions_submitted ?? 0) - (a.solutions_submitted ?? 0))
          .slice(0, 10);

        setTopCreators(byScore);
        setTopShippers(byShipped);
      }
      setLoading(false);
    }
    fetchLeaderboards();
  }, []);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 3rem', maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Developer Ladder</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center' }}>
        Rankings based on merit: solutions shipped and upvotes received.
      </p>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>

          {/* Top Creators */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Top Creators</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Ranked by upvotes received + solutions shipped.
            </p>
            {topCreators.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No creators yet — be the first to ship a solution!</p>
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {topCreators.map((row, i) => {
                  const rank = getRankFromUpvotes(row.upvotes_received ?? 0, row.solutions_submitted ?? 0);
                  const displayName = row.name || 'Anonymous';
                  return (
                    <li key={row.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border-soft)' }}>
                      <span style={{ fontWeight: 700, color: 'var(--accent)', width: 24 }}>#{i + 1}</span>
                      <span style={{ flex: 1, fontWeight: 500 }}>{displayName}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{row.upvotes_received ?? 0} ↑</span>
                      <RankBadge rank={rank} style={{ fontSize: '0.7rem', padding: '0.2em 0.5em' }} />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Top Shippers */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Most Solutions Shipped</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Creators ranked by total solutions submitted.
            </p>
            {topShippers.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No solutions yet — ship something!</p>
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {topShippers.map((row, i) => {
                  const rank = getRankFromUpvotes(row.upvotes_received ?? 0, row.solutions_submitted ?? 0);
                  const displayName = row.name || 'Anonymous';
                  return (
                    <li key={row.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border-soft)' }}>
                      <span style={{ fontWeight: 700, color: 'var(--accent)', width: 24 }}>#{i + 1}</span>
                      <span style={{ flex: 1, fontWeight: 500 }}>{displayName}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {row.solutions_submitted ?? 0} solution{(row.solutions_submitted ?? 0) !== 1 ? 's' : ''}
                      </span>
                      <RankBadge rank={rank} style={{ fontSize: '0.7rem', padding: '0.2em 0.5em' }} />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
