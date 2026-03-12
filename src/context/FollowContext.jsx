import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const FollowContext = createContext(null);

export function FollowProvider({ children }) {
  const [followedDomains, setFollowedDomains] = useState({});
  const [followedRequests, setFollowedRequests] = useState({});
  const [userId, setUserId] = useState(null);

  // Track auth state independently (avoids circular AuthContext dependency)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load follows from DB when user logs in; clear when logged out
  useEffect(() => {
    if (!userId) {
      setFollowedDomains({});
      setFollowedRequests({});
      return;
    }
    supabase.from('user_follows').select('*').eq('user_id', userId).then(({ data }) => {
      if (!data) return;
      const domains = {};
      const requests = {};
      data.forEach((row) => {
        if (row.type === 'domain') domains[row.target_id] = true;
        if (row.type === 'request') requests[row.target_id] = { id: row.target_id, text: row.target_text ?? row.target_id };
      });
      setFollowedDomains(domains);
      setFollowedRequests(requests);
    });
  }, [userId]);

  const toggleDomain = (domain) => {
    setFollowedDomains((prev) => {
      const next = { ...prev, [domain]: !prev[domain] };
      if (userId) {
        if (!prev[domain]) {
          supabase.from('user_follows').insert({ user_id: userId, type: 'domain', target_id: domain }).then(() => {});
        } else {
          supabase.from('user_follows').delete().eq('user_id', userId).eq('type', 'domain').eq('target_id', domain).then(() => {});
        }
      }
      return next;
    });
  };

  const toggleRequest = (id, text) => {
    setFollowedRequests((prev) => {
      const next = { ...prev };
      const isFollowing = !!next[id];
      if (isFollowing) {
        delete next[id];
        if (userId) supabase.from('user_follows').delete().eq('user_id', userId).eq('type', 'request').eq('target_id', id).then(() => {});
      } else {
        next[id] = { id, text };
        if (userId) supabase.from('user_follows').insert({ user_id: userId, type: 'request', target_id: id, target_text: text }).then(() => {});
      }
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
