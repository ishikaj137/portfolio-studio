import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Set initial theme before React mounts to prevent flash
const saved = localStorage.getItem('ll-theme') || 'dark'
document.documentElement.setAttribute('data-theme', saved)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
