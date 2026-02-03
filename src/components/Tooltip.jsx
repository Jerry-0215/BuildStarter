import { useState } from 'react';

export default function Tooltip({ children, content, style = {} }) {
  const [show, setShow] = useState(false);
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', ...style }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && content && (
        <span
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%) translateY(-6px)',
            padding: '0.5rem 0.75rem',
            background: 'var(--text-primary)',
            color: 'var(--surface)',
            fontSize: '0.8rem',
            borderRadius: 8,
            maxWidth: 280,
            whiteSpace: 'normal',
            zIndex: 100,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
}
