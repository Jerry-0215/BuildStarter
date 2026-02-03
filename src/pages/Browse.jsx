import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_REQUESTS, CATEGORIES } from '../data/mockRequests';

export default function Browse() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(null);
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [newRequestText, setNewRequestText] = useState('');
  const [keyFeaturesExpanded, setKeyFeaturesExpanded] = useState(false);
  const [keyFeatures, setKeyFeatures] = useState(['']);

  const addFeature = () => setKeyFeatures((prev) => [...prev, '']);
  const removeFeature = (i) => setKeyFeatures((prev) => prev.filter((_, idx) => idx !== i));
  const updateFeature = (i, value) => setKeyFeatures((prev) => prev.map((v, idx) => (idx === i ? value : v)));

  const [requestUpvotes, setRequestUpvotes] = useState({});
  const upvoteRequest = (e, reqId) => {
    e.preventDefault();
    e.stopPropagation();
    setRequestUpvotes((prev) => ({ ...prev, [reqId]: (prev[reqId] ?? 0) + 1 }));
  };

  const filteredRequests = MOCK_REQUESTS.filter((r) => {
    const matchesSearch = !search.trim() || r.text.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || r.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 3rem', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Browse requests</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Search, create a request, or open one to see details and solutions.
      </p>

      {/* Search — large and prominent */}
      <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="search"
          placeholder="e.g. FRC fantasy, dashboard, mobile app..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: 640,
            padding: '1rem 1.25rem',
            fontSize: '1.15rem',
            borderRadius: 12,
            border: '2px solid var(--border)',
          }}
        />
        {/* Category tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
          <button
            type="button"
            className={category === null ? 'btn-primary' : 'btn-ghost'}
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.9rem', textTransform: 'capitalize' }}
            onClick={() => setCategory(null)}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={category === cat ? 'btn-primary' : 'btn-ghost'}
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.9rem', textTransform: 'capitalize' }}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Create request */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button className="btn-primary" onClick={() => setShowCreateRequest(!showCreateRequest)}>
          {showCreateRequest ? 'Cancel' : '+ Create a request'}
        </button>
        {showCreateRequest && (
          <div className="card" style={{ marginTop: '1rem', width: '100%', maxWidth: '560px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>What would you want to build?</label>
            <textarea
              placeholder="e.g. I would like an FRC fantasy website/app"
              value={newRequestText}
              onChange={(e) => setNewRequestText(e.target.value)}
              rows={3}
              style={{ width: '100%', marginBottom: '1rem', resize: 'vertical' }}
            />

            {/* Expandable key features */}
            <div style={{ marginBottom: '1rem' }}>
              <button
                type="button"
                className="btn-ghost"
                style={{ padding: '0.4rem 0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                onClick={() => setKeyFeaturesExpanded(!keyFeaturesExpanded)}
              >
                {keyFeaturesExpanded ? '▼' : '▶'} Key features to include
              </button>
              {keyFeaturesExpanded && (
                <div style={{ marginTop: '0.75rem', paddingLeft: '0.5rem' }}>
                  {keyFeatures.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder={`Feature ${i + 1}`}
                        value={f}
                        onChange={(e) => updateFeature(i, e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <button type="button" className="btn-ghost" style={{ padding: '0.4rem 0.6rem' }} onClick={() => removeFeature(i)}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn-secondary" style={{ marginTop: '0.25rem' }} onClick={addFeature}>
                    + Add feature
                  </button>
                </div>
              )}
            </div>

            <button
              className="btn-primary"
              onClick={() => {
                setNewRequestText('');
                setKeyFeatures(['']);
                setKeyFeaturesExpanded(false);
                setShowCreateRequest(false);
              }}
            >
              Submit request
            </button>
          </div>
        )}
      </div>

      {/* Popular requests — full-width horizontal tiles */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--accent-muted) 0%, var(--surface) 100%)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '1.75rem',
          marginBottom: '1rem',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginBottom: '0.35rem', fontSize: '1.35rem' }}>Popular requests</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
          Click a request to see details, existing features, propose new ones, and rate or comment on creator solutions.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
          {filteredRequests.map((req) => {
            const totalUpvotes = (req.upvotes ?? 0) + (requestUpvotes[req.id] ?? 0);
            return (
              <Link
                key={req.id}
                to={`/request/${req.id}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%' }}
              >
                <div
                  className="card"
                  style={{
                    cursor: 'pointer',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(37, 99, 235, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '1.05rem', flex: 1 }}>{req.text}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <button
                      type="button"
                      className="btn-ghost"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      onClick={(e) => upvoteRequest(e, req.id)}
                      aria-label="Upvote"
                    >
                      ▲ {totalUpvotes}
                    </button>
                    <span>{req.date}</span>
                    {req.solutions?.length > 0 && (
                      <span>· {req.solutions.length} solution{req.solutions.length !== 1 ? 's' : ''}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
