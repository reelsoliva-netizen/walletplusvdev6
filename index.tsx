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
    {/* Mount SecurityProvider above SettingsProvider so Hide Balances works globally */}
    <SecurityProvider>
      <SettingsProvider>
        <PrivacyProvider>
          <App />
        </PrivacyProvider>
      </SettingsProvider>
    </SecurityProvider>
  </React.StrictMode>
);

// Suppress browser PWA install prompt on startup
window.addEventListener('beforeinstallprompt', (e: Event) => {
  e.preventDefault();
  // Intentionally do not show any prompt. User can install from browser menu.
});

// Block standard browser refresh keys to enhance app-like behavior
window.addEventListener('keydown', (e: KeyboardEvent) => {
  const isCtrl = e.ctrlKey || e.metaKey; // metaKey for Mac
  const key = e.key.toLowerCase();
  if (key === 'f5' || (isCtrl && (key === 'r' || key === 'f5' || key === 'shift'))) {
    e.preventDefault();
  }
});

// Register service worker only in production builds
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // ignore registration errors
    });
  });
}
