import React, { useState } from 'react';
import type { EmergencyFund, Account } from '../types';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import { useSettings } from '../contexts/SettingsContext';

interface EmergencyFundScreenProps {
  emergencyFund: EmergencyFund;
  accounts: Account[];
  onUpdateGoal: (newGoal: number) => void;
  onContribute: (amount: number, accountId: string) => void;
}

const EmergencyFundScreen: React.FC<EmergencyFundScreenProps> = ({ emergencyFund, accounts, onUpdateGoal, onContribute }) => {
  const [contributionAmount, setContributionAmount] = useState('');
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id || '');
  const { formatCurrency } = useSettings();

  const progress = Math.min(100, (emergencyFund.current / emergencyFund.goal) * 100);
  const isFunded = progress >= 100;

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(contributionAmount);
    if (amount > 0 && fromAccountId) {
      onContribute(amount, fromAccountId);
      setContributionAmount('');
    }
  };

  return (
    <div className="p-4 text-light-900">
      <h1 className="text-2xl font-bold mb-6">Emergency Fund</h1>

      <div className={`p-5 rounded-2xl shadow-lg mb-6 ${isFunded ? 'bg-green-500/20' : 'bg-dark-700'}`}>
        <div className="flex justify-between items-start">
            <div>
                <p className={`font-semibold mb-2 ${isFunded ? 'text-green-400' : 'text-light-900'}`}>{isFunded ? 'Fully Funded!' : 'Your Safety Net'}</p>
                <p className="text-sm text-light-800">3-6 months of living expenses</p>
            </div>
            {isFunded && <CheckCircleIcon className="w-8 h-8 text-green-400" />}
        </div>
        <div className="w-full bg-dark-800 rounded-full h-2.5 my-3"><div className={`${isFunded ? 'bg-green-500' : 'bg-primary'} h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div></div>
        <div className="flex justify-between text-sm text-light-800">
            <span>{formatCurrency(emergencyFund.current)}</span>
            <span>{formatCurrency(emergencyFund.goal)}</span>
        </div>
      </div>

      <div className="bg-dark-700 p-5 rounded-2xl">
        <h2 className="text-xl font-bold mb-4">Contribute</h2>
        <form onSubmit={handleContribute} className="space-y-4">
          <input type="number" placeholder="Amount" value={contributionAmount} onChange={e => setContributionAmount(e.target.value)} className="w-full bg-dark-800 p-3 rounded-lg" required/>
          <select value={fromAccountId} onChange={e => setFromAccountId(e.target.value)} className="w-full bg-dark-800 p-3 rounded-lg" required>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <button type="submit" className="w-full p-3 bg-primary text-dark-900 rounded-lg font-bold">Add to Fund</button>
        </form>
      </div>

    </div>
  );
};

export default EmergencyFundScreen;