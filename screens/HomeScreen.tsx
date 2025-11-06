import React, { useMemo } from 'react';
import type { Transaction, Account, Goal, Budget, Category, EmergencyFund, IncomeSource, Bill } from '../types';
import { TransactionType } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import UpcomingBills from '../components/UpcomingBills';

interface HomeScreenProps {
  transactions: Transaction[];
  accounts: Account[];
  goals: Goal[];
  budgets: Budget[];
  categories: Category[];
  emergencyFund: EmergencyFund;
  financialHealthScore: number;
  incomeSources: IncomeSource[];
  bills: Bill[];
  onNavigate: (screen: 'transactions' | 'accounts' | 'goals' | 'analysis' | 'health' | 'subscriptions') => void;
}

const FinancialInsights: React.FC<{transactions: Transaction[], categories: Category[]}> = ({ transactions, categories }) => {
    const insights = useMemo(() => {
        const newInsights = [];
        const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE);
        if (expenses.length < 5) return [];

        // Insight 1: Spending patterns
        const weekendSpending = expenses.filter(t => [0,6].includes(new Date(t.date).getDay())).reduce((sum, t) => sum + t.amount, 0);
        const weekdaySpending = expenses.filter(t => ![0,6].includes(new Date(t.date).getDay())).reduce((sum, t) => sum + t.amount, 0);
        if(weekendSpending > weekdaySpending * 1.5) {
            newInsights.push('Heads up! Your spending seems to be significantly higher on weekends.');
        }

        // Insight 2: Unused subscriptions (simple check for subscription categories with no recent spending)
        const subCategories = categories.filter(c => c.name.toLowerCase().includes('subscription')).map(c => c.id);
        const recentSubExpenses = expenses.filter(t => subCategories.includes(t.categoryId) && new Date(t.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
        if (subCategories.length > 0 && recentSubExpenses.length === 0) {
            newInsights.push('You have subscription categories but no recent payments. It might be a good time to review your recurring charges.');
        }
        
        return newInsights.slice(0, 2); // Show max 2 insights
    }, [transactions, categories]);
    
    if (insights.length === 0) return null;

    return (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Financial Insights</h2>
          <div className="bg-dark-700 p-4 rounded-2xl space-y-3">
              {insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                      <span className="text-primary mt-1">💡</span>
                      <p className="text-light-800">{insight}</p>
                  </div>
              ))}
          </div>
        </div>
    );
};

