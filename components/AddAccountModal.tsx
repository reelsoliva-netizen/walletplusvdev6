import React, { useState, useEffect } from 'react';
import type { Account } from '../types';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Omit<Account, 'id'> | Account) => void;
  editingAccount?: Account | null;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose, onSave, editingAccount }) => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [icon, setIcon] = useState('💰');
  const [type, setType] = useState<Account['type']>('Checking');

  useEffect(() => {
    if (isOpen) {
      if (editingAccount) {
        setName(editingAccount.name);
        setBalance(String(editingAccount.balance));
        setIcon(editingAccount.icon);
        setType(editingAccount.type);
      } else {
        setName('');
        setBalance('');
        setIcon('💰');
        setType('Checking');
      }
    }
  }, [editingAccount, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const accountData = {
      name,
      balance: parseFloat(balance),
      icon,
      type,
    };
    if (editingAccount) {
      onSave({ ...editingAccount, ...accountData });
    } else {
      onSave(accountData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-md shadow-lg" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-light-900 mb-6">{editingAccount ? 'Edit Account' : 'Add Account'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Account Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900" required />
          <select value={type} onChange={e => setType(e.target.value as Account['type'])} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900">
            <option value="Checking">Checking</option>
            <option value="Savings">Savings</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Investment">Investment</option>
            <option value="Cash">Cash</option>
          </select>
          <input type="number" step="0.01" placeholder="Current Balance" value={balance} onChange={e => setBalance(e.target.value)} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900" required />
          <input type="text" placeholder="Icon (Emoji)" value={icon} onChange={e => setIcon(e.target.value)} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900" required />
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="w-full p-3 bg-dark-700 text-light-900 font-bold rounded-lg">Cancel</button>
            <button type="submit" className="w-full p-3 bg-primary text-dark-900 font-bold rounded-lg">Save Account</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal;