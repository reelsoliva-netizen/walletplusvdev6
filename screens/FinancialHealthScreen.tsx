import React from 'react';

interface FinancialHealthScreenProps {
  score: number;
  savingsRate: number;
  debtToIncome: number;
  emergencyFundStatus: number;
}

const ScoreGuage: React.FC<{ score: number }> = ({ score }) => {
    const getScoreColor = () => {
        if (score > 75) return 'var(--color-primary)';
        if (score > 50) return '#eab308';
        return '#ef4444';
    }
    const circumference = 2 * Math.PI * 52;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle className="text-dark-800" strokeWidth="10" stroke="currentColor" fill="transparent" r="52" cx="60" cy="60" />
                <circle
                    className="text-primary"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                    style={{ color: getScoreColor(), transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold" style={{ color: getScoreColor() }}>{score}</span>
            </div>
        </div>
    )
}

const FinancialHealthScreen: React.FC<FinancialHealthScreenProps> = ({ score, savingsRate, debtToIncome, emergencyFundStatus }) => {
  const getRecommendation = () => {
    if (score > 75) return "You're in excellent financial shape! Keep up the great work with your savings and managing debt.";
    if (score > 50) return "You're on a solid track, but there's room for improvement. Focusing on increasing your savings rate or paying down debt could boost your score.";
    return "This is a starting point. Let's focus on building a budget, increasing your emergency fund, and creating a plan to tackle debt.";
  }
  return (
    <div className="p-4 text-light-900">
      <h1 className="text-2xl font-bold mb-4">Financial Health</h1>
      
      <div className="bg-dark-700 p-5 rounded-2xl mb-6 flex flex-col items-center">
        <ScoreGuage score={score} />
        <p className="mt-4 text-center text-light-800">{getRecommendation()}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Score Breakdown</h2>
        <div className="bg-dark-700 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{`Savings Rate: ${savingsRate.toFixed(1)}%`}</h3>
            <p className="text-sm text-light-800">This measures how much of your income you're saving. Higher is better!</p>
        </div>
        <div className="bg-dark-700 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{`Debt-to-Income: ${debtToIncome.toFixed(1)}%`}</h3>
            <p className="text-sm text-light-800">This shows how much of your income goes to debt payments. Lower is better.</p>
        </div>
        <div className="bg-dark-700 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{`Emergency Fund: ${emergencyFundStatus.toFixed(1)}% Funded`}</h3>
            <p className="text-sm text-light-800">Your safety net for unexpected expenses. Aim for 100% (3-6 months of expenses).</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialHealthScreen;