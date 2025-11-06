import React, { useMemo } from 'react';
import type { Account } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import PlusIcon from '../components/icons/PlusIcon';
import EditIcon from '../components/icons/EditIcon';
import TrashIcon from '../components/icons/TrashIcon';

interface AccountsScreenProps {
  accounts: Account[];
  onAddAccount: () => void;
  onEditAccount: (account: Account) => void;
  onDeleteAccount: (accountId: string) => void;
}

const AccountsScreen: React.FC<AccountsScreenProps> = ({ accounts, onAddAccount, onEditAccount, onDeleteAccount }) => {
  const { formatCurrency } = useSettings();
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const groupedAccounts = useMemo(() => {
    return accounts.reduce((acc, account) => {
      const type = account.type || 'Uncategorized';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(account);
      return acc;
    }, {} as Record<string, Account[]>);
  }, [accounts]);

  const groupOrder: Account['type'][] = ['Checking', 'Savings', 'Cash', 'Credit Card', 'Investment'];


  return (
    <div className="p-4 text-light-900">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <button onClick={onAddAccount} className="p-2 bg-primary rounded-full text-dark-900">
            <PlusIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="text-light-800 mb-6">Total Net Worth: <span className="font-bold text-primary">{formatCurrency(totalBalance)}</span></div>

      <div className="space-y-6">
        {accounts.length > 0 ? (
          groupOrder.map(groupName => {
            const groupAccounts = groupedAccounts[groupName];
            if (!groupAccounts || groupAccounts.length === 0) return null;

            return (
              <div key={groupName}>
                <h2 className="text-lg font-bold text-light-800 mb-3">{groupName}</h2>
                <div className="space-y-4">
                  {groupAccounts.map(account => (
                    <div key={account.id} className="bg-dark-700 p-5 rounded-2xl flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{account.icon}</span>
                        <div>
                          <p className="text-lg font-semibold">{account.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className={`text-xl font-bold ${account.balance >= 0 ? 'text-light-900' : 'text-red-400'}`}>{formatCurrency(account.balance)}</p>
                        <button onClick={() => onEditAccount(account)} className="text-light-800 hover:text-primary p-1"><EditIcon className="w-5 h-5"/></button>
                        <button onClick={() => onDeleteAccount(account.id)} className="text-light-800 hover:text-red-400 p-1"><TrashIcon className="w-5 h-5"/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20">
            <p className="text-light-800">No accounts found.</p>
            <p className="text-sm text-light-800/70">Tap the '+' button to add an account.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsScreen;
