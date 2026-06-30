import React from 'react'
import ReactDOM from 'react-dom/client'
import './theme/tokens.css'
import './theme/app.css'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
