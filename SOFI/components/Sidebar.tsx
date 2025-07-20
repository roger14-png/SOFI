import React from 'react';
import HomeIcon from './icons/HomeIcon';
import WriteIcon from './icons/WriteIcon';
import HistoryIcon from './icons/HistoryIcon';
import BookIcon from './icons/BookIcon';
import LockIcon from './icons/LockIcon';
import SecurityIcon from './icons/SecurityIcon';
import WithdrawIcon from './icons/WithdrawIcon';
import { Icon } from './icons/Icon';

type View = 'dashboard' | 'write' | 'history' | 'reissue' | 'security' | 'withdraw';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  onLogout: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-primary text-white shadow-lg'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}
  >
    <Icon className="mr-3">{icon}</Icon>
    <span className="flex-1 text-left">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
    { id: 'write', label: 'Send Payment', icon: <WriteIcon /> },
    { id: 'withdraw', label: 'Withdraw Funds', icon: <WithdrawIcon /> },
    { id: 'history', label: 'Transactions', icon: <HistoryIcon /> },
    { id: 'security', label: 'Security Center', icon: <SecurityIcon /> },
    { id: 'reissue', label: 'Account Settings', icon: <BookIcon /> },
  ];

  return (
    <div className="w-64 bg-white dark:bg-dark-card p-4 flex flex-col shadow-lg z-10">
      <div className="flex items-center mb-10 px-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
        <h1 className="text-xl font-bold ml-2 text-gray-800 dark:text-white">SOFI</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map(item => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={currentView === item.id}
            onClick={() => setCurrentView(item.id as View)}
          />
        ))}
      </nav>
      <div className="mt-auto space-y-2">
         <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <Icon className="mr-3"><LockIcon /></Icon>
            <span className="flex-1 text-left">Logout</span>
          </button>
        <div className="p-2 bg-secondary dark:bg-dark-bg rounded-lg text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Secure & Reliable</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">&copy; {new Date().getFullYear()} SOFI Inc.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
