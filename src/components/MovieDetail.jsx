import AIAnalysis from './AIAnalysis';

function MovieDetail({ movie, onClose, inWatchlist, onToggleWatchlist }) {
  if (!movie) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="modal-content">

          {/* LEFT — POSTER */}
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                : 'https://via.placeholder.com/300x450?text=No+Image'
            }
            alt={movie.title}
            className="modal-poster"
          />

          {/* RIGHT — DETAILS */}
          <div className="modal-info">
            <h2 className="modal-title">{movie.title}</h2>

            <div className="modal-meta">
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              <span>📅 {movie.release_date?.split('-')[0]}</span>
              <span>🗳️ {movie.vote_count?.toLocaleString()} votes</span>
            </div>

            <button
              className={`watchlist-toggle-btn${inWatchlist ? ' watchlist-toggle-btn--active' : ''}`}
              onClick={onToggleWatchlist}>
              {inWatchlist ? '❤️ In Watchlist' : '🤍 Add to Watchlist'}
            </button>

            <p className="modal-overview">{movie.overview}</p>

            <AIAnalysis movie={movie} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default MovieDetail;