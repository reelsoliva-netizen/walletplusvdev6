import React, { useState, useMemo } from 'react';
import { currencies } from '../currencies';
import type { Currency } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface CurrencySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CurrencySelectionModal: React.FC<CurrencySelectionModalProps> = ({ isOpen, onClose }) => {
  const { currency, setCurrency } = useSettings();
  const [search, setSearch] = useState('');

  const filteredCurrencies = useMemo(() => {
    const searchTerm = search.toLowerCase();
    return currencies.filter(
      c =>
        c.name.toLowerCase().includes(searchTerm) ||
        c.code.toLowerCase().includes(searchTerm)
    );
  }, [search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-end justify-center p-4" onClick={onClose}>
      <div
        className="bg-dark-800 rounded-t-2xl p-4 w-full max-w-2xl shadow-lg flex flex-col h-[60vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-light-900">Select Currency</h2>
          <button onClick={onClose} className="text-light-800 text-2xl">&times;</button>
        </div>
        <input
          type="text"
          placeholder="Search currencies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 mb-4 focus:ring-primary focus:border-primary flex-shrink-0"
        />
        <div className="flex-grow overflow-y-auto space-y-1">
          {filteredCurrencies.map(c => (
            <button
              key={c.code}
              onClick={() => {
                setCurrency(c);
                onClose();
              }}
              className={`w-full text-left p-3 rounded-md transition-colors flex justify-between items-center ${currency?.code === c.code ? 'bg-primary/20 text-primary' : 'hover:bg-dark-700'} text-light-900`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{c.flag}</span>
                <div>
                  <span className="font-semibold text-light-900">{c.name}</span>
                  <span className="text-sm text-light-700 ml-2">{c.code}</span>
                </div>
              </div>
              {currency?.code === c.code && <CheckCircleIcon className="w-5 h-5 text-primary" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrencySelectionModal;
