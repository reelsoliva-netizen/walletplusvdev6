import React from 'react';

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ className, style }) => (
  <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <defs>
      <linearGradient id="walletGradient" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#FFA500" />
        <stop offset="100%" stopColor="#FF6B35" />
      </linearGradient>
       <linearGradient id="walletFlapGradient" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#FFB520" />
        <stop offset="100%" stopColor="#FFA500" />
      </linearGradient>
      <linearGradient id="plusGradient" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#FDB813" />
      </linearGradient>
      <filter id="logo-glow">
        <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="var(--color-primary)" floodOpacity="0.6" />
      </filter>
    </defs>
    <g filter="url(#logo-glow)">
      {/* Main Wallet Body */}
      <path d="M90,75H10C4.5,75,0,70.5,0,65V25c0-5.5,4.5-10,10-10H90c5.5,0,10,4.5,10,10V65C100,70.5,95.5,75,90,75Z" fill="url(#walletGradient)"/>
      
      {/* Wallet Flap */}
      <path d="M95,20H5C2.2,20,0,17.8,0,15V10C0,4.5,4.5,0,10,0H90c5.5,0,10,4.5,10,10v5c0,2.8-2.2,5-5,5Z" fill="url(#walletFlapGradient)" />

      {/* Clasp */}
      <path d="M98,48H88V32h10c1.1,0,2,0.9,2,2v12C100,47.1,99.1,48,98,48Z" fill="url(#walletGradient)" />
      <circle cx="94" cy="40" r="3" fill="#FFF" />
      
      {/* Plus Symbol */}
      <path d="M41,45 H59 M50,36 V54" stroke="url(#plusGradient)" strokeWidth="8" strokeLinecap="round"/>
    </g>
  </svg>
);

export default Logo;