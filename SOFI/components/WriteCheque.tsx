import React, { useState, useEffect, useMemo } from 'react';
import { User, Transaction } from '../types';
import { KNOWN_BUSINESSES } from '../constants';
import Card from './common/Card';
import SpinnerIcon from './icons/SpinnerIcon';
import VerifiedIcon from './icons/VerifiedIcon';
import WarningIcon from './icons/WarningIcon';

interface WriteChequeProps {
  user: User;
  onAddTransaction: (newTransactionData: Omit<Transaction, 'id' | 'status' | 'date'>) => void;
}

const WriteCheque: React.FC<WriteChequeProps> = ({ user, onAddTransaction }) => {
  const [payee, setPayee] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState('');
  const [isBusiness, setIsBusiness] = useState(false);
  const [regNumber, setRegNumber] = useState('');
  const [tillNumber, setTillNumber] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified' | 'failed'>('idle');

  useEffect(() => {
    let verificationTimeout: ReturnType<typeof setTimeout>;
    if (isBusiness && payee.trim() && regNumber.trim() && tillNumber.trim()) {
      setVerificationStatus('verifying');
      verificationTimeout = setTimeout(() => {
        const foundBusiness = KNOWN_BUSINESSES.find(
          b => b.name.toLowerCase() === payee.trim().toLowerCase() &&
               b.regNumber === regNumber.trim() &&
               b.tillNumber === tillNumber.trim()
        );
        if (foundBusiness) {
          setVerificationStatus('verified');
        } else {
          setVerificationStatus('failed');
        }
      }, 1500);
    } else {
      setVerificationStatus('idle');
    }
    return () => clearTimeout(verificationTimeout);
  }, [payee, isBusiness, regNumber, tillNumber]);

  useEffect(() => {
    // Reset fields when toggling business status
    setRegNumber('');
    setTillNumber('');
    setVerificationStatus('idle');
  }, [isBusiness]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payee || !amount) {
      setError('Payee and Amount are required.');
      return;
    }
    if (amount > user.balance) {
      setError('Amount exceeds your current balance.');
      return;
    }
    if (isBusiness && verificationStatus !== 'verified') {
        setError('Business details must be verified before sending.');
        return;
    }
    setError('');
    onAddTransaction({ payee, amount, memo });
  };

  const isSubmitDisabled = useMemo(() => {
    const baseInvalid = !payee || !amount || amount > user.balance;
    let businessInvalid = false;
    if(isBusiness) {
        businessInvalid = verificationStatus !== 'verified' || !regNumber.trim() || !tillNumber.trim();
    }
    return baseInvalid || businessInvalid || verificationStatus === 'verifying';
  }, [payee, amount, user.balance, isBusiness, verificationStatus, regNumber, tillNumber]);
  
  const VerificationIcon = () => {
    if (verificationStatus === 'verifying') return <SpinnerIcon className="w-5 h-5 text-primary" />;
    if (verificationStatus === 'verified') return <VerifiedIcon className="w-5 h-5 text-green-500" />;
    if (verificationStatus === 'failed') return <WarningIcon className="w-5 h-5 text-red-500" />;
    return null;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Send a New Payment</h2>
      <Card className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <p className="font-bold text-lg">{user.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Account: {user.accountNumber}</p>
            </div>
            <div className="text-right">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
              <input
                type="text"
                id="date"
                readOnly
                value={new Date().toLocaleDateString()}
                className="mt-1 p-2 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-center"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start space-x-4">
              <label htmlFor="payee" className="text-lg font-semibold whitespace-nowrap pt-3">Pay to the order of</label>
              <div className="flex-grow">
                  <div className="relative">
                    <input
                      type="text"
                      id="payee"
                      value={payee}
                      onChange={(e) => setPayee(e.target.value)}
                      placeholder="Enter payee's name"
                      className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    {isBusiness && <div className="absolute inset-y-0 right-0 flex items-center pr-3"><VerificationIcon /></div>}
                </div>
                 <div className="flex items-center justify-end space-x-2 mt-2">
                    {verificationStatus === 'failed' && <p className="text-xs text-red-500 mr-auto">Business details could not be verified.</p>}
                    <label htmlFor="isBusiness" className="flex items-center space-x-2 cursor-pointer text-sm">
                        <input type="checkbox" id="isBusiness" checked={isBusiness} onChange={(e) => setIsBusiness(e.target.checked)} className="rounded text-primary focus:ring-primary" />
                        <span>This is a payment to a business</span>
                    </label>
                </div>
              </div>
            </div>

            {isBusiness && (
                <div className="pl-6 ml-[188px] space-y-4 -mt-1 transition-all duration-500 ease-in-out">
                    <div className="relative">
                        <label htmlFor="regNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Registration No.</label>
                        <input
                            type="text"
                            id="regNumber"
                            value={regNumber}
                            onChange={(e) => setRegNumber(e.target.value)}
                            placeholder="e.g., REG-12345"
                            className="w-full mt-1 p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="tillNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Paybill/Till No.</label>
                        <input
                            type="text"
                            id="tillNumber"
                            value={tillNumber}
                            onChange={(e) => setTillNumber(e.target.value)}
                            placeholder="e.g., 555111"
                            className="w-full mt-1 p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <label htmlFor="amount" className="text-lg font-semibold">$</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
              placeholder="0.00"
              className="w-48 p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg focus:ring-2 focus:ring-primary focus:outline-none"
              step="0.01"
              min="0.01"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label htmlFor="memo" className="text-lg font-semibold">Memo</label>
            <input
              type="text"
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="e.g., Monthly rent, Invoice #123"
              className="flex-grow p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Send Payment
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default WriteCheque;