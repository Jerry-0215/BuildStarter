import { useState } from 'react';

export default function FollowButton({ id, label = 'Follow', followedLabel = 'Following', size = 'default' }) {
  const [followed, setFollowed] = useState(false);
  const isSmall = size === 'small';
  return (
    <button
      type="button"
      className={followed ? 'btn-primary' : 'btn-secondary'}
      style={{
        padding: isSmall ? '0.35rem 0.65rem' : '0.5rem 0.9rem',
        fontSize: isSmall ? '0.85rem' : '0.9rem',
      }}
      onClick={() => setFollowed((f) => !f)}
    >
      {followed ? followedLabel : label}
    </button>
  );
}
