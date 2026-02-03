import Tooltip from './Tooltip';

const TOOLTIP_TEXT =
  'Market Fit Score (concept): In the full product, this would combine demand signals—similar requests, upvote velocity, and creator interest—to show how well a request matches market need.';

export default function MarketFitBadge({ score }) {
  const s = score ?? 0;
  const color = s >= 70 ? 'var(--vote-up)' : s >= 50 ? 'var(--amber)' : 'var(--text-muted)';
  return (
    <Tooltip content={TOOLTIP_TEXT}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.2em 0.5em',
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 700,
          background: 'var(--accent-soft)',
          color: 'var(--blue-dark)',
          border: '1px solid var(--border-soft)',
          cursor: 'help',
        }}
      >
        Fit {s}%
      </span>
    </Tooltip>
  );
}
