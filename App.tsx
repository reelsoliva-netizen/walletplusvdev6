import React, { useState, useMemo, useEffect, useCallback } from 'react';
import BottomNav, { type NavItem } from './components/BottomNav';

// Eager load all screen components for instant navigation
import HomeScreen from './screens/HomeScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import AnalysisScreen from './screens/AnalysisScreen';
import AccountsScreen from './screens/AccountsScreen';
import SettingsScreen from './screens/SettingsScreen';
import GoalsScreen from './screens/GoalsScreen';
import ShoppingScreen from './screens/ShoppingScreen';
import DebtScreen from './screens/DebtScreen';
import WarrantyScreen from './screens/WarrantyScreen';
import NetWorthScreen from './screens/NetWorthScreen';
import FinancialHealthScreen from './screens/FinancialHealthScreen';
import SubscriptionsAndBillsScreen from './screens/SubscriptionsAndBillsScreen';
import IncomeManagerScreen from './screens/IncomeManagerScreen';
import TaxScreen from './screens/TaxScreen';
import EmergencyFundScreen from './screens/EmergencyFundScreen';
import CurrencySetupScreen from './screens/CurrencySetupScreen';


import AddTransactionModal from './components/AddTransactionModal';
import AddAccountModal from './components/AddAccountModal';
import AddBudgetModal from './components/AddBudgetModal';
import AddRecurringTransactionModal from './components/AddRecurringTransactionModal';
import ContributeToGoalModal from './components/ContributeToGoalModal';
import AddGoalModal from './components/AddGoalModal';
import SearchModal from './components/SearchModal';
import AddCategoryModal from './components/AddCategoryModal';
import CurrencySelectionModal from './components/CurrencySelectionModal';


import type { Transaction, Account, Goal, Category, Budget, RecurringTransaction, ShoppingList, Debt, Product, NetWorthSnapshot, EmergencyFund, Subscription, Bill, IncomeSource, BackupData } from './types';
import { TransactionType } from './types';
import { CATEGORIES, SAVINGS_CATEGORY_ID } from './constants';
import { useSettings } from './contexts/SettingsContext';
import { useSecurity } from './contexts/SecurityContext';
import { usePrivacy } from './contexts/PrivacyContext';
import Sidebar from './components/Sidebar';
import MenuIcon from './components/icons/MenuIcon';
import SearchIcon from './components/icons/SearchIcon';

