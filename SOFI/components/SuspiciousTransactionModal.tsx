import React, { useState } from 'react';
import { Transaction } from '../types';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import MapPinIcon from './icons/MapPinIcon';

interface SuspiciousTransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
  onResolve: (txId: string, action: 'safe' | 'fraud') => void;
}

const SuspiciousTransactionModal: React.FC<SuspiciousTransactionModalProps> = ({ transaction, onClose, onResolve }) => {
    const [action, setAction] = useState<'safe' | 'fraud' | null>(null);

    const handleResolve = () => {
        if (action) {
            onResolve(transaction.id, action);
        }
    }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-2xl w-full max-w-lg m-4 transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <AlertTriangleIcon className="w-8 h-8 text-red-500 mr-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Review Suspicious Transaction</h2>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            A transaction requires your approval. Please review the details below to ensure your account is secure.
          </p>
          
          <div className="bg-secondary dark:bg-dark-bg p-4 rounded-lg space-y-3">
             <div className="flex justify-between items-baseline">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Payee:</span>
                <span className="font-mono text-lg text-gray-900 dark:text-white">{transaction.payee}</span>
            </div>
             <div className="flex justify-between items-baseline">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Amount:</span>
                <span className="font-mono text-2xl font-bold text-primary dark:text-accent">${transaction.amount.toFixed(2)}</span>
            </div>
             <div className="flex justify-between items-baseline">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Date:</span>
                <span className="font-mono text-lg text-gray-900 dark:text-white">{new Date(transaction.date).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="border-t border-dashed dark:border-gray-600 my-4"></div>

          <div>
             <h3 className="font-semibold text-lg mb-2 text-gray-700 dark:text-gray-200">Activity Details</h3>
             <div className="bg-secondary dark:bg-dark-bg p-4 rounded-lg flex items-start space-x-4">
                <MapPinIcon className="w-10 h-10 text-primary dark:text-accent flex-shrink-0 mt-1"/>
                <div>
                    <p className="font-bold text-gray-800 dark:text-white">{transaction.location || 'Unknown Location'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Device: {transaction.device || 'N/A'}</p>
                </div>
             </div>
          </div>

           <div className="pt-2">
                <p className="text-center font-semibold text-gray-700 dark:text-gray-300">Do you recognize this transaction?</p>
                <div className="flex justify-center space-x-4 mt-3">
                     <button 
                        onClick={() => setAction('safe')}
                        className={`px-6 py-2 rounded-lg font-bold w-40 transition-all ${action === 'safe' ? 'bg-green-600 text-white ring-2 ring-green-400' : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300'}`}>
                         This was me
                    </button>
                    <button 
                        onClick={() => setAction('fraud')}
                        className={`px-6 py-2 rounded-lg font-bold w-40 transition-all ${action === 'fraud' ? 'bg-red-600 text-white ring-2 ring-red-400' : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300'}`}>
                        This wasn't me
                    </button>
                </div>
           </div>

        </div>

        <div className="bg-gray-50 dark:bg-dark-bg/50 px-6 py-4 flex justify-end space-x-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 rounded-md font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleResolve}
            disabled={!action}
            className="px-6 py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuspiciousTransactionModal;