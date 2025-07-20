import React from 'react';

const BankIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m3 21 18 0"/>
        <path d="M5 21V8l7-5 7 5v13"/>
        <path d="M9 21v-5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5"/>
        <path d="M12 12h.01"/>
    </svg>
);

export default BankIcon;
