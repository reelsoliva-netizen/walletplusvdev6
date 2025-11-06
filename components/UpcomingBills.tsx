import React, { useMemo } from 'react';
import type { Bill } from '../types';
import BellIcon from './icons/BellIcon';
import { useSettings } from '../contexts/SettingsContext';

interface UpcomingBillsProps {
  bills: Bill[];
  onNavigate: () => void;
}

const UpcomingBills: React.FC<UpcomingBillsProps> = ({ bills, onNavigate }) => {
  const { formatCurrency } = useSettings();
  
  const upcomingBills = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    return bills
      .filter(bill => bill.status === 'unpaid' && bill.reminderDays !== undefined)
      .map(bill => {
        const dueDate = new Date(bill.dueDate);
        const reminderDate = new Date(dueDate);
        reminderDate.setDate(dueDate.getDate() - (bill.reminderDays ?? 0));
        
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return { ...bill, reminderDate, diffDays };
      })
      .filter(bill => bill.reminderDate <= today && bill.diffDays >= 0)
      .sort((a, b) => a.diffDays - b.diffDays)
      .slice(0, 3); // Show max 3 reminders
  }, [bills]);

  if (upcomingBills.length === 0) {
    return null;
  }

  const getDueDateText = (diffDays: number) => {
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Bill Reminders</h2>
        <button onClick={onNavigate} className="text-primary text-sm font-semibold">View All Bills</button>
      </div>
      <div className="bg-dark-700 p-4 rounded-2xl space-y-3">
        {upcomingBills.map(bill => (
          <div key={bill.id} className="flex items-center gap-4 text-sm">
            <div className="p-2 bg-primary/20 rounded-full">
              <BellIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-grow">
              <p className="font-semibold">{bill.name}</p>
              <p className="text-light-800">{getDueDateText(bill.diffDays)}</p>
            </div>
            <p className="font-bold">{formatCurrency(bill.amount)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingBills;