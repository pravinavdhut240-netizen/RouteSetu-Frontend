import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthUserProvider } from './context/AuthUserContext';

document.documentElement.dataset.theme = localStorage.getItem('routesetu-theme') === 'light' ? 'light' : 'dark';

createRoot(document.getElementById('root')).render(<StrictMode><BrowserRouter><AuthUserProvider><App /></AuthUserProvider></BrowserRouter></StrictMode>);
