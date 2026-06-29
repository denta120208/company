import { useEffect } from 'react'

function App() {
  useEffect(() => { window.location.replace('/expired.html') }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{ textAlign: 'center', color: '#888', fontSize: 14 }}>
        Redirecting...
      </div>
    </div>
  )
}

export default App
