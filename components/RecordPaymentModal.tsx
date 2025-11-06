import React, { useState } from 'react';
import type { Debt, Account } from '../types';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (debtId: string, amount: number, accountId: string, date: string) => void;
  debt: Debt | null;
  accounts: Account[];
}

const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({ isOpen, onClose, onSave, debt, accounts }) => {
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debt || !amount || !accountId) return;
    onSave(debt.id, parseFloat(amount), accountId, date);
    onClose();
    setAmount('');
  };

  if (!isOpen || !debt) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-md shadow-lg" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-light-900 mb-6">Record Payment for {debt.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="number" placeholder={`Amount (Min: ${debt.minimumPayment})`} value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-dark-700 rounded-lg p-3" required />
          <select value={accountId} onChange={e => setAccountId(e.target.value)} className="w-full bg-dark-700 rounded-lg p-3" required>
            <option value="" disabled>Select Account</option>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-dark-700 rounded-lg p-3" required />
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="w-full p-3 bg-dark-700 rounded-lg font-bold">Cancel</button>
            <button type="submit" className="w-full p-3 bg-primary text-dark-900 rounded-lg font-bold">Record Payment</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordPaymentModal;
