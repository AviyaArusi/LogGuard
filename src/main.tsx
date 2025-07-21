import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Mounting LG App...');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', background: '#22c55e', color: 'white', padding: '8px', zIndex: 1000, textAlign: 'center', fontWeight: 'bold' }}>
        LG App Mount Test — If you see this, React is working
      </div>
      <App />
    </div>
  </React.StrictMode>,
) 