import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Transaction, Category, Account } from '../types';
import { TransactionType } from '../types';
import PaperclipIcon from './icons/PaperclipIcon';
import TrashIcon from './icons/TrashIcon';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'> | Transaction) => void;
  categories: Category[];
  accounts: Account[];
  editingTransaction?: Transaction | null;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onSave, categories, accounts, editingTransaction }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [isTaxDeductible, setIsTaxDeductible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredCategories = categories.filter(c => c.type === type);

  const resetForm = useCallback(() => {
    setType(TransactionType.EXPENSE);
    setAmount('');
    setDescription('');
    setCategoryId(categories.find(c => c.type === TransactionType.EXPENSE)?.id || '');
    setAccountId(accounts[0]?.id || '');
    setDate(new Date().toISOString().split('T')[0]);
    setReceipt(null);
    setIsTaxDeductible(false);
  }, [categories, accounts]);

  useEffect(() => {
    if (isOpen) {
        if (editingTransaction) {
            setType(editingTransaction.type);
            setAmount(String(editingTransaction.amount));
            setDescription(editingTransaction.description);
            setCategoryId(editingTransaction.categoryId);
            setAccountId(editingTransaction.accountId);
            setDate(new Date(editingTransaction.date).toISOString().split('T')[0]);
            setReceipt(editingTransaction.receiptImage || null);
            setIsTaxDeductible(editingTransaction.isTaxDeductible || false);
        } else {
            resetForm();
        }
    }
  }, [editingTransaction, isOpen, resetForm]);
  
  useEffect(() => {
    if (editingTransaction) return;
    const selectedCategoryIsInvalid = !filteredCategories.some(c => c.id === categoryId);
    if (selectedCategoryIsInvalid) {
        setCategoryId(filteredCategories[0]?.id || '');
    }
  }, [type, categoryId, filteredCategories, editingTransaction]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !categoryId || !accountId) {
      alert('Please fill all required fields');
      return;
    }
    const transactionData = {
      type,
      amount: parseFloat(amount),
      description,
      categoryId,
      accountId,
      date: new Date(date).toISOString(),
      receiptImage: receipt,
      isTaxDeductible,
    };

    if (editingTransaction) {
      onSave({ ...editingTransaction, ...transactionData });
    } else {
      onSave(transactionData);
    }
    onClose();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceipt(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-md shadow-lg" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-light-900 mb-6">{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>

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
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900" required />
          
          <div>
            {!receipt ? (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 p-3 bg-dark-700 rounded-lg text-light-800 hover:text-primary">
                    <PaperclipIcon className="w-5 h-5" />
                    Attach Receipt
                </button>
            ) : (
                <div className="flex items-center justify-between p-2 bg-dark-700 rounded-lg">
                    <p className="text-sm text-light-800 truncate">Receipt attached.</p>
                    <button type="button" onClick={() => setReceipt(null)} className="text-red-500 p-1"><TrashIcon className="w-4 h-4" /></button>
                </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*"/>
          </div>

          <div className="flex items-center gap-2 text-light-800">
            <input type="checkbox" id="tax-deductible" checked={isTaxDeductible} onChange={e => setIsTaxDeductible(e.target.checked)} className="w-4 h-4 rounded text-primary bg-dark-700 border-dark-700 focus:ring-primary"/>
            <label htmlFor="tax-deductible">This is tax-deductible</label>
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

export default AddTransactionModal;