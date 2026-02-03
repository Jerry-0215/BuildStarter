// Rank based on upvotes received (and optionally solutions count / years)
// Bronze → Silver → Gold → Platinum → Diamond

export const RANKS = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];

export function getRankFromUpvotes(upvotesReceived, solutionsSubmitted = 0) {
  const score = upvotesReceived + solutionsSubmitted * 5; // weight solutions a bit
  if (score >= 1000) return 'diamond';
  if (score >= 400) return 'platinum';
  if (score >= 150) return 'gold';
  if (score >= 50) return 'silver';
  return 'bronze';
}

export const RANK_STYLES = {
  bronze: { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' },
  silver: { bg: '#f1f5f9', color: '#475569', border: '#94a3b8' },
  gold: { bg: '#fef9c3', color: '#a16207', border: '#eab308' },
  platinum: { bg: '#e0e7ff', color: '#3730a3', border: '#6366f1' },
  diamond: { bg: 'linear-gradient(135deg, #e0f2fe 0%, #fae8ff 100%)', color: '#701a75', border: '#a855f7' },
};