const EmergencyFundCard: React.FC<{emergencyFund: EmergencyFund}> = ({ emergencyFund }) => {
    const { formatCurrency } = useSettings();
    const progress = Math.min(100, (emergencyFund.current / emergencyFund.goal) * 100);
    const isFunded = progress >= 100;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Emergency Fund</h2>
            <div className={`p-5 rounded-2xl shadow-lg ${isFunded ? 'bg-green-500/20' : 'bg-dark-700'}`}>
                <p className={`font-semibold mb-2 ${isFunded ? 'text-green-400' : 'text-light-900'}`}>{isFunded ? 'Fully Funded!' : 'Your Safety Net'}</p>
                <div className="w-full bg-dark-800 rounded-full h-2.5 mb-2"><div className={`${isFunded ? 'bg-green-500' : 'bg-primary'} h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div></div>
                <div className="flex justify-between text-sm text-light-800">
                    <span>{formatCurrency(emergencyFund.current)}</span>
                    <span>{formatCurrency(emergencyFund.goal)}</span>
                </div>
            </div>
        </div>
    )
}

const FinancialHealthScoreCard: React.FC<{ score: number, onNavigate: () => void }> = ({ score, onNavigate }) => {
    const getScoreColor = () => {
        if (score > 75) return 'text-green-400';
        if (score > 50) return 'text-yellow-400';
        return 'text-red-400';
    }
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center"><h2 className="text-xl font-bold">Financial Health</h2><button onClick={onNavigate} className="text-primary text-sm font-semibold">Details</button></div>
            <div className="bg-dark-700 p-5 rounded-2xl shadow-lg flex items-center justify-between">
                <p>Your score is</p>
                <p className={`text-5xl font-bold ${getScoreColor()}`}>{score}</p>
            </div>
        </div>
    )
}


const HomeScreen: React.FC<HomeScreenProps> = ({ transactions, accounts, goals, budgets, categories, emergencyFund, financialHealthScore, incomeSources, bills, onNavigate }) => {
  const { formatCurrency } = useSettings();

  const totals = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    const incomeFromTransactions = transactions
        .filter(t => t.type === TransactionType.INCOME && t.date >= startOfMonth)
        .reduce((sum, t) => sum + t.amount, 0);

    const recurringMonthlyIncome = incomeSources
        .filter(s => s.isRecurring)
        .reduce((sum, s) => sum + s.amount, 0);

    const expense = transactions
        .filter(t => t.type === TransactionType.EXPENSE && t.date >= startOfMonth)
        .reduce((sum, t) => sum + t.amount, 0);
        
    const income = incomeFromTransactions + recurringMonthlyIncome;
    
    return { income, expense, net: income - expense };
  }, [transactions, incomeSources]);

  const totalBalance = useMemo(() => accounts.reduce((sum, acc) => sum + acc.balance, 0), [accounts]);
  
  const recentTransactions = useMemo(() => [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5), [transactions]);
  
  const closestGoal = useMemo(() => {
    if (goals.length === 0) return null;
    return goals.filter(g => g.currentAmount < g.targetAmount)
        .sort((a, b) => (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount))[0];
  }, [goals]);

  return (
    <div className="p-4 text-light-900 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-700 p-4 rounded-2xl"><p className="text-light-800 text-sm">This Month's Income</p><p className="text-xl font-bold text-green-400">{formatCurrency(totals.income)}</p></div>
        <div className="bg-dark-700 p-4 rounded-2xl"><p className="text-light-800 text-sm">This Month's Expenses</p><p className="text-xl font-bold text-red-400">{formatCurrency(totals.expense)}</p></div>
      </div>
      
      <UpcomingBills bills={bills} onNavigate={() => onNavigate('subscriptions')} />

      <FinancialHealthScoreCard score={financialHealthScore} onNavigate={() => onNavigate('health')} />
      
      <EmergencyFundCard emergencyFund={emergencyFund} />

      <FinancialInsights transactions={transactions} categories={categories} />

      <div className="space-y-4">
        <div className="flex justify-between items-center"><h2 className="text-xl font-bold">Recent Transactions</h2><button onClick={() => onNavigate('transactions')} className="text-primary text-sm font-semibold">View All</button></div>
        <div className="bg-dark-700 rounded-2xl p-2 space-y-1">
          {recentTransactions.map(t => (
            <div key={t.id} className="flex justify-between items-center p-3">
              <div><p className="font-semibold">{t.description}</p><p className="text-xs text-light-800">{new Date(t.date).toLocaleDateString()}</p></div>
              <p className={`font-bold ${t.type === TransactionType.INCOME ? 'text-green-400' : 'text-red-400'}`}>{t.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(t.amount)}</p>
            </div>
          ))}
        </div>
      </div>
      
      {closestGoal && (
        <div className="space-y-4">
          <div className="flex justify-between items-center"><h2 className="text-xl font-bold">Closest Goal</h2><button onClick={() => onNavigate('goals')} className="text-primary text-sm font-semibold">View Goals</button></div>
          <div className="bg-dark-700 p-5 rounded-2xl shadow-lg">
             <p className="font-semibold mb-2">{closestGoal.name}</p>
             <div className="w-full bg-dark-800 rounded-full h-2.5 mb-2"><div className="bg-primary h-2.5 rounded-full" style={{ width: `${(closestGoal.currentAmount / closestGoal.targetAmount) * 100}%` }}></div></div>
             <div className="flex justify-between text-sm text-light-800">
                <span>{formatCurrency(closestGoal.currentAmount)}</span>
                <span>{formatCurrency(closestGoal.targetAmount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
