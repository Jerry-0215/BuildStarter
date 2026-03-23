import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/mockRequests';
import { useFollow } from '../context/FollowContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return `${Math.floor(diff / 604800)} weeks ago`;
}

export default function Browse() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(null);
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [newRequestText, setNewRequestText] = useState('');
  const [newRequestCategory, setNewRequestCategory] = useState('');
  const [keyFeaturesExpanded, setKeyFeaturesExpanded] = useState(false);
  const [keyFeatures, setKeyFeatures] = useState(['']);
  const [submitting, setSubmitting] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(
    () => sessionStorage.getItem('heroRevealed') === '1'
  );
  const { followedRequests, toggleRequest } = useFollow();

  // Fetch requests once on mount — never re-fetches just because auth state changed
  useEffect(() => {
    async function fetchRequests() {
      const { data, error } = await supabase
        .from('requests')
        .select('*, solutions(count)')
        .order('upvotes', { ascending: false });
      if (!error) setRequests(data);
      setLoading(false);
    }
    fetchRequests();
  }, []);

  // Separately load which requests this user has already voted on
  useEffect(() => {
    if (!user) return;
    supabase
      .from('request_votes')
      .select('request_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (!data) return;
        const voted = {};
        data.forEach((v) => { voted[v.request_id] = true; });
        setVotedRequests(voted);
      });
  }, [user]);

  const revealHero = () => {
    sessionStorage.setItem('heroRevealed', '1');
    setHeroRevealed(true);
  };

  // Scroll also triggers the transition
  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 4) revealHero(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const addFeature = () => setKeyFeatures((prev) => [...prev, '']);
  const removeFeature = (i) => setKeyFeatures((prev) => prev.filter((_, idx) => idx !== i));
  const updateFeature = (i, value) => setKeyFeatures((prev) => prev.map((v, idx) => (idx === i ? value : v)));

  const [votedRequests, setVotedRequests] = useState({});
  const upvoteRequest = async (e, reqId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    if (votedRequests[reqId]) return; // already voted
    // Optimistic update
    setVotedRequests((prev) => ({ ...prev, [reqId]: true }));
    setRequests((prev) => prev.map((r) => r.id === reqId ? { ...r, upvotes: r.upvotes + 1 } : r));
    const { data: success } = await supabase.rpc('upvote_request', { req_id: reqId });
    if (!success) {
      // Server rejected — roll back
      setVotedRequests((prev) => ({ ...prev, [reqId]: false }));
      setRequests((prev) => prev.map((r) => r.id === reqId ? { ...r, upvotes: r.upvotes - 1 } : r));
    }
  };

  const handleSubmitRequest = async () => {
    if (!user) { navigate('/login'); return; }
    if (!newRequestText.trim()) return;
    setSubmitting(true);
    const newId = crypto.randomUUID();
    const { data: inserted, error } = await supabase
      .from('requests')
      .insert({ id: newId, text: newRequestText.trim(), category: newRequestCategory || 'general', upvotes: 0, user_id: user.id })
      .select()
      .single();
    if (!error && inserted) {
      const validFeatures = keyFeatures.filter((f) => f.trim());
      if (validFeatures.length > 0) {
        await supabase.from('features').insert(
          validFeatures.map((f) => ({ request_id: newId, text: f.trim(), upvotes: 0, downvotes: 0 }))
        );
      }
      setRequests((prev) => [{ ...inserted, solutions: [] }, ...prev]);
    }
    setNewRequestText('');
    setNewRequestCategory('');
    setKeyFeatures(['']);
    setKeyFeaturesExpanded(false);
    setShowCreateRequest(false);
    setSubmitting(false);
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch = !search.trim() || r.text.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || r.category === category;
    return matchesSearch && matchesCategory;
  });

  // Bump this key whenever the list meaningfully changes, so rows re-animate
  const listKeyRef = useRef(0);
  const prevFilterRef = useRef('');
  const filterSig = search + '|' + (category ?? '');
  if (filterSig !== prevFilterRef.current) {
    prevFilterRef.current = filterSig;
    listKeyRef.current += 1;
  }
  const listKey = listKeyRef.current;

  return (
    <>
      {/* Hero — negative margin pulls it behind the sticky nav so photo fills full viewport top */}
      <div style={{ backgroundImage: 'linear-gradient(to right, rgba(10,15,30,0.92) 0%, rgba(10,15,30,0.75) 55%, rgba(10,15,30,0.42) 100%), url(https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', marginTop: '-56px', paddingTop: heroRevealed ? 'calc(4.5rem + 56px)' : 'calc(50vh - 56px)', paddingBottom: heroRevealed ? '4rem' : 'calc(50vh - 56px)', paddingLeft: '2rem', paddingRight: '2rem', overflow: 'hidden', position: 'relative', transition: 'padding-top 0.9s cubic-bezier(0.4,0,0.2,1), padding-bottom 0.9s cubic-bezier(0.4,0,0.2,1)' }}>
        <div style={{ maxWidth: 560, position: 'relative', zIndex: 1 }}>
          {/* <div style={{ display: 'inline-block', background: 'rgba(59,130,246,0.18)', color: '#93c5fd', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.3rem 0.75rem', borderRadius: 999, marginBottom: '1.25rem', border: '1px solid rgba(59,130,246,0.3)' }}>
            Open platform &bull; Free to post
          </div> */}
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.15, color: 'white', margin: '0 0 1rem' }}>
            What app do you<br />wish existed?
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.65, margin: '0 0 2.25rem', maxWidth: 440 }}>
            Post a request. Developers build it.<br />The best ideas rise to the top.
          </p>
          <div style={{ display: 'flex', gap: '0.625rem', maxWidth: 500 }}>
            <input
              type="search"
              placeholder="Search requests..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); revealHero(); }}
              style={{ flex: 1, padding: '0.75rem 1rem', fontSize: '0.975rem', borderRadius: 8, border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: 'white', outline: 'none' }}
            />
            <button
              className="btn-primary"
              onClick={() => setShowCreateRequest(true)}
              style={{ padding: '0.75rem 1.25rem', fontSize: '0.975rem', whiteSpace: 'nowrap', borderRadius: 8, flexShrink: 0 }}
            >
              Post a request
            </button>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border-soft)', padding: '0.625rem 1.5rem', display: 'flex', gap: '0.375rem', flexWrap: 'wrap', justifyContent: 'center', opacity: heroRevealed ? 1 : 0, transform: heroRevealed ? 'none' : 'translateY(20px)', transition: 'opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s', pointerEvents: heroRevealed ? 'auto' : 'none' }}>
        <button
          type="button"
          onClick={() => setCategory(null)}
          style={{ padding: '0.35rem 0.85rem', fontSize: '0.825rem', borderRadius: 999, border: '1px solid', borderColor: category === null ? 'var(--accent)' : 'var(--border)', background: category === null ? 'var(--accent-soft)' : 'white', color: category === null ? 'var(--accent)' : 'var(--text-muted)', fontWeight: category === null ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.825rem', borderRadius: 999, border: '1px solid', borderColor: category === cat ? 'var(--accent)' : 'var(--border)', background: category === cat ? 'var(--accent-soft)' : 'white', color: category === cat ? 'var(--accent)' : 'var(--text-muted)', fontWeight: category === cat ? 600 : 400, cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'inherit' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Request list */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '1.5rem 1.5rem 4rem', opacity: heroRevealed ? 1 : 0, transform: heroRevealed ? 'none' : 'translateY(20px)', transition: 'opacity 0.55s ease 0.45s, transform 0.55s ease 0.45s', pointerEvents: heroRevealed ? 'auto' : 'none' }}>
        {loading && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>Loading...</p>}
        {!loading && filteredRequests.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>No requests found.</p>
        )}
        {!loading && filteredRequests.length > 0 && (
          <div key={listKey} style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-soft)' }}>
            {filteredRequests.map((req, i) => {
              const isFollowed = !!followedRequests[req.id];
              const sCount = req.solutions?.[0]?.count ?? 0;
              return (
                <div key={req.id} style={{ animation: 'fadeInUp 0.32s ease both', animationDelay: `${Math.min(i, 14) * 0.045}s` }}>
                  <Link to={`/request/${req.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', background: 'white', transition: 'background 0.12s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; }}
                    >
                      {/* Upvote block */}
                      <button
                        type="button"
                        onClick={(e) => upvoteRequest(e, req.id)}
                        disabled={!!votedRequests[req.id]}
                        aria-label="Upvote"
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', minWidth: 40, padding: '0.4rem 0.5rem', borderRadius: 6, border: '1px solid', borderColor: votedRequests[req.id] ? 'var(--accent)' : 'var(--border-soft)', background: votedRequests[req.id] ? 'var(--accent-soft)' : 'transparent', color: votedRequests[req.id] ? 'var(--accent)' : 'var(--text-muted)', cursor: votedRequests[req.id] ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'all 0.12s', flexShrink: 0 }}
                      >
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="currentColor"><path d="M5 0L10 8H0L5 0Z" /></svg>
                        <span style={{ fontSize: '0.775rem', fontWeight: 600, lineHeight: 1 }}>{req.upvotes ?? 0}</span>
                      </button>

                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.45, marginBottom: '0.3rem' }}>{req.text}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                          {req.category && (
                            <span style={{ background: 'var(--border-soft)', padding: '0.1em 0.5em', borderRadius: 4, textTransform: 'capitalize', fontWeight: 500 }}>{req.category}</span>
                          )}
                          <span>{timeAgo(req.created_at)}</span>
                          {sCount > 0 && <span>{sCount} solution{sCount !== 1 ? 's' : ''}</span>}
                          {isFollowed && <span style={{ color: 'var(--accent)', fontWeight: 500 }}>Following</span>}
                        </div>
                      </div>

                      {/* Follow button */}
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleRequest(req.id, req.text); }}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: 6, border: '1px solid', borderColor: isFollowed ? 'var(--accent)' : 'var(--border)', background: isFollowed ? 'var(--accent-soft)' : 'white', color: isFollowed ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, flexShrink: 0, whiteSpace: 'nowrap' }}
                      >
                        {isFollowed ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  </Link>
                  {i < filteredRequests.length - 1 && (
                    <div style={{ height: 1, background: 'var(--border-soft)' }} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create request modal */}
      {showCreateRequest && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: 520, padding: '2rem', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>Post a request</h2>
              <button
                type="button"
                onClick={() => setShowCreateRequest(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--text-muted)', padding: '0.2rem 0.4rem', borderRadius: 4, fontFamily: 'inherit', lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            {!user && (
              <p style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', background: 'var(--border-soft)', padding: '0.75rem 1rem', borderRadius: 8 }}>
                <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link> to submit a request.
              </p>
            )}
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.875rem' }}>What would you want built?</label>
            <textarea
              placeholder="e.g. An FRC fantasy website with live scoring and draft picks"
              value={newRequestText}
              onChange={(e) => setNewRequestText(e.target.value)}
              rows={3}
              style={{ width: '100%', marginBottom: '1.25rem', resize: 'vertical' }}
            />
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.875rem' }}>Category</label>
            <select
              value={newRequestCategory}
              onChange={(e) => setNewRequestCategory(e.target.value)}
              style={{ width: '100%', marginBottom: '1.25rem', padding: '0.6em 0.9em', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'inherit', fontSize: '0.925rem' }}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div style={{ marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setKeyFeaturesExpanded(!keyFeaturesExpanded)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-muted)', padding: 0, fontFamily: 'inherit', textDecoration: 'underline' }}
              >
                {keyFeaturesExpanded ? 'Hide' : 'Add'} key features (optional)
              </button>
              {keyFeaturesExpanded && (
                <div style={{ marginTop: '0.75rem' }}>
                  {keyFeatures.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder={`Feature ${i + 1}`}
                        value={f}
                        onChange={(e) => updateFeature(i, e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <button type="button" className="btn-ghost" style={{ padding: '0.4rem 0.6rem', fontSize: '0.825rem' }} onClick={() => removeFeature(i)}>Remove</button>
                    </div>
                  ))}
                  <button type="button" className="btn-secondary" style={{ marginTop: '0.25rem', fontSize: '0.825rem' }} onClick={addFeature}>+ Add feature</button>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-ghost" onClick={() => setShowCreateRequest(false)}>Cancel</button>
              <button
                className="btn-primary"
                disabled={submitting || !newRequestText.trim()}
                onClick={handleSubmitRequest}
                style={{ borderRadius: 8 }}
              >
                {submitting ? 'Submitting...' : 'Submit request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

