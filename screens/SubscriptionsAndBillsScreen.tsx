import React, { useState, useMemo } from 'react';
import type { Subscription, Bill, Category, Account } from '../types';
import PlusIcon from '../components/icons/PlusIcon';
import AddSubscriptionModal from '../components/AddSubscriptionModal';
import AddBillModal from '../components/AddBillModal';
import { TransactionType } from '../types';
import BellIcon from '../components/icons/BellIcon';
import { useSettings } from '../contexts/SettingsContext';

interface SubscriptionsAndBillsScreenProps {
  subscriptions: Subscription[];
  bills: Bill[];
  categories: Category[];
  accounts: Account[];
  onSaveSubscription: (sub: Subscription) => void;
  onSaveBill: (bill: Bill) => void;
  onMarkBillPaid: (billId: string, accountId: string) => void;
}

const SubscriptionsAndBillsScreen: React.FC<SubscriptionsAndBillsScreenProps> = ({ subscriptions, bills, categories, accounts, onSaveSubscription, onSaveBill, onMarkBillPaid }) => {
  const [activeTab, setActiveTab] = useState<'subs' | 'bills'>('subs');
  const [billStatusTab, setBillStatusTab] = useState<'unpaid' | 'paid'>('unpaid');
  const [isSubModalOpen, setSubModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [isBillModalOpen, setBillModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [payingBillId, setPayingBillId] = useState<string | null>(null);
  const [paymentAccountId, setPaymentAccountId] = useState(accounts[0]?.id || '');
  const { formatCurrency } = useSettings();

  const monthlySubCost = useMemo(() => subscriptions.filter(s => s.status === 'active').reduce((sum, s) => {
    if (s.billingCycle === 'monthly') return sum + s.amount;
    if (s.billingCycle === 'yearly') return sum + s.amount / 12;
    if (s.billingCycle === 'quarterly') return sum + s.amount / 3;
    return sum;
  }, 0), [subscriptions]);

  const filteredBills = useMemo(() => bills.filter(b => b.status === billStatusTab), [bills, billStatusTab]);

  return (
    <div className="p-4 text-light-900">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Subscriptions & Bills</h1>
        <button onClick={() => activeTab === 'subs' ? setSubModalOpen(true) : setBillModalOpen(true)} className="p-2 bg-primary rounded-full text-dark-900"><PlusIcon className="w-6 h-6" /></button>
      </div>

      <div className="flex gap-2 bg-dark-800 p-1 rounded-full mb-6">
        <button onClick={() => setActiveTab('subs')} className={`w-full text-center font-semibold py-2 rounded-full ${activeTab === 'subs' ? 'bg-primary text-dark-900' : 'text-light-800'}`}>Subscriptions</button>
        <button onClick={() => setActiveTab('bills')} className={`w-full text-center font-semibold py-2 rounded-full ${activeTab === 'bills' ? 'bg-primary text-dark-900' : 'text-light-800'}`}>Bills</button>
      </div>
      
      {activeTab === 'subs' ? (
        <>
            <div className="bg-dark-700 p-4 rounded-lg mb-6">
                <p className="text-sm text-light-800">Monthly Subscription Cost</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(monthlySubCost)}</p>
            </div>
            <div className="space-y-4">
                {subscriptions.map(sub => (
                    <div key={sub.id} onClick={() => {setEditingSub(sub); setSubModalOpen(true);}} className="bg-dark-700 p-4 rounded-lg cursor-pointer">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{sub.name}</p>
                                <p className="text-sm text-light-800 capitalize">{sub.billingCycle}</p>
                            </div>
                            <p className="font-bold">{formatCurrency(sub.amount)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
      ) : (
        <>
            <div className="flex gap-2 bg-dark-800 p-1 rounded-full mb-4">
                <button onClick={() => setBillStatusTab('unpaid')} className={`w-full text-center font-semibold py-2 rounded-full ${billStatusTab === 'unpaid' ? 'bg-primary/20 text-primary' : 'text-light-800'}`}>Upcoming</button>
                <button onClick={() => setBillStatusTab('paid')} className={`w-full text-center font-semibold py-2 rounded-full ${billStatusTab === 'paid' ? 'bg-primary/20 text-primary' : 'text-light-800'}`}>History</button>
            </div>
            <div className="space-y-4">
                {filteredBills.map(bill => (
                    <div key={bill.id} className="bg-dark-700 p-4 rounded-lg">
                         <div className="flex justify-between items-center">
                            <div onClick={() => {setEditingBill(bill); setBillModalOpen(true);}} className="cursor-pointer flex-grow flex items-center gap-2">
                                {bill.reminderDays !== undefined && <BellIcon className="w-4 h-4 text-primary" />}
                                <div>
                                    <p className="font-semibold">{bill.name}</p>
                                    <p className="text-sm text-light-800">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="font-bold">{formatCurrency(bill.amount)}</p>
                                {bill.status === 'unpaid' && payingBillId !== bill.id && (
                                    <button onClick={() => { setPayingBillId(bill.id); setPaymentAccountId(accounts[0]?.id || '')}} className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-semibold">Mark Paid</button>
                                )}
                            </div>
                        </div>
                        {payingBillId === bill.id && (
                            <div className="mt-3 pt-3 border-t border-dark-800 space-y-2">
                                <select value={paymentAccountId} onChange={e => setPaymentAccountId(e.target.value)} className="w-full bg-dark-800 p-2 rounded-md text-sm">
                                    <option value="" disabled>Select account to pay from</option>
                                    {accounts.map(a => <option key={a.id} value={a.id}>{a.name} ({formatCurrency(a.balance)})</option>)}
                                </select>
                                <div className="flex gap-2">
                                    <button onClick={() => setPayingBillId(null)} className="w-full py-1 bg-dark-900 rounded-md text-xs">Cancel</button>
                                    <button onClick={() => { onMarkBillPaid(bill.id, paymentAccountId); setPayingBillId(null); }} className="w-full py-1 bg-primary text-dark-900 rounded-md font-bold text-xs">Confirm Payment</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
      )}

      <AddSubscriptionModal isOpen={isSubModalOpen} onClose={() => {setSubModalOpen(false); setEditingSub(null)}} onSave={onSaveSubscription} categories={categories.filter(c => c.type === TransactionType.EXPENSE)} editingSubscription={editingSub} />
      <AddBillModal isOpen={isBillModalOpen} onClose={() => {setBillModalOpen(false); setEditingBill(null);}} onSave={onSaveBill} categories={categories.filter(c => c.type === TransactionType.EXPENSE)} editingBill={editingBill} />
    </div>
  );
};

export default SubscriptionsAndBillsScreen;