import React, { useState, useMemo } from 'react';
import type { Transaction, Account, Category } from '../types';
import { NavItem } from './BottomNav';
import { TransactionType } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  onNavigate: (item: NavItem) => void;
  onEditTransaction: (transaction: Transaction) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, transactions, accounts, categories, onNavigate, onEditTransaction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { formatCurrency } = useSettings();

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) {
      return { transactions: [], accounts: [], categories: [] };
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    const filteredTransactions = transactions.filter(t => t.description.toLowerCase().includes(lowercasedTerm));
    const filteredAccounts = accounts.filter(a => a.name.toLowerCase().includes(lowercasedTerm));
    const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(lowercasedTerm));
    return { transactions: filteredTransactions, accounts: filteredAccounts, categories: filteredCategories };
  }, [searchTerm, transactions, accounts, categories]);
  
  const hasResults = searchResults.transactions.length > 0 || searchResults.accounts.length > 0 || searchResults.categories.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex flex-col items-center p-4 pt-16" onClick={onClose}>
      <div className="bg-dark-800 rounded-2xl w-full max-w-2xl shadow-lg flex flex-col" onClick={e => e.stopPropagation()}>
        <input
          type="search"
          placeholder="Search transactions, accounts, categories..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-dark-700 text-light-900 rounded-t-2xl p-4 text-lg border-b-2 border-primary focus:outline-none"
          autoFocus
        />
        <div className="max-h-[70vh] overflow-y-auto">
          {searchTerm.trim() && !hasResults && <p className="text-center text-light-800 p-8">No results found.</p>}
          {searchResults.transactions.length > 0 && (
            <div className="p-4">
              <h3 className="text-sm font-bold text-primary uppercase mb-2">Transactions</h3>
              {searchResults.transactions.map(t => (
                <div key={t.id} onClick={() => onEditTransaction(t)} className="p-3 rounded-lg hover:bg-dark-700 cursor-pointer flex justify-between items-center">
                   <div><p className="font-semibold">{t.description}</p><p className="text-xs text-light-800">{new Date(t.date).toLocaleDateString()}</p></div>
                   <p className={`font-bold ${t.type === TransactionType.INCOME ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(t.amount)}</p>
                </div>
              ))}
            </div>
          )}
          {searchResults.accounts.length > 0 && (
            <div className="p-4 border-t border-dark-700">
              <h3 className="text-sm font-bold text-primary uppercase mb-2">Accounts</h3>
              {searchResults.accounts.map(a => (
                <div key={a.id} onClick={() => onNavigate('accounts')} className="p-3 rounded-lg hover:bg-dark-700 cursor-pointer flex justify-between items-center">
                   <p className="font-semibold">{a.name}</p>
                   <p className="font-bold">{formatCurrency(a.balance)}</p>
                </div>
              ))}
            </div>
          )}
           {searchResults.categories.length > 0 && (
            <div className="p-4 border-t border-dark-700">
              <h3 className="text-sm font-bold text-primary uppercase mb-2">Categories</h3>
              {searchResults.categories.map(c => (
                <div key={c.id} className="p-3 rounded-lg flex justify-between items-center">
                   <p className="font-semibold">{c.name}</p>
                   <p className={`text-xs font-bold uppercase ${c.type === TransactionType.INCOME ? 'text-green-400' : 'text-red-400'}`}>{c.type}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;