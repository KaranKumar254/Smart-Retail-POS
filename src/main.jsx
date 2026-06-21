import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '18px',
            background: '#ffffff',
            color: '#0f172a',
            boxShadow: '0 18px 45px rgba(15,23,42,0.12)',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
);
