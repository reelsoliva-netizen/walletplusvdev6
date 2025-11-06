import React, { useState, useEffect } from 'react';
import type { RecurringTransaction, Category, Account, Transaction } from '../types';
import { TransactionType } from '../types';

interface AddRecurringTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rt: Omit<RecurringTransaction, 'id'> | RecurringTransaction) => void;
  categories: Category[];
  accounts: Account[];
  editingTransaction?: RecurringTransaction | null;
}

const AddRecurringTransactionModal: React.FC<AddRecurringTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  accounts,
  editingTransaction,
}) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  const resetForm = () => {
    setType(TransactionType.EXPENSE);
    setAmount('');
    setDescription('');
    setCategoryId('');
    setAccountId('');
    setFrequency('monthly');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
  };

  useEffect(() => {
    if (isOpen) {
        if (editingTransaction) {
            setType(editingTransaction.transactionDetails.type);
            setAmount(String(editingTransaction.transactionDetails.amount));
            setDescription(editingTransaction.transactionDetails.description);
            setCategoryId(editingTransaction.transactionDetails.categoryId);
            setAccountId(editingTransaction.transactionDetails.accountId);
            setFrequency(editingTransaction.frequency);
            setStartDate(new Date(editingTransaction.startDate).toISOString().split('T')[0]);
            setEndDate(editingTransaction.endDate ? new Date(editingTransaction.endDate).toISOString().split('T')[0] : '');
        } else {
            resetForm();
        }
    }
  }, [editingTransaction, isOpen]);

  const filteredCategories = categories.filter(c => c.type === type);

  useEffect(() => {
    if (!filteredCategories.some(c => c.id === categoryId)) {
      setCategoryId(filteredCategories[0]?.id || '');
    }
  }, [type, categoryId, filteredCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !categoryId || !accountId || !startDate) {
      alert('Please fill all required fields');
      return;
    }

    const transactionDetails = {
      type,
      amount: parseFloat(amount),
      description,
      categoryId,
      accountId,
    };

    const saveData = {
        transactionDetails,
        frequency,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
    }

    if (editingTransaction) {
      onSave({ ...editingTransaction, ...saveData });
    } else {
      onSave(saveData as Omit<RecurringTransaction, 'id'>);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-md shadow-lg" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-light-900 mb-6">{editingTransaction ? 'Edit Recurring Transaction' : 'Add Recurring Transaction'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex bg-dark-700 rounded-full p-1">
            <button type="button" onClick={() => setType(TransactionType.EXPENSE)} className={`w-full py-2 rounded-full font-semibold transition-colors ${type === TransactionType.EXPENSE ? 'bg-red-500 text-dark-900' : 'text-light-800'}`}>Expense</button>
            <button type="button" onClick={() => setType(TransactionType.INCOME)} className={`w-full py-2 rounded-full font-semibold transition-colors ${type === TransactionType.INCOME ? 'bg-green-500 text-dark-900' : 'text-light-800'}`}>Income</button>
          </div>
          
          <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900" required />
          <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900" required />
          
          <div className="grid grid-cols-2 gap-4">
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900" required>
              <option value="" disabled>Category</option>
              {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={accountId} onChange={e => setAccountId(e.target.value)} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900" required>
              <option value="" disabled>Account</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <select value={frequency} onChange={e => setFrequency(e.target.value as any)} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900" required>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-light-800">Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900" required />
            </div>
            <div>
              <label className="text-sm text-light-800">End Date (Optional)</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900" />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="w-full p-3 bg-dark-700 text-light-900 font-bold rounded-lg">Cancel</button>
            <button type="submit" className="w-full p-3 bg-primary text-dark-900 font-bold rounded-lg">{editingTransaction ? 'Update' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecurringTransactionModal;