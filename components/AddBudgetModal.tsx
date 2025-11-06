import React, { useState } from 'react';
import type { Budget, Category } from '../types';

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: Omit<Budget, 'id'>) => void;
  expenseCategories: Category[];
}

const AddBudgetModal: React.FC<AddBudgetModalProps> = ({ isOpen, onClose, onSave, expenseCategories }) => {
  const [categoryId, setCategoryId] = useState(expenseCategories[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryId && amount && month) {
      onSave({ categoryId, amount: parseFloat(amount), month });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-md shadow-lg" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-light-900 mb-6">Add Budget</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900" required>
            <option value="" disabled>Select Category</option>
            {expenseCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="number" placeholder="Budget Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900" required />
          <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900" required />
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="w-full p-3 bg-dark-700 text-light-900 font-bold rounded-lg">Cancel</button>
            <button type="submit" className="w-full p-3 bg-primary text-dark-900 font-bold rounded-lg">Save Budget</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudgetModal;