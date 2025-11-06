import React, { useState, useEffect, useRef } from 'react';
import type { Product, Warranty } from '../types';
import PaperclipIcon from './icons/PaperclipIcon';
import TrashIcon from './icons/TrashIcon';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  editingProduct: Product | null;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSave, editingProduct }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [purchasePrice, setPurchasePrice] = useState('');
  const [warranty, setWarranty] = useState<Warranty>({
    type: 'Manufacturer',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    provider: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (editingProduct) {
        setName(editingProduct.name);
        setCategory(editingProduct.category);
        setPurchaseDate(new Date(editingProduct.purchaseDate).toISOString().split('T')[0]);
        setPurchasePrice(String(editingProduct.purchasePrice));
        setWarranty(editingProduct.warranty);
    } else {
        // Reset form
        setName(''); setCategory(''); setPurchaseDate(new Date().toISOString().split('T')[0]); setPurchasePrice('');
        setWarranty({ type: 'Manufacturer', startDate: new Date().toISOString().split('T')[0], endDate: '', provider: ''});
    }
  }, [editingProduct, isOpen]);
  
  const handleWarrantyChange = (field: keyof Warranty, value: string) => {
    setWarranty(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleWarrantyChange('document', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
        name, category,
        purchaseDate: new Date(purchaseDate).toISOString(),
        purchasePrice: parseFloat(purchasePrice),
        warranty,
        claims: editingProduct?.claims || [],
    };
    onSave({ id: editingProduct?.id || `prod-${Date.now()}`, ...productData });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-lg shadow-lg" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-light-900 mb-6">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          <h3 className="text-lg font-semibold border-b border-dark-700 pb-1">Product Details</h3>
          <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-dark-700 p-3 rounded-lg" required/>
          <input type="text" placeholder="Category (e.g., Electronics)" value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-dark-700 p-3 rounded-lg" required/>
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Purchase Price" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} className="w-full bg-dark-700 p-3 rounded-lg" required/>
            <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} className="w-full bg-dark-700 p-3 rounded-lg"/>
          </div>

          <h3 className="text-lg font-semibold border-b border-dark-700 pb-1 pt-4">Warranty Details</h3>
          <select value={warranty.type} onChange={e => handleWarrantyChange('type', e.target.value)} className="w-full bg-dark-700 p-3 rounded-lg">
            <option>Manufacturer</option>
            <option>Extended</option>
            <option>Protection Plan</option>
            <option>Accidental Damage</option>
          </select>
          <input type="text" placeholder="Warranty Provider" value={warranty.provider} onChange={e => handleWarrantyChange('provider', e.target.value)} className="w-full bg-dark-700 p-3 rounded-lg" required/>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-light-800">Start Date</label>
              <input type="date" value={new Date(warranty.startDate).toISOString().split('T')[0]} onChange={e => handleWarrantyChange('startDate', e.target.value)} className="w-full bg-dark-700 p-3 rounded-lg mt-1"/>
            </div>
            <div>
              <label className="text-sm text-light-800">End Date</label>
              <input type="date" value={warranty.endDate ? new Date(warranty.endDate).toISOString().split('T')[0] : ''} onChange={e => handleWarrantyChange('endDate', e.target.value)} className="w-full bg-dark-700 p-3 rounded-lg mt-1" required/>
            </div>
          </div>
          
          <div>
            {!warranty.document ? (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 p-3 bg-dark-700 rounded-lg text-light-800 hover:text-primary">
                    <PaperclipIcon className="w-5 h-5" />
                    Attach Warranty Document (Image/PDF)
                </button>
            ) : (
                <div className="flex items-center justify-between p-2 bg-dark-700 rounded-lg">
                    <p className="text-sm text-light-800 truncate">Document attached.</p>
                    <button type="button" onClick={() => handleWarrantyChange('document', '')} className="text-red-500 p-1"><TrashIcon className="w-4 h-4" /></button>
                </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf"/>
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

export default AddProductModal;
