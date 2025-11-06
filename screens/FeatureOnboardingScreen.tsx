import React, { useState, useMemo } from 'react';
import TransactionIcon from '../components/icons/TransactionIcon';
import AnalysisIcon from '../components/icons/AnalysisIcon';
import GoalsIcon from '../components/icons/GoalsIcon';

interface FeatureOnboardingScreenProps {
  onComplete: () => void;
}

const features = [
  {
    icon: TransactionIcon,
    title: 'Track Everything',
    description: 'Log income and expenses effortlessly. See where money goes.',
  },
  {
    icon: AnalysisIcon,
    title: 'Smart Analysis',
    description: 'Understand habits with clear charts and insights.',
  },
  {
    icon: GoalsIcon,
    title: 'Reach Your Goals',
    description: 'Set savings goals and track progress toward milestones.',
  },
];

const FeatureOnboardingScreen: React.FC<FeatureOnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const isLastStep = currentStep === features.length - 1;
  const feature = features[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-8 text-center animate-fade-in"
         style={{
           background: 'radial-gradient(1200px 600px at 50% 0%, #1a1a1a 0%, #0d0d0d 60%)'
         }}>
      <div className="flex-grow flex flex-col items-center justify-center text-light-900">
        <div className="w-28 h-28 rounded-full flex items-center justify-center mb-8 animate-scale-up"
             style={{
               background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
               boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2)'
             }}>
          <feature.icon className="w-14 h-14" style={{ color: '#d4af37' }} />
        </div>
        <h2 className="text-4xl font-extrabold mb-3 tracking-tight animate-slide-down" style={{ color: '#e6c763' }}>{feature.title}</h2>
        <p className="max-w-sm animate-fade-in" style={{ color: '#c9b68a', animationDelay: '0.2s' }}>{feature.description}</p>
      </div>

      <div className="flex-shrink-0 w-full max-w-xs">
        <div className="flex justify-center gap-2 mb-8">
          {features.map((_, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-full transition-transform"
              style={{
                backgroundColor: currentStep === index ? '#d4af37' : '#333333',
                transform: currentStep === index ? 'scale(1.2)' : 'scale(1)'
              }}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="w-full p-4 font-bold rounded-lg text-lg transition-opacity"
          style={{
            background: 'linear-gradient(135deg, #d4af37 0%, #b08d28 100%)',
            color: '#0d0d0d',
            boxShadow: '0 10px 24px rgba(212, 175, 55, 0.35)'
          }}
        >
          {isLastStep ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default FeatureOnboardingScreen;
