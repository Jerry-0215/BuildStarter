// Mock friends data

export const MOCK_FRIENDS = {
  David: {
    name: 'David',
    email: 'david@example.com',
    bio: 'Full-stack developer focused on FRC tools and automation.',
    joinedDate: '2021-08-20',
    solutionsSubmitted: 15,
    upvotesReceived: 267,
    techStack: ['React', 'Python', 'FastAPI'],
    expertise: ['FRC', 'Automation', 'Backend'],
    availability: 'solo',
    badges: ['Top Creator for FRC'],
    recentApps: [
      { title: 'FRC Scouting Analyzer', link: 'https://example.com/scouting', requestTitle: 'Scouting data export to CSV/Excel', date: '1 week ago', upvotes: 45 },
      { title: 'Match Predictor Pro', link: 'https://example.com/predictor', requestTitle: 'FRC fantasy website/app', date: '2 weeks ago', upvotes: 38 },
    ],
  },
  Mathis: {
    name: 'Mathis',
    email: 'mathis@example.com',
    bio: 'UI/UX designer and frontend builder. Love creating beautiful, functional interfaces.',
    joinedDate: '2022-01-10',
    solutionsSubmitted: 9,
    upvotesReceived: 189,
    techStack: ['Figma', 'React', 'Next.js', 'Tailwind'],
    expertise: ['UX', 'Web apps', 'Design systems'],
    availability: 'open to cofounding',
    badges: ['Highly Rated This Month'],
    recentApps: [
      { title: 'Dashboard UI Kit', link: 'https://example.com/dashboard-kit', requestTitle: 'Custom team dashboard with live match data', date: '3 days ago', upvotes: 52 },
      { title: 'Event Check-in App', link: 'https://example.com/checkin', requestTitle: 'Mobile app for event check-in', date: '1 week ago', upvotes: 31 },
    ],
  },
  Remy: {
    name: 'Remy',
    email: 'remy@example.com',
    bio: 'Mobile developer and rapid prototyper. I ship fast and iterate based on feedback.',
    joinedDate: '2022-11-05',
    solutionsSubmitted: 7,
    upvotesReceived: 142,
    techStack: ['React Native', 'TypeScript', 'Firebase'],
    expertise: ['Mobile', 'Rapid prototyping', 'Productivity'],
    availability: 'team',
    badges: [],
    recentApps: [
      { title: 'Habit Tracker MVP', link: 'https://example.com/habit', requestTitle: 'Habit tracker with streaks', date: '5 days ago', upvotes: 28 },
      { title: 'Workout Timer', link: 'https://example.com/workout', requestTitle: 'Workout planner and timer', date: '2 weeks ago', upvotes: 19 },
    ],
  },
};
