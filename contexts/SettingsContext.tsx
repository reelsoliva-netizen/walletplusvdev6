import React, { createContext, useContext, useEffect, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Theme, Currency } from '../types';
import { themes } from '../themes';
import { currencies } from '../currencies';
import { useSecurity } from './SecurityContext';

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currency: Currency | null;
  setCurrency: (currency: Currency | null) => void;
  formatCurrency: (amount: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useLocalStorage<string>('theme', 'darkElegance');
  const [currencyCode, setCurrencyCode] = useLocalStorage<string | null>('currency', null);
  const { isHidden } = useSecurity();
  
  const theme = useMemo(() => themes.find(t => t.name === themeName) || themes[0], [themeName]);
  const currency = useMemo(() => currencies.find(c => c.code === currencyCode) || null, [currencyCode]);

  useEffect(() => {
    const root = window.document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value as string);
    });
  }, [theme]);
  
  const setTheme = (newTheme: Theme) => {
    setThemeName(newTheme.name);
  };
  
  const setCurrency = (newCurrency: Currency | null) => {
      setCurrencyCode(newCurrency ? newCurrency.code : null);
  };

  const formatCurrency = (amount: number) => {
    // Respect Hide Balances privacy setting globally
    if (isHidden) return '••••••';
    if (!currency) return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    
    const locale = currency.code === 'INR' ? 'en-IN' : 'en-US';

    const formattedAmount = new Intl.NumberFormat(locale, { 
        minimumFractionDigits: currency.decimalDigits, 
        maximumFractionDigits: currency.decimalDigits 
    }).format(amount);

    return currency.symbolPosition === 'before'
      ? `${currency.symbol}${formattedAmount}`
      : `${formattedAmount} ${currency.symbol}`;
  };

  const value = { theme, setTheme, currency, setCurrency, formatCurrency };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
