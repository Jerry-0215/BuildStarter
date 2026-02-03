import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_REQUESTS } from '../data/mockRequests';
import RankBadge from '../components/RankBadge';

function StarRating({ value, onChange, readonly = false }) {
  const [hover, setHover] = useState(null);
  const v = readonly ? value : (hover ?? value);
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(null)}
          onClick={() => !readonly && onChange(star)}
          style={{
            background: 'none',
            border: 'none',
            padding: 2,
            cursor: readonly ? 'default' : 'pointer',
            fontSize: '1.25rem',
            lineHeight: 1,
            color: star <= v ? 'var(--amber)' : 'var(--border)',
          }}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </span>
  );
}

export default function RequestDetail() {
  const { id } = useParams();
  const request = MOCK_REQUESTS.find((r) => r.id === id);
  const [proposeFeatureText, setProposeFeatureText] = useState('');
  const [showPropose, setShowPropose] = useState(false);
  const [showPostSolution, setShowPostSolution] = useState(false);
  const [solutionUrl, setSolutionUrl] = useState('');
  const [solutionType, setSolutionType] = useState('app');
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [proposedFeatures, setProposedFeatures] = useState([]);
  const [featureVotes, setFeatureVotes] = useState({}); // { featureKey: { up, down } } — user-added only

  const voteFeature = (featureKey, direction) => {
    setFeatureVotes((prev) => {
      const cur = prev[featureKey] ?? { up: 0, down: 0 };
      if (direction === 'up') return { ...prev, [featureKey]: { ...cur, up: cur.up + 1 } };
      return { ...prev, [featureKey]: { ...cur, down: cur.down + 1 } };
    });
  };

  const allFeatures = useMemo(() => {
    const base = (request?.features ?? []).map((f, i) => ({ ...f, id: `base-${i}` }));
    const proposed = proposedFeatures.map((f, i) => ({ ...f, id: `proposed-${i}` }));
    const combined = [...base, ...proposed];
    return combined.sort((a, b) => {
      const upA = (a.upvotes ?? 0) + (featureVotes[a.id]?.up ?? 0);
      const downA = (a.downvotes ?? 0) + (featureVotes[a.id]?.down ?? 0);
      const upB = (b.upvotes ?? 0) + (featureVotes[b.id]?.up ?? 0);
      const downB = (b.downvotes ?? 0) + (featureVotes[b.id]?.down ?? 0);
      return (upB - downB) - (upA - downA);
    });
  }, [request?.features, proposedFeatures, featureVotes]);

  const getFeatureUp = (feat) => (feat.upvotes ?? 0) + (featureVotes[feat.id]?.up ?? 0);
  const getFeatureDown = (feat) => (feat.downvotes ?? 0) + (featureVotes[feat.id]?.down ?? 0);

  if (!request) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <p>Request not found.</p>
        <Link to="/">Back to browse</Link>
      </div>
    );
  }

  const setRating = (solutionId, stars) => setRatings((prev) => ({ ...prev, [solutionId]: stars }));
  const getRating = (solutionId) => ratings[solutionId] ?? request.solutions.find((s) => s.id === solutionId)?.rating ?? 0;
  const addComment = (solutionId, text) => {
    if (!text.trim()) return;
    setComments((prev) => ({
      ...prev,
      [solutionId]: [...(prev[solutionId] ?? []), { id: `new-${Date.now()}`, author: 'You', text: text.trim(), date: 'Just now' }],
    }));
    setNewComment((prev) => ({ ...prev, [solutionId]: '' }));
  };
  const solutionComments = (solutionId) => {
    const sol = request.solutions.find((s) => s.id === solutionId);
    const existing = sol?.comments ?? [];
    const added = comments[solutionId] ?? [];
    return [...existing, ...added];
  };

  const submitProposedFeature = () => {
    if (!proposeFeatureText.trim()) return;
    setProposedFeatures((prev) => [...prev, { text: proposeFeatureText.trim(), upvotes: 0, downvotes: 0 }]);
    setProposeFeatureText('');
    setShowPropose(false);
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 3rem', maxWidth: 800 }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem', fontSize: '0.9rem' }}>← Back to browse</Link>
      <h1 style={{ marginBottom: '0.5rem' }}>{request.text}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        {request.upvotes} upvotes · {request.date}
      </p>

      {/* Existing features — up/down votes, sorted by difference, green up / red down */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.75rem', fontSize: '1.2rem' }}>Existing features</h2>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', lineHeight: 1.7 }}>
          {allFeatures.map((feat) => {
            const up = getFeatureUp(feat);
            const down = getFeatureDown(feat);
            return (
              <li
                key={feat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '0.5rem',
                  padding: '0.6rem 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <span style={{ flex: 1, color: 'var(--text-primary)', fontWeight: 500 }}>{feat.text}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', minWidth: 100, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn-ghost"
                    style={{
                      padding: '0.4rem 0.6rem',
                      fontSize: '1rem',
                      color: 'var(--vote-up)',
                      fontWeight: 700,
                    }}
                    onClick={() => voteFeature(feat.id, 'up')}
                    aria-label="Upvote"
                  >
                    ▲ {up}
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    style={{
                      padding: '0.4rem 0.6rem',
                      fontSize: '1rem',
                      color: 'var(--vote-down)',
                      fontWeight: 700,
                    }}
                    onClick={() => voteFeature(feat.id, 'down')}
                    aria-label="Downvote"
                  >
                    ▼ {down}
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Propose new feature — adds to list with 0 votes */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.75rem', fontSize: '1.2rem' }}>Propose a new feature</h2>
        <button className="btn-secondary" onClick={() => setShowPropose(!showPropose)}>
          {showPropose ? 'Cancel' : '+ Propose feature'}
        </button>
        {showPropose && (
          <div className="card" style={{ marginTop: '1rem' }}>
            <input
              type="text"
              placeholder="Describe the feature..."
              value={proposeFeatureText}
              onChange={(e) => setProposeFeatureText(e.target.value)}
              style={{ width: '100%', marginBottom: '0.75rem' }}
              onKeyDown={(e) => e.key === 'Enter' && submitProposedFeature()}
            />
            <button className="btn-primary" onClick={submitProposedFeature}>
              Submit
            </button>
          </div>
        )}
      </section>

      {/* Solutions */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.75rem', fontSize: '1.2rem' }}>Solutions from creators</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1rem' }}>
          Rate solutions out of 5 stars and leave feedback in the comments.
        </p>

        {request.solutions.length === 0 ? (
          <div className="card" style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
            No solutions yet. Post an app or demo below.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {request.solutions.map((sol) => (
              <div key={sol.id} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div>
                    <a href={sol.link} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, fontSize: '1.05rem' }}>
                      {sol.title}
                    </a>
                    <span className="badge" style={{ marginLeft: '0.5rem', background: 'var(--accent-muted)', color: 'var(--accent-hover)', fontSize: '0.75rem' }}>
                      {sol.type === 'app' ? 'App' : 'Demo'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    by {sol.author}
                    <RankBadge rank={sol.authorRank} />
                  </span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>Rate:</span>
                  <StarRating value={getRating(sol.id)} onChange={(stars) => setRating(sol.id, stars)} />
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    ({sol.ratingCount} ratings)
                  </span>
                </div>
                <div>
                  <div style={{ fontWeight: 500, marginBottom: '0.5rem', fontSize: '0.95rem' }}>Comments</div>
                  <ul style={{ margin: '0 0 1rem', paddingLeft: '1.25rem', listStyle: 'none', paddingLeft: 0 }}>
                    {solutionComments(sol.id).map((c) => (
                      <li key={c.id} style={{ marginBottom: '0.5rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.95rem' }}>
                        <strong>{c.author}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{c.date}</span>
                        <div style={{ marginTop: '0.25rem' }}>{c.text}</div>
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment[sol.id] ?? ''}
                      onChange={(e) => setNewComment((prev) => ({ ...prev, [sol.id]: e.target.value }))}
                      style={{ flex: 1 }}
                      onKeyDown={(e) => e.key === 'Enter' && addComment(sol.id, newComment[sol.id] ?? '')}
                    />
                    <button className="btn-primary" onClick={() => addComment(sol.id, newComment[sol.id] ?? '')}>
                      Post
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '1.25rem' }}>
          <button className="btn-secondary" onClick={() => setShowPostSolution(!showPostSolution)}>
            {showPostSolution ? 'Cancel' : '+ Post a solution'}
          </button>
          {showPostSolution && (
            <div className="card" style={{ marginTop: '1rem', maxWidth: 520 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Type</label>
              <select
                value={solutionType}
                onChange={(e) => setSolutionType(e.target.value)}
                style={{ marginBottom: '1rem', padding: '0.6em 0.9em', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'inherit' }}
              >
                <option value="app">App</option>
                <option value="demo">Demo</option>
              </select>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                {solutionType === 'app' ? 'App URL' : 'Demo URL'}
              </label>
              <input
                type="url"
                placeholder={solutionType === 'app' ? 'https://my-app.example.com' : 'https://my-demo.vercel.app'}
                value={solutionUrl}
                onChange={(e) => setSolutionUrl(e.target.value)}
                style={{ width: '100%', marginBottom: '1rem' }}
              />
              <button
                className="btn-primary"
                onClick={() => {
                  setSolutionUrl('');
                  setShowPostSolution(false);
                }}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
