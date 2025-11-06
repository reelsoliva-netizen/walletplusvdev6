import React, { useState, useEffect } from 'react';
import type { IncomeSource } from '../types';

interface AddIncomeSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (source: IncomeSource) => void;
  editingSource: IncomeSource | null;
}

const AddIncomeSourceModal: React.FC<AddIncomeSourceModalProps> = ({ isOpen, onClose, onSave, editingSource }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<IncomeSource['type']>('Salary');
  const [amount, setAmount] = useState('');
  const [payday, setPayday] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(true);

  useEffect(() => {
    if (editingSource) {
      setName(editingSource.name);
      setType(editingSource.type);
      setAmount(String(editingSource.amount));
      setPayday(new Date(editingSource.payday).toISOString().split('T')[0]);
      setIsRecurring(editingSource.isRecurring);
    } else {
      setName('');
      setType('Salary');
      setAmount('');
      setPayday(new Date().toISOString().split('T')[0]);
      setIsRecurring(true);
    }
  }, [editingSource, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sourceData = {
      name,
      type,
      amount: parseFloat(amount),
      payday: new Date(payday).toISOString(),
      isRecurring,
    };
    onSave({ id: editingSource?.id || `inc-${Date.now()}`, ...sourceData });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-md shadow-lg" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-light-900 mb-6">{editingSource ? 'Edit' : 'Add'} Income Source</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Source Name (e.g. Salary)" value={name} onChange={e => setName(e.target.value)} className="w-full bg-dark-700 p-3 rounded-lg" required />
          <select value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-dark-700 p-3 rounded-lg">
            <option>Salary</option>
            <option>Freelance</option>
            <option>Investment</option>
            <option>Other</option>
          </select>
          <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-dark-700 p-3 rounded-lg" required />
          <div>
            <label className="text-sm text-light-800">Payday / Date Received</label>
            <input type="date" value={payday} onChange={e => setPayday(e.target.value)} className="w-full bg-dark-700 p-3 rounded-lg mt-1" required />
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

export default AddIncomeSourceModal;
