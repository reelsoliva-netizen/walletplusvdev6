import React, { useState } from 'react';
import type { ShoppingList, Transaction, Account, Category } from '../types';
import PlusIcon from '../components/icons/PlusIcon';
import ShoppingListDetail from '../components/ShoppingListDetail';
import AddShoppingListModal from '../components/AddShoppingListModal';
import { useSettings } from '../contexts/SettingsContext';

interface ShoppingScreenProps {
  lists: ShoppingList[];
  onSave: (list: ShoppingList) => void;
  transactions: Transaction[];
  accounts: Account[];
  onSaveTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  categories: Category[];
}

const ShoppingScreen: React.FC<ShoppingScreenProps> = ({ lists, onSave, ...rest }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'archived'>('active');
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const { formatCurrency } = useSettings();

  const handleSaveList = (list: ShoppingList) => {
    onSave(list);
    if (selectedList?.id === list.id) {
        setSelectedList(list);
    }
  };
  
  const handleCreateList = (listData: Omit<ShoppingList, 'id' | 'items' | 'status' | 'createdDate' | 'updatedDate' | 'isPaid'>) => {
    const newList: ShoppingList = {
        id: `list-${Date.now()}`,
        ...listData,
        items: [],
        status: 'active',
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        isPaid: false,
    };
    onSave(newList);
    setSelectedList(newList);
  }

  const filteredLists = lists.filter(l => l.status === activeTab);

  if (selectedList) {
    return <ShoppingListDetail list={selectedList} onBack={() => setSelectedList(null)} onSave={handleSaveList} {...rest} />;
  }

  return (
    <div className="p-4 text-light-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shopping Lists</h1>
        <button onClick={() => setModalOpen(true)} className="p-2 bg-primary rounded-full text-dark-900"><PlusIcon className="w-6 h-6" /></button>
      </div>
      
      <div className="flex gap-2 bg-dark-800 p-1 rounded-full mb-6">
        <button onClick={() => setActiveTab('active')} className={`w-full text-center font-semibold py-2 rounded-full capitalize ${activeTab === 'active' ? 'bg-primary text-dark-900' : 'text-light-800'}`}>Active</button>
        <button onClick={() => setActiveTab('completed')} className={`w-full text-center font-semibold py-2 rounded-full capitalize ${activeTab === 'completed' ? 'bg-primary text-dark-900' : 'text-light-800'}`}>Completed</button>
        <button onClick={() => setActiveTab('archived')} className={`w-full text-center font-semibold py-2 rounded-full capitalize ${activeTab === 'archived' ? 'bg-primary text-dark-900' : 'text-light-800'}`}>Archived</button>
      </div>
      
      <div className="space-y-4">
        {filteredLists.length > 0 ? filteredLists.map(list => {
            const totalItems = list.items.length;
            const purchasedItems = list.items.filter(i => i.isPurchased).length;
            const progress = totalItems > 0 ? (purchasedItems / totalItems) * 100 : 0;
            const totalPrice = list.items.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0);
            
            return (
              <div key={list.id} onClick={() => setSelectedList(list)} className="bg-dark-700 p-4 rounded-lg cursor-pointer hover:bg-dark-800 transition-colors">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="font-bold text-lg">{list.name}</h2>
                        <p className="text-sm text-light-800">{list.store} &bull; {totalItems} items</p>
                    </div>
                    <p className="font-bold text-primary">{formatCurrency(totalPrice)}</p>
                </div>
                <div className="w-full bg-dark-800 rounded-full h-1.5 mt-3">
                    <div className="bg-primary h-1.5 rounded-full" style={{width: `${progress}%`}}></div>
                </div>
              </div>
            );
        }) : (
          <p className="text-center text-light-800 py-10">No {activeTab} lists found.</p>
        )}
      </div>

      <AddShoppingListModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSave={handleCreateList} />
    </div>
  );
};

export default ShoppingScreen;