import { useState, useEffect } from 'react'
import FileManager from './FileManager'
import './App.css'

function App() {
  const [view, setView] = useState('files') // 'files' or 'health'
  const [health, setHealth] = useState(null)
  const [loadingHealth, setLoadingHealth] = useState(false)
  const [healthError, setHealthError] = useState(null)

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

  useEffect(() => {
    if (view === 'health') {
      fetchHealth()
    }
  }, [view])

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui', background: '#fafafa' }}>
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e0e0e0',
        padding: '0 16px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>prism-lab-145</h1>
        <nav style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setView('files')}
            style={{
              padding: '8px 16px',
              background: view === 'files' ? '#1976d2' : 'transparent',
              color: view === 'files' ? '#fff' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            File Manager
          </button>
          <button
            onClick={() => setView('health')}
            style={{
              padding: '8px 16px',
              background: view === 'health' ? '#1976d2' : 'transparent',
              color: view === 'health' ? '#fff' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Health
          </button>
        </nav>
      </header>

      <main style={{ flex: 1 }}>
        {view === 'files' && <FileManager />}
        {view === 'health' && (
          <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginTop: 0 }}>Backend Health</h2>
            {loadingHealth && <p>Loading...</p>}
            {healthError && <p style={{ color: 'red' }}>Error: {healthError}</p>}
            {health && (
              <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', fontFamily: 'monospace' }}>
                <pre style={{ margin: 0 }}>{JSON.stringify(health, null, 2)}</pre>
              </div>
            )}
            {!loadingHealth && !health && !healthError && (
              <button onClick={fetchHealth} style={{ padding: '8px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Check Health
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
