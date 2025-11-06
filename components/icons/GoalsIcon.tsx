
import React from 'react';

interface IconProps {
  className?: string;
}

const GoalsIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21A2.48 2.48 0 0 1 8 19.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5c0-.83-.42-1.54-1.03-1.99A2.4 2.4 0 0 0 14 17v-2.34"/>
        <path d="M8.5 12.5C12.5 12.5 14 10.5 14 5V.5L12 3 10 5V.5L8 3l-2 2V5c0 5.5 1.5 7.5 5.5 7.5z"/>
    </svg>
);

export default GoalsIcon;
