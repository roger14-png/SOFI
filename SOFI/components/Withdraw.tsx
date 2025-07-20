import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, Transaction } from '../types';
import Card from './common/Card';
import SpinnerIcon from './icons/SpinnerIcon';
import BankIcon from './icons/BankIcon';
import MobileIcon from './icons/MobileIcon';
import AgentIcon from './icons/AgentIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface WithdrawProps {
  user: User;
  onWithdraw: (data: { amount: number; destination: string; payee: string }, onSuccess: (tx: Transaction) => void) => void;
  onComplete: () => void;
}

const DestinationOption: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ icon, title, description, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-lg border-2 flex items-center cursor-pointer transition-all duration-200 ${
      isSelected
        ? 'border-primary bg-primary/10 shadow-md'
        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card hover:border-primary/50 hover:bg-primary/5'
    }`}
    role="radio"
    aria-checked={isSelected}
    tabIndex={0}
  >
    <div className="mr-4 text-primary dark:text-accent">{icon}</div>
    <div>
      <h4 className="font-bold text-gray-800 dark:text-white">{title}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

const Withdraw: React.FC<WithdrawProps> = ({ user, onWithdraw, onComplete }) => {
  const [stage, setStage] = useState<'form' | 'verifying' | 'success'>('form');
  const [amount, setAmount] = useState<number | ''>('');
  const [destination, setDestination] = useState('');
  const [error, setError] = useState('');
  
  const [verificationText, setVerificationText] = useState('Verifying Transaction...');
  const [successData, setSuccessData] = useState<Transaction | null>(null);

  useEffect(() => {
    if (user.accountType === 'corporate') {
      setDestination('bank');
    }
  }, [user.accountType]);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const value = e.target.value;
    setAmount(value === '' ? '' : parseFloat(value));
  };
  
  const handleDestinationChange = (dest: string) => {
    setError('');
    setDestination(dest);
  };

  const handleSubmit = () => {
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (amount > user.balance) {
      setError('Withdrawal amount cannot exceed your balance.');
      return;
    }
    if (!destination) {
      setError('Please select a withdrawal destination.');
      return;
    }
    setError('');
    setStage('verifying');
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (stage === 'verifying') {
      const verificationSteps = [
        "Checking source integrity...", 
        "Running AI-based fraud checks...", 
        "Contacting payment provider...",
        "Finalizing..."
      ];
      let step = 0;
      
      const updateText = () => {
        setVerificationText(verificationSteps[step]);
        step++;
      };
      
      timer = setInterval(updateText, 1200);

      // Final callback after all steps simulated
      setTimeout(() => {
        clearInterval(timer);
        const payeeMap: { [key: string]: string } = {
          bank: "Linked Business Bank",
          wallet: "Mobile Wallet Deposit",
          agent: "Cheque Flow Agent"
        };
        const payee = payeeMap[destination] || "Withdrawal";
        onWithdraw({ amount: Number(amount), destination, payee }, (tx) => {
          setSuccessData(tx);
          setStage('success');
        });
      }, 1200 * verificationSteps.length + 500);
    }
    return () => clearInterval(timer);
  }, [stage, amount, destination, onWithdraw]);
  
  const isSubmitDisabled = useMemo(() => {
      return !amount || !destination || amount > user.balance || stage !== 'form';
  }, [amount, destination, user.balance, stage]);

  const personalDestinations = [
    { id: 'wallet', icon: <MobileIcon className="w-8 h-8"/>, title: "Mobile Wallet", description: "Direct deposit to M-Pesa, Airtel, etc." },
    { id: 'agent', icon: <AgentIcon className="w-8 h-8"/>, title: "Cheque Flow Agent", description: "Generate a token to cash-out at an agent." }
  ];

  if (stage === 'verifying') {
    return (
      <Card className="max-w-xl mx-auto text-center animate-fade-in flex flex-col items-center justify-center p-12 h-96">
        <SpinnerIcon className="w-16 h-16 text-primary mb-6" />
        <h3 className="text-2xl font-bold mb-2">Processing Withdrawal</h3>
        <p className="text-gray-500 dark:text-gray-400 transition-all duration-300">{verificationText}</p>
      </Card>
    );
  }

  if (stage === 'success' && successData) {
    return (
      <Card className="max-w-xl mx-auto text-center animate-fade-in p-8">
        <CheckCircleIcon className="w-20 h-20 text-success mx-auto mb-4" />
        <h3 className="text-3xl font-bold mb-2">Withdrawal Successful!</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The funds have been successfully processed.</p>
        <div className="bg-secondary dark:bg-dark-bg p-4 rounded-lg text-left space-y-3 mb-6">
          <div className="flex justify-between"><span className="font-semibold">Amount:</span> <span className="font-mono text-lg font-bold">${successData.amount.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="font-semibold">To:</span> <span className="font-mono">{successData.payee}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Transaction ID:</span> <span className="font-mono text-xs">{successData.id}</span></div>
          {destination === 'agent' && (
            <div className="flex justify-between pt-2 border-t border-dashed dark:border-gray-600"><span className="font-semibold">Withdrawal Token:</span> <span className="font-mono text-green-600 dark:text-green-400 font-bold tracking-widest">WDL-{String(successData.id).slice(-6).toUpperCase()}</span></div>
          )}
        </div>
        <button onClick={onComplete} className="w-full px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-lg">
          Done
        </button>
      </Card>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Withdraw Funds</h2>
      <Card className="max-w-4xl mx-auto">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="p-4 space-y-6">
          <div>
            <label htmlFor="amount" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-2xl text-gray-500">$</span>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full text-4xl font-bold p-3 pl-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg focus:ring-2 focus:ring-primary focus:outline-none"
                step="0.01"
                min="0.01"
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-right">Available Balance: ${user.balance.toLocaleString()}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Destination</h3>
            {user.accountType === 'corporate' ? (
              <DestinationOption 
                icon={<BankIcon className="w-8 h-8"/>} 
                title="Business Bank Account"
                description="Funds will be sent to your linked business account."
                isSelected={true}
                onClick={() => {}}
              />
            ) : (
              <div className="space-y-4">
                {personalDestinations.map(dest => (
                  <DestinationOption
                    key={dest.id}
                    {...dest}
                    isSelected={destination === dest.id}
                    onClick={() => handleDestinationChange(dest.id)}
                  />
                ))}
              </div>
            )}
          </div>
          
          {error && <p className="text-red-500 text-sm text-center animate-fade-in">{error}</p>}
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="px-10 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Withdraw Funds
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Withdraw;