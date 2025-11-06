import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SettingsProvider } from './contexts/SettingsContext';
import { SecurityProvider } from './contexts/SecurityContext';
import { PrivacyProvider } from './contexts/PrivacyContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <PrivacyProvider>
        <App />
      </PrivacyProvider>
    </SettingsProvider>
  </React.StrictMode>
);

// Register service worker only in production builds
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // ignore registration errors
    });
  });
}
