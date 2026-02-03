import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_REQUESTS } from '../data/mockRequests';
import { MOCK_CREATORS, FEEDBACK_DIMENSIONS } from '../data/mockDemo';
import RankBadge from '../components/RankBadge';
import Modal from '../components/Modal';
import FollowButton from '../components/FollowButton';

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

const COLLAB_MODAL_BODY = (
  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
    In the full product, this would start a collaboration or partnership—messaging, scope, and terms would happen here. This demo is UI-only; no transactions or contracts.
  </p>
);

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
  const [featureVotes, setFeatureVotes] = useState({});
  const [collaborationModal, setCollaborationModal] = useState(null);
  const [feedbackScores, setFeedbackScores] = useState({}); // { [solutionId]: { ux, featureCompleteness, scalability, overall } }
  const [showFeedbackFor, setShowFeedbackFor] = useState(null);

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

  // Mock aggregate feedback (base) + user's slider values
  const getAggregateFeedback = (solId) => {
    const base = { ux: 4.2, featureCompleteness: 3.8, scalability: 3.5, overall: 4.0 };
    const user = feedbackScores[solId];
    if (!user) return base;
    const n = 1 + (user.ux != null ? 1 : 0) + (user.featureCompleteness != null ? 1 : 0) + (user.scalability != null ? 1 : 0) + (user.overall != null ? 1 : 0);
    const count = [user.ux, user.featureCompleteness, user.scalability, user.overall].filter((v) => v != null).length;
    if (count === 0) return base;
    return {
      ux: user.ux != null ? (base.ux + user.ux) / 2 : base.ux,
      featureCompleteness: user.featureCompleteness != null ? (base.featureCompleteness + user.featureCompleteness) / 2 : base.featureCompleteness,
      scalability: user.scalability != null ? (base.scalability + user.scalability) / 2 : base.scalability,
      overall: user.overall != null ? (base.overall + user.overall) / 2 : base.overall,
    };
  };
  const setFeedback = (solId, key, value) => {
    setFeedbackScores((prev) => ({
      ...prev,
      [solId]: { ...(prev[solId] ?? {}), [key]: value },
    }));
  };

  const availabilityLabel = (av) => (av === 'solo' ? 'Solo' : av === 'team' ? 'Team' : av === 'open to cofounding' ? 'Open to cofounding' : av);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 3rem', maxWidth: 800 }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem', fontSize: '0.9rem' }}>← Back to browse</Link>
      <h1 style={{ marginBottom: '0.5rem' }}>{request.text}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        {request.upvotes} upvotes · {request.date}
      </p>

      {/* Existing features */}
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
                  <button type="button" className="btn-ghost" style={{ padding: '0.4rem 0.6rem', fontSize: '1rem', color: 'var(--vote-up)', fontWeight: 700 }} onClick={() => voteFeature(feat.id, 'up')} aria-label="Upvote">▲ {up}</button>
                  <button type="button" className="btn-ghost" style={{ padding: '0.4rem 0.6rem', fontSize: '1rem', color: 'var(--vote-down)', fontWeight: 700 }} onClick={() => voteFeature(feat.id, 'down')} aria-label="Downvote">▼ {down}</button>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Propose new feature */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.75rem', fontSize: '1.2rem' }}>Propose a new feature</h2>
        <button className="btn-secondary" onClick={() => setShowPropose(!showPropose)}>{showPropose ? 'Cancel' : '+ Propose feature'}</button>
        {showPropose && (
          <div className="card" style={{ marginTop: '1rem' }}>
            <input type="text" placeholder="Describe the feature..." value={proposeFeatureText} onChange={(e) => setProposeFeatureText(e.target.value)} style={{ width: '100%', marginBottom: '0.75rem' }} onKeyDown={(e) => e.key === 'Enter' && submitProposedFeature()} />
            <button className="btn-primary" onClick={submitProposedFeature}>Submit</button>
          </div>
        )}
      </section>

      {/* Solutions */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.75rem', fontSize: '1.2rem' }}>Solutions from creators</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1rem' }}>
          Rate solutions, give structured feedback, and use the CTAs to explore collaboration. (Demo: no real messaging or payments.)
        </p>

        {request.solutions.length === 0 ? (
          <div className="card" style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No solutions yet. Post an app or demo below.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {request.solutions.map((sol) => {
              const creator = MOCK_CREATORS[sol.author] || {};
              const agg = getAggregateFeedback(sol.id);
              const userScores = feedbackScores[sol.id] ?? {};
              const showFeedback = showFeedbackFor === sol.id;
              return (
                <div key={sol.id} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div>
                      <a href={sol.link} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, fontSize: '1.05rem' }}>{sol.title}</a>
                      <span className="badge" style={{ marginLeft: '0.5rem', background: 'var(--accent-muted)', color: 'var(--accent-hover)', fontSize: '0.75rem' }}>{sol.type === 'app' ? 'App' : 'Demo'}</span>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      by {sol.author}
                      <RankBadge rank={sol.authorRank} />
                    </span>
                  </div>

                  {/* Creator identity: tech stack, expertise, availability, badges */}
                  <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'var(--accent-soft)', borderRadius: 10, border: '1px solid var(--border-soft)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                      {(creator.badges || []).map((b) => (
                        <span key={b} className="badge badge-ai" style={{ fontSize: '0.7rem' }}>{b}</span>
                      ))}
                      {creator.availability && (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>· {availabilityLabel(creator.availability)}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.35rem' }}>
                      {(creator.techStack || []).map((t) => (
                        <span key={t} style={{ fontSize: '0.8rem', padding: '0.2em 0.5em', background: 'var(--surface)', borderRadius: 6, color: 'var(--blue-dark)' }}>{t}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {(creator.expertise || []).map((e) => (
                        <span key={e} style={{ fontSize: '0.8rem', padding: '0.2em 0.5em', background: 'var(--accent-muted)', borderRadius: 6, color: 'var(--text-primary)' }}>{e}</span>
                      ))}
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>
                      <FollowButton id={sol.author} label="Follow creator" followedLabel="Following" size="small" />
                    </div>
                  </div>

                  {/* Collaboration CTAs */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    <button type="button" className="btn-primary" style={{ fontSize: '0.9rem' }} onClick={() => setCollaborationModal('hire')}>Hire creator</button>
                    <button type="button" className="btn-secondary" style={{ fontSize: '0.9rem' }} onClick={() => setCollaborationModal('sponsor')}>Sponsor this build</button>
                    <button type="button" className="btn-secondary" style={{ fontSize: '0.9rem' }} onClick={() => setCollaborationModal('cobuild')}>Co-build this</button>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>Rate:</span>
                    <StarRating value={getRating(sol.id)} onChange={(stars) => setRating(sol.id, stars)} />
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>({sol.ratingCount} ratings)</span>
                  </div>

                  {/* Structured feedback: aggregated + sliders */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontWeight: 500, marginBottom: '0.5rem', fontSize: '0.95rem' }}>Structured feedback</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
                      {FEEDBACK_DIMENSIONS.map((d) => (
                        <div key={d.key} style={{ minWidth: 120 }}>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{d.label}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ flex: 1, height: 8, background: 'var(--border-soft)', borderRadius: 4, overflow: 'hidden' }}>
                              <div style={{ width: `${(agg[d.key] / 5) * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: 4 }} />
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{agg[d.key].toFixed(1)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn-ghost" style={{ fontSize: '0.85rem' }} onClick={() => setShowFeedbackFor(showFeedback ? null : sol.id)}>
                      {showFeedback ? 'Hide your ratings' : 'Rate this solution (UX, completeness, scalability, overall)'}
                    </button>
                    {showFeedback && (
                      <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border-soft)' }}>
                        {FEEDBACK_DIMENSIONS.map((d) => (
                          <div key={d.key} style={{ marginBottom: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>{d.label}</label>
                            <input
                              type="range"
                              min={1}
                              max={5}
                              step={0.5}
                              value={userScores[d.key] ?? 3}
                              onChange={(e) => setFeedback(sol.id, d.key, parseFloat(e.target.value))}
                              style={{ width: '100%', maxWidth: 200 }}
                            />
                            <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>{userScores[d.key] ?? 3}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ fontWeight: 500, marginBottom: '0.5rem', fontSize: '0.95rem' }}>Comments</div>
                    <ul style={{ margin: '0 0 1rem', paddingLeft: 0, listStyle: 'none' }}>
                      {solutionComments(sol.id).map((c) => (
                        <li key={c.id} style={{ marginBottom: '0.5rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.95rem' }}>
                          <strong>{c.author}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{c.date}</span>
                          <div style={{ marginTop: '0.25rem' }}>{c.text}</div>
                        </li>
                      ))}
                    </ul>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="text" placeholder="Add a comment..." value={newComment[sol.id] ?? ''} onChange={(e) => setNewComment((prev) => ({ ...prev, [sol.id]: e.target.value }))} style={{ flex: 1 }} onKeyDown={(e) => e.key === 'Enter' && addComment(sol.id, newComment[sol.id] ?? '')} />
                      <button className="btn-primary" onClick={() => addComment(sol.id, newComment[sol.id] ?? '')}>Post</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: '1.25rem' }}>
          <button className="btn-secondary" onClick={() => setShowPostSolution(!showPostSolution)}>{showPostSolution ? 'Cancel' : '+ Post a solution'}</button>
          {showPostSolution && (
            <div className="card" style={{ marginTop: '1rem', maxWidth: 520 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Type</label>
              <select value={solutionType} onChange={(e) => setSolutionType(e.target.value)} style={{ marginBottom: '1rem', padding: '0.6em 0.9em', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'inherit' }}>
                <option value="app">App</option>
                <option value="demo">Demo</option>
              </select>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{solutionType === 'app' ? 'App URL' : 'Demo URL'}</label>
              <input type="url" placeholder={solutionType === 'app' ? 'https://my-app.example.com' : 'https://my-demo.vercel.app'} value={solutionUrl} onChange={(e) => setSolutionUrl(e.target.value)} style={{ width: '100%', marginBottom: '1rem' }} />
              <button className="btn-primary" onClick={() => { setSolutionUrl(''); setShowPostSolution(false); }}>Submit</button>
            </div>
          )}
        </div>
      </section>

      <Modal open={!!collaborationModal} onClose={() => setCollaborationModal(null)} title={collaborationModal === 'hire' ? 'Hire creator' : collaborationModal === 'sponsor' ? 'Sponsor this build' : 'Co-build this'}>
        {COLLAB_MODAL_BODY}
      </Modal>
    </div>
  );
}
