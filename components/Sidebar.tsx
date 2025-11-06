import React from 'react';
import type { NavItem } from './BottomNav';
import GoalsIcon from './icons/GoalsIcon';
import ShoppingIcon from './icons/ShoppingIcon';
import DebtIcon from './icons/DebtIcon';
import WarrantyIcon from './icons/WarrantyIcon';
import NetWorthIcon from './icons/NetWorthIcon';
import HealthIcon from './icons/HealthIcon';
import SubscriptionIcon from './icons/SubscriptionIcon';
import IncomeIcon from './icons/IncomeIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import TaxIcon from './icons/TaxIcon';
import EmergencyFundIcon from './icons/EmergencyFundIcon';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (item: NavItem) => void;
  activeItem: NavItem;
}

const sidebarNavItems: { id: NavItem, label: string, icon: React.FC<{className?: string}> }[] = [
  { id: 'goals', label: 'Goals', icon: GoalsIcon },
  { id: 'shop', label: 'Shopping', icon: ShoppingIcon },
  { id: 'debts', label: 'Debts', icon: DebtIcon },
  { id: 'warranties', label: 'Warranties', icon: WarrantyIcon },
  { id: 'networth', label: 'Net Worth', icon: NetWorthIcon },
  { id: 'health', label: 'Health', icon: HealthIcon },
  { id: 'subscriptions', label: 'Subscriptions & Bills', icon: SubscriptionIcon },
  { id: 'income', label: 'Income', icon: IncomeIcon },
  { id: 'tax', label: 'Taxes', icon: TaxIcon },
  { id: 'emergency', label: 'Emergency Fund', icon: EmergencyFundIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate, activeItem }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-[80] transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-dark-800 shadow-xl z-[90] transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 border-b border-dark-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-light-900">More Features</h2>
          <button onClick={onClose} className="text-light-800 hover:text-primary"><ChevronLeftIcon className="w-6 h-6"/></button>
        </div>
        <nav className="p-4 space-y-2">
          {sidebarNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-lg text-left transition-colors ${
                activeItem === item.id ? 'bg-primary text-dark-900' : 'text-light-800 hover:bg-dark-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;