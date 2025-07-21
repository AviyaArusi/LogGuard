import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Mounting LG App...');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <App />
    </div>
  </React.StrictMode>,
) 