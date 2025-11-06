import React, { useState, useEffect } from 'react';
import type { Debt } from '../types';

interface AddDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (debt: Debt) => void;
  editingDebt: Debt | null;
}

const AddDebtModal: React.FC<AddDebtModalProps> = ({ isOpen, onClose, onSave, editingDebt }) => {
  const [name, setName] = useState('');
  // FIX: Broaden the type to match the Debt interface to fix type error.
  const [type, setType] = useState<Debt['type']>('Loan');
  const [creditorName, setCreditorName] = useState('');
  const [originalAmount, setOriginalAmount] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [minimumPayment, setMinimumPayment] = useState('');
  const [dueDateDay, setDueDateDay] = useState('1');

  useEffect(() => {
    if (editingDebt) {
        setName(editingDebt.name);
        setType(editingDebt.type);
        setCreditorName(editingDebt.creditorName);
        setOriginalAmount(String(editingDebt.originalAmount));
        setCurrentBalance(String(editingDebt.currentBalance));
        setInterestRate(String(editingDebt.interestRate));
        setMinimumPayment(String(editingDebt.minimumPayment));
        setDueDateDay(String(editingDebt.dueDateDay));
    } else {
        // reset form
        setName(''); setType('Loan'); setCreditorName(''); setOriginalAmount(''); setCurrentBalance(''); setInterestRate(''); setMinimumPayment(''); setDueDateDay('1');
    }
  }, [editingDebt, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const debtData = {
        name, type, creditorName, 
        originalAmount: parseFloat(originalAmount),
        currentBalance: parseFloat(currentBalance),
        interestRate: parseFloat(interestRate),
        minimumPayment: parseFloat(minimumPayment),
        dueDateDay: parseInt(dueDateDay),
        startDate: editingDebt?.startDate || new Date().toISOString(),
        status: editingDebt?.status || 'Active',
        paymentHistory: editingDebt?.paymentHistory || [],
    };
    onSave({ id: editingDebt?.id || `debt-${Date.now()}`, ...debtData });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-md shadow-lg" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-light-900 mb-6">{editingDebt ? 'Edit Debt' : 'Add New Debt'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Debt Name (e.g. Car Loan)" value={name} onChange={e => setName(e.target.value)} className="w-full bg-dark-700 rounded-lg p-3" required />
          <input type="text" placeholder="Creditor (e.g. Bank of America)" value={creditorName} onChange={e => setCreditorName(e.target.value)} className="w-full bg-dark-700 rounded-lg p-3" required />
          {/* FIX: Add select input for debt type. */}
          <select value={type} onChange={e => setType(e.target.value as Debt['type'])} className="w-full bg-dark-700 rounded-lg p-3">
            <option value="Loan">Loan</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Medical">Medical</option>
            <option value="Family Loan">Family Loan</option>
            <option value="Other">Other</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Original Amount" value={originalAmount} onChange={e => setOriginalAmount(e.target.value)} className="w-full bg-dark-700 rounded-lg p-3" required />
            <input type="number" placeholder="Current Balance" value={currentBalance} onChange={e => setCurrentBalance(e.target.value)} className="w-full bg-dark-700 rounded-lg p-3" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" step="0.01" placeholder="Interest Rate (APR %)" value={interestRate} onChange={e => setInterestRate(e.target.value)} className="w-full bg-dark-700 rounded-lg p-3" required />
            <input type="number" placeholder="Minimum Payment" value={minimumPayment} onChange={e => setMinimumPayment(e.target.value)} className="w-full bg-dark-700 rounded-lg p-3" required />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="w-full p-3 bg-dark-700 rounded-lg font-bold">Cancel</button>
            <button type="submit" className="w-full p-3 bg-primary text-dark-900 rounded-lg font-bold">Save Debt</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDebtModal;
