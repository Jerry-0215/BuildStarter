import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getRankFromUpvotes } from '../utils/rank';
import RankBadge from '../components/RankBadge';

const MOCK_ACCOUNT = {
  name: 'John',
  email: 'john@example.com',
  bio: 'Builder and creator. I ship apps and demos for FRC and productivity tools.',
  joinedDate: '2022-03-15',
  solutionsSubmitted: 12,
  upvotesReceived: 184,
  linkedin: 'https://linkedin.com/in/johndoe',
  github: 'https://github.com/johndoe',
};

const MOCK_PAST_APPS = [
  { id: 1, title: 'FRC Fantasy Web App', link: 'https://example.com/frc-fantasy-app', requestTitle: 'FRC fantasy website/app', requestId: 'r1', upvotes: 42, date: '2 months ago', type: 'app' },
  { id: 2, title: 'Team Dashboard Lite', link: 'https://example.com/dashboard-lite', requestTitle: 'Custom team dashboard with live match data', requestId: 'r2', upvotes: 28, date: '4 months ago', type: 'app' },
  { id: 3, title: 'Check-in QR Demo', link: 'https://example.com/checkin-demo', requestTitle: 'Mobile app for event check-in', requestId: 'r3', upvotes: 19, date: '5 months ago', type: 'demo' },
  { id: 4, title: 'Scout Export Tool', link: 'https://example.com/export-tool', requestTitle: 'Scouting data export to CSV/Excel', requestId: 'r5', upvotes: 31, date: '6 months ago', type: 'app' },
];

function yearsSince(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const years = (now - d) / (365.25 * 24 * 60 * 60 * 1000);
  return Math.floor(years);
}

const TABS = ['Overview', 'Past apps'];

export default function Account() {
  const [activeTab, setActiveTab] = useState('Overview');
  const years = yearsSince(MOCK_ACCOUNT.joinedDate);
  const rank = getRankFromUpvotes(MOCK_ACCOUNT.upvotesReceived, MOCK_ACCOUNT.solutionsSubmitted);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 3rem', maxWidth: 720, margin: '0 auto' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        ← Back to browse
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
          {MOCK_ACCOUNT.name.charAt(0)}
        </div>
        <h1 style={{ marginBottom: '0.35rem' }}>{MOCK_ACCOUNT.name}</h1>
        <div style={{ marginBottom: '0.5rem' }}>
          <RankBadge rank={rank} style={{ fontSize: '0.8rem', padding: '0.3em 0.65em' }} />
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>{MOCK_ACCOUNT.email}</p>
        <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>{MOCK_ACCOUNT.bio}</p>
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

      {activeTab === 'Overview' && (
        <>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Account</h2>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 2, color: 'var(--text-primary)' }}>
              <li>Member since <strong>{new Date(MOCK_ACCOUNT.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</strong></li>
              <li><strong>{years}</strong> year{years !== 1 ? 's' : ''} on BuildStarter</li>
              <li>Rank: <RankBadge rank={rank} /></li>
            </ul>
          </div>

          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Creator stats</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--accent-soft)', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--blue-dark)' }}>{MOCK_ACCOUNT.solutionsSubmitted}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Solutions submitted</div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--accent-soft)', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--blue-dark)' }}>{MOCK_ACCOUNT.upvotesReceived}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Upvotes received</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Profiles</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a
                href={MOCK_ACCOUNT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 0.9rem',
                  borderRadius: 8,
                  background: 'var(--accent-soft)',
                  color: 'var(--blue-dark)',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>in</span> LinkedIn
              </a>
              <a
                href={MOCK_ACCOUNT.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 0.9rem',
                  borderRadius: 8,
                  background: 'var(--accent-soft)',
                  color: 'var(--blue-dark)',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>⌘</span> GitHub
              </a>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {MOCK_PAST_APPS.map((app) => (
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
                  <a href={app.link} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--blue-dark)', textDecoration: 'none' }}>
                    {app.title}
                  </a>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    For: {app.requestTitle}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span className="badge badge-count">{app.upvotes} upvotes</span>
                  <span style={{ textTransform: 'capitalize' }}>{app.type}</span>
                  <span>{app.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
