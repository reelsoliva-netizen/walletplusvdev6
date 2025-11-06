import React, { useState, useEffect } from 'react';
import type { Category } from '../types';
import { TransactionType } from '../types';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, 'id'> | Category) => void;
  editingCategory?: Category | null;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onSave, editingCategory }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [icon, setIcon] = useState('💰');
  const [color, setColor] = useState('#ef4444');

  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        setName(editingCategory.name);
        setType(editingCategory.type);
        setIcon(editingCategory.icon);
        setColor(editingCategory.color);
      } else {
        setName('');
        setType(TransactionType.EXPENSE);
        setIcon('💰');
        setColor('#ef4444');
      }
    }
  }, [editingCategory, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryData = {
      name,
      type,
      icon,
      color,
    };
    if (editingCategory) {
      onSave({ ...editingCategory, ...categoryData });
    } else {
      onSave(categoryData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-md shadow-lg" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-light-900 mb-6">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Category Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900" required />
          <select value={type} onChange={e => setType(e.target.value as TransactionType)} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900">
            <option value={TransactionType.EXPENSE}>Expense</option>
            <option value={TransactionType.INCOME}>Income</option>
          </select>
          <div className="flex gap-4">
            <input type="text" placeholder="Icon (Emoji)" value={icon} onChange={e => setIcon(e.target.value)} className="w-1/2 bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900" required />
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-1/2 bg-dark-700 border-dark-700 border-2 rounded-lg p-1 h-12 focus:ring-primary focus:border-primary" />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="w-full p-3 bg-dark-700 text-light-900 font-bold rounded-lg">Cancel</button>
            <button type="submit" className="w-full p-3 bg-primary text-dark-900 font-bold rounded-lg">Save Category</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;