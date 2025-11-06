
import React from 'react';

interface IconProps {
  className?: string;
}

const TaxIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 9.5a2.5 2.5 0 0 1 0-5h10a2.5 2.5 0 0 1 0 5H2Z"></path>
        <path d="M12 4.5V2"></path>
        <path d="M12 10v-1"></path>
        <path d="m15 12-3-3-3 3"></path>
        <path d="M12 15.5V14"></path>
        <path d="M8.5 10a2.5 2.5 0 0 1 0-5h10a2.5 2.5 0 0 1 0 5H8.5Z"></path>
        <path d="M14.5 18a2.5 2.5 0 0 1 0-5h-10a2.5 2.5 0 0 0 0 5h10Z"></path>
        <path d="M22 13h-2"></path>
        <path d="M4.5 13H2"></path>
        <path d="m19 22-3-3-3 3"></path>
    </svg>
);

export default TaxIcon;
