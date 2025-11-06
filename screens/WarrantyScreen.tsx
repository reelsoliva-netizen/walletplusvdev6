import React, { useState } from 'react';
import type { Product } from '../types';
import PlusIcon from '../components/icons/PlusIcon';
import AddProductModal from '../components/AddProductModal';
import TrashIcon from '../components/icons/TrashIcon';
import { useSettings } from '../contexts/SettingsContext';

interface WarrantyScreenProps {
  products: Product[];
  onSave: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const WarrantyScreen: React.FC<WarrantyScreenProps> = ({ products, onSave, onDeleteProduct }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'expiring' | 'expired'>('active');
  const { formatCurrency } = useSettings();

  const getStatus = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffDays = (end.getTime() - now.getTime()) / (1000 * 3600 * 24);
    if (diffDays < 0) return 'expired';
    if (diffDays <= 30) return 'expiring';
    return 'active';
  };
  
  const filteredProducts = products.filter(p => getStatus(p.warranty.endDate) === activeTab);

  const handleOpenModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setModalOpen(true);
  };
  
  const handleSave = (product: Product) => {
    onSave(product);
    setModalOpen(false);
  }

  return (
    <div className="p-4 text-light-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Warranties</h1>
        <button onClick={() => handleOpenModal()} className="p-2 bg-primary rounded-full text-dark-900"><PlusIcon className="w-6 h-6" /></button>
      </div>
      
      <div className="flex gap-2 bg-dark-800 p-1 rounded-full mb-6">
        <button onClick={() => setActiveTab('active')} className={`w-full text-center font-semibold py-2 rounded-full capitalize ${activeTab === 'active' ? 'bg-primary text-dark-900' : 'text-light-800'}`}>Active</button>
        <button onClick={() => setActiveTab('expiring')} className={`w-full text-center font-semibold py-2 rounded-full capitalize ${activeTab === 'expiring' ? 'bg-primary text-dark-900' : 'text-light-800'}`}>Expiring</button>
        <button onClick={() => setActiveTab('expired')} className={`w-full text-center font-semibold py-2 rounded-full capitalize ${activeTab === 'expired' ? 'bg-primary text-dark-900' : 'text-light-800'}`}>Expired</button>
      </div>

      <div className="space-y-4">
        {filteredProducts.map(product => (
            <div key={product.id} className="bg-dark-700 p-4 rounded-lg">
                <div onClick={() => handleOpenModal(product)} className="cursor-pointer">
                    <div className="flex justify-between">
                        <div>
                            <h2 className="font-bold text-lg">{product.name}</h2>
                            <p className="text-sm text-light-800">{product.brand || 'No Brand'}</p>
                        </div>
                        <p>{formatCurrency(product.purchasePrice)}</p>
                    </div>
                    <div className="text-xs text-light-800 mt-2">
                        Expires: {new Date(product.warranty.endDate).toLocaleDateString()}
                    </div>
                </div>
                <div className="flex justify-end mt-2">
                    <button onClick={(e) => { e.stopPropagation(); onDeleteProduct(product.id); }} className="text-light-800 hover:text-red-500 p-1">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        ))}
        {filteredProducts.length === 0 && <p className="text-center text-light-800 py-10">No products in this category.</p>}
      </div>

      <AddProductModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} editingProduct={editingProduct} />
    </div>
  );
};

export default WarrantyScreen;