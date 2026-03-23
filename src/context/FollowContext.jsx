import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const FollowContext = createContext(null);

export function FollowProvider({ children }) {
  const [followedDomains, setFollowedDomains] = useState({});
  const [followedRequests, setFollowedRequests] = useState({});
  // friendships: { [otherUserId]: 'sent' | 'received' | 'accepted' }
  const [friendships, setFriendships] = useState({});
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

  // Load data from DB when user logs in; clear when logged out
  useEffect(() => {
    if (!userId) {
      setFollowedDomains({});
      setFollowedRequests({});
      setFriendships({});
      return;
    }
    // Load request/domain follows
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
    // Load friend requests (both directions)
    supabase
      .from('friend_requests')
      .select('from_user_id, to_user_id, status')
      .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
      .then(({ data }) => {
        const fr = {};
        (data ?? []).forEach((row) => {
          if (row.from_user_id === userId) {
            fr[row.to_user_id] = row.status === 'accepted' ? 'accepted' : 'sent';
          } else {
            fr[row.from_user_id] = row.status === 'accepted' ? 'accepted' : 'received';
          }
        });
        setFriendships(fr);
      });
  }, [userId]);

  const toggleDomain = (domain) => {
    if (!userId) return;
    setFollowedDomains((prev) => {
      const next = { ...prev, [domain]: !prev[domain] };
      if (!prev[domain]) {
        supabase.from('user_follows').insert({ user_id: userId, type: 'domain', target_id: domain }).then(() => {});
      } else {
        supabase.from('user_follows').delete().eq('user_id', userId).eq('type', 'domain').eq('target_id', domain).then(() => {});
      }
      return next;
    });
  };

  const toggleRequest = (id, text) => {
    if (!userId) return;
    setFollowedRequests((prev) => {
      const next = { ...prev };
      const isFollowing = !!next[id];
      if (isFollowing) {
        delete next[id];
        supabase.from('user_follows').delete().eq('user_id', userId).eq('type', 'request').eq('target_id', id).then(() => {});
      } else {
        next[id] = { id, text };
        supabase.from('user_follows').insert({ user_id: userId, type: 'request', target_id: id, target_text: text }).then(() => {});
      }
      return next;
    });
  };

  const sendFriendRequest = async (targetUserId) => {
    if (!userId) return;
    await supabase.from('friend_requests').insert({ from_user_id: userId, to_user_id: targetUserId });
    setFriendships((prev) => ({ ...prev, [targetUserId]: 'sent' }));
  };

  const cancelFriendRequest = async (targetUserId) => {
    if (!userId) return;
    await supabase.from('friend_requests').delete().eq('from_user_id', userId).eq('to_user_id', targetUserId);
    setFriendships((prev) => { const next = { ...prev }; delete next[targetUserId]; return next; });
  };

  const acceptFriendRequest = async (fromUserId) => {
    if (!userId) return;
    await supabase.from('friend_requests').update({ status: 'accepted' }).eq('from_user_id', fromUserId).eq('to_user_id', userId);
    setFriendships((prev) => ({ ...prev, [fromUserId]: 'accepted' }));
  };

  const declineFriendRequest = async (fromUserId) => {
    if (!userId) return;
    await supabase.from('friend_requests').delete().eq('from_user_id', fromUserId).eq('to_user_id', userId);
    setFriendships((prev) => { const next = { ...prev }; delete next[fromUserId]; return next; });
  };

  const unfriend = async (otherUserId) => {
    if (!userId) return;
    await supabase.from('friend_requests').delete()
      .or(`and(from_user_id.eq.${userId},to_user_id.eq.${otherUserId}),and(from_user_id.eq.${otherUserId},to_user_id.eq.${userId})`);
    setFriendships((prev) => { const next = { ...prev }; delete next[otherUserId]; return next; });
  };

  return (
    <FollowContext.Provider value={{
      followedDomains, followedRequests,
      friendships, sendFriendRequest, cancelFriendRequest, acceptFriendRequest, declineFriendRequest, unfriend,
      toggleDomain, toggleRequest,
    }}>
      {children}
    </FollowContext.Provider>
  );
}

export function useFollow() {
  const ctx = useContext(FollowContext);
  if (!ctx) throw new Error('useFollow must be used within FollowProvider');
  return ctx;
}
