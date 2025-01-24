import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Certifique-se que o ID está correto
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);