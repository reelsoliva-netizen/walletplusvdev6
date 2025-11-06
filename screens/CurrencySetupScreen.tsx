import React, { useState, useMemo } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { currencies } from '../currencies';
import type { Currency } from '../types';
import Logo from '../components/icons/Logo';

const CurrencySetupScreen: React.FC = () => {
  const { setCurrency } = useSettings();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Currency | null>(null);

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

  return (
    <div className="fixed inset-0 bg-dark-900 z-[100] flex flex-col items-center justify-center p-4 text-light-900">
        <div className="w-full max-w-md text-center">
            <Logo className="w-24 h-24 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-primary mb-2">Welcome to Wallet+</h1>
            <p className="text-light-800 mb-8">Please select your primary currency to get started.</p>

            <input
                type="text"
                placeholder="Search for a currency..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-dark-800 border-dark-700 border-2 rounded-lg p-3 mb-4 focus:ring-primary focus:border-primary"
            />
        </div>
        
        <div className="w-full max-w-md h-1/2 overflow-y-auto bg-dark-800 rounded-lg p-2 space-y-1">
            {filteredCurrencies.map(c => (
                <button
                    key={c.code}
                    onClick={() => handleSelect(c)}
                    className={`w-full text-left p-3 rounded-md transition-colors flex justify-between items-center ${selected?.code === c.code ? 'bg-primary text-dark-900' : 'hover:bg-dark-700'}`}
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
            className="w-full max-w-md mt-8 p-4 bg-primary text-dark-900 font-bold rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
            Confirm & Start
        </button>
    </div>
  );
};

export default CurrencySetupScreen;