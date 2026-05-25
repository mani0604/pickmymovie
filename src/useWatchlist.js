import { useState } from 'react';

const KEY = 'pickmymovie_watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  });

  function toggle(movie) {
    setWatchlist(prev => {
      const exists = prev.some(m => m.id === movie.id);
      const next = exists ? prev.filter(m => m.id !== movie.id) : [...prev, movie];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  function isInWatchlist(id) {
    return watchlist.some(m => m.id === id);
  }

  return { watchlist, toggle, isInWatchlist };
}
