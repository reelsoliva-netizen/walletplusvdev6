import React from 'react';
import type { Goal } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import PlusIcon from '../components/icons/PlusIcon';
import EditIcon from '../components/icons/EditIcon';
import TrashIcon from '../components/icons/TrashIcon';

interface GoalsScreenProps {
  goals: Goal[];
  onContribute: (goal: Goal) => void;
  onAddGoal: () => void;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
}

const GoalProgressBar: React.FC<{ goal: Goal }> = React.memo(({ goal }) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  return (
    <div className="w-full bg-dark-800 rounded-full h-2.5">
      <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress > 100 ? 100 : progress}%` }}></div>
    </div>
  );
});

const GoalsScreen: React.FC<GoalsScreenProps> = ({ goals, onContribute, onAddGoal, onEditGoal, onDeleteGoal }) => {
  const { formatCurrency } = useSettings();

  return (
    <div className="p-4 text-light-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Savings Goals</h1>
        <button onClick={onAddGoal} className="p-2 bg-primary rounded-full text-dark-900">
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-6">
        {goals.length > 0 ? (
          goals.map(goal => (
            <div key={goal.id} className="bg-dark-700 p-5 rounded-2xl shadow-lg space-y-3">
              <div className="flex items-start justify-between">
                <div>
                    <p className="text-lg font-semibold">{goal.name}</p>
                    <p className="text-sm text-light-800">Due: {new Date(goal.deadline).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {goal.currentAmount < goal.targetAmount && (
                        <button onClick={() => onContribute(goal)} className="px-4 py-2 bg-primary text-dark-900 text-sm font-bold rounded-full">Contribute</button>
                    )}
                    <button onClick={() => onEditGoal(goal)} className="text-light-800 hover:text-primary p-1"><EditIcon className="w-4 h-4" /></button>
                    <button onClick={() => onDeleteGoal(goal.id)} className="text-light-800 hover:text-red-500 p-1"><TrashIcon className="w-4 h-4" /></button>
                </div>
              </div>
              <GoalProgressBar goal={goal} />
              <div className="flex items-center justify-between text-sm">
                <p className="text-primary font-bold">{formatCurrency(goal.currentAmount)}</p>
                <p className="text-light-800">{formatCurrency(goal.targetAmount)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-light-800">No savings goals set.</p>
            <p className="text-sm text-light-800/70">Tap the '+' button to add a goal and start saving.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsScreen;