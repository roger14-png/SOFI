import React, { useState, useCallback } from 'react';
import { User, Transaction, TransactionStatus } from './types';
import { INITIAL_USER_DATA, INITIAL_TRANSACTIONS, USERS } from './constants';
import { detectSuspiciousActivity } from './services/fraudDetectionService';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import WriteCheque from './components/WriteCheque';
import ChequeHistory from './components/ChequeHistory';
import ReissueChequeBook from './components/ReissueChequeBook';
import Security from './components/Security';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import SuspiciousTransactionModal from './components/SuspiciousTransactionModal';
import Withdraw from './components/Withdraw';

type View = 'dashboard' | 'write' | 'history' | 'reissue' | 'security' | 'withdraw';
type AuthView = 'login' | 'signup';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [user, setUser] = useState<User>(INITIAL_USER_DATA);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [lastAddedTransactionId, setLastAddedTransactionId] = useState<string | null>(null);
  const [suspiciousTxToView, setSuspiciousTxToView] = useState<Transaction | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
    // On login, reset to initial state for that user
    setTransactions(INITIAL_TRANSACTIONS); 
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(INITIAL_USER_DATA); // Reset to default
  };
  
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
      setNotification({ message, type });
      setTimeout(() => {
        setNotification(null);
      }, 4000);
  };

  const handleAddTransaction = useCallback((newTransactionData: Omit<Transaction, 'id' | 'status' | 'date'>) => {
    const fraudCheckResult = detectSuspiciousActivity(newTransactionData);

    const newTransaction: Transaction = {
      ...newTransactionData,
      id: `txn_${Date.now()}`,
      status: TransactionStatus.Initiated,
      date: new Date().toISOString().split('T')[0],
      ...fraudCheckResult,
    };

    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    setUser(prevUser => ({
      ...prevUser,
      balance: prevUser.balance - newTransaction.amount,
    }));

    if (newTransaction.isSuspicious) {
      setSuspiciousTxToView(newTransaction);
    } else {
      setLastAddedTransactionId(newTransaction.id);
      setCurrentView('history');

      setTimeout(() => {
          setTransactions(prev => 
              prev.map(t => 
                  t.id === newTransaction.id ? { ...t, status: TransactionStatus.Pending } : t
              )
          );
      }, 2500);

      const highlightTimer = setTimeout(() => {
          setLastAddedTransactionId(null);
      }, 5000);

      return () => clearTimeout(highlightTimer);
    }
  }, []);

  const handleWithdrawal = useCallback((withdrawalData: { amount: number; destination: string; payee: string }, onSuccess: (transaction: Transaction) => void) => {
    const { amount, destination, payee } = withdrawalData;

    // Withdrawals might have different risk profiles, but we can reuse the same detector for this simulation
    const fraudCheckResult = detectSuspiciousActivity({ amount, payee, memo: `Withdrawal to ${destination}` });

    const newTransaction: Transaction = {
      id: `wth_${Date.now()}`,
      payee: payee,
      amount: amount,
      memo: `Withdrawal via ${destination}`,
      status: TransactionStatus.Initiated,
      date: new Date().toISOString().split('T')[0],
      ...fraudCheckResult,
    };

    setUser(prevUser => ({
      ...prevUser,
      balance: prevUser.balance - newTransaction.amount,
    }));
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);

    if (newTransaction.isSuspicious) {
        setSuspiciousTxToView(newTransaction);
    } else {
        // Automatically mark as completed after a short delay
        setTimeout(() => {
            setTransactions(prev =>
                prev.map(t =>
                    t.id === newTransaction.id ? { ...t, status: TransactionStatus.Completed } : t
                )
            );
        }, 1500);
        onSuccess(newTransaction);
    }
  }, [user.balance]);

  const handleResolveSuspiciousTx = (txId: string, action: 'safe' | 'fraud') => {
    const originalTransaction = transactions.find(t => t.id === txId);
    if (!originalTransaction) return;

    setTransactions(prevTransactions =>
      prevTransactions.map(t => {
        if (t.id === txId) {
          if (action === 'safe') {
             if (txId.startsWith('wth_')) {
                 showNotification('Withdrawal approved and is now completed.', 'success');
                 return { ...t, isSuspicious: false, status: TransactionStatus.Completed };
             } else {
                showNotification('Transaction marked as safe and is now pending.', 'success');
                const newStatus = t.status === TransactionStatus.Initiated ? TransactionStatus.Pending : t.status;
                return { ...t, isSuspicious: false, status: newStatus };
             }
          } else { // action === 'fraud'
             showNotification('Transaction flagged as fraud. It has been cancelled and reported to our security team.', 'error');
             if (t.status !== TransactionStatus.Cancelled) {
                setUser(prevUser => ({
                    ...prevUser,
                    balance: prevUser.balance + originalTransaction.amount,
                }));
             }
            return { ...t, status: TransactionStatus.Cancelled, isSuspicious: false };
          }
        }
        return t;
      })
    );
    setSuspiciousTxToView(null);
    setCurrentView('history');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} transactions={transactions} onReviewSuspicious={setSuspiciousTxToView} />;
      case 'write':
        return <WriteCheque user={user} onAddTransaction={handleAddTransaction} />;
      case 'withdraw':
        return <Withdraw user={user} onWithdraw={handleWithdrawal} onComplete={() => setCurrentView('dashboard')} />;
      case 'history':
        return <ChequeHistory transactions={transactions} newTransactionId={lastAddedTransactionId} onReviewSuspicious={setSuspiciousTxToView} />;
      case 'reissue':
        return <ReissueChequeBook />;
      case 'security':
        return <Security user={user} transactions={transactions} />;
      default:
        return <Dashboard user={user} transactions={transactions} onReviewSuspicious={setSuspiciousTxToView} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full h-screen bg-secondary dark:bg-dark-bg">
        {authView === 'login' ? (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onSwitchToSignUp={() => setAuthView('signup')}
          />
        ) : (
          <SignUp
            onSignUpSuccess={() => {
              showNotification('Sign up successful! Please log in.');
              setAuthView('login');
            }}
            onSwitchToLogin={() => setAuthView('login')}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-secondary dark:bg-dark-bg text-gray-800 dark:text-dark-text">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={handleLogout} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header user={user} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-secondary dark:bg-dark-bg p-6 md:p-8 lg:p-12">
            {renderView()}
          </main>
        </div>
      </div>
      {suspiciousTxToView && (
        <SuspiciousTransactionModal
          transaction={suspiciousTxToView}
          onClose={() => {
            setSuspiciousTxToView(null);
            // If the user cancels the modal for a withdrawal, it should remain in the history as suspicious.
            // Resetting the view is appropriate.
            setCurrentView('history');
          }}
          onResolve={handleResolveSuspiciousTx}
        />
      )}
       {notification && (
        <div className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white animate-fade-in ${notification.type === 'success' ? 'bg-success' : 'bg-danger'}`}>
          {notification.message}
        </div>
       )}
    </>
  );
};

export default App;
