import { RANK_STYLES } from '../utils/rank';

export default function RankBadge({ rank, style = {} }) {
  const r = (rank || 'bronze').toLowerCase();
  const s = RANK_STYLES[r] || RANK_STYLES.bronze;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.2em 0.5em',
        borderRadius: 6,
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        ...style,
      }}
    >
      {r}
    </span>
  );
}
