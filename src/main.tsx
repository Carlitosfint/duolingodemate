import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', background: '#ff0055', color: 'white', textAlign: 'center', zIndex: 9999, padding: '10px', fontWeight: 'bold', pointerEvents: 'none' }}>
      🚀 ¡Hola! Aquí Persona 2 haciendo un cambio visible.
    </div>
    <App />
  </StrictMode>,
);
