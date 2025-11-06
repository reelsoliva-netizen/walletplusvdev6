import React, { useState, useMemo } from 'react';
import type { ShoppingList, ShoppingItem, Transaction, Account, Category } from '../types';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import { TransactionType } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface ShoppingListDetailProps {
  list: ShoppingList;
  onBack: () => void;
  onSave: (list: ShoppingList) => void;
  accounts: Account[];
  onSaveTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  categories: Category[];
}

const ShoppingListDetail: React.FC<ShoppingListDetailProps> = ({ list, onBack, onSave, accounts, onSaveTransaction, categories }) => {
  const [newItemName, setNewItemName] = useState('');
  const [items, setItems] = useState<ShoppingItem[]>(list.items);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const { formatCurrency } = useSettings();
  
  const totalCost = useMemo(() => items.reduce((sum, item) => sum + (item.pricePerUnit || 0) * item.quantity, 0), [items]);
  const purchasedCost = useMemo(() => items.filter(i => i.isPurchased).reduce((sum, item) => sum + (item.purchasedPrice || item.pricePerUnit || 0) * item.quantity, 0), [items]);

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const newItem: ShoppingItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      quantity: 1,
      unit: 'pcs',
      pricePerUnit: 0,
      category: 'General',
      notes: '',
      isPurchased: false,
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    onSave({ ...list, items: updatedItems });
    setNewItemName('');
  };
  
  const handleUpdateItem = (updatedItem: ShoppingItem) => {
    const updatedItems = items.map(item => item.id === updatedItem.id ? updatedItem : item);
    setItems(updatedItems);
    onSave({ ...list, items: updatedItems });
  };
  
  const handleDeleteItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    onSave({ ...list, items: updatedItems });
  };
  
  const handleCompleteList = (accountId: string, categoryId: string) => {
    // 1. Create transaction
    const transaction: Omit<Transaction, 'id'> = {
        amount: purchasedCost,
        accountId,
        categoryId,
        date: new Date().toISOString(),
        description: `Shopping: ${list.name}`,
        type: TransactionType.EXPENSE,
    };
    onSaveTransaction(transaction);
    // 2. Update list status
    onSave({ ...list, status: 'completed', completionDate: new Date().toISOString(), isPaid: true });
    setShowCompleteModal(false);
    onBack();
  };

  const ItemRow: React.FC<{item: ShoppingItem}> = ({item}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(item);

    if (isEditing) {
        return (
            <div className="bg-dark-800 p-2 rounded-lg space-y-2">
                <input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full bg-dark-700 p-1 rounded" />
                <div className="flex gap-2">
                    <input type="number" value={editData.quantity} onChange={e => setEditData({...editData, quantity: parseFloat(e.target.value) || 1})} className="w-1/3 bg-dark-700 p-1 rounded" />
                    <input value={editData.pricePerUnit} onChange={e => setEditData({...editData, pricePerUnit: parseFloat(e.target.value) || 0})} className="w-2/3 bg-dark-700 p-1 rounded" placeholder="Price"/>
                </div>
                <button onClick={() => { handleUpdateItem(editData); setIsEditing(false); }} className="w-full bg-primary text-dark-900 text-sm p-1 rounded">Save</button>
            </div>
        )
    }

    return (
        <div className="flex items-center p-3 hover:bg-dark-800 rounded-lg">
            <input type="checkbox" checked={item.isPurchased} onChange={(e) => handleUpdateItem({...item, isPurchased: e.target.checked})} className="w-5 h-5 rounded bg-dark-900 border-dark-700 text-primary focus:ring-primary mr-4"/>
            <div className="flex-grow" onClick={() => setIsEditing(true)}>
                <p className={`font-semibold ${item.isPurchased ? 'line-through text-light-800' : ''}`}>{item.name}</p>
                <p className="text-xs text-light-800">{item.quantity} {item.unit} &bull; <span>{formatCurrency(item.pricePerUnit)}</span></p>
            </div>
            <button onClick={() => handleDeleteItem(item.id)} className="text-light-800 hover:text-red-500 ml-4"><TrashIcon className="w-4 h-4" /></button>
        </div>
    )
  }

  const CompleteListModal = () => (
    <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center p-4">
        <div className="bg-dark-800 rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Complete Shopping Trip</h2>
            <p className="mb-4 text-light-800">Create a single expense transaction for this shopping list for a total of <span className="font-bold text-primary">{formatCurrency(purchasedCost)}</span>.</p>
            <div className="space-y-4">
                <select id="account-select" className="w-full bg-dark-700 p-3 rounded-lg" defaultValue={accounts[0]?.id}>
                    {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                <select id="category-select" className="w-full bg-dark-700 p-3 rounded-lg" defaultValue={categories.find(c => c.name === 'Groceries')?.id}>
                    {categories.filter(c => c.type === TransactionType.EXPENSE).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
            <div className="flex gap-4 mt-6">
                <button onClick={() => setShowCompleteModal(false)} className="w-full p-3 bg-dark-700 rounded-lg font-bold">Cancel</button>
                <button onClick={() => handleCompleteList(
                    (document.getElementById('account-select') as HTMLSelectElement).value,
                    (document.getElementById('category-select') as HTMLSelectElement).value
                )} className="w-full p-3 bg-primary text-dark-900 rounded-lg font-bold">Confirm</button>
            </div>
        </div>
    </div>
  )

  return (
    <div className="p-4 text-light-900">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="mr-4 p-2">&larr;</button>
        <div>
            <h1 className="text-2xl font-bold">{list.name}</h1>
            <p className="text-sm text-light-800">{list.store}</p>
        </div>
      </div>
      
      <div className="bg-dark-700 p-4 rounded-lg mb-4">
        <div className="flex justify-between text-sm">
            <span>Total Est. Cost: <span className="font-bold">{formatCurrency(totalCost)}</span></span>
            <span>Paid: <span className="font-bold text-primary">{formatCurrency(purchasedCost)}</span></span>
        </div>
        {list.budgetLimit && (
            <div className="mt-2">
                <div className="w-full bg-dark-800 rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{width: `${Math.min(100, (purchasedCost / list.budgetLimit) * 100)}%`}}></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                    <span>Budget</span>
                    <span>{formatCurrency(list.budgetLimit)}</span>
                </div>
            </div>
        )}
      </div>

      <div className="bg-dark-700 rounded-lg p-2 mb-4">
        <div className="flex gap-2">
          <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="Add new item..." className="flex-grow bg-dark-800 p-3 rounded-lg"/>
          <button onClick={handleAddItem} className="p-3 bg-primary rounded-lg text-dark-900"><PlusIcon className="w-6 h-6"/></button>
        </div>
      </div>
      
      <div className="space-y-1">
        {items.map(item => <ItemRow key={item.id} item={item} />)}
      </div>

      <button onClick={() => setShowCompleteModal(true)} className="w-full p-4 bg-green-600 text-white font-bold rounded-lg mt-6">
        Mark as Complete & Create Expense
      </button>

      {showCompleteModal && <CompleteListModal />}
    </div>
  );
};

export default ShoppingListDetail;