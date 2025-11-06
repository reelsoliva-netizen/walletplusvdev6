import React, { useState, useEffect } from 'react';
import type { Subscription, Category } from '../types';
import { TransactionType } from '../types';

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subscription: Subscription) => void;
  categories: Category[];
  editingSubscription: Subscription | null;
}

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({ isOpen, onClose, onSave, categories, editingSubscription }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly' | 'quarterly'>('monthly');
  const [nextPaymentDate, setNextPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');

  const expenseCategories = categories.filter(c => c.type === TransactionType.EXPENSE);

  useEffect(() => {
    if (editingSubscription) {
      setName(editingSubscription.name);
      setAmount(String(editingSubscription.amount));
      setBillingCycle(editingSubscription.billingCycle);
      setNextPaymentDate(new Date(editingSubscription.nextPaymentDate).toISOString().split('T')[0]);
      setCategoryId(editingSubscription.category);
    } else {
      setName('');
      setAmount('');
      setBillingCycle('monthly');
      setNextPaymentDate(new Date().toISOString().split('T')[0]);
      setCategoryId(expenseCategories[0]?.id || '');
    }
  }, [editingSubscription, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subData = {
      name,
      amount: parseFloat(amount),
      billingCycle,
      nextPaymentDate: new Date(nextPaymentDate).toISOString(),
      category: categoryId,
      status: editingSubscription?.status || 'active',
    };
    onSave({ id: editingSubscription?.id || `sub-${Date.now()}`, ...subData });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-md shadow-lg" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-light-900 mb-6">{editingSubscription ? 'Edit' : 'Add'} Subscription</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Subscription Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-dark-700 p-3 rounded-lg" required />
          <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-dark-700 p-3 rounded-lg" required />
          <select value={billingCycle} onChange={e => setBillingCycle(e.target.value as any)} className="w-full bg-dark-700 p-3 rounded-lg">
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="quarterly">Quarterly</option>
          </select>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full bg-dark-700 p-3 rounded-lg" required>
            {expenseCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div>
            <label className="text-sm text-light-800">Next Payment Date</label>
            <input type="date" value={nextPaymentDate} onChange={e => setNextPaymentDate(e.target.value)} className="w-full bg-dark-700 p-3 rounded-lg mt-1" required />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="w-full p-3 bg-dark-700 rounded-lg font-bold">Cancel</button>
            <button type="submit" className="w-full p-3 bg-primary text-dark-900 rounded-lg font-bold">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;
