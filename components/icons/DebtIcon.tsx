
import React from 'react';

interface IconProps {
  className?: string;
}

const DebtIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 13v2.5a2.5 2.5 0 0 1-5 0V13a2.5 2.5 0 0 1 5 0Z"></path>
        <path d="M12 11V8"></path>
        <path d="M12 21a9 9 0 0 0 0-18 9 9 0 0 0 0 18Z"></path>
    </svg>
);

export default DebtIcon;