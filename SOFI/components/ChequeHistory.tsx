import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, TransactionStatus } from '../types';
import Card from './common/Card';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import SearchIcon from './icons/SearchIcon';

const StatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
  const baseClasses = 'px-3 py-1 text-xs font-bold rounded-full inline-block transition-colors duration-300';
  const statusClasses = {
    [TransactionStatus.Completed]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    [TransactionStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    [TransactionStatus.Initiated]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    [TransactionStatus.Cancelled]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

interface ChequeHistoryProps {
    transactions: Transaction[];
    newTransactionId?: string | null;
    onReviewSuspicious: (transaction: Transaction) => void;
}

const ChequeHistory: React.FC<ChequeHistoryProps> = ({ transactions, newTransactionId, onReviewSuspicious }) => {
  const [filter, setFilter] = useState<TransactionStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    if (newTransactionId) {
        setHighlightedId(newTransactionId);
        const timer = setTimeout(() => {
            setHighlightedId(null);
        }, 4000); // Highlight for 4 seconds
        return () => clearTimeout(timer);
    }
  }, [newTransactionId]);

  const filteredTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const statusFiltered = filter === 'all'
      ? sorted
      : sorted.filter(transaction => transaction.status === filter);

    if (!searchQuery.trim()) {
      return statusFiltered;
    }

    const query = searchQuery.toLowerCase();
    return statusFiltered.filter(transaction =>
      transaction.payee.toLowerCase().includes(query) ||
      transaction.memo.toLowerCase().includes(query) ||
      transaction.amount.toString().includes(query)
    );
  }, [transactions, filter, searchQuery]);

  const filterOptions: { value: TransactionStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: TransactionStatus.Initiated, label: 'Initiated' },
    { value: TransactionStatus.Pending, label: 'Pending' },
    { value: TransactionStatus.Completed, label: 'Completed' },
    { value: TransactionStatus.Cancelled, label: 'Cancelled' },
  ];

  return (
    <div>
       {newTransactionId && !transactions.find(t => t.id === newTransactionId)?.isSuspicious && (
        <div className="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-800 dark:text-green-200 p-4 mb-6 rounded-md shadow-md" role="alert">
            <p className="font-bold">Success!</p>
            <p>Your payment has been initiated and is now being processed.</p>
        </div>
      )}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Transaction History</h2>
        <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                </span>
                <input
                    type="text"
                    placeholder="Search payee, memo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 pl-10"
                    aria-label="Search transactions"
                />
            </div>
            <div className="flex items-center space-x-2">
                <label htmlFor="status-filter" className="text-sm font-medium">Filter by status:</label>
                <select
                    id="status-filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as TransactionStatus | 'all')}
                    className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
                >
                    {filterOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>
        </div>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payee</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Memo</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} 
                    className={`transition-all duration-500 
                        ${highlightedId === transaction.id ? 'bg-yellow-100 dark:bg-yellow-800/40' : ''}
                        ${transaction.isSuspicious ? 'bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/40 cursor-pointer' : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'}`
                    }
                    onClick={() => transaction.isSuspicious && onReviewSuspicious(transaction)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{transaction.payee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{transaction.memo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center justify-end">
                      {transaction.isSuspicious && <AlertTriangleIcon className="w-4 h-4 text-red-500 mr-2" />}
                      <span>${transaction.amount.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <StatusBadge status={transaction.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            {filteredTransactions.length === 0 && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    <p>No transactions match your criteria.</p>
                </div>
            )}
        </div>
      </Card>
    </div>
  );
};

export default ChequeHistory;