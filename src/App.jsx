import { useState, useEffect } from 'react';
import MovieDetail from './components/MovieDetail';
import './App.css';
import MovieChat from './components/MovieChat';

import { TMDB_KEY } from './config';

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState('');

  async function loadPopularMovies() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}`
      );
      const data = await res.json();
      if (data.results) setMovies(data.results);
    } catch {
      setError('Could not load popular movies.');
    }
    setLoading(false);
  }

  useEffect(() => { loadPopularMovies(); }, []);

  async function searchMovies() {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setMovies([]);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      console.log('API Response:', data);

      if (!data.results || data.results.length === 0) {
        setError('No movies found. Try another title!');
      } else {
        setMovies(data.results);
        setHasSearched(true);
        setSearchedQuery(query);
      }
    } catch (err) {
      console.log('Error:', err);
      setError('Something went wrong. Try again!');
    }

    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === 'Enter') searchMovies();
  }

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo" onClick={() => { setQuery(''); setError(''); setHasSearched(false); setSearchedQuery(''); loadPopularMovies(); }} style={{cursor:'pointer'}}>
          🎬 PickMyMovie
        </div>
        <p className="tagline">Find your next favourite film</p>
      </nav>

      {/* SEARCH */}
      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search any movie... (e.g. Interstellar)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            className="search-input"
          />
          <button onClick={searchMovies} className="search-btn">
            🔍 Search
          </button>
        </div>
      </div>
      {/* HERO DESCRIPTION — only show when no movies searched yet */}
      {movies.length === 0 && !loading && !hasSearched && (
        <div className="hero-section">

          <div className="hero-text">
            <h1 className="hero-title">Your AI Movie Companion 🎬</h1>
            <p className="hero-subtitle">
              Search any movie and get instant AI-powered insights —
              mood, themes, hidden gems and personalized recommendations.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Search Any Movie</h3>
              <p>Find any movie from Hollywood to Bollywood to Tollywood instantly</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Movie Analysis</h3>
              <p>Click any movie and get instant AI analysis — mood, themes, hidden gems and similar movies</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Chat With AI</h3>
              <p>Not sure what to watch? Click "Ask AI" and describe your mood — our AI recommends the perfect movie for you</p>
            </div>
          </div>

          <div className="try-section">
            <p className="try-text">Try searching:</p>
            <div className="try-tags">
              {['Interstellar', 'RRR', 'Manam', 'KGF', 'Inception'].map(title => (
                <button
                  key={title}
                  className="try-tag"
                  onClick={() => { setQuery(title); }}>
                  {title}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
      {loading && <div className="status">Searching movies... 🎬</div>}
      {error && <div className="status error">{error}</div>}

      {/* MOVIES GRID */}
      {movies.length > 0 && (
        <h2 className="movies-heading">
          {hasSearched ? `Search Results for "${searchedQuery}"` : 'Popular Movies 🎬'}
        </h2>
      )}
      <div className="movies-grid">
        {movies.map(movie => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() => setSelectedMovie(movie)}>
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : 'https://via.placeholder.com/300x450?text=No+Image'
              }
              alt={movie.title}
              className="movie-poster"
            />
            <div className="movie-info">
              <div className="movie-title">{movie.title}</div>
              <div className="movie-meta">
                <span>⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
                <span>📅 {movie.release_date?.split('-')[0] || 'N/A'}</span>
              </div>
              <p className="movie-overview">
                {movie.overview
                  ? movie.overview.slice(0, 100) + '...'
                  : 'No description available.'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* MOVIE DETAIL MODAL */}
      {selectedMovie && (
        <MovieDetail
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
      {/* FLOATING CHAT BUTTON */}
      <button
        className="chat-float-btn"
        onClick={() => setChatOpen(true)}>
        🤖 Ask AI
      </button>

      {/* MOVIE CHAT */}
      {chatOpen && (
        <MovieChat onClose={() => setChatOpen(false)} />
      )}

    </div>
  );
}

export default App;