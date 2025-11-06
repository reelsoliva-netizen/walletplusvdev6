
import { TransactionType, type Account, type Category, type Transaction, type Goal } from './types';

export const SAVINGS_CATEGORY_ID = 'cat-11';

export const CATEGORIES: Category[] = [
  // Income
  { id: 'cat-1', name: 'Salary', type: TransactionType.INCOME, color: '#22c55e', icon: '💼' },
  { id: 'cat-8', name: 'Freelance', type: TransactionType.INCOME, color: '#14b8a6', icon: '💻' },
  { id: 'cat-12', name: 'Awards', type: TransactionType.INCOME, color: '#facc15', icon: '🏆' },
  { id: 'cat-13', name: 'Coupons', type: TransactionType.INCOME, color: '#38bdf8', icon: '🎟️' },
  { id: 'cat-14', name: 'Grants', type: TransactionType.INCOME, color: '#a78bfa', icon: '🤝' },
  { id: 'cat-15', name: 'Lottery', type: TransactionType.INCOME, color: '#e879f9', icon: '🎰' },
  { id: 'cat-16', name: 'Refunds', type: TransactionType.INCOME, color: '#fbbf24', icon: '🔙' },
  { id: 'cat-17', name: 'Rental', type: TransactionType.INCOME, color: '#60a5fa', icon: '🏢' },
  { id: 'cat-18', name: 'Sale', type: TransactionType.INCOME, color: '#f87171', icon: '🏷️' },
  
  // Expense
  { id: 'cat-2', name: 'Groceries', type: TransactionType.EXPENSE, color: '#ef4444', icon: '🛒' },
  { id: 'cat-3', name: 'Rent', type: TransactionType.EXPENSE, color: '#f97316', icon: '🏠' },
  { id: 'cat-4', name: 'Utilities', type: TransactionType.EXPENSE, color: '#3b82f6', icon: '💡' },
  { id: 'cat-5', name: 'Transport', type: TransactionType.EXPENSE, color: '#8b5cf6', icon: '🚗' },
  { id: 'cat-6', name: 'Dining Out', type: TransactionType.EXPENSE, color: '#eab308', icon: '🍔' },
  { id: 'cat-7', name: 'Entertainment', type: TransactionType.EXPENSE, color: '#ec4899', icon: '🎬' },
  { id: 'cat-9', name: 'Shopping', type: TransactionType.EXPENSE, color: '#d946ef', icon: '🛍️' },
  { id: 'cat-10', name: 'Health', type: TransactionType.EXPENSE, color: '#64748b', icon: '💊' },
  { id: SAVINGS_CATEGORY_ID, name: 'Savings & Goals', type: TransactionType.EXPENSE, color: '#10b981', icon: '🏦' },
  { id: 'cat-19', name: 'Baby', type: TransactionType.EXPENSE, color: '#7dd3fc', icon: '🍼' },
  { id: 'cat-20', name: 'Beauty', type: TransactionType.EXPENSE, color: '#f472b6', icon: '💄' },
  { id: 'cat-21', name: 'Bills', type: TransactionType.EXPENSE, color: '#9ca3af', icon: '🧾' },
  { id: 'cat-22', name: 'Education', type: TransactionType.EXPENSE, color: '#a3e635', icon: '🎓' },
];

export const ACCOUNTS: Account[] = [];

export const TRANSACTIONS: Transaction[] = [];

export const GOALS: Goal[] = [];