import React, { useState, useMemo } from 'react';
import type { Debt, Account } from '../types';
import PlusIcon from '../components/icons/PlusIcon';
import AddDebtModal from '../components/AddDebtModal';
import RecordPaymentModal from '../components/RecordPaymentModal';
import { useSettings } from '../contexts/SettingsContext';

// FIX: Added DebtScreenProps interface definition.
interface DebtScreenProps {
  debts: Debt[];
  accounts: Account[];
  onSave: (debt: Debt) => void;
  onRecordPayment: (debtId: string, amount: number, accountId: string, date: string) => void;
}

const DebtCalculator: React.FC<{debts: Debt[]}> = ({ debts }) => {
    const { formatCurrency } = useSettings();
    const [selectedDebtId, setSelectedDebtId] = useState(debts[0]?.id || '');
    const [extraPayment, setExtraPayment] = useState(0);

    const debt = useMemo(() => debts.find(d => d.id === selectedDebtId), [debts, selectedDebtId]);

    const calculatePayoff = (balance: number, rate: number, payment: number) => {
        if (payment <= (balance * (rate / 100)) / 12) return { months: Infinity, interest: Infinity };
        let months = 0;
        let totalInterest = 0;
        let currentBalance = balance;
        while (currentBalance > 0) {
            const interest = (currentBalance * (rate / 100)) / 12;
            totalInterest += interest;
            const principal = payment - interest;
            currentBalance -= principal;
            months++;
            if (months > 1200) break; // 100 years limit
        }
        return { months, interest: totalInterest };
    };

    const results = useMemo(() => {
        if (!debt || debt.currentBalance <= 0) return null;
        const min = calculatePayoff(debt.currentBalance, debt.interestRate, debt.minimumPayment);
        const extra = calculatePayoff(debt.currentBalance, debt.interestRate, debt.minimumPayment + extraPayment);
        return { min, extra };
    }, [debt, extraPayment]);

    if (debts.filter(d => d.status === 'Active').length === 0) {
      return <p className="text-center text-light-800 py-4">No active debts to calculate.</p>
    }

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-lg">Payoff Calculator</h3>
            <select value={selectedDebtId} onChange={e => setSelectedDebtId(e.target.value)} className="w-full bg-dark-800 p-2 rounded-lg">
                {debts.filter(d => d.status === 'Active').map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <div>
                <label className="text-sm">Extra Monthly Payment</label>
                <input type="number" value={extraPayment} onChange={e => setExtraPayment(parseFloat(e.target.value) || 0)} className="w-full bg-dark-800 p-2 rounded-lg mt-1"/>
            </div>
            {results && debt && (
                <div className="text-sm space-y-2 bg-dark-900 p-3 rounded-lg">
                    <p>With min. payment of <span>{formatCurrency(debt.minimumPayment)}</span>: <span className="font-bold">{results.min.months === Infinity ? 'Never' : `${results.min.months} months`}</span> to payoff. Total interest: <span className="font-bold">{formatCurrency(results.min.interest)}</span>.</p>
                    <p className="text-green-400">With <span>{formatCurrency(debt.minimumPayment + extraPayment)}</span> payment: <span className="font-bold">{results.extra.months === Infinity ? 'Never' : `${results.extra.months} months`}</span> to payoff. Total interest: <span className="font-bold">{formatCurrency(results.extra.interest)}</span>. You save <span className="font-bold">{formatCurrency(results.min.interest - results.extra.interest)}</span>!</p>
                </div>
            )}
        </div>
    )
};


const DebtScreen: React.FC<DebtScreenProps> = ({ debts, accounts, onSave, onRecordPayment }) => {
  const { formatCurrency } = useSettings();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isPayModalOpen, setPayModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  
  const totalDebt = useMemo(() => debts.filter(d => d.status === 'Active').reduce((sum, d) => sum + d.currentBalance, 0), [debts]);
  const totalMinPayment = useMemo(() => debts.filter(d => d.status === 'Active').reduce((sum, d) => sum + d.minimumPayment, 0), [debts]);

  const handleOpenAddModal = (debt: Debt | null = null) => {
    setEditingDebt(debt);
    setAddModalOpen(true);
  }

  const handleOpenPayModal = (debt: Debt) => {
    setSelectedDebt(debt);
    setPayModalOpen(true);
  }

  return (
    <div className="p-4 text-light-900">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Debt Manager</h1>
        <button onClick={() => handleOpenAddModal()} className="p-2 bg-primary rounded-full text-dark-900"><PlusIcon className="w-6 h-6" /></button>
      </div>

      <div className="bg-dark-700 p-4 rounded-lg mb-6 grid grid-cols-2 gap-4">
        <div>
            <p className="text-sm text-light-800">Total Debt</p>
            <p className="text-2xl font-bold text-red-400">{formatCurrency(totalDebt)}</p>
        </div>
        <div>
            <p className="text-sm text-light-800">Total Min. Payments</p>
            <p className="text-2xl font-bold">{formatCurrency(totalMinPayment)}</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <h2 className="text-xl font-bold">Active Debts</h2>
        {debts.filter(d => d.status === 'Active').map(debt => (
            <div key={debt.id} className="bg-dark-700 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="font-bold text-lg">{debt.name}</h2>
                        <p className="text-sm text-light-800">{debt.creditorName} &bull; {debt.interestRate}% APR</p>
                    </div>
                    <div className="flex-shrink-0 flex gap-2">
                        <button onClick={() => handleOpenAddModal(debt)} className="text-xs text-light-800 font-semibold">Edit</button>
                        <button onClick={() => handleOpenPayModal(debt)} className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full font-semibold">Record Payment</button>
                    </div>
                </div>
                <div className="w-full bg-dark-800 rounded-full h-2 mt-3">
                    <div className="bg-primary h-2 rounded-full" style={{width: `${100 - (debt.currentBalance / debt.originalAmount) * 100}%`}}></div>
                </div>
                <div className="flex justify-between text-sm mt-1">
                    <span className="font-bold">{formatCurrency(debt.currentBalance)}</span>
                    <span className="text-light-800">{formatCurrency(debt.originalAmount)}</span>
                </div>
            </div>
        ))}
         {debts.filter(d => d.status === 'Active').length === 0 && <p className="text-center text-light-800 py-4 text-sm">You have no active debts. Great job!</p>}
      </div>

      <div className="bg-dark-700 p-4 rounded-lg">
        <DebtCalculator debts={debts} />
      </div>

      <AddDebtModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onSave={onSave} editingDebt={editingDebt}/>
      <RecordPaymentModal isOpen={isPayModalOpen} onClose={() => setPayModalOpen(false)} onSave={onRecordPayment} debt={selectedDebt} accounts={accounts} />
    </div>
  );
};

export default DebtScreen;