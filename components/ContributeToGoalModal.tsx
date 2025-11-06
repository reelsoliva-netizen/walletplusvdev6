import React, { useState } from 'react';
import type { Goal, Account } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface ContributeToGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goalId: string, amount: number, accountId: string) => void;
  goal: Goal | null;
  accounts: Account[];
}

const ContributeToGoalModal: React.FC<ContributeToGoalModalProps> = ({ isOpen, onClose, onSave, goal, accounts }) => {
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const { formatCurrency } = useSettings();

  if (!isOpen || !goal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contributionAmount = parseFloat(amount);
    if (contributionAmount > 0 && accountId) {
      onSave(goal.id, contributionAmount, accountId);
      setAmount('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-md shadow-lg" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-light-900 mb-2">Contribute to Goal</h2>
        <p className="text-light-800 mb-6">Saving for: <span className="text-primary">{goal.name}</span></p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900" required />
          <select value={accountId} onChange={e => setAccountId(e.target.value)} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900" required>
            <option value="" disabled>From Account</option>
            {accounts.map(a => (<option key={a.id} value={a.id}>{a.name} ({formatCurrency(a.balance)})</option>))}
          </select>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="w-full p-3 bg-dark-700 text-light-900 font-bold rounded-lg">Cancel</button>
            <button type="submit" className="w-full p-3 bg-primary text-dark-900 font-bold rounded-lg">Save Contribution</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributeToGoalModal;