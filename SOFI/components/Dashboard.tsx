import React, { useState, useMemo, useCallback } from 'react';
import { User, Transaction, TransactionStatus } from '../types';
import { analyzeSpending } from '../services/geminiService';
import Card from './common/Card';
import BotIcon from './icons/BotIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';

interface DashboardProps {
  user: User;
  transactions: Transaction[];
  onReviewSuspicious: (transaction: Transaction) => void;
}

const StatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
  const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';
  const statusClasses = {
    [TransactionStatus.Completed]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    [TransactionStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    [TransactionStatus.Initiated]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    [TransactionStatus.Cancelled]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const Dashboard: React.FC<DashboardProps> = ({ user, transactions, onReviewSuspicious }) => {
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const recentTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);
  }, [transactions]);

  const suspiciousTransactions = useMemo(() => {
    return transactions.filter(t => t.isSuspicious);
  }, [transactions]);

  const handleAnalysis = useCallback(async () => {
    if (!assistantPrompt.trim()) return;
    setIsLoading(true);
    setAssistantResponse('');
    const response = await analyzeSpending(transactions, assistantPrompt);
    setAssistantResponse(response);
    setIsLoading(false);
  }, [assistantPrompt, transactions]);

  return (
    <div className="space-y-8">
      {suspiciousTransactions.length > 0 && (
        <Card className="bg-red-100 dark:bg-red-900/30 border border-red-400 animate-fade-in">
          <div className="flex items-center">
            <AlertTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400 mr-4" />
            <div className="flex-grow">
              <h3 className="font-bold text-red-800 dark:text-red-200">Security Alert</h3>
              <p className="text-red-700 dark:text-red-300">
                We've detected {suspiciousTransactions.length} suspicious transaction(s). Please review them immediately.
              </p>
            </div>
            <button
              onClick={() => onReviewSuspicious(suspiciousTransactions[0])}
              className="ml-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Review Now
            </button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary to-blue-700 text-white">
          <h3 className="font-semibold text-lg opacity-80">Total Balance</h3>
          <p className="text-4xl font-bold mt-2">${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="mt-4 opacity-80">Account: {user.accountNumber}</p>
        </Card>
        <Card>
           <h3 className="font-semibold text-gray-600 dark:text-gray-300">Pending Transactions</h3>
           <p className="text-3xl font-bold mt-2 text-primary dark:text-accent">{transactions.filter(t => t.status === TransactionStatus.Pending).length}</p>
        </Card>
        <Card>
           <h3 className="font-semibold text-gray-600 dark:text-gray-300">Completed this Month</h3>
           <p className="text-3xl font-bold mt-2 text-primary dark:text-accent">${transactions.filter(t => t.status === TransactionStatus.Completed && new Date(t.date).getMonth() === new Date().getMonth()).reduce((sum, c) => sum + c.amount, 0).toLocaleString()}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="lg:col-span-1">
          <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div>
                  <p className="font-semibold">{transaction.payee}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${transaction.amount.toFixed(2)}</p>
                  <StatusBadge status={transaction.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="lg:col-span-1 flex flex-col">
          <div className="flex items-center mb-4">
            <BotIcon className="w-6 h-6 mr-3 text-primary dark:text-accent"/>
            <h3 className="text-xl font-bold">Smart Assistant</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Ask about your spending, e.g., "How much did I spend on utilities?"</p>
          <div className="flex space-x-2">
            <input
              type="text"
              value={assistantPrompt}
              onChange={(e) => setAssistantPrompt(e.target.value)}
              placeholder="Ask a question..."
              className="flex-grow p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg focus:ring-2 focus:ring-primary focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleAnalysis}
              disabled={isLoading || !assistantPrompt.trim()}
              className="px-4 py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Analyzing...' : 'Ask'}
            </button>
          </div>
          {assistantResponse && (
             <div className="mt-4 p-4 bg-secondary dark:bg-dark-bg rounded-lg whitespace-pre-wrap font-mono text-sm">
                {assistantResponse}
             </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;