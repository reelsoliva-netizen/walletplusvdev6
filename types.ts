export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  spendingLimit?: number;
}

export interface Account {
  id: string;
  name:string;
  balance: number;
  icon: string;
  type: 'Checking' | 'Savings' | 'Credit Card' | 'Investment' | 'Cash';
}

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  description: string;
  categoryId: string;
  date: string; // ISO string
  receiptImage?: string | null;
  isTaxDeductible?: boolean;
  isReconciled?: boolean;
}

export interface RecurringTransaction {
    id: string;
    transactionDetails: Omit<Transaction, 'id' | 'date' | 'receiptImage'>;
    frequency: 'daily' | 'weekly' | 'monthly';
    startDate: string; // ISO string
    endDate?: string; // ISO string
    lastInstanceDate?: string; // ISO string
}

export interface Goal {
  id: string;
  name: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string; // ISO string
  deadline: string; // ISO string
}

export interface Budget {
    id:string;
    categoryId: string;
    amount: number;
    month: string; // YYYY-MM
}

export interface Theme {
  name: string;
  displayName: string;
  colors: {
    [key: string]: string;
  };
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  symbolPosition: 'before' | 'after';
  flag: string;
  decimalDigits: number;
}

export interface Language {
    code: string;
    name: string;
    localName: string;
    flag: string;
    dir?: 'ltr' | 'rtl';
}

export interface ShoppingItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    purchasedPrice?: number;
    category: string;
    notes: string;
    isPurchased: boolean;
}

export interface ShoppingList {
    id: string;
    name: string;
    store: string;
    category: string;
    budgetLimit?: number;
    reminderDate?: string;
    items: ShoppingItem[];
    status: 'active' | 'completed' | 'archived';
    createdDate: string; // ISO string
    updatedDate: string; // ISO string
    completionDate?: string; // ISO string
    isPaid: boolean;
}

export interface Debt {
    id: string;
    name: string;
    type: 'Loan' | 'Credit Card' | 'Medical' | 'Family Loan' | 'Other';
    creditorName: string;
    originalAmount: number;
    currentBalance: number;
    interestRate: number; // APR
    minimumPayment: number;
    dueDateDay: number; // Day of the month
    startDate: string; // ISO string
    status: 'Active' | 'Paid Off';
    paymentHistory: { date: string; amount: number }[];
}

export interface Warranty {
    type: 'Manufacturer' | 'Extended' | 'Protection Plan' | 'Accidental Damage';
    startDate: string; // ISO string
    endDate: string; // ISO string
    provider: string;
    document?: string; // URL or path to doc
}

export interface WarrantyClaim {
    id: string;
    date: string; // ISO string
    description: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Product {
    id: string;
    name: string;
    category: string;
    brand?: string;
    model?: string;
    serialNumber?: string;
    purchaseDate: string; // ISO string
    purchasePrice: number;
    warranty: Warranty;
    claims: WarrantyClaim[];
}

export interface NetWorthSnapshot {
    date: string; // ISO string
    netWorth: number;
    assets: number;
    liabilities: number;
}

export interface Subscription {
    id: string;
    name: string;
    amount: number;
    billingCycle: 'monthly' | 'yearly' | 'quarterly';
    nextPaymentDate: string; // ISO string
    category: string;
    status: 'active' | 'cancelled';
}

export interface Bill {
    id: string;
    name: string;
    amount: number;
    dueDate: string; // ISO string
    isRecurring: boolean;
    frequency?: 'weekly' | 'monthly' | 'yearly';
    category: string;
    status: 'paid' | 'unpaid' | 'overdue';
    reminderDays?: number;
}

export interface IncomeSource {
    id: string;
    name: string;
    type: 'Salary' | 'Freelance' | 'Investment' | 'Other';
    amount: number;
    payday: string; // Can be a date for one-time, or a rule for recurring
    isRecurring: boolean;
}

export interface EmergencyFund {
    goal: number;
    current: number;
    contributions: { date: string; amount: number }[];
}

export type AuthType = 'pin' | 'password' | 'pattern' | 'none';

export interface AuthCredential {
    type: AuthType;
    hash: string;
    salt: string;
}

export interface BackupData {
    transactions: Transaction[];
    accounts: Account[];
    goals: Goal[];
    budgets: Budget[];
    recurringTransactions: RecurringTransaction[];
    shoppingLists: ShoppingList[];
    debts: Debt[];
    products: Product[];
    emergencyFund: EmergencyFund;
    subscriptions: Subscription[];
    bills: Bill[];
    incomeSources: IncomeSource[];
    // FIX: Added categories to the backup data type.
    categories: Category[];
}