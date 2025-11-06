import React from 'react';
import type { Transaction, IncomeSource } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface TaxScreenProps {
  transactions: Transaction[];
  incomeSources: IncomeSource[];
}

const TaxScreen: React.FC<TaxScreenProps> = ({ transactions, incomeSources }) => {
  const { formatCurrency } = useSettings();
  const totalIncome = incomeSources.reduce((sum, s) => sum + s.amount, 0);
  // This is a very simplistic example. Real tax calculation is much more complex.
  const estimatedTax = totalIncome * 0.22; 

  return (
    <div className="p-4 text-light-900">
      <h1 className="text-2xl font-bold mb-6">Tax Center</h1>
      
      <div className="bg-dark-700 p-5 rounded-2xl mb-6">
        <p className="text-light-800 text-sm">Estimated Taxable Income (YTD)</p>
        <p className="text-3xl font-bold text-primary">{formatCurrency(totalIncome)}</p>
        <p className="text-light-800 text-sm mt-4">Estimated Tax Liability</p>
        <p className="text-2xl font-bold">{formatCurrency(estimatedTax)}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Tax Resources</h2>
        <div className="bg-dark-700 p-4 rounded-lg">
          <p>Find a tax professional</p>
        </div>
        <div className="bg-dark-700 p-4 rounded-lg">
          <p>IRS Website</p>
        </div>
        <div className="bg-dark-700 p-4 rounded-lg">
          <p>Tax document checklist</p>
        </div>
      </div>
      <p className="text-xs text-light-800/70 text-center mt-6">Disclaimer: This is not financial advice. Consult with a professional for tax matters.</p>
    </div>
  );
};

export default TaxScreen;