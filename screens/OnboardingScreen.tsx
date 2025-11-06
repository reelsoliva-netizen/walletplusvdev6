import React from 'react';
import WalletPlusIcon from '../components/icons/WalletPlusIcon';

const OnboardingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-dark-900 z-[100] flex flex-col items-center justify-center p-4 text-light-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-light-900 mb-4">
          Wallet+
        </h1>
        <WalletPlusIcon className="w-32 h-32 mx-auto mb-8" />
        <p className="text-light-800 text-lg">
          Your Personal Finance Companion
        </p>
      </div>
    </div>
  );
};

export default OnboardingScreen;