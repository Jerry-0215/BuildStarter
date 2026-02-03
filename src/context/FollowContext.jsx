import { createContext, useContext, useState } from 'react';

const FollowContext = createContext(null);

export function FollowProvider({ children }) {
  const [followedDomains, setFollowedDomains] = useState({});
  const [followedRequests, setFollowedRequests] = useState({}); // { [id]: { id, text } }
  const toggleDomain = (domain) => {
    setFollowedDomains((prev) => ({ ...prev, [domain]: !prev[domain] }));
  };
  const toggleRequest = (id, text) => {
    setFollowedRequests((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = { id, text };
      return next;
    });
  };
  return (
    <FollowContext.Provider value={{ followedDomains, followedRequests, toggleDomain, toggleRequest }}>
      {children}
    </FollowContext.Provider>
  );
}

export function useFollow() {
  const ctx = useContext(FollowContext);
  if (!ctx) throw new Error('useFollow must be used within FollowProvider');
  return ctx;
}
