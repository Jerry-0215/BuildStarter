import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useFollow } from '../context/FollowContext';
import { getRankFromUpvotes } from '../utils/rank';
import RankBadge from '../components/RankBadge';

const availabilityLabel = (av) =>
  av === 'solo' ? 'Solo' : av === 'team' ? 'Team' : av === 'open to cofounding' ? 'Open to cofounding' : av;

export default function FriendProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const { friendships, sendFriendRequest, cancelFriendRequest, acceptFriendRequest, declineFriendRequest, unfriend } = useFollow();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setProfile(data ?? null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <p>Creator not found.</p>
        <Link to="/friends">← Back to friends</Link>
      </div>
    );
  }

  const displayName = profile.name || 'Unnamed Creator';
  const rank = getRankFromUpvotes(profile.upvotes_received ?? 0, profile.solutions_submitted ?? 0);
  const friendship = friendships[id]; // 'sent' | 'received' | 'accepted' | undefined
  const years = profile.created_at
    ? Math.floor((Date.now() - new Date(profile.created_at)) / (365.25 * 24 * 60 * 60 * 1000))
    : 0;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 3rem', maxWidth: 720, margin: '0 auto' }}>
      <Link to="/friends" style={{ display: 'inline-block', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        ← Back to friends
      </Link>

      <div className="card" style={{ padding: '2rem', marginBottom: '1rem', textAlign: 'center' }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--blue-dark) 100%)',
            color: 'white',
            fontSize: '2rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
          }}
        >
          {displayName.charAt(0).toUpperCase()}
        </div>
        <h1 style={{ marginBottom: '0.35rem' }}>{displayName}</h1>
        <div style={{ marginBottom: '0.75rem' }}>
          <RankBadge rank={rank} style={{ fontSize: '0.8rem', padding: '0.3em 0.65em' }} />
        </div>
        {profile.bio && (
          <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, margin: '0 0 1rem', fontSize: '0.95rem' }}>
            {profile.bio}
          </p>
        )}
        {(profile.tech_stack ?? []).length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', justifyContent: 'center', marginBottom: '0.75rem' }}>
            {profile.tech_stack.map((t) => (
              <span key={t} style={{ fontSize: '0.8rem', padding: '0.25em 0.5em', background: 'var(--accent-soft)', borderRadius: 6, color: 'var(--blue-dark)' }}>{t}</span>
            ))}
          </div>
        )}
        {profile.availability && (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 1rem' }}>
            Availability: {availabilityLabel(profile.availability)}
          </p>
        )}
        {user && user.id !== id && (
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {friendship === 'accepted' && (
              <button onClick={() => unfriend(id)} className="btn-ghost" style={{ fontSize: '0.95rem' }}>
                Unfriend
              </button>
            )}
            {friendship === 'sent' && (
              <button onClick={() => cancelFriendRequest(id)} className="btn-ghost" style={{ fontSize: '0.95rem' }}>
                Request Sent — Cancel
              </button>
            )}
            {friendship === 'received' && (
              <>
                <button onClick={() => acceptFriendRequest(id)} className="btn-primary" style={{ fontSize: '0.95rem' }}>
                  Accept Friend Request
                </button>
                <button onClick={() => declineFriendRequest(id)} className="btn-ghost" style={{ fontSize: '0.95rem' }}>
                  Decline
                </button>
              </>
            )}
            {!friendship && (
              <button onClick={() => sendFriendRequest(id)} className="btn-primary" style={{ fontSize: '0.95rem' }}>
                Add Friend
              </button>
            )}
          </div>
        )}
      </div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Account</h2>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 2, color: 'var(--text-primary)' }}>
          {profile.created_at && (
            <>
              <li>Member since <strong>{new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</strong></li>
              <li><strong>{years}</strong> year{years !== 1 ? 's' : ''} on BuildStarter</li>
            </>
          )}
          <li>Rank: <RankBadge rank={rank} /></li>
        </ul>
      </div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: profile.linkedin || profile.github ? '1.5rem' : 0 }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Creator stats</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--accent-soft)', borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--blue-dark)' }}>{profile.solutions_submitted ?? 0}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Solutions submitted</div>
          </div>
          <div style={{ padding: '1rem', background: 'var(--accent-soft)', borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--blue-dark)' }}>{profile.upvotes_received ?? 0}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Upvotes received</div>
          </div>
        </div>
      </div>

      {(profile.linkedin || profile.github) && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Links</h2>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.9rem', borderRadius: 8, background: 'var(--accent-soft)', color: 'var(--blue-dark)', textDecoration: 'none', fontWeight: 500 }}>
                LinkedIn
              </a>
            )}
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.9rem', borderRadius: 8, background: 'var(--accent-soft)', color: 'var(--blue-dark)', textDecoration: 'none', fontWeight: 500 }}>
                GitHub
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
