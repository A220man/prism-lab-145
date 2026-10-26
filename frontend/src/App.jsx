import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/health')
      .then(res => res.json())
      .then(data => {
        setHealth(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>prism-lab-145</h1>
      <div style={{ marginTop: '1rem' }}>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {health && (
          <div style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '4px' }}>
            <h2>Backend Health</h2>
            <pre>{JSON.stringify(health, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
