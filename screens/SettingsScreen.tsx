import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useSecurity } from '../contexts/SecurityContext';
import { themes } from '../themes';
import type { Category, Transaction } from '../types';
import { TransactionType } from '../types';
import ExportIcon from '../components/icons/ExportIcon';
import BackupIcon from '../components/icons/BackupIcon';
import RestoreIcon from '../components/icons/RestoreIcon';
import ResetIcon from '../components/icons/ResetIcon';
import LikeIcon from '../components/icons/LikeIcon';
import FeedbackIcon from '../components/icons/FeedbackIcon';
import PlusIcon from '../components/icons/PlusIcon';
import EditIcon from '../components/icons/EditIcon';
import TrashIcon from '../components/icons/TrashIcon';
import MoreVerticalIcon from '../components/icons/MoreVerticalIcon';
import ChevronDownIcon from '../components/icons/ChevronDownIcon';
import LockIcon from '../components/icons/LockIcon';
import GlobeIcon from '../components/icons/GlobeIcon';
import ConfirmDialog from '../components/ConfirmDialog';


const FeedbackModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const handleSendEmail = () => {
    const appVersion = "5.8-free";
    const osInfo = navigator.userAgent;
    const subject = "Wallet+ Feedback";
    const body = `
--------------------
Device Information (Please do not remove):
App Version: ${appVersion}
OS: ${osInfo}
--------------------

Please write your feedback below:

`;
    window.location.href = `mailto:Walletplus98@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-md shadow-lg" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-light-900 mb-4">Send Feedback</h2>
        <p className="text-sm text-light-800 mb-6">
          Having trouble using Wallet+? Please check out the Help section first. For further queries or suggestions, you can write an email. Note that some device information may be included in the email to recognize the issue.
        </p>
        <div className="flex gap-4 pt-4">
          <button type="button" onClick={onClose} className="w-full p-3 bg-dark-700 text-light-900 font-bold rounded-lg">Cancel</button>
          <button type="button" onClick={handleSendEmail} className="w-full p-3 bg-primary text-dark-900 font-bold rounded-lg">
            CONTACT VIA EMAIL
          </button>
        </div>
      </div>
    </div>
  );
};

interface SettingsScreenProps {
  onExport: () => void;
  onBackup: () => void;
  onRestore: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  categories: Category[];
  transactions: Transaction[];
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onOpenCurrencyModal: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  onExport, onBackup, onRestore, onReset,
  categories, transactions,
  onAddCategory, onEditCategory, onDeleteCategory,
  onOpenCurrencyModal
}) => {
  const { theme, setTheme, currency } = useSettings();
  const { isHidden, toggleHidden } = useSecurity();
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isConfirmResetOpen, setConfirmResetOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [incomeCategoriesVisible, setIncomeCategoriesVisible] = useState(true);
  const [expenseCategoriesVisible, setExpenseCategoriesVisible] = useState(false);
  const restoreInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClose = (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest('[data-menu-button]')) return;
        setOpenMenuId(null);
    };
    if (openMenuId) window.addEventListener('click', handleClose, { once: true });
    return () => window.removeEventListener('click', handleClose);
  }, [openMenuId]);

  const transactionCounts = useMemo(() => {
    return transactions.reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [transactions]);

  const handleRestoreClick = () => restoreInputRef.current?.click();

  const { incomeCategories, expenseCategories } = useMemo(() => ({
    incomeCategories: categories.filter(c => c.type === TransactionType.INCOME),
    expenseCategories: categories.filter(c => c.type === TransactionType.EXPENSE)
  }), [categories]);
  
  const handleMenuClick = (e: React.MouseEvent, categoryId: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === categoryId ? null : categoryId);
  }

  const renderCategoryRow = (c: Category) => (
    <div key={c.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-dark-800">
        <span className="text-xl">{c.icon}</span>
        <div className="w-4 h-4 rounded-full" style={{backgroundColor: c.color}}></div>
        <span className="flex-grow">{c.name}</span>
        <span className="text-xs bg-dark-900 text-light-800 px-2 py-1 rounded-full">{transactionCounts[c.id] || 0}</span>
        <div className="relative" onClick={e => e.stopPropagation()}>
            <button data-menu-button onClick={(e) => handleMenuClick(e, c.id)} className="p-1 text-light-800 hover:text-primary"><MoreVerticalIcon className="w-5 h-5" /></button>
            {openMenuId === c.id && (
                <div className="absolute right-0 mt-2 w-36 bg-dark-900 border border-dark-700 rounded-md shadow-lg z-20 py-1 animate-fade-in">
                    <button onClick={() => { onEditCategory(c); setOpenMenuId(null); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-light-800 hover:bg-dark-800 hover:text-primary transition-colors"><EditIcon className="w-4 h-4" /><span>Edit</span></button>
                    <button onClick={() => { onDeleteCategory(c.id); setOpenMenuId(null); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-dark-800 transition-colors"><TrashIcon className="w-4 h-4" /><span>Delete</span></button>
                </div>
            )}
        </div>
    </div>
  );

  return (
    <div className="p-4 text-light-900 space-y-8">
      
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Appearance</h2>
        <div className="space-y-2">
          <label htmlFor="theme-select" className="text-light-800">Theme</label>
          <select id="theme-select" value={theme.name} onChange={(e) => setTheme(themes.find(t => t.name === e.target.value) || themes[0])} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900">
            {themes.map(t => <option key={t.name} value={t.name}>{t.displayName}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-light-800">Currency</label>
          <button onClick={onOpenCurrencyModal} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 focus:ring-primary focus:border-primary text-light-900 text-left flex justify-between items-center">
            <span>{currency ? `${currency.flag} ${currency.code} - ${currency.name}` : 'Select Currency'}</span>
            <span>&gt;</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Security</h2>
        <div className="bg-dark-700 rounded-lg p-4 flex justify-between items-center">
          <div className="flex items-center gap-3"><p>Hide Balances</p></div>
          <button onClick={toggleHidden} className={`w-14 h-8 rounded-full p-1 transition-colors ${isHidden ? 'bg-primary' : 'bg-dark-800'}`}><div className={`w-6 h-6 rounded-full bg-white transform transition-transform ${isHidden ? 'translate-x-6' : 'translate-x-0'}`} /></button>
        </div>
        
      </div>
      
       <div className="space-y-4">
        <div className="flex justify-between items-center"><h2 className="text-xl font-bold">Manage Categories</h2><button onClick={onAddCategory} className="p-2 bg-primary/20 rounded-full text-primary"><PlusIcon className="w-5 h-5" /></button></div>
        <div className="bg-dark-700 p-4 rounded-lg space-y-2">
            <button onClick={() => setIncomeCategoriesVisible(!incomeCategoriesVisible)} className="w-full flex justify-between items-center p-2 rounded-md hover:bg-dark-800"><h3 className="font-semibold text-primary">Income</h3><ChevronDownIcon className={`w-5 h-5 transition-transform ${!incomeCategoriesVisible ? '-rotate-90' : ''}`} /></button>
            {incomeCategoriesVisible && <div className="space-y-1 pl-2 border-l-2 border-dark-800">{incomeCategories.map(renderCategoryRow)}</div>}
            <div className="pt-2" />
            <button onClick={() => setExpenseCategoriesVisible(!expenseCategoriesVisible)} className="w-full flex justify-between items-center p-2 rounded-md hover:bg-dark-800"><h3 className="font-semibold text-primary">Expense</h3><ChevronDownIcon className={`w-5 h-5 transition-transform ${!expenseCategoriesVisible ? '-rotate-90' : ''}`} /></button>
            {expenseCategoriesVisible && <div className="space-y-1 pl-2 border-l-2 border-dark-800">{expenseCategories.map(renderCategoryRow)}</div>}
        </div>
       </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Data Management</h2>
        <div className="space-y-2">
          <button onClick={onExport} className="w-full flex items-center gap-4 bg-dark-700 rounded-lg p-4 text-light-900 hover:bg-dark-800 transition-colors"><ExportIcon className="w-5 h-5 text-primary" /><span>Export Records (CSV)</span></button>
           <button onClick={onBackup} className="w-full flex items-center gap-4 bg-dark-700 rounded-lg p-4 text-light-900 hover:bg-dark-800 transition-colors"><BackupIcon className="w-5 h-5 text-primary" /><span>Backup Data</span></button>
           <button onClick={handleRestoreClick} className="w-full flex items-center gap-4 bg-dark-700 rounded-lg p-4 text-light-900 hover:bg-dark-800 transition-colors"><RestoreIcon className="w-5 h-5 text-primary" /><span>Restore Data</span></button>
          <input type="file" ref={restoreInputRef} onChange={onRestore} className="hidden" accept=".json"/>
           <button onClick={() => setConfirmResetOpen(true)} className="w-full flex items-center gap-4 bg-dark-700 rounded-lg p-4 text-red-400 hover:bg-dark-800 transition-colors"><ResetIcon className="w-5 h-5" /><span>Delete & Reset Data</span></button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Application</h2>
        <div className="space-y-2">
          <a href="https://play.google.com/store/apps/details?id=com.walletplus.app&reviewId=0" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-4 bg-dark-700 rounded-lg p-4 text-light-900 hover:bg-dark-800 transition-colors"><LikeIcon className="w-5 h-5 text-primary" /><span>Like Wallet+</span></a>
          <button onClick={() => setFeedbackModalOpen(true)} className="w-full flex items-center gap-4 bg-dark-700 rounded-lg p-4 text-light-900 hover:bg-dark-800 transition-colors"><FeedbackIcon className="w-5 h-5 text-primary" /><span>Send Feedback</span></button>
        </div>
      </div>

      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setFeedbackModalOpen(false)} />

      <ConfirmDialog
        isOpen={isConfirmResetOpen}
        title="Delete & Reset Data"
        message="Are you sure? This will delete all your data permanently and cannot be undone."
        cancelText="Cancel"
        confirmText="OK"
        onCancel={() => setConfirmResetOpen(false)}
        onConfirm={() => { setConfirmResetOpen(false); onReset(); }}
      />
    </div>
  );
};

export default SettingsScreen;
