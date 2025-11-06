import React, { useState, useEffect } from 'react';
import type { Bill, Category } from '../types';
import { TransactionType } from '../types';

interface AddBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bill: Bill) => void;
  categories: Category[];
  editingBill: Bill | null;
}

const AddBillModal: React.FC<AddBillModalProps> = ({ isOpen, onClose, onSave, categories, editingBill }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [reminderDays, setReminderDays] = useState<number | undefined>(undefined);

  const expenseCategories = categories.filter(c => c.type === TransactionType.EXPENSE);

  useEffect(() => {
    if (editingBill) {
      setName(editingBill.name);
      setAmount(String(editingBill.amount));
      setDueDate(new Date(editingBill.dueDate).toISOString().split('T')[0]);
      setCategoryId(editingBill.category);
      setIsRecurring(editingBill.isRecurring);
      setReminderDays(editingBill.reminderDays);
    } else {
      setName('');
      setAmount('');
      setDueDate(new Date().toISOString().split('T')[0]);
      setCategoryId(expenseCategories[0]?.id || '');
      setIsRecurring(false);
      setReminderDays(undefined);
    }
  }, [editingBill, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const billData = {
      name,
      amount: parseFloat(amount),
      dueDate: new Date(dueDate).toISOString(),
      category: categoryId,
      isRecurring,
      status: editingBill?.status || 'unpaid',
      reminderDays: reminderDays,
    };
    onSave({ id: editingBill?.id || `bill-${Date.now()}`, ...billData });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-md shadow-lg" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-light-900 mb-6">{editingBill ? 'Edit' : 'Add'} Bill</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Bill Name (e.g. Electricity)" value={name} onChange={e => setName(e.target.value)} className="w-full bg-dark-700 p-3 rounded-lg" required />
          <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-dark-700 p-3 rounded-lg" required />
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full bg-dark-700 p-3 rounded-lg" required>
            {expenseCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div>
            <label className="text-sm text-light-800">Due Date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-dark-700 p-3 rounded-lg mt-1" required />
          </div>
          <select value={reminderDays === undefined ? 'none' : reminderDays} onChange={e => setReminderDays(e.target.value === 'none' ? undefined : Number(e.target.value))} className="w-full bg-dark-700 p-3 rounded-lg">
            <option value="none">No Reminder</option>
            <option value="1">1 Day Before</option>
            <option value="3">3 Days Before</option>
            <option value="7">7 Days Before</option>
          </select>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is-recurring" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} />
            <label htmlFor="is-recurring">Is this a recurring bill?</label>
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

export default AddBillModal;