import React, { useState, useMemo } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { currencies } from '../currencies';
import type { Currency } from '../types';
import Logo from '../components/icons/Logo';

const CurrencySetupScreen: React.FC = () => {
  const { setCurrency } = useSettings();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Currency | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const filteredCurrencies = useMemo(() => {
    const searchTerm = search.toLowerCase();
    return currencies.filter(
      c =>
        c.name.toLowerCase().includes(searchTerm) ||
        c.code.toLowerCase().includes(searchTerm) ||
        c.symbol.includes(searchTerm)
    );
  }, [search]);
  
  const handleSelect = (currency: Currency) => {
      setSelected(currency);
  }

  const handleConfirm = () => {
    if (selected) {
      setCurrency(selected);
    }
  };

  if (showWelcome) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 z-[100] flex flex-col items-center justify-center p-6 text-light-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10 w-full max-w-lg text-center animate-fade-in">
          <div className="mb-8 animate-scale-up">
            <Logo className="w-32 h-32 mx-auto drop-shadow-2xl" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-slide-down">
            <span className="text-light-900">Wallet</span>
            <span className="text-primary">+</span>
          </h1>
          
          <p className="text-xl text-light-800 mb-12 animate-slide-down" style={{animationDelay: '0.2s'}}>
            Your Complete Financial Companion
          </p>

          <div className="space-y-4 mb-12 text-left max-w-md mx-auto">
            <div className="flex items-start gap-4 p-4 bg-dark-800/50 backdrop-blur rounded-xl animate-slide-down" style={{animationDelay: '0.3s'}}>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary text-2xl">💰</span>
              </div>
              <div>
                <h3 className="font-bold text-light-900 mb-1">Track Expenses</h3>
                <p className="text-sm text-light-800">Monitor every transaction and stay on budget</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-dark-800/50 backdrop-blur rounded-xl animate-slide-down" style={{animationDelay: '0.4s'}}>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="font-bold text-light-900 mb-1">Set Goals</h3>
                <p className="text-sm text-light-800">Achieve your financial dreams with smart planning</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-dark-800/50 backdrop-blur rounded-xl animate-slide-down" style={{animationDelay: '0.5s'}}>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary text-2xl">🔒</span>
              </div>
              <div>
                <h3 className="font-bold text-light-900 mb-1">100% Private</h3>
                <p className="text-sm text-light-800">Your data stays on your device, never sent anywhere</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-dark-800/50 backdrop-blur rounded-xl animate-slide-down" style={{animationDelay: '0.6s'}}>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary text-2xl">📱</span>
              </div>
              <div>
                <h3 className="font-bold text-light-900 mb-1">Works Offline</h3>
                <p className="text-sm text-light-800">Full functionality even without internet connection</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowWelcome(false)}
            className="w-full max-w-md mx-auto p-4 bg-primary hover:bg-primary/90 text-dark-900 font-bold rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg shadow-primary/50 animate-slide-down"
            style={{animationDelay: '0.7s'}}
          >
            Get Started →
          </button>

          <p className="text-xs text-light-800 mt-6 opacity-70">
            No signup required • Free forever • No ads
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-dark-900 z-[100] flex flex-col items-center justify-center p-4 text-light-900 animate-fade-in">
        <div className="w-full max-w-md text-center">
            <Logo className="w-20 h-20 mx-auto mb-6 animate-scale-up" />
            <h1 className="text-4xl font-bold text-primary mb-2 animate-slide-down">Choose Your Currency</h1>
            <p className="text-light-800 mb-8 animate-slide-down" style={{animationDelay: '0.1s'}}>Select your primary currency to personalize your experience</p>

            <input
                type="text"
                placeholder="🔍 Search for a currency..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-dark-800 border-dark-700 border-2 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
            />
        </div>
        
        <div className="w-full max-w-md h-1/2 overflow-y-auto bg-dark-800 rounded-lg p-2 space-y-1 custom-scrollbar">
            {filteredCurrencies.map((c, index) => (
                <button
                    key={c.code}
                    onClick={() => handleSelect(c)}
                    className={`w-full text-left p-3 rounded-md transition-all flex justify-between items-center animate-slide-down ${selected?.code === c.code ? 'bg-primary text-dark-900 shadow-lg' : 'hover:bg-dark-700'}`}
                    style={{animationDelay: `${index * 0.02}s`}}
                >
                    <div>
                        <span className="font-bold">{c.name}</span>
                        <span className="text-sm opacity-70 ml-2">{c.code}</span>
                    </div>
                    <span className="text-2xl font-mono">{c.symbol}</span>
                </button>
            ))}
        </div>

        <button
            onClick={handleConfirm}
            disabled={!selected}
            className="w-full max-w-md mt-8 p-4 bg-primary text-dark-900 font-bold rounded-lg text-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all transform hover:scale-105 enabled:shadow-lg enabled:shadow-primary/50"
        >
            {selected ? `Continue with ${selected.code} ${selected.symbol}` : 'Select a currency to continue'}
        </button>
    </div>
  );
};

export default CurrencySetupScreen;