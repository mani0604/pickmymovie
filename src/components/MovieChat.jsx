import { useState, useRef, useEffect } from 'react';

import { GROQ_KEY } from '../config';

function MovieChat({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Namaste! 🎬 I\'m your personal movie guide. Tell me your mood, occasion, or favourite genre and I\'ll recommend the perfect movie for you!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

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
              {
                role: 'system',
                content: `You are PickMyMovie AI — a friendly movie recommendation assistant. 
                You recommend movies based on user's mood, occasion, genre preference, or any criteria they mention.
                Keep responses short, fun and conversational.
                Always recommend 2-3 specific movies with a one line reason for each.
                Use emojis to make it fun. 🎬`
              },
              ...updatedMessages
            ],
            max_tokens: 500,
            temperature: 0.8
          })
        }
      );

      const data = await response.json();
      const aiMessage = {
        role: 'assistant',
        content: data.choices[0].message.content
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      console.log('Chat error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Try again! 😅'
      }]);
    }

    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === 'Enter') sendMessage();
  }

  return (
    <div className="chat-overlay" onClick={onClose}>
      <div className="chat-box" onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className="chat-header">
          <div className="chat-title">
            <span>🤖</span>
            <div>
              <div className="chat-name">Movie AI</div>
              <div className="chat-status">● Online</div>
            </div>
          </div>
          <button className="chat-close" onClick={onClose}>✕</button>
        </div>

        {/* MESSAGES */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}>
              {msg.role === 'assistant' && (
                <div className="ai-avatar">🎬</div>
              )}
              <div className="message-bubble">
                {msg.content.split('\n').map((line, j) => (
                  <p key={j}>{line}</p>
                ))}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message ai-message">
              <div className="ai-avatar">🎬</div>
              <div className="message-bubble typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="chat-input-bar">
          <input
            type="text"
            placeholder="Ask for a movie recommendation..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="chat-input"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="chat-send-btn">
            Send 🚀
          </button>
        </div>

      </div>
    </div>
  );
}

export default MovieChat;