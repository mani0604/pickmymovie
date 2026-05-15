import { useState } from 'react';

import { GROQ_KEY } from '../config';

function AIAnalysis({ movie }) {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function analyzeMovie() {
    setLoading(true);
    setAnalysis('');

    const prompt = `Analyze this movie for someone deciding to watch it:

Movie: ${movie.title} (${movie.release_date?.split('-')[0]})
Rating: ${movie.vote_average}/10
Overview: ${movie.overview}

Give me in this exact format:
🎭 Mood: (2-3 words describing the feeling)
🎯 Themes: (main themes, comma separated)
⭐ Hidden Gem: (one interesting detail or fact)
🎬 You'll also love: (3 similar movies, one per line with →)
💬 One line review: (honest one line review)

Keep it short, fun and helpful. No long paragraphs.`;

    try {
      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_KEY}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'user', content: prompt }
            ],
            max_tokens: 500,
            temperature: 0.7
          })
        }
      );

      const data = await response.json();
      console.log('Groq response:', data);

      if (data.error) {
        setAnalysis(`Error: ${data.error.message}`);
        setLoading(false);
        return;
      }

      const text = data.choices[0].message.content;
      setAnalysis(text);
      setDone(true);

    } catch (err) {
      console.log('Groq error:', err);
      setAnalysis('Could not analyze. Try again!');
    }

    setLoading(false);
  }

  return (
    <div className="ai-section">
      <div className="ai-header">
        <span>🤖 AI Analysis</span>
        {!done && (
          <button
            className="ai-btn"
            onClick={analyzeMovie}
            disabled={loading}>
            {loading ? 'Analyzing... ✨' : 'Analyze This Movie'}
          </button>
        )}
      </div>

      {loading && (
        <div className="ai-loading">
          <div className="ai-dots">
            <span></span><span></span><span></span>
          </div>
          <p>AI is watching the movie... 🎬</p>
        </div>
      )}

      {analysis && (
        <div className="ai-result">
          {analysis.split('\n').map((line, i) => (
            line.trim() && (
              <p key={i} className={line.startsWith('🎬') ? 'ai-rec' : 'ai-line'}>
                {line}
              </p>
            )
          ))}
        </div>
      )}
    </div>
  );
}

export default AIAnalysis;