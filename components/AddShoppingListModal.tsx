import React, { useState } from 'react';
import type { ShoppingList } from '../types';

interface AddShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (listData: Omit<ShoppingList, 'id'|'items'|'status'|'createdDate'|'updatedDate'|'isPaid'>) => void;
}

const AddShoppingListModal: React.FC<AddShoppingListModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [store, setStore] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [reminderDate, setReminderDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onSave({
      name,
      store,
      category,
      budgetLimit: budgetLimit ? parseFloat(budgetLimit) : undefined,
      reminderDate: reminderDate || undefined,
    });
    onClose();
    setName('');
    setStore('');
    setBudgetLimit('');
    setReminderDate('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-md shadow-lg" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-light-900 mb-6">New Shopping List</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="List Name (e.g. Weekly Groceries)" value={name} onChange={e => setName(e.target.value)} className="w-full bg-dark-700 rounded-lg p-3" required />
          <input type="text" placeholder="Store (e.g. Walmart)" value={store} onChange={e => setStore(e.target.value)} className="w-full bg-dark-700 rounded-lg p-3" />
          <input type="number" placeholder="Budget Limit (Optional)" value={budgetLimit} onChange={e => setBudgetLimit(e.target.value)} className="w-full bg-dark-700 rounded-lg p-3" />
          <div>
            <label className="text-sm text-light-800">Reminder (Optional)</label>
            <input type="date" value={reminderDate} onChange={e => setReminderDate(e.target.value)} className="w-full bg-dark-700 rounded-lg p-3 mt-1" />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="w-full p-3 bg-dark-700 rounded-lg font-bold">Cancel</button>
            <button type="submit" className="w-full p-3 bg-primary text-dark-900 rounded-lg font-bold">Create List</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShoppingListModal;
