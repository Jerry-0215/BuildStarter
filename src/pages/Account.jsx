import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRankFromUpvotes } from '../utils/rank';
import RankBadge from '../components/RankBadge';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

function yearsSince(dateStr) {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - d) / (365.25 * 24 * 60 * 60 * 1000));
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 604800)}w ago`;
}

const TABS = ['My Requests', 'Overview', 'Past apps'];
const AVAILABILITY_OPTIONS = ['solo', 'team', 'open to cofounding'];

export default function Account() {
  const { user, profile, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('My Requests');
  const [myRequests, setMyRequests] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Edit profile state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editTechStack, setEditTechStack] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editAvailability, setEditAvailability] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function fetchData() {
      const [reqRes, appRes] = await Promise.all([
        supabase.from('requests').select('*, solutions(count)').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('solutions').select('*, requests(text)').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);
      if (!reqRes.error) setMyRequests(reqRes.data ?? []);
      if (!appRes.error) setMyApps(appRes.data ?? []);
      setDataLoading(false);
    }
    fetchData();
  }, [user]);

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>You're not signed in</h2>
        <Link to="/login" className="btn-primary">Sign in</Link>
      </div>
    );
  }

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  function startEditing() {
    setEditName(profile?.name ?? '');
    setEditBio(profile?.bio ?? '');
    setEditTechStack((profile?.tech_stack ?? []).join(', '));
    setEditLinkedin(profile?.linkedin ?? '');
    setEditGithub(profile?.github ?? '');
    setEditAvailability(profile?.availability ?? '');
    setEditing(true);
  }

  async function handleSaveProfile() {
    setSaving(true);
    await updateProfile({
      name: editName.trim() || null,
      bio: editBio.trim() || null,
      tech_stack: editTechStack.split(',').map((t) => t.trim()).filter(Boolean),
      linkedin: editLinkedin.trim() || null,
      github: editGithub.trim() || null,
      availability: editAvailability || null,
    });
    setSaving(false);
    setEditing(false);
  }

  const years = yearsSince(profile?.created_at);
  const rank = getRankFromUpvotes(profile?.upvotes_received ?? 0, profile?.solutions_submitted ?? 0);
  const displayName = profile?.name || user.email?.split('@')[0] || 'User';
  const initial = displayName[0]?.toUpperCase() ?? '?';

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 3rem', maxWidth: 720, margin: '0 auto' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        ← Back to browse
      </Link>

      <div className="card" style={{ padding: '2rem', marginBottom: '1rem', textAlign: 'center' }}>
        <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent) 0%, var(--blue-dark) 100%)', color: 'white', fontSize: '2rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)' }}>
          {initial}
        </div>

        {editing ? (
          <div style={{ textAlign: 'left', maxWidth: 480, margin: '0 auto' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.3rem' }}>Name</label>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.3rem' }}>Bio</label>
              <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} rows={3} style={{ width: '100%', resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.3rem' }}>Tech stack <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(comma-separated)</span></label>
              <input value={editTechStack} onChange={(e) => setEditTechStack(e.target.value)} placeholder="React, Python, Postgres" style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.3rem' }}>LinkedIn URL</label>
              <input value={editLinkedin} onChange={(e) => setEditLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.3rem' }}>GitHub URL</label>
              <input value={editGithub} onChange={(e) => setEditGithub(e.target.value)} placeholder="https://github.com/..." style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.3rem' }}>Availability</label>
              <select value={editAvailability} onChange={(e) => setEditAvailability(e.target.value)} style={{ padding: '0.6em 0.9em', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'inherit' }}>
                <option value="">— select —</option>
                {AVAILABILITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn-primary" disabled={saving} onClick={handleSaveProfile}>{saving ? 'Saving…' : 'Save'}</button>
              <button className="btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <h1 style={{ marginBottom: '0.35rem' }}>{displayName}</h1>
            <div style={{ marginBottom: '0.5rem' }}>
              <RankBadge rank={rank} style={{ fontSize: '0.8rem', padding: '0.3em 0.65em' }} />
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>{user.email}</p>
            {profile?.bio && (
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, margin: '0 0 1rem', fontSize: '0.95rem' }}>{profile.bio}</p>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
              {(profile?.tech_stack ?? []).map((t) => (
                <span key={t} style={{ fontSize: '0.8rem', padding: '0.25em 0.5em', background: 'var(--accent-soft)', borderRadius: 6, color: 'var(--blue-dark)' }}>{t}</span>
              ))}
            </div>
            {profile?.availability && (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 1rem' }}>Availability: {profile.availability}</p>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn-ghost" style={{ fontSize: '0.9rem' }} onClick={startEditing}>Edit profile</button>
              <button className="btn-ghost" onClick={handleSignOut} style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sign out</button>
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-soft)' }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? 'btn-primary' : 'btn-ghost'}
            style={{
              padding: '0.6rem 1.25rem',
              fontSize: '0.95rem',
              borderRadius: '10px 10px 0 0',
              marginBottom: '-2px',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'My Requests' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>My requests</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
            Requests you've created.
          </p>
          {dataLoading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
          ) : myRequests.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>You haven't created any requests yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {myRequests.map((req) => {
                const solutionCount = req.solutions?.[0]?.count ?? 0;
                return (
                  <Link key={req.id} to={`/request/${req.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        padding: '1rem',
                        background: 'var(--accent-soft)',
                        borderRadius: 10,
                        border: '1px solid var(--border-soft)',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.15)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ''; }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>{req.text}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{timeAgo(req.created_at)}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        <span className="badge badge-count">{req.upvotes} upvotes</span>
                        <span>· {solutionCount} solution{solutionCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Overview' && (
        <>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Account</h2>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 2, color: 'var(--text-primary)' }}>
              <li>Member since <strong>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}</strong></li>
              <li><strong>{years}</strong> year{years !== 1 ? 's' : ''} on BuildStarter</li>
              <li>Rank: <RankBadge rank={rank} /></li>
            </ul>
          </div>

          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Creator stats</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--accent-soft)', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--blue-dark)' }}>{profile?.solutions_submitted ?? 0}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Solutions submitted</div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--accent-soft)', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--blue-dark)' }}>{profile?.upvotes_received ?? 0}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Upvotes received</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Profiles</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {profile?.linkedin ? (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.9rem', borderRadius: 8, background: 'var(--accent-soft)', color: 'var(--blue-dark)', textDecoration: 'none', fontWeight: 500 }}>
                  <span style={{ fontSize: '1.25rem' }}>in</span> LinkedIn
                </a>
              ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No LinkedIn added</span>}
              {profile?.github ? (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.9rem', borderRadius: 8, background: 'var(--accent-soft)', color: 'var(--blue-dark)', textDecoration: 'none', fontWeight: 500 }}>
                  <span style={{ fontSize: '1.25rem' }}>⌘</span> GitHub
                </a>
              ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No GitHub added</span>}
            </div>
          </div>
        </>
      )}

      {activeTab === 'Past apps' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Past apps created</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
            Solutions and demos you’ve submitted to requests.
          </p>
          {dataLoading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
          ) : myApps.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>You haven't submitted any solutions yet.</p>
          ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {myApps.map((app) => (
              <div
                key={app.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: 'var(--accent-soft)',
                  borderRadius: 10,
                  border: '1px solid var(--border-soft)',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  {app.link ? (
                    <a href={app.link} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--blue-dark)', textDecoration: 'none' }}>
                      {app.title}
                    </a>
                  ) : (
                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>{app.title}</span>
                  )}
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    For: {app.requests?.text ?? 'Unknown request'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span className="badge badge-count" style={{ textTransform: 'capitalize' }}>{app.type}</span>
                  <span>{timeAgo(app.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}
    </div>
  );
}
