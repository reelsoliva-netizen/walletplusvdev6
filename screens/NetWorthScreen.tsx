import React from 'react';
import type { NetWorthSnapshot } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useSettings } from '../contexts/SettingsContext';

interface NetWorthScreenProps {
  netWorthHistory: NetWorthSnapshot[];
  currentNetWorth: number;
}

const NetWorthScreen: React.FC<NetWorthScreenProps> = ({ netWorthHistory, currentNetWorth }) => {
  const { formatCurrency } = useSettings();
  const chartData = netWorthHistory.map(snapshot => ({
    name: new Date(snapshot.date).toLocaleDateString('default', { month: 'short', year: '2-digit' }),
    'Net Worth': snapshot.netWorth,
  }));

  return (
    <div className="p-4 text-light-900">
      <h1 className="text-2xl font-bold mb-4">Net Worth</h1>
      
      <div className="bg-dark-700 p-5 rounded-2xl mb-6">
        <p className="text-light-800 text-sm">Current Net Worth</p>
        <p className="text-3xl font-bold text-primary">{formatCurrency(currentNetWorth)}</p>
      </div>

      <div className="bg-dark-700 p-4 rounded-2xl">
        <h2 className="text-xl font-bold mb-4">History</h2>
        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" stroke="#A0A0A0" />
              <YAxis stroke="#A0A0A0" tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value as number)} />
              <Tooltip cursor={{ fill: 'rgba(255, 149, 0, 0.1)' }} contentStyle={{ backgroundColor: '#2A2A2A', border: 'none', borderRadius: '1rem' }} />
              <Line type="monotone" dataKey="Net Worth" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-light-800 py-10">Not enough data to display chart. Check back later.</p>
        )}
      </div>
    </div>
  );
};

export default NetWorthScreen;