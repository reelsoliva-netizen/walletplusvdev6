import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, Line } from 'recharts';
import type { Transaction, Category, Budget, NetWorthSnapshot } from '../types';
import { TransactionType } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import PlusIcon from '../components/icons/PlusIcon';
import TrashIcon from '../components/icons/TrashIcon';

const BudgetsManager: React.FC<{
  budgets: Budget[];
  transactions: Transaction[];
  categories: Category[];
  onAddBudget: () => void;
  onDeleteBudget: (budgetId: string) => void;
}> = ({ budgets, transactions, categories, onAddBudget, onDeleteBudget }) => {
    const { formatCurrency } = useSettings();
    
    const budgetStatus = useMemo(() => {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);
        const expensesThisMonth = transactions.filter(t => t.type === TransactionType.EXPENSE && t.date.startsWith(currentMonth));

        return currentMonthBudgets.map(budget => {
            const spent = expensesThisMonth
                .filter(t => t.categoryId === budget.categoryId)
                .reduce((sum, t) => sum + t.amount, 0);
            const category = categories.find(c => c.id === budget.categoryId);
            const progress = (Number(spent) / (Number(budget.amount) || 1)) * 100;
            return { ...budget, spent, category, progress };
        });
    }, [budgets, transactions, categories]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">This Month's Budgets</h2>
                <button onClick={onAddBudget} className="p-2 bg-primary rounded-full text-dark-900"><PlusIcon className="w-5 h-5" /></button>
            </div>
            {budgetStatus.length > 0 ? (
                <div className="space-y-4">
                    {budgetStatus.map(b => {
                        // FIX: Cast amount and spent to Number to prevent type errors during subtraction.
                        const remaining = Number(b.amount) - Number(b.spent);
                        const isOverspent = remaining < 0;
                        return (
                            <div key={b.id} className="bg-dark-800 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{b.category?.icon}</span>
                                        <span className="font-semibold">{b.category?.name}</span>
                                    </div>
                                    <button onClick={() => onDeleteBudget(b.id)} className="text-light-800 hover:text-red-500 p-1"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                                <div className="w-full bg-dark-700 rounded-full h-2.5"><div className={`${b.progress > 100 ? 'bg-red-500' : 'bg-primary'} h-2.5 rounded-full`} style={{ width: `${b.progress > 100 ? 100 : b.progress}%` }}></div></div>
                                <div className="flex justify-between items-center text-sm mt-2">
                                    <div>
                                        <span className="text-light-800">Spent: </span>
                                        <span className="font-semibold text-light-900">{formatCurrency(b.spent)}</span>
                                        <span className="text-light-800"> / {formatCurrency(b.amount)}</span>
                                    </div>
                                    {isOverspent ? (
                                        <div>
                                            <span className="text-red-400 font-semibold">Over: </span>
                                            <span className="font-semibold text-red-400">{formatCurrency(Math.abs(remaining))}</span>
                                        </div>
                                    ) : (
                                        <div>
                                            <span className="text-light-800">Left: </span>
                                            <span className="font-semibold text-green-400">{formatCurrency(remaining)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : <p className="text-light-800 text-center py-10">No budgets set for this month. Tap '+' to add one.</p>}
        </div>
    );
};

const HabitsAnalysis: React.FC<{transactions: Transaction[], categories: Category[]}> = ({ transactions, categories }) => {
    const { formatCurrency } = useSettings();
    const habitsData = useMemo(() => {
        const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE);
        const weekdaySpending = expenses.filter(t => ![0, 6].includes(new Date(t.date).getDay())).reduce((s, t) => s + t.amount, 0);
        const weekendSpending = expenses.filter(t => [0, 6].includes(new Date(t.date).getDay())).reduce((s, t) => s + t.amount, 0);

        const topCategories = Object.entries(expenses.reduce((acc, t) => {
            acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>))
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([catId, amount]) => ({
                name: categories.find(c => c.id === catId)?.name || 'N/A',
                amount
            }));

        return { weekdaySpending, weekendSpending, topCategories };
    }, [transactions, categories]);

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Spending Habits</h2>
            <div className="bg-dark-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Weekday vs Weekend</h3>
                <div className="flex justify-between items-center">
                    <span>Weekday Total:</span>
                    <span className="font-bold">{formatCurrency(habitsData.weekdaySpending)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Weekend Total:</span>
                    <span className="font-bold">{formatCurrency(habitsData.weekendSpending)}</span>
                </div>
            </div>
            <div className="bg-dark-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Top 3 Categories</h3>
                {habitsData.topCategories.map(cat => (
                    <div key={cat.name} className="flex justify-between items-center">
                        <span>{cat.name}</span>
                        <span className="font-bold">{formatCurrency(cat.amount)}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

const NetWorthAnalysis: React.FC<{ history: NetWorthSnapshot[] }> = ({ history }) => {
    const chartData = history.map(s => ({
        name: new Date(s.date).toLocaleDateString('default', { month: 'short' }),
        Assets: s.assets,
        Liabilities: s.liabilities,
        'Net Worth': s.netWorth
    }));

    if (history.length < 2) {
        return <p className="text-light-800 text-center py-10">Track your accounts and debts to see your net worth grow over time.</p>
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
                <defs>
                    <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#A0A0A0" />
                <YAxis stroke="#A0A0A0" tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value as number)} />
                <Tooltip cursor={{ fill: 'rgba(255, 149, 0, 0.1)' }} contentStyle={{ backgroundColor: '#2A2A2A', border: 'none', borderRadius: '1rem' }} />
                <Legend />
                <Area type="monotone" dataKey="Net Worth" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorNetWorth)" />
                <Line type="monotone" dataKey="Assets" stroke="#22c55e" />
                <Line type="monotone" dataKey="Liabilities" stroke="#ef4444" />
            </AreaChart>
        </ResponsiveContainer>
    )
}


interface AnalysisScreenProps {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  onAddBudget: () => void;
  onDeleteBudget: (budgetId: string) => void;
  netWorthHistory: NetWorthSnapshot[];
}

const RADIAN = Math.PI / 180;
// FIX: Recharts props can be of any type, so they must be cast to Number
// before being used in arithmetic operations to prevent runtime errors.
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const numCx = Number(cx);
  const numCy = Number(cy);
  const numMidAngle = Number(midAngle);
  const numInnerRadius = Number(innerRadius);
  const numOuterRadius = Number(outerRadius);
  const numPercent = Number(percent);

  const radius = numInnerRadius + (numOuterRadius - numInnerRadius) * 0.5;
  const x = numCx + radius * Math.cos(-numMidAngle * RADIAN);
  const y = numCy + radius * Math.sin(-numMidAngle * RADIAN);
  return (<text x={x} y={y} fill="white" textAnchor={x > numCx ? 'start' : 'end'} dominantBaseline="central">{`${(numPercent * 100).toFixed(0)}%`}</text>);
};

const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ transactions, categories, budgets, onAddBudget, onDeleteBudget, netWorthHistory }) => {
  const [activeTab, setActiveTab] = useState<'spending' | 'cashflow' | 'budgets' | 'habits' | 'networth'>('spending');
  
  const expenseData = useMemo(() => {
    const expenseByCategory = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => {
        acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(expenseByCategory)
      .map(([categoryId, amount]) => {
        const category = categories.find(c => c.id === categoryId);
        return { name: category?.name || 'Uncategorized', value: amount, color: category?.color || '#8884d8' };
      })
      .sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  const cashFlowData = useMemo(() => {
    const dataByMonth: Record<string, { income: number; expense: number }> = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!dataByMonth[month]) dataByMonth[month] = { income: 0, expense: 0 };
      if (t.type === TransactionType.INCOME) dataByMonth[month].income += t.amount;
      else dataByMonth[month].expense += t.amount;
    });
    return Object.entries(dataByMonth).map(([name, values]) => ({ name, ...values })).reverse();
  }, [transactions]);

  return (
    <div className="p-4 text-light-900 space-y-8">
      <h1 className="text-2xl font-bold">Financial Analysis</h1>
      
      <div className="flex gap-2 bg-dark-800 p-1 rounded-full overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('spending')} className={`flex-shrink-0 px-4 text-center font-semibold py-2 rounded-full ${activeTab === 'spending' ? 'bg-primary text-dark-900' : 'text-light-800'}`}>Spending</button>
        <button onClick={() => setActiveTab('cashflow')} className={`flex-shrink-0 px-4 text-center font-semibold py-2 rounded-full ${activeTab === 'cashflow' ? 'bg-primary text-dark-900' : 'text-light-800'}`}>Cash Flow</button>
        <button onClick={() => setActiveTab('budgets')} className={`flex-shrink-0 px-4 text-center font-semibold py-2 rounded-full ${activeTab === 'budgets' ? 'bg-primary text-dark-900' : 'text-light-800'}`}>Budgets</button>
        <button onClick={() => setActiveTab('habits')} className={`flex-shrink-0 px-4 text-center font-semibold py-2 rounded-full ${activeTab === 'habits' ? 'bg-primary text-dark-900' : 'text-light-800'}`}>Habits</button>
        <button onClick={() => setActiveTab('networth')} className={`flex-shrink-0 px-4 text-center font-semibold py-2 rounded-full ${activeTab === 'networth' ? 'bg-primary text-dark-900' : 'text-light-800'}`}>Net Worth</button>
      </div>

      {activeTab === 'spending' && (
        <div className="bg-dark-700 p-4 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Expense Breakdown</h2>
            {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                <Pie data={expenseData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={120} fill="#8884d8" dataKey="value" nameKey="name">
                    {expenseData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#2A2A2A', border: 'none', borderRadius: '1rem' }} itemStyle={{ color: '#F5F5F5' }}/>
                <Legend iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
            ) : <p className="text-light-800 text-center py-10">No expense data to analyze.</p>}
        </div>
      )}
      
      {activeTab === 'cashflow' && (
        <div className="bg-dark-700 p-4 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Monthly Cash Flow</h2>
            {cashFlowData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cashFlowData}>
                <XAxis dataKey="name" stroke="#A0A0A0" />
                <YAxis stroke="#A0A0A0" />
                <Tooltip cursor={{ fill: 'rgba(255, 149, 0, 0.1)' }} contentStyle={{ backgroundColor: '#2A2A2A', border: 'none', borderRadius: '1rem' }} itemStyle={{ color: '#F5F5F5' }}/>
                <Legend />
                <Bar dataKey="income" fill="#22c55e" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            ) : <p className="text-light-800 text-center py-10">No income or expense data available.</p>}
        </div>
      )}

      {activeTab === 'budgets' && (
         <div className="bg-dark-700 p-4 rounded-2xl">
            <BudgetsManager budgets={budgets} transactions={transactions} categories={categories} onAddBudget={onAddBudget} onDeleteBudget={onDeleteBudget}/>
        </div>
      )}

      {activeTab === 'habits' && (
          <div className="bg-dark-700 p-4 rounded-2xl">
              <HabitsAnalysis transactions={transactions} categories={categories} />
          </div>
      )}

      {activeTab === 'networth' && (
        <div className="bg-dark-700 p-4 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Net Worth Trend</h2>
            <NetWorthAnalysis history={netWorthHistory} />
        </div>
      )}
    </div>
  );
};

export default AnalysisScreen;