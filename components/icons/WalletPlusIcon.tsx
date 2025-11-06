import React from 'react';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

const WalletPlusIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 258 205" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
        <defs>
            <linearGradient id="wallet-body-grad" x1="129" y1="0" x2="129" y2="205" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F97316"/>
                <stop offset="1" stopColor="#EA580C"/>
            </linearGradient>
            <linearGradient id="plus-grad" x1="129" y1="70" x2="129" y2="152" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDBA74"/>
                <stop offset="1" stopColor="#FDE047"/>
            </linearGradient>
        </defs>
        <path d="M232.091 176.439H25.9091C11.6291 176.439 0 164.81 0 150.53V40.2091C0 25.9291 11.6291 14.3 25.9091 14.3H232.091C246.371 14.3 258 25.9291 258 40.2091V150.53C258 164.81 246.371 176.439 232.091 176.439Z" fill="url(#wallet-body-grad)"/>
        <path d="M258 57.5607C258 43.2807 246.371 31.6516 232.091 31.6516H25.9091C11.6291 31.6516 0 43.2807 0 57.5607V192.05C0 200.04 6.70001 206.5 14.8636 206.5H243.136C251.3 206.5 258 200.04 258 192.05V57.5607Z" fill="url(#wallet-body-grad)"/>
        <path d="M239.545 40.2091H18.4545C8.27273 40.2091 0 31.9364 0 21.7545V14.3C0 6.41273 6.41273 0 14.3 0H243.7C251.587 0 258 6.41273 258 14.3V21.7545C258 31.9364 249.727 40.2091 239.545 40.2091Z" fill="#FB923C"/>
        <path d="M254.591 118.845C254.591 114.636 251.182 111.227 247 111.227H231.227C227.045 111.227 223.636 114.636 223.636 118.845V118.845C223.636 123.055 227.045 126.464 231.227 126.464H247C251.182 126.464 254.591 123.055 254.591 118.845V118.845Z" fill="#FB923C"/>
        <circle cx="239.114" cy="118.845" r="7.63636" fill="white"/>
        <path d="M156.409 111.227H101.591C97.1364 111.227 93.4545 107.545 93.4545 103.091V103.091C93.4545 98.6364 97.1364 94.9545 101.591 94.9545H156.409C160.864 94.9545 164.545 98.6364 164.545 103.091V103.091C164.545 107.545 160.864 111.227 156.409 111.227Z" transform="rotate(90 129 111)" fill="url(#plus-grad)"/>
        <path d="M156.409 111.227H101.591C97.1364 111.227 93.4545 107.545 93.4545 103.091V103.091C93.4545 98.6364 97.1364 94.9545 101.591 94.9545H156.409C160.864 94.9545 164.545 98.6364 164.545 103.091V103.091C164.545 107.545 160.864 111.227 156.409 111.227Z" fill="url(#plus-grad)"/>
    </svg>
);

export default WalletPlusIcon;
