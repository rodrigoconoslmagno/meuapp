import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// src/main.tsx
import 'primereact/resources/themes/lara-light-blue/theme.css'; // tema
import 'primereact/resources/primereact.min.css';                // componentes base
import 'primeicons/primeicons.css';                             // ícones
import 'primeflex/primeflex.css';  

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);