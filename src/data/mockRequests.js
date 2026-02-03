// Shared mock data for requests and solutions (demo only)
// features: { text, upvotes, downvotes } — sorted by (upvotes - downvotes) in UI

const CATEGORIES = ['sports', 'frc', 'lifestyle', 'fitness', 'communication', 'gaming', 'productivity', 'utility'];

export const MOCK_REQUESTS = [
  {
    id: 'r1',
    text: 'FRC fantasy website/app',
    upvotes: 89,
    date: '2 days ago',
    category: 'frc',
    features: [
      { text: 'Draft or pick teams before events', upvotes: 42, downvotes: 2 },
      { text: 'Live scoring during matches', upvotes: 38, downvotes: 5 },
      { text: 'Leaderboard and stats', upvotes: 31, downvotes: 4 },
    ],
    solutions: [
      {
        id: 's1',
        title: 'FRC Fantasy Web App',
        type: 'app',
        link: 'https://example.com/frc-fantasy-app',
        author: 'Creator A',
        authorRank: 'gold',
        rating: 4.2,
        ratingCount: 12,
        comments: [
          { id: 'c1', author: 'User1', text: 'Love the draft flow! Consider adding dark mode.', date: '1 day ago' },
          { id: 'c2', author: 'User2', text: 'Leaderboard layout is clear. Would be great to see match schedule integration.', date: '2 days ago' },
        ],
      },
      {
        id: 's2',
        title: 'Live FRC Fantasy Demo',
        type: 'demo',
        link: 'https://frc-fantasy-demo.vercel.app',
        author: 'Creator B',
        authorRank: 'platinum',
        rating: 4.8,
        ratingCount: 24,
        comments: [
          { id: 'c3', author: 'User3', text: 'Works great on mobile. Star rating deserved!', date: '5 hours ago' },
        ],
      },
    ],
  },
  {
    id: 'r2',
    text: 'Custom team dashboard with live match data',
    upvotes: 76,
    date: '3 days ago',
    category: 'frc',
    features: [
      { text: 'Real-time match scores', upvotes: 35, downvotes: 3 },
      { text: 'Team rankings', upvotes: 28, downvotes: 1 },
      { text: 'Customizable widgets', upvotes: 22, downvotes: 6 },
    ],
    solutions: [
      {
        id: 's3',
        title: 'Dashboard Prototype',
        type: 'app',
        link: 'https://example.com/dashboard-app',
        author: 'Creator C',
        authorRank: 'silver',
        rating: 3.9,
        ratingCount: 8,
        comments: [],
      },
    ],
  },
  {
    id: 'r3',
    text: 'Mobile app for event check-in',
    upvotes: 54,
    date: '5 days ago',
    category: 'productivity',
    features: [
      { text: 'QR code scan', upvotes: 30, downvotes: 2 },
      { text: 'Attendee list', upvotes: 25, downvotes: 4 },
      { text: 'Check-in stats', upvotes: 18, downvotes: 3 },
    ],
    solutions: [],
  },
  {
    id: 'r4',
    text: 'Pit display kiosk for competition',
    upvotes: 41,
    date: '1 week ago',
    category: 'frc',
    features: [
      { text: 'Full-screen schedule', upvotes: 28, downvotes: 1 },
      { text: 'Match countdown', upvotes: 24, downvotes: 2 },
      { text: 'Team info panel', upvotes: 19, downvotes: 5 },
    ],
    solutions: [],
  },
  {
    id: 'r5',
    text: 'Scouting data export to CSV/Excel',
    upvotes: 38,
    date: '1 week ago',
    category: 'utility',
    features: [
      { text: 'Export current view', upvotes: 26, downvotes: 3 },
      { text: 'Custom columns', upvotes: 20, downvotes: 2 },
      { text: 'Bulk export', upvotes: 15, downvotes: 4 },
    ],
    solutions: [],
  },
  {
    id: 'r6',
    text: 'Fantasy league for local sports',
    upvotes: 45,
    date: '4 days ago',
    category: 'sports',
    features: [
      { text: 'Draft picks', upvotes: 22, downvotes: 2 },
      { text: 'Weekly standings', upvotes: 19, downvotes: 1 },
    ],
    solutions: [],
  },
  {
    id: 'r7',
    text: 'Habit tracker with streaks',
    upvotes: 52,
    date: '5 days ago',
    category: 'lifestyle',
    features: [
      { text: 'Daily check-in', upvotes: 28, downvotes: 3 },
      { text: 'Streak counter', upvotes: 24, downvotes: 2 },
    ],
    solutions: [],
  },
  {
    id: 'r8',
    text: 'Workout planner and timer',
    upvotes: 48,
    date: '6 days ago',
    category: 'fitness',
    features: [
      { text: 'Rest timer', upvotes: 26, downvotes: 1 },
      { text: 'Exercise library', upvotes: 20, downvotes: 4 },
    ],
    solutions: [],
  },
  {
    id: 'r9',
    text: 'Team chat with channels',
    upvotes: 61,
    date: '3 days ago',
    category: 'communication',
    features: [
      { text: 'Channels', upvotes: 35, downvotes: 2 },
      { text: 'File sharing', upvotes: 28, downvotes: 5 },
    ],
    solutions: [],
  },
  {
    id: 'r10',
    text: 'Tournament bracket manager',
    upvotes: 44,
    date: '1 week ago',
    category: 'gaming',
    features: [
      { text: 'Single/double elim', upvotes: 25, downvotes: 2 },
      { text: 'Live updates', upvotes: 18, downvotes: 3 },
    ],
    solutions: [],
  },
];

export { CATEGORIES };
