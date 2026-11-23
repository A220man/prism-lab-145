import { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:8000/api'

function AIChat({ onMessage }) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed) return
    
    setInput('')
    setHistory(prev => [...prev, { role: 'user', content: trimmed }])
    
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed })
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.detail || 'API error')
      
      setHistory(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (err) {
      setHistory(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }])
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div style={{ 
      borderTop: '1px solid #e2e8f0', 
      padding: '1rem',
      background: '#f8fafc',
    }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask AI assistant..."
          style={{ 
            flex: 1, padding: '0.5rem', border: '1px solid #cbd5e0',
            borderRadius: '4px', fontSize: '0.875rem'
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '0.5rem 1rem', 
            background: '#3182ce', color: 'white',
            border: 'none', borderRadius: '4px', cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          Send
        </button>
      </div>
      <div style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '0.875rem' }}>
        {history.map((msg, i) => (
          <div key={i} style={{ 
            marginBottom: '0.5rem', 
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            background: msg.role === 'user' ? '#ebf8ff' : '#f1f8e9'
          }}>
            <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong> {msg.content}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AIChat
