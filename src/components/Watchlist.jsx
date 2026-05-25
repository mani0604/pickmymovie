function Watchlist({ watchlist, onClose, onSelectMovie, onToggle }) {
  return (
    <div className="watchlist-overlay" onClick={onClose}>
      <div className="watchlist-panel" onClick={e => e.stopPropagation()}>

        <div className="watchlist-header">
          <div className="watchlist-title">
            <span>❤️</span>
            <span>My Watchlist</span>
            <span className="watchlist-count">{watchlist.length}</span>
          </div>
          <button className="chat-close" onClick={onClose}>✕</button>
        </div>

        {watchlist.length === 0 ? (
          <div className="watchlist-empty">
            <p>💔 No movies saved yet</p>
            <p>Click the ❤️ on any movie to save it here</p>
          </div>
        ) : (
          <div className="watchlist-items">
            {watchlist.map(movie => (
              <div
                key={movie.id}
                className="watchlist-item"
                onClick={() => { onSelectMovie(movie); onClose(); }}>
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                      : 'https://via.placeholder.com/92x138?text=No+Image'
                  }
                  alt={movie.title}
                  className="watchlist-poster"
                />
                <div className="watchlist-info">
                  <div className="watchlist-movie-title">{movie.title}</div>
                  <div className="watchlist-movie-meta">
                    <span>⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
                    <span>📅 {movie.release_date?.split('-')[0] || 'N/A'}</span>
                  </div>
                </div>
                <button
                  className="watchlist-remove"
                  onClick={e => { e.stopPropagation(); onToggle(movie); }}
                  title="Remove from watchlist">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Watchlist;
