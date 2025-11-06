import React, { useState, useMemo } from 'react';
import type { Transaction, Category, Account, RecurringTransaction } from '../types';
import { TransactionType } from '../types';
import PlusIcon from '../components/icons/PlusIcon';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import TrashIcon from '../components/icons/TrashIcon';
import { useSettings } from '../contexts/SettingsContext';

interface TransactionsScreenProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  recurringTransactions: RecurringTransaction[];
  onAddTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onAddRecurring: () => void;
  onEditRecurring: (recurring: RecurringTransaction) => void;
  onToggleReconciled: (transactionId: string) => void;
}

interface TransactionRowProps {
  transaction: Transaction;
  categories: Category[];
  accounts: Account[];
  onToggleReconciled: (transactionId: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
}

const TransactionRow: React.FC<TransactionRowProps> = React.memo(({
  transaction,
  categories,
  accounts,
  onToggleReconciled,
  onEditTransaction,
}) => {
  const { formatCurrency } = useSettings();
  const getCategory = (id: string) => categories.find(c => c.id === id);
  const getAccount = (id: string) => accounts.find(a => a.id === id);
  const category = getCategory(transaction.categoryId);
  
  return (
    <div className="flex items-center p-3 hover:bg-dark-800 rounded-lg cursor-pointer" onClick={() => onEditTransaction(transaction)}>
      <button onClick={(e) => { e.stopPropagation(); onToggleReconciled(transaction.id);}} className={`mr-3 p-1 ${transaction.isReconciled ? 'text-primary' : 'text-dark-700'}`}>
        <CheckCircleIcon className="w-5 h-5"/>
      </button>
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl mr-4" style={{ backgroundColor: category?.color, color: '#fff' }}>
        {category?.icon}
      </div>
      <div className="flex-grow">
        <p className="font-semibold">{transaction.description}</p>
        <p className="text-sm text-light-800">{category?.name}</p>
      </div>
      <div className="text-right">
        <p className={`font-bold ${transaction.type === TransactionType.INCOME ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(transaction.amount)}</p>
        <p className="text-xs text-light-800">{getAccount(transaction.accountId)?.name}</p>
      </div>
    </div>
  );
});

const TransactionsScreen: React.FC<TransactionsScreenProps> = ({ transactions, categories, accounts, recurringTransactions, onAddTransaction, onEditTransaction, onAddRecurring, onEditRecurring, onToggleReconciled }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'recurring'>('all');
  const [filter, setFilter] = useState('');
  const [reconciledFilter, setReconciledFilter] = useState<'all' | 'reconciled' | 'unreconciled'>('all');
  const { formatCurrency } = useSettings();

  const filteredTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter(t => t.description.toLowerCase().includes(filter.toLowerCase()))
      .filter(t => {
          if (reconciledFilter === 'all') return true;
          if (reconciledFilter === 'reconciled') return t.isReconciled;
          if (reconciledFilter === 'unreconciled') return !t.isReconciled;
          return true;
      });
  }, [transactions, filter, reconciledFilter]);

  const transactionsByDate = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => {
      const date = new Date(t.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(t);
      return acc;
    }, {} as Record<string, Transaction[]>);
  }, [filteredTransactions]);

  return (
    <div className="p-4 text-light-900">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button onClick={activeTab === 'all' ? onAddTransaction : onAddRecurring} className="p-2 bg-primary rounded-full text-dark-900">
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex gap-2 bg-dark-800 p-1 rounded-full mb-4">
        <button onClick={() => setActiveTab('all')} className={`w-full text-center font-semibold py-2 rounded-full ${activeTab === 'all' ? 'bg-primary text-dark-900' : 'text-light-800'}`}>All</button>
        <button onClick={() => setActiveTab('recurring')} className={`w-full text-center font-semibold py-2 rounded-full ${activeTab === 'recurring' ? 'bg-primary text-dark-900' : 'text-light-800'}`}>Recurring</button>
      </div>

      {activeTab === 'all' ? (
        <>
          <input
            type="text"
            placeholder="Search transactions..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 mb-4 focus:ring-primary focus:border-primary"
          />
          <select onChange={(e) => setReconciledFilter(e.target.value as any)} value={reconciledFilter} className="w-full bg-dark-700 border-dark-700 border-2 rounded-lg p-3 mb-4 focus:ring-primary focus:border-primary">
            <option value="all">Show All</option>
            <option value="reconciled">Show Reconciled</option>
            <option value="unreconciled">Show Unreconciled</option>
          </select>
          <div className="space-y-4">
            {Object.entries(transactionsByDate).map(([date, txs]) => (
              <div key={date}>
                <h2 className="text-sm font-semibold text-light-800 mb-2">{date}</h2>
                <div className="bg-dark-700 rounded-2xl p-2 space-y-1">
                  {/* FIX: Cast `txs` to Transaction[] to fix map error. */}
                  {(txs as Transaction[]).map(t => <TransactionRow 
                      key={t.id} 
                      transaction={t} 
                      categories={categories} 
                      accounts={accounts} 
                      onEditTransaction={onEditTransaction}
                      onToggleReconciled={onToggleReconciled}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {recurringTransactions.map(rt => (
            <div key={rt.id} onClick={() => onEditRecurring(rt)} className="bg-dark-700 p-4 rounded-lg cursor-pointer">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{rt.transactionDetails.description}</p>
                  <p className="text-sm text-light-800 capitalize">{rt.frequency}</p>
                </div>
                <p className={`font-bold ${rt.transactionDetails.type === TransactionType.INCOME ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(rt.transactionDetails.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionsScreen;