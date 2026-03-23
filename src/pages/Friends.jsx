import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFollow } from '../context/FollowContext';
import { supabase } from '../lib/supabase';

function Avatar({ name, size = 48 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--blue-dark))', color: 'white', fontWeight: 700, fontSize: size * 0.4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {(name || '?').charAt(0).toUpperCase()}
    </div>
  );
}

function SearchButton({ status, id, sendFriendRequest, cancelFriendRequest, acceptFriendRequest, declineFriendRequest }) {
  if (status === 'accepted') {
    return <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, padding: '0.35rem 0.85rem' }}>Friends ✓</span>;
  }
  if (status === 'sent') {
    return (
      <button onClick={() => cancelFriendRequest(id)} style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem', borderRadius: 8, border: '1px solid var(--border)', background: 'white', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, whiteSpace: 'nowrap' }}>
        Request Sent
      </button>
    );
  }
  if (status === 'received') {
    return (
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <button onClick={() => acceptFriendRequest(id)} className="btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}>Accept</button>
        <button onClick={() => declineFriendRequest(id)} className="btn-ghost" style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}>Decline</button>
      </div>
    );
  }
  return (
    <button onClick={() => sendFriendRequest(id)} style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem', borderRadius: 8, border: '1px solid var(--accent)', background: 'var(--accent-soft)', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, whiteSpace: 'nowrap' }}>
      Add Friend
    </button>
  );
}

export default function Friends() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { friendships, sendFriendRequest, cancelFriendRequest, acceptFriendRequest, declineFriendRequest } = useFollow();
  const [profiles, setProfiles] = useState({});  // { [userId]: profile }
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Load profiles for received requests + accepted friends
  useEffect(() => {
    const ids = Object.entries(friendships)
      .filter(([, v]) => v === 'received' || v === 'accepted')
      .map(([k]) => k);
    if (!ids.length) { setProfiles({}); return; }
    supabase
      .from('profiles')
      .select('id, name, bio, tech_stack, availability')
      .in('id', ids)
      .then(({ data }) => {
        const map = {};
        (data ?? []).forEach((p) => { map[p.id] = p; });
        setProfiles(map);
      });
  }, [friendships]);

  // Debounced search for users by name
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      const { data } = await supabase
        .from('profiles')
        .select('id, name, bio, tech_stack')
        .ilike('name', `%${searchQuery.trim()}%`)
        .neq('id', user?.id ?? '')
        .limit(10);
      setSearchResults(data ?? []);
      setSearching(false);
    }, 350);
    return () => clearTimeout(t);
  }, [searchQuery, user]);

  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
        <h2 style={{ marginBottom: '0.75rem' }}>Friends</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Log in to connect with other builders on BuildStarter.
        </p>
        <button className="btn-primary" onClick={() => navigate('/login')}>Log in</button>
      </div>
    );
  }

  const receivedRequests = Object.entries(friendships)
    .filter(([, v]) => v === 'received')
    .map(([id]) => ({ id, profile: profiles[id] }));

  const acceptedFriends = Object.entries(friendships)
    .filter(([, v]) => v === 'accepted')
    .map(([id]) => ({ id, profile: profiles[id] }));

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 3rem', maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Friends</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center' }}>
        Connect with other builders on BuildStarter.
      </p>

      {/* Incoming friend requests */}
      {receivedRequests.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            Friend requests
            <span style={{ marginLeft: '0.5rem', background: 'var(--accent)', color: 'white', borderRadius: '999px', fontSize: '0.75rem', padding: '0.1em 0.55em', fontWeight: 700 }}>{receivedRequests.length}</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {receivedRequests.map(({ id, profile }) => (
              <div key={id} className="card" style={{ padding: '0.9rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                <Avatar name={profile?.name} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/friend/${id}`} style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>
                    {profile?.name || 'Loading…'}
                  </Link>
                  {profile?.bio && (
                    <p style={{ margin: '0.1rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {profile.bio}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                  <button onClick={() => acceptFriendRequest(id)} className="btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}>Accept</button>
                  <button onClick={() => declineFriendRequest(id)} className="btn-ghost" style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: '2.5rem' }}>
        <input
          type="text"
          placeholder="Find builders by name…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '1rem', borderRadius: 10, border: '1px solid var(--border)', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }}
        />
        {searchQuery.trim() && (
          <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {searching && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Searching…</p>}
            {!searching && searchResults.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No users found.</p>
            )}
            {searchResults.map((p) => (
              <div key={p.id} className="card" style={{ padding: '0.9rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                <Avatar name={p.name} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/friend/${p.id}`} style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>
                    {p.name || 'Unnamed'}
                  </Link>
                  {p.bio && (
                    <p style={{ margin: '0.15rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.bio}
                    </p>
                  )}
                </div>
                <SearchButton
                  status={friendships[p.id]}
                  id={p.id}
                  sendFriendRequest={sendFriendRequest}
                  cancelFriendRequest={cancelFriendRequest}
                  acceptFriendRequest={acceptFriendRequest}
                  declineFriendRequest={declineFriendRequest}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Friends grid */}
      {acceptedFriends.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1rem' }}>No friends yet.</p>
          <p style={{ fontSize: '0.9rem' }}>Search for builders above and send a friend request.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {acceptedFriends.map(({ id, profile: p }) => (
            <Link key={id} to={`/friend/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                className="card"
                style={{ padding: '1.5rem', cursor: 'pointer', transition: 'box-shadow 0.2s', height: '100%', boxSizing: 'border-box' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(37, 99, 235, 0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.85rem' }}>
                  <Avatar name={p?.name} size={52} />
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p?.name || 'Loading…'}
                    </h3>
                    {p?.availability && (
                      <p style={{ margin: '0.1rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.availability}</p>
                    )}
                  </div>
                </div>
                {p?.bio && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.85rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.bio}
                  </p>
                )}
                {(p?.tech_stack ?? []).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {p.tech_stack.slice(0, 4).map((t) => (
                      <span key={t} style={{ fontSize: '0.75rem', padding: '0.2em 0.5em', background: 'var(--accent-soft)', borderRadius: 6, color: 'var(--blue-dark)' }}>{t}</span>
                    ))}
                    {p.tech_stack.length > 4 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+{p.tech_stack.length - 4}</span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

