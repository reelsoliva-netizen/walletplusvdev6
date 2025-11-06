
import React from 'react';

interface IconProps {
  className?: string;
}

const TransactionIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3v18"></path>
    <path d="M17 8l-5 5-5-5"></path>
    <path d="M7 16l5-5 5 5"></path>
  </svg>
);

export default TransactionIcon;
