import React, { useState, useEffect } from 'react';
import type { Goal } from '../types';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Omit<Goal, 'id'> | Goal) => void;
  editingGoal?: Goal | null;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose, onSave, editingGoal }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Savings');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  const resetForm = () => {
    setName('');
    setCategory('Savings');
    setTargetAmount('');
    setDeadline('');
  };

  useEffect(() => {
    if (isOpen) {
      if (editingGoal) {
        setName(editingGoal.name);
        setCategory(editingGoal.category);
        setTargetAmount(String(editingGoal.targetAmount));
        setDeadline(new Date(editingGoal.deadline).toISOString().split('T')[0]);
      } else {
        resetForm();
      }
    }
  }, [editingGoal, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !deadline) {
      alert('Please fill all required fields');
      return;
    }
    const goalData = {
      name,
      category,
      targetAmount: parseFloat(targetAmount),
      deadline: new Date(deadline).toISOString(),
    };

    if (editingGoal) {
      onSave({ ...editingGoal, ...goalData });
    } else {
      // FIX: Add missing properties `currentAmount` and `startDate` to satisfy the Omit<Goal, 'id'> type.
      onSave({
        ...goalData,
        currentAmount: 0,
        startDate: new Date().toISOString(),
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-md shadow-lg" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-light-900 mb-6">{editingGoal ? 'Edit Savings Goal' : 'Add Savings Goal'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Goal Name (e.g., Vacation to Hawaii)" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="w-full bg-dark-700 border border-light-800/20 p-3 rounded-lg text-light-900 placeholder-light-800/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
            required 
          />
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)} 
            className="w-full bg-dark-700 border border-light-800/20 p-3 rounded-lg text-light-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          >
            <option value="Savings">Savings</option>
            <option value="Travel">Travel</option>
            <option value="Emergency Fund">Emergency Fund</option>
            <option value="Education">Education</option>
            <option value="Home">Home</option>
            <option value="Car">Car</option>
            <option value="Investment">Investment</option>
            <option value="Other">Other</option>
          </select>
          <input 
            type="number" 
            placeholder="Target Amount" 
            value={targetAmount} 
            onChange={e => setTargetAmount(e.target.value)} 
            className="w-full bg-dark-700 border border-light-800/20 p-3 rounded-lg text-light-900 placeholder-light-800/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
            required 
          />
          <div>
            <label htmlFor="deadline" className="block text-sm text-light-800 mb-2 font-medium">Deadline</label>
            <input 
              id="deadline" 
              type="date" 
              value={deadline} 
              onChange={e => setDeadline(e.target.value)} 
              className="w-full bg-dark-700 border border-light-800/20 p-3 rounded-lg text-light-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
              required 
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="w-full p-3 bg-dark-700 text-light-900 font-bold rounded-lg">Cancel</button>
            <button type="submit" className="w-full p-3 bg-primary text-dark-900 font-bold rounded-lg">{editingGoal ? 'Update' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalModal;