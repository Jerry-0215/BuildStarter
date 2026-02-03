// Demo-only mock data: clusters, demand signals, leaderboards, feed, creator profiles.
// No backend; for storytelling and feedback only.

/** Request-level demand signals (clusterId, similarCount, combinedUpvotes, demandTrendPct, marketFitScore) */
export const REQUEST_DEMAND = {
  r1: { clusterId: 'fantasy-frc', similarCount: 4, combinedUpvotes: 312, demandTrendPct: 12, marketFitScore: 82 },
  r2: { clusterId: 'dashboard-frc', similarCount: 3, combinedUpvotes: 198, demandTrendPct: 8, marketFitScore: 76 },
  r3: { clusterId: 'checkin', similarCount: 2, combinedUpvotes: 89, demandTrendPct: -3, marketFitScore: 58 },
  r4: { clusterId: 'kiosk-frc', similarCount: 2, combinedUpvotes: 67, demandTrendPct: 5, marketFitScore: 64 },
  r5: { clusterId: 'export', similarCount: 1, combinedUpvotes: 38, demandTrendPct: 0, marketFitScore: 52 },
  r6: { clusterId: 'fantasy-sports', similarCount: 3, combinedUpvotes: 134, demandTrendPct: 18, marketFitScore: 71 },
  r7: { clusterId: 'habit', similarCount: 2, combinedUpvotes: 98, demandTrendPct: 22, marketFitScore: 69 },
  r8: { clusterId: 'fitness', similarCount: 2, combinedUpvotes: 85, demandTrendPct: 11, marketFitScore: 65 },
  r9: { clusterId: 'chat', similarCount: 2, combinedUpvotes: 112, demandTrendPct: 6, marketFitScore: 74 },
  r10: { clusterId: 'bracket', similarCount: 1, combinedUpvotes: 44, demandTrendPct: -2, marketFitScore: 55 },
};

/** Creator profiles: tech stack, expertise, availability, badges (by author id/name) */
export const MOCK_CREATORS = {
  'Creator A': {
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    expertise: ['FRC', 'Web apps', 'Dashboards'],
    availability: 'solo',
    badges: ['Top Creator for FRC'],
  },
  'Creator B': {
    techStack: ['React', 'Vite', 'Tailwind'],
    expertise: ['FRC', 'Mobile-first'],
    availability: 'open to cofounding',
    badges: ['Highly Rated This Month', 'Top Creator for FRC'],
  },
  'Creator C': {
    techStack: ['Figma', 'React', 'TypeScript'],
    expertise: ['FRC', 'UX'],
    availability: 'team',
    badges: [],
  },
};

/** Leaderboards (static) */
export const LEADERBOARD_TOP_FRC = [
  { rank: 1, name: 'Creator B', solutions: 8, upvotes: 312, badge: 'Platinum' },
  { rank: 2, name: 'Creator A', solutions: 6, upvotes: 248, badge: 'Gold' },
  { rank: 3, name: 'Creator C', solutions: 4, upvotes: 156, badge: 'Silver' },
  { rank: 4, name: 'Alex Rivera', solutions: 3, upvotes: 98, badge: 'Silver' },
  { rank: 5, name: 'Sam Chen', solutions: 2, upvotes: 67, badge: 'Bronze' },
];

export const LEADERBOARD_FASTEST_SHIPPERS = [
  { rank: 1, name: 'Creator B', shippedIn: '2 days', request: 'FRC fantasy website/app' },
  { rank: 2, name: 'Jordan Lee', shippedIn: '3 days', request: 'Team chat with channels' },
  { rank: 3, name: 'Creator A', shippedIn: '4 days', request: 'Custom team dashboard' },
  { rank: 4, name: 'Alex Rivera', shippedIn: '5 days', request: 'Pit display kiosk' },
  { rank: 5, name: 'Creator C', shippedIn: '6 days', request: 'Dashboard Prototype' },
];

/** Activity feed (static storytelling) */
export const ACTIVITY_FEED = [
  { id: 1, type: 'solution', title: 'Creator B shipped a new demo', subtitle: 'Live FRC Fantasy Demo for "FRC fantasy website/app"', time: '5 hours ago', domain: 'frc' },
  { id: 2, type: 'trending', title: 'Trending in FRC', subtitle: '"Custom team dashboard" gained 24 upvotes this week', time: '1 day ago', domain: 'frc' },
  { id: 3, type: 'solution', title: 'Jordan Lee posted a solution', subtitle: 'Team Chat MVP for "Team chat with channels"', time: '2 days ago', domain: 'communication' },
  { id: 4, type: 'trending', title: 'Trending in Lifestyle', subtitle: '"Habit tracker with streaks" — 18 new upvotes', time: '2 days ago', domain: 'lifestyle' },
  { id: 5, type: 'community', title: 'Community highlight', subtitle: '3 new solutions in Fitness this week', time: '3 days ago', domain: 'fitness' },
];

/** Structured feedback dimensions (for sliders) */
export const FEEDBACK_DIMENSIONS = [
  { key: 'ux', label: 'UX' },
  { key: 'featureCompleteness', label: 'Feature completeness' },
  { key: 'scalability', label: 'Scalability' },
  { key: 'overall', label: 'Overall' },
];