const App: React.FC = () => {
  const { currency } = useSettings();
  const { /* isLocked */ } = useSecurity();
  const { confirm } = usePrivacy();
  
  const [activeItem, setActiveItem] = useState<NavItem>('home');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // App state flags
  const [isDataLoaded, setIsDataLoaded] = useState(true); // Start with data loaded to avoid loading screen
  const [isResetting, setIsResetting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(() => {
    return !localStorage.getItem('currency') ? 'currency' : 'done';
  });


  // Data states - managed in memory, persisted to localStorage
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [netWorthHistory, setNetWorthHistory] = useState<NetWorthSnapshot[]>([]);
  const [emergencyFund, setEmergencyFund] = useState<EmergencyFund>({ goal: 0, current: 0, contributions: [] });
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  
  // Modal states
  const [isAddTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isAddAccountModalOpen, setAddAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isAddBudgetModalOpen, setAddBudgetModalOpen] = useState(false);
  const [isAddRecurringModalOpen, setAddRecurringModalOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<RecurringTransaction | null>(null);
  const [isContributeModalOpen, setContributeModalOpen] = useState(false);
  const [contributingGoal, setContributingGoal] = useState<Goal | null>(null);
  const [isAddGoalModalOpen, setAddGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCurrencyModalOpen, setCurrencyModalOpen] = useState(false);

  const handleResetData = useCallback((force = false) => {
    const confirmReset = async () => {
      setIsResetting(true);
      // Clear localStorage immediately
      localStorage.clear();
      // Clear Cache Storage (if any)
      try {
        if (window.caches) {
          const keys = await caches.keys();
          await Promise.all(keys.map(k => caches.delete(k)));
        }
      } catch {}
      // Unregister service workers (if any)
      try {
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map(r => r.unregister()));
        }
      } catch {}
      // Small delay for UX, then reload without query params
      setTimeout(() => {
        window.location.href = window.location.origin + window.location.pathname;
      }, 400);
    };

    // Confirmation handled by the UI (custom modal). Always proceed when invoked.
    void confirmReset();
  }, []);
  
  // Effect to load data from localStorage on startup
  useEffect(() => {
    const loadData = () => {
      const rawData = localStorage.getItem('appData');
      let appData: Partial<BackupData> = {};

      if (rawData) {
        try {
          appData = JSON.parse(rawData);
        } catch (e) {
          console.error("Failed to load or parse data. Data might be corrupt.", e);
          alert("Error: Could not load your data. It might be corrupted. Resetting to a clean state.");
          handleResetData(true);
          return; // Stop execution
        }
      } else {
        // First launch: initialize with empty state
        appData = {
            transactions: [],
            accounts: [],
            goals: [],
            categories: CATEGORIES, // Keep default categories
            budgets: [],
            recurringTransactions: [],
            shoppingLists: [],
            debts: [],
            products: [],
            emergencyFund: { goal: 0, current: 0, contributions: [] },
            subscriptions: [],
            bills: [],
            incomeSources: [],
        };
      }
      
      setTransactions(appData.transactions || []);
      setAccounts(appData.accounts || []);
      setGoals(appData.goals || []);
      setCategories(appData.categories || CATEGORIES);
      setBudgets(appData.budgets || []);
      setRecurringTransactions(appData.recurringTransactions || []);
      setShoppingLists(appData.shoppingLists || []);
      setDebts(appData.debts || []);
      setProducts(appData.products || []);
      setEmergencyFund(appData.emergencyFund || { goal: 0, current: 0, contributions: [] });
      setSubscriptions(appData.subscriptions || []);
      setBills(appData.bills || []);
      setIncomeSources(appData.incomeSources || []);
      // Net Worth is calculated, not loaded directly.
      setIsDataLoaded(true);
    };

    loadData();
  }, [handleResetData]);
  
  // Effect to handle onboarding flow based on currency selection
  useEffect(() => {
    if (currency && onboardingStep === 'currency') {
      setOnboardingStep('done');
    }
  }, [currency, onboardingStep]);

  // Effect to save data to localStorage whenever it changes
  useEffect(() => {
    const saveData = async () => {
        if (!isDataLoaded || isSaving) return;

        setIsSaving(true);
        const appData: BackupData = {
          transactions, accounts, goals, categories, budgets, recurringTransactions, 
          shoppingLists, debts, products, emergencyFund, subscriptions, bills, incomeSources
        };

        const jsonString = JSON.stringify(appData);
        
        try {
            localStorage.setItem('appData', jsonString);
            // Mark that data has been persisted at least once
            localStorage.setItem('hasLaunchedBefore', 'true');
        } catch (e) {
            console.error("Failed to save data:", e);
        } finally {
            setIsSaving(false);
        }
    };
    
    saveData();
  }, [
    transactions, accounts, goals, categories, budgets, recurringTransactions, 
    shoppingLists, debts, products, emergencyFund, subscriptions, bills, incomeSources,
    isDataLoaded
  ]);

  useEffect(() => {
    const assets = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const liabilities = debts.filter(d => d.status === 'Active').reduce((sum, debt) => sum + debt.currentBalance, 0);
    const netWorth = assets - liabilities;
    const now = new Date();

    setNetWorthHistory(prev => {
        const lastSnapshot = prev[prev.length - 1];
        const todayISO = now.toISOString().split('T')[0];
        
        const newSnapshot = { date: now.toISOString(), netWorth, assets, liabilities };
        
        if (!lastSnapshot || new Date(lastSnapshot.date).toISOString().split('T')[0] !== todayISO) {
            return [...prev, newSnapshot];
        } else {
            const updatedHistory = [...prev];
            updatedHistory[updatedHistory.length - 1] = newSnapshot;
            return updatedHistory;
        }
    });
  }, [accounts, debts]);

  // --- Notifications for Bills and Subscriptions ---
  useEffect(() => {
    const todayISO = new Date().toISOString().split('T')[0];
    const notifiedBillsKey = 'notifiedBills';
    const notifiedSubsKey = 'notifiedSubs';
    let notifiedBills: Record<string, string> = {};
    let notifiedSubs: Record<string, string> = {};
    try {
      notifiedBills = JSON.parse(localStorage.getItem(notifiedBillsKey) || '{}');
      notifiedSubs = JSON.parse(localStorage.getItem(notifiedSubsKey) || '{}');
    } catch {}

    const requestPermission = () => {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
    };
    requestPermission();

    const canNotify = 'Notification' in window && Notification.permission === 'granted';
    if (!canNotify) return;

    // Bills: notify if dueDate within reminderDays and not paid
    bills.forEach((bill) => {
      if (bill.status === 'paid') return;
      const reminderDays = bill.reminderDays ?? 0;
      if (reminderDays <= 0) return;
      const due = new Date(bill.dueDate);
      const now = new Date();
      const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= reminderDays && diffDays >= 0) {
        const lastNotified = notifiedBills[bill.id];
        if (lastNotified !== todayISO) {
          new Notification('Upcoming Bill', {
            body: `${bill.name} is due in ${diffDays} day(s). Amount: ${bill.amount}`,
          });
          notifiedBills[bill.id] = todayISO;
        }
      }
    });

    // Subscriptions: notify if nextPaymentDate within 3 days
    subscriptions.forEach((sub) => {
      const next = new Date(sub.nextPaymentDate);
      const now = new Date();
      const diffDays = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 3 && diffDays >= 0) {
        const lastNotified = notifiedSubs[sub.id];
        if (lastNotified !== todayISO) {
          new Notification('Upcoming Subscription Payment', {
            body: `${sub.name} renews in ${diffDays} day(s). Amount: ${sub.amount}`,
          });
          notifiedSubs[sub.id] = todayISO;
        }
      }
    });

    try {
      localStorage.setItem(notifiedBillsKey, JSON.stringify(notifiedBills));
      localStorage.setItem(notifiedSubsKey, JSON.stringify(notifiedSubs));
    } catch {}
  }, [bills, subscriptions]);

  // --- Financial Health Calculation ---
  const financialHealthData = useMemo(() => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const monthlyIncome = incomeSources.filter(s => s.isRecurring).reduce((sum, s) => sum + s.amount, 0);
    const monthlySavings = transactions.filter(t => t.date >= lastMonth.toISOString() && t.categoryId === SAVINGS_CATEGORY_ID && t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
    const monthlyDebtPayments = debts.filter(d => d.status === 'Active').reduce((sum, d) => sum + d.minimumPayment, 0);

    const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;
    const debtToIncome = monthlyIncome > 0 ? (monthlyDebtPayments / monthlyIncome) * 100 : 0;
    const emergencyFundStatus = emergencyFund.goal > 0 ? (emergencyFund.current / emergencyFund.goal) * 100 : 0;

    const savingsScore = Math.min(100, (savingsRate / 20) * 100);
    const dtiScore = Math.max(0, (1 - (debtToIncome / 43)) * 100);
    const emergencyFundScore = Math.min(100, emergencyFundStatus);

    const score = Math.round((savingsScore * 0.4) + (dtiScore * 0.3) + (emergencyFundScore * 0.3));
    
    return { score, savingsRate, debtToIncome, emergencyFundStatus };
  }, [transactions, incomeSources, debts, emergencyFund]);

  const handleNavigate = useCallback((item: NavItem) => {
    setActiveItem(item);
    setSidebarOpen(false);
  }, []);

  // --- Data Management Functions ---
  const handleExportData = useCallback(() => {
    const headers = ["Date", "Description", "Amount", "Type", "Category", "Account"];
    const rows = transactions.map(t => {
      const category = categories.find(c => c.id === t.categoryId)?.name || 'N/A';
      const account = accounts.find(a => a.id === t.accountId)?.name || 'N/A';
      return [ new Date(t.date).toLocaleDateString(), `"${t.description.replace(/"/g, '""')}"`, t.amount, t.type, category, account ].join(',');
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "walletplus_transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [transactions, categories, accounts]);

  const handleBackupData = useCallback(() => {
    const backupData = { transactions, accounts, goals, budgets, recurringTransactions, shoppingLists, debts, products, emergencyFund, subscriptions, bills, incomeSources, categories };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `walletplus-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }, [transactions, accounts, goals, budgets, recurringTransactions, shoppingLists, debts, products, emergencyFund, subscriptions, bills, incomeSources, categories]);

  const handleRestoreData = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const restoredData = JSON.parse(event.target?.result as string) as BackupData;
        const ok = await confirm({ title: 'Restore Data', message: 'Are you sure you want to restore? This will overwrite your current data.' });
        if (ok) {
            setTransactions(restoredData.transactions || []);
            setAccounts(restoredData.accounts || []);
            setGoals(restoredData.goals || []);
            setCategories(restoredData.categories || CATEGORIES);
            setBudgets(restoredData.budgets || []);
            setRecurringTransactions(restoredData.recurringTransactions || []);
            setShoppingLists(restoredData.shoppingLists || []);
            setDebts(restoredData.debts || []);
            setProducts(restoredData.products || []);
            setEmergencyFund(restoredData.emergencyFund || { goal: 10000, current: 0, contributions: [] });
            setSubscriptions(restoredData.subscriptions || []);
            setBills(restoredData.bills || []);
            setIncomeSources(restoredData.incomeSources || []);
            alert("Data restored successfully!");
        }
      } catch (err) {
        console.error("Failed to parse restore file:", err);
        alert("Error: The selected file is not a valid backup file.");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset file input
  }, [confirm]);
  
  const handleSaveTransaction = useCallback(async (transactionData: Omit<Transaction, 'id'> | Transaction) => {
    if ('id' in transactionData) {
        const originalTransaction = transactions.find(t => t.id === transactionData.id);
        if (!originalTransaction) return;

        setTransactions(prev => prev.map(t => t.id === transactionData.id ? { ...t, ...transactionData } : t));

        setAccounts(prevAccounts => {
            return prevAccounts.map(acc => {
                let newBalance = acc.balance;
                if (acc.id === originalTransaction.accountId) {
                    newBalance += originalTransaction.type === TransactionType.INCOME ? -originalTransaction.amount : originalTransaction.amount;
                }
                if (acc.id === transactionData.accountId) {
                    newBalance += transactionData.type === TransactionType.INCOME ? transactionData.amount : -transactionData.amount;
                }
                return { ...acc, balance: newBalance };
            });
        });
    } else {
        const newTransaction: Transaction = { id: `trn-${Date.now()}`, ...transactionData } as Transaction;
        setTransactions(prev => [newTransaction, ...prev]);
        setAccounts(prevAccounts => prevAccounts.map(acc => {
            if (acc.id === newTransaction.accountId) {
                const newBalance = newTransaction.type === TransactionType.INCOME ? acc.balance + newTransaction.amount : acc.balance - newTransaction.amount;
                return { ...acc, balance: newBalance };
            }
            return acc;
        }));
    }
  }, [transactions]);
  
  const handleSaveRecurringTransaction = useCallback((rtData: Omit<RecurringTransaction, 'id'> | RecurringTransaction) => {
    if ('id' in rtData) {
        setRecurringTransactions(prev => prev.map(rt => rt.id === rtData.id ? { ...rt, ...rtData } : rt));
    } else {
        const newRt = { id: `rtrn-${Date.now()}`, ...rtData } as RecurringTransaction;
        setRecurringTransactions(prev => [newRt, ...prev]);
    }
  }, []);

  const handleSaveAccount = useCallback((accountData: Omit<Account, 'id'> | Account) => {
    if ('id' in accountData) {
      setAccounts(prev => prev.map(acc => acc.id === accountData.id ? { ...acc, ...accountData } : acc));
    } else {
      const newAccount: Account = { id: `acc-${Date.now()}`, ...accountData } as Account;
      setAccounts(prev => [...prev, newAccount]);
    }
  }, []);

  const handleDeleteAccount = useCallback(async (accountId: string) => {
    const ok = await confirm({ title: 'Delete Account', message: 'Are you sure you want to delete this account?' });
    if (ok) {
      setAccounts(prev => prev.filter(a => a.id !== accountId));
    }
  }, [confirm]);

  const handleSaveBudget = useCallback((budgetData: Omit<Budget, 'id'>) => {
    const newBudget: Budget = { id: `bud-${Date.now()}`, ...budgetData };
    setBudgets(prev => [...prev, newBudget]);
  }, []);

  const handleDeleteBudget = useCallback(async (budgetId: string) => {
    const ok = await confirm({ title: 'Delete Budget', message: 'Are you sure you want to delete this budget?' });
    if (ok) {
      setBudgets(prev => prev.filter(b => b.id !== budgetId));
    }
  }, [confirm]);

  const handleSaveGoal = useCallback((goalData: Omit<Goal, 'id'> | Goal) => {
    if ('id' in goalData) {
        setGoals(prev => prev.map(g => g.id === goalData.id ? { ...g, ...goalData } : g));
    } else {
        const newGoal: Goal = { id: `goal-${Date.now()}`, currentAmount: 0, startDate: new Date().toISOString(), ...goalData };
        setGoals(prev => [newGoal, ...prev]);
    }
  }, []);

  const handleDeleteGoal = useCallback(async (goalId: string) => {
    const ok = await confirm({ title: 'Delete Goal', message: 'Are you sure you want to delete this goal?' });
    if (ok) {
      setGoals(prev => prev.filter(g => g.id !== goalId));
    }
  }, [confirm]);

  const handleContributeToGoal = useCallback((goalId: string, amount: number, accountId: string) => {
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g));
    const goal = goals.find(g => g.id === goalId);
    handleSaveTransaction({
        accountId, type: TransactionType.EXPENSE, amount,
        description: `Contribution to: ${goal?.name || 'Savings Goal'}`,
        categoryId: SAVINGS_CATEGORY_ID, date: new Date().toISOString(),
    });
  }, [goals, handleSaveTransaction]);

  const handleToggleReconciled = useCallback((transactionId: string) => {
    setTransactions(prev => prev.map(t => t.id === transactionId ? { ...t, isReconciled: !t.isReconciled } : t));
  }, []);
  
  const handleMarkBillPaid = useCallback((billId: string, accountId: string) => {
    const bill = bills.find(b => b.id === billId);
    if (!bill) return;
    setBills(prev => prev.map(b => b.id === billId ? { ...b, status: 'paid' } : b));
    handleSaveTransaction({
        accountId, type: TransactionType.EXPENSE, amount: bill.amount,
        description: `Bill Paid: ${bill.name}`, categoryId: bill.category,
        date: new Date().toISOString(),
    });
  }, [bills, handleSaveTransaction]);

  const handleRecordDebtPayment = useCallback((debtId: string, amount: number, accountId: string, date: string) => {
    setDebts(prev => prev.map(d => {
        if (d.id === debtId) {
            const newBalance = d.currentBalance - amount;
            return {
                ...d, currentBalance: newBalance, status: newBalance <= 0 ? 'Paid Off' : 'Active',
                paymentHistory: [...d.paymentHistory, { date, amount }],
            };
        }
        return d;
    }));
    const debt = debts.find(d => d.id === debtId);
    let debtCategoryId = categories.find(c => c.name.toLowerCase().includes('debt'))?.id || categories.find(c => c.name === 'Shopping')?.id || '';
    handleSaveTransaction({ accountId, type: TransactionType.EXPENSE, amount, description: `Debt Payment: ${debt?.name || 'Debt'}`, categoryId: debtCategoryId, date });
  }, [debts, categories, handleSaveTransaction]);

  const handleSaveProduct = useCallback((productData: Product) => {
    setProducts(prev => [...prev.filter(p => p.id !== productData.id), productData]);
  }, []);

  const handleDeleteProduct = useCallback(async (productId: string) => {
    const ok = await confirm({ title: 'Delete Warranty Record', message: 'Are you sure you want to delete this product warranty record?' });
    if (ok) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  }, [confirm]);

  const handleDeleteIncomeSource = useCallback(async (sourceId: string) => {
    const ok = await confirm({ title: 'Delete Income Source', message: 'Are you sure you want to delete this income source?' });
    if (ok) {
      setIncomeSources(prev => prev.filter(s => s.id !== sourceId));
    }
  }, [confirm]);

  const handleUpdateEmergencyFundGoal = useCallback((newGoal: number) => {
    setEmergencyFund(prev => ({ ...prev, goal: newGoal }));
  }, []);

  const handleContributeToEmergencyFund = useCallback((amount: number, accountId: string) => {
    setEmergencyFund(prev => ({ ...prev, current: prev.current + amount, contributions: [...prev.contributions, { date: new Date().toISOString(), amount }] }));
    setAccounts(prev => prev.map(acc => acc.id === accountId ? { ...acc, balance: acc.balance - amount } : acc));
  }, []);

  const handleSaveCategory = useCallback((categoryData: Omit<Category, 'id'> | Category) => {
    if ('id' in categoryData) {
      setCategories(prev => prev.map(c => c.id === categoryData.id ? { ...c, ...categoryData } : c));
    } else {
      const newCategory: Category = { id: `cat-${Date.now()}`, ...categoryData };
      setCategories(prev => [...prev, newCategory]);
    }
  }, []);

  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    if (categoryId === SAVINGS_CATEGORY_ID) { return alert("The 'Savings & Goals' category is essential and cannot be deleted."); }
    const isUsed = transactions.some(t => t.categoryId === categoryId) || budgets.some(b => b.categoryId === categoryId) || subscriptions.some(s => s.category === categoryId) || bills.some(b => b.category === categoryId) || recurringTransactions.some(rt => rt.transactionDetails.categoryId === categoryId);
    if (isUsed) { return alert("Cannot delete category. It is being used by transactions, budgets, or bills."); }
    const ok = await confirm({ title: 'Delete Category', message: 'Are you sure you want to delete this category?' });
    if (ok) { setCategories(prev => prev.filter(c => c.id !== categoryId)); }
  }, [transactions, budgets, subscriptions, bills, recurringTransactions, confirm]);

  const currentNetWorth = useMemo(() => accounts.reduce((sum, acc) => sum + acc.balance, 0) - debts.reduce((sum, debt) => sum + debt.currentBalance, 0), [accounts, debts]);
  
  const handleSaveShoppingList = useCallback((list: ShoppingList) => setShoppingLists(prev => [...prev.filter(l => l.id !== list.id), list]), []);
  const handleSaveSubscription = useCallback((sub: Subscription) => setSubscriptions(prev => [...prev.filter(s => s.id !== sub.id), sub]), []);
  const handleSaveBill = useCallback((bill: Bill) => setBills(prev => [...prev.filter(b => b.id !== bill.id), bill]), []);
  const handleSaveIncomeSource = useCallback((source: IncomeSource) => setIncomeSources(prev => [...prev.filter(s => s.id !== source.id), source]), []);
  
  const renderScreen = () => {
    switch (activeItem) {
      case 'home': return <HomeScreen transactions={transactions} accounts={accounts} goals={goals} budgets={budgets} categories={categories} emergencyFund={emergencyFund} financialHealthScore={financialHealthData.score} incomeSources={incomeSources} bills={bills} onNavigate={(screen) => setActiveItem(screen as NavItem)} />;
      case 'transactions': return <TransactionsScreen transactions={transactions} categories={categories} accounts={accounts} recurringTransactions={recurringTransactions} onAddTransaction={() => { setEditingTransaction(null); setAddTransactionModalOpen(true); }} onEditTransaction={(t) => { setEditingTransaction(t); setAddTransactionModalOpen(true); }} onAddRecurring={() => { setEditingRecurring(null); setAddRecurringModalOpen(true);}} onEditRecurring={(rt) => { setEditingRecurring(rt); setAddRecurringModalOpen(true); }} onToggleReconciled={handleToggleReconciled} />;
      case 'analysis': return <AnalysisScreen transactions={transactions} categories={categories} budgets={budgets} onAddBudget={() => setAddBudgetModalOpen(true)} onDeleteBudget={handleDeleteBudget} netWorthHistory={netWorthHistory} />;
      case 'accounts': return <AccountsScreen accounts={accounts} onAddAccount={() => { setEditingAccount(null); setAddAccountModalOpen(true); }} onEditAccount={(acc) => { setEditingAccount(acc); setAddAccountModalOpen(true); }} onDeleteAccount={handleDeleteAccount} />;
      case 'goals': return <GoalsScreen goals={goals} onContribute={(goal) => { setContributingGoal(goal); setContributeModalOpen(true); }} onAddGoal={() => { setEditingGoal(null); setAddGoalModalOpen(true); }} onEditGoal={(goal) => { setEditingGoal(goal); setAddGoalModalOpen(true); }} onDeleteGoal={handleDeleteGoal} />;
      case 'shop': return <ShoppingScreen lists={shoppingLists} onSave={handleSaveShoppingList} transactions={transactions} accounts={accounts} onSaveTransaction={handleSaveTransaction} categories={categories} />;
      case 'debts': return <DebtScreen debts={debts} accounts={accounts} onSave={(debt) => setDebts(prev => [...prev.filter(d => d.id !== debt.id), debt])} onRecordPayment={handleRecordDebtPayment} />;
      case 'warranties': return <WarrantyScreen products={products} onSave={handleSaveProduct} onDeleteProduct={handleDeleteProduct} />;
      case 'networth': return <NetWorthScreen netWorthHistory={netWorthHistory} currentNetWorth={currentNetWorth} />;
      case 'health': return <FinancialHealthScreen {...financialHealthData} />;
      case 'subscriptions': return <SubscriptionsAndBillsScreen subscriptions={subscriptions} bills={bills} categories={categories} accounts={accounts} onSaveSubscription={handleSaveSubscription} onSaveBill={handleSaveBill} onMarkBillPaid={handleMarkBillPaid} />;
      case 'income': return <IncomeManagerScreen incomeSources={incomeSources} onSave={handleSaveIncomeSource} onDelete={handleDeleteIncomeSource} />;
      case 'tax': return <TaxScreen transactions={transactions} incomeSources={incomeSources} />;
      case 'emergency': return <EmergencyFundScreen emergencyFund={emergencyFund} accounts={accounts} onUpdateGoal={handleUpdateEmergencyFundGoal} onContribute={handleContributeToEmergencyFund} />;
      case 'settings': return <SettingsScreen onExport={handleExportData} onBackup={handleBackupData} onRestore={handleRestoreData} onReset={handleResetData} categories={categories} transactions={transactions} onAddCategory={() => { setEditingCategory(null); setAddCategoryModalOpen(true); }} onEditCategory={(c) => { setEditingCategory(c); setAddCategoryModalOpen(true); }} onDeleteCategory={handleDeleteCategory} onOpenCurrencyModal={() => setCurrencyModalOpen(true)} />;
      default: return <HomeScreen transactions={transactions} accounts={accounts} goals={goals} budgets={budgets} categories={categories} emergencyFund={emergencyFund} financialHealthScore={financialHealthData.score} incomeSources={incomeSources} bills={bills} onNavigate={(screen) => setActiveItem(screen as NavItem)} />;
    }
  };
  
  // App Render Flow
  if (isResetting) return <div className="fixed inset-0 bg-dark-900 z-[200] flex flex-col items-center justify-center text-center p-4"><div className="w-12 h-12 rounded-full border-4 border-dark-700 border-t-primary animate-spin mb-4"></div><h1 className="text-2xl font-bold text-light-900">Resetting Application...</h1><p className="text-light-800">All your data is being securely deleted.</p></div>;
  // Removed loading screen - app loads immediately
  
  // Onboarding Flow
  if (onboardingStep === 'currency') return <CurrencySetupScreen />;

  // Main App Flow (app lock removed)

  return (
    <div className="bg-dark-900 min-h-screen font-sans">
      <div className="container mx-auto max-w-2xl relative bg-dark-900 pb-16">
        <header className="p-4 flex justify-between items-center text-light-900">
            <button onClick={() => setSidebarOpen(true)}><MenuIcon className="w-6 h-6"/></button>
            <h1 className="text-xl font-bold text-primary">Wallet+</h1>
            <button onClick={() => setIsSearchModalOpen(true)}><SearchIcon className="w-6 h-6"/></button>
        </header>

        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={handleNavigate} activeItem={activeItem} />

        <main>{renderScreen()}</main>
        
        <BottomNav activeItem={activeItem} onItemClick={(item) => setActiveItem(item)} />
        
        <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} transactions={transactions} accounts={accounts} categories={categories} onNavigate={(item) => { setActiveItem(item); setIsSearchModalOpen(false); }} onEditTransaction={(t) => { setEditingTransaction(t); setIsSearchModalOpen(false); setAddTransactionModalOpen(true); }} />
        <AddTransactionModal isOpen={isAddTransactionModalOpen} onClose={() => { setAddTransactionModalOpen(false); setEditingTransaction(null); }} onSave={handleSaveTransaction} categories={categories} accounts={accounts} editingTransaction={editingTransaction} />
        <AddAccountModal isOpen={isAddAccountModalOpen} onClose={() => { setAddAccountModalOpen(false); setEditingAccount(null); }} onSave={handleSaveAccount} editingAccount={editingAccount} />
        <AddBudgetModal isOpen={isAddBudgetModalOpen} onClose={() => setAddBudgetModalOpen(false)} onSave={handleSaveBudget} expenseCategories={categories.filter(c => c.type === TransactionType.EXPENSE)} />
        <AddRecurringTransactionModal isOpen={isAddRecurringModalOpen} onClose={() => { setAddRecurringModalOpen(false); setEditingRecurring(null); }} onSave={handleSaveRecurringTransaction} categories={categories} accounts={accounts} editingTransaction={editingRecurring} />
        <ContributeToGoalModal isOpen={isContributeModalOpen} onClose={() => { setContributeModalOpen(false); setContributingGoal(null); }} onSave={handleContributeToGoal} goal={contributingGoal} accounts={accounts} />
        <AddGoalModal isOpen={isAddGoalModalOpen} onClose={() => { setAddGoalModalOpen(false); setEditingGoal(null); }} onSave={handleSaveGoal} editingGoal={editingGoal} />
        <AddCategoryModal isOpen={isAddCategoryModalOpen} onClose={() => { setAddCategoryModalOpen(false); setEditingCategory(null); }} onSave={handleSaveCategory} editingCategory={editingCategory} />
        <CurrencySelectionModal isOpen={isCurrencyModalOpen} onClose={() => setCurrencyModalOpen(false)} />
      </div>
    </div>
  );
};

export default App;
