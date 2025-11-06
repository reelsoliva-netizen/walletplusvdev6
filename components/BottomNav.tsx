import React from 'react';
import HomeIcon from './icons/HomeIcon';
import TransactionIcon from './icons/TransactionIcon';
import AnalysisIcon from './icons/AnalysisIcon';
import AccountIcon from './icons/AccountIcon';
import SettingsIcon from './icons/SettingsIcon';

// FIX: Added 'tax', 'emergency', and 'language' to NavItem to support new screens.
export type NavItem = 'home' | 'transactions' | 'analysis' | 'goals' | 'accounts' | 'settings' | 'shop' | 'debts' | 'warranties' | 'networth' | 'health' | 'subscriptions' | 'income' | 'tax' | 'emergency';

interface BottomNavProps {
  activeItem: NavItem;
  onItemClick: (item: NavItem) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeItem, onItemClick }) => {
  const navItems: { id: NavItem, label: string, icon: React.FC<{className?: string}> }[] = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'transactions', label: 'Transactions', icon: TransactionIcon },
    { id: 'analysis', label: 'Analysis', icon: AnalysisIcon },
    { id: 'accounts', label: 'Accounts', icon: AccountIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-700 z-50">
      <div className="flex justify-around items-center container mx-auto max-w-2xl">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`flex flex-col items-center justify-center flex-shrink-0 w-20 h-16 rounded-lg transition-colors ${
              activeItem === item.id ? 'text-primary' : 'text-light-800 hover:text-light-900'
            }`}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default React.memo(BottomNav);
