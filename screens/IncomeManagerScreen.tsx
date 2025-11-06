import React, { useState, useMemo } from 'react';
import type { IncomeSource } from '../types';
import PlusIcon from '../components/icons/PlusIcon';
import AddIncomeSourceModal from '../components/AddIncomeSourceModal';
import TrashIcon from '../components/icons/TrashIcon';
import { useSettings } from '../contexts/SettingsContext';

interface IncomeManagerScreenProps {
  incomeSources: IncomeSource[];
  onSave: (source: IncomeSource) => void;
  onDelete: (sourceId: string) => void;
}

const IncomeManagerScreen: React.FC<IncomeManagerScreenProps> = ({ incomeSources, onSave, onDelete }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<IncomeSource | null>(null);
  const { formatCurrency } = useSettings();

  const totalMonthlyIncome = useMemo(() => {
    return incomeSources.filter(s => s.isRecurring).reduce((sum, s) => sum + s.amount, 0);
  }, [incomeSources]);

  const handleOpenModal = (source: IncomeSource | null = null) => {
    setEditingSource(source);
    setModalOpen(true);
  };
  
  const handleSave = (source: IncomeSource) => {
    onSave(source);
    setModalOpen(false);
  }

  const handleDelete = (e: React.MouseEvent, sourceId: string) => {
    e.stopPropagation();
    onDelete(sourceId);
  }

  return (
    <div className="p-4 text-light-900">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Income</h1>
        <button onClick={() => handleOpenModal()} className="p-2 bg-primary rounded-full text-dark-900"><PlusIcon className="w-6 h-6" /></button>
      </div>

      <div className="bg-dark-700 p-4 rounded-lg mb-6">
        <p className="text-sm text-light-800">Total Recurring Monthly Income</p>
        <p className="text-2xl font-bold text-green-400">{formatCurrency(totalMonthlyIncome)}</p>
      </div>

      <div className="space-y-4">
        {incomeSources.map(source => (
          <div key={source.id} onClick={() => handleOpenModal(source)} className="bg-dark-700 p-4 rounded-lg cursor-pointer">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{source.name}</p>
                <p className="text-sm text-light-800">{source.type}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold">{formatCurrency(source.amount)}</p>
                <button onClick={(e) => handleDelete(e, source.id)} className="text-light-800/60 hover:text-red-500 p-1">
                    <TrashIcon className="w-4 h-4"/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddIncomeSourceModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} editingSource={editingSource} />
    </div>
  );
};

export default IncomeManagerScreen;