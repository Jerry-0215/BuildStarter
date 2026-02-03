import { useParams, Link } from 'react-router-dom';
import { MOCK_FRIENDS } from '../data/mockFriends';
import { getRankFromUpvotes } from '../utils/rank';
import RankBadge from '../components/RankBadge';

function yearsSince(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const years = (now - d) / (365.25 * 24 * 60 * 60 * 1000);
  return Math.floor(years);
}

export default function FriendProfile() {
  const { name } = useParams();
  const friend = MOCK_FRIENDS[name];
  if (!friend) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <p>Friend not found.</p>
        <Link to="/friends">Back to friends</Link>
      </div>
    );
  }
  const years = yearsSince(friend.joinedDate);
  const rank = getRankFromUpvotes(friend.upvotesReceived, friend.solutionsSubmitted);
  const availabilityLabel = (av) => (av === 'solo' ? 'Solo' : av === 'team' ? 'Team' : av === 'open to cofounding' ? 'Open to cofounding' : av);

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
          {friend.name.charAt(0)}
        </div>
        <h1 style={{ marginBottom: '0.35rem' }}>{friend.name}</h1>
        <div style={{ marginBottom: '0.5rem' }}>
          <RankBadge rank={rank} style={{ fontSize: '0.8rem', padding: '0.3em 0.65em' }} />
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>{friend.email}</p>
        <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, margin: 0, fontSize: '0.95rem', marginBottom: '1rem' }}>{friend.bio}</p>
        {(friend.badges || []).length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', justifyContent: 'center', marginBottom: '0.75rem' }}>
            {friend.badges.map((b) => (
              <span key={b} className="badge badge-ai" style={{ fontSize: '0.75rem' }}>{b}</span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', justifyContent: 'center', marginBottom: '0.35rem' }}>
          {(friend.techStack || []).map((t) => (
            <span key={t} style={{ fontSize: '0.8rem', padding: '0.25em 0.5em', background: 'var(--accent-soft)', borderRadius: 6, color: 'var(--blue-dark)' }}>{t}</span>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
          {(friend.expertise || []).map((e) => (
            <span key={e} style={{ fontSize: '0.8rem', padding: '0.25em 0.5em', background: 'var(--accent-muted)', borderRadius: 6, color: 'var(--text-primary)' }}>{e}</span>
          ))}
        </div>
        {friend.availability && (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>Availability: {availabilityLabel(friend.availability)}</p>
        )}
      </div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Account</h2>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 2, color: 'var(--text-primary)' }}>
          <li>Member since <strong>{new Date(friend.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</strong></li>
          <li><strong>{years}</strong> year{years !== 1 ? 's' : ''} on BuildStarter</li>
          <li>Rank: <RankBadge rank={rank} /></li>
        </ul>
      </div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Creator stats</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--accent-soft)', borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--blue-dark)' }}>{friend.solutionsSubmitted}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Solutions submitted</div>
          </div>
          <div style={{ padding: '1rem', background: 'var(--accent-soft)', borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--blue-dark)' }}>{friend.upvotesReceived}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Upvotes received</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Recent apps</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {friend.recentApps.map((app, i) => (
            <div
              key={i}
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
                <a href={app.link} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--blue-dark)', textDecoration: 'none' }}>
                  {app.title}
                </a>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>For: {app.requestTitle}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span className="badge badge-count">{app.upvotes} upvotes</span>
                <span>{app.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
