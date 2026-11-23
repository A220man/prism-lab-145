import { useState, useEffect } from 'react'
import FileManager from './FileManager'
import AIChat from './AIChat'
import './App.css'

function App() {
  const [view, setView] = useState('files') // 'files' or 'health'
  const [health, setHealth] = useState(null)
  const [loadingHealth, setLoadingHealth] = useState(false)
  const [healthError, setHealthError] = useState(null)
  const [aiChatOpen, setAiChatOpen] = useState(false)
  const [aiMessages, setAiMessages] = useState([])

  const fetchHealth = async () => {
    setLoadingHealth(true)
    setHealthError(null)
    try {
      const res = await fetch('http://localhost:8000/api/health')
      const data = await res.json()
      setHealth(data)
    } catch (err) {
      setHealthError(err.message)
    } finally {
      setLoadingHealth(false)
    }
  }

  const handleAiSend = async (message) => {
    setAiMessages(prev => [...prev, { role: 'user', content: message }])
    
    try {
      const res = await fetch('http://localhost:8000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.detail || 'API error')
      
      setAiMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (err) {
      setAiMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }])
    }
  }

  useEffect(() => {
    if (view === 'health') {
      fetchHealth()
    }
  }, [view])

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui', background: '#fafafa' }}>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 1.5rem', background: '#ffffff', borderBottom: '1px solid #e2e8f0',
      }}>
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>prism-lab-145</h1>
        <nav style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setView('health')}
            style={{
              padding: '0.5rem 1rem', background: view === 'health' ? '#3182ce' : 'transparent',
              color: view === 'health' ? 'white' : '#4a5568', border: 'none',
              borderRadius: '4px', cursor: 'pointer', fontSize: '14px'
            }}
          >Health</button>
          <button
            onClick={() => setAiChatOpen(true)}
            style={{
              padding: '0.5rem 1rem', background: 'transparent', color: '#2d3748',
              border: '1px solid #cbd5e0', borderRadius: '4px', cursor: 'pointer',
              fontSize: '14px'
            }}
          >AI</button>
        </nav>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {view === 'files' && <FileManager />}
        {view === 'health' && (
          <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Health Check</h2>
            {loadingHealth && <p>Loading...</p>}
            {healthError && <p style={{ color: '#e53e3e' }}>Error: {healthError}</p>}
            {health && <p>{JSON.stringify(health)}</p>}
          </div>
        )}

        {/* AI Chat overlay */}
        {aiChatOpen && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column', zIndex: 1000,
          }}>
            <div style={{ padding: '1rem', background: '#fff', borderRadius: '8px 8px 0 0' }}>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>AI Coding Assistant</h3>
              <button
                onClick={() => setAiChatOpen(false)}
                style={{
                  position: 'absolute', right: '0', top: 0, bottom: 0,
                  padding: '0 0.5rem', background: 'transparent', border: 'none',
                  fontSize: '1.2rem', cursor: 'pointer', color: '#718096'
                }}
              >&times;</button>
            </div>
            <AIChat onMessage={handleAiSend} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
