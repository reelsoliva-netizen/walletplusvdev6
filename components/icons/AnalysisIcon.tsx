
import React from 'react';

interface IconProps {
  className?: string;
}

const AnalysisIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3v18h18"></path>
    <path d="M18.7 8a6 6 0 0 0-6 0"></path>
    <path d="M12.7 14a6 6 0 0 0-6 0"></path>
    <path d="M6.7 20a6 6 0 0 0-6 0"></path>
  </svg>
);

export default AnalysisIcon;
