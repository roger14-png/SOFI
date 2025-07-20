
import React from 'react';
import { User } from '../types';
import ShieldCheckIcon from './icons/ShieldCheckIcon';

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const displayName = user.accountType === 'personal' ? user.name.split(' ')[0] : user.name;

  return (
    <header className="bg-white dark:bg-dark-card shadow-sm p-4 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome back, {displayName}!</h2>
        <div className="flex items-center space-x-2 text-success mt-1">
          <ShieldCheckIcon className="w-5 h-5" />
          <span className="text-sm font-semibold">Account Secure</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="font-semibold text-gray-700 dark:text-gray-200">Current Balance</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
         <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
            {user.name.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default Header;