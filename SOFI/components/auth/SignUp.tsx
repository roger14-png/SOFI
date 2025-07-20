import React, { useState } from 'react';
import Card from '../common/Card';
import UserIcon from '../icons/UserIcon';
import BriefcaseIcon from '../icons/BriefcaseIcon';
import { VALID_BUSINESS_IDS } from '../../constants';

interface SignUpProps {
  onSignUpSuccess: () => void;
  onSwitchToLogin: () => void;
}

const AccountTypeButton: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-1/2 flex flex-col items-center justify-center p-4 border-b-4 transition-all duration-300 ${isActive ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-bg'}`}
    >
        {icon}
        <span className="font-semibold mt-2 text-sm">{label}</span>
    </button>
);

const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess, onSwitchToLogin }) => {
  const [accountType, setAccountType] = useState<'personal' | 'corporate'>('personal');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (accountType === 'personal' && !email.endsWith('@gmail.com')) {
        setError('Personal accounts must use a valid Gmail address.');
        return;
    }
    
    if (accountType === 'corporate' && !VALID_BUSINESS_IDS.includes(businessId)) {
        setError('Business ID is not valid or could not be verified.');
        return;
    }

    setIsLoading(true);

    // Simulate API call for sign up
    setTimeout(() => {
      console.log('New user signed up:', { type: accountType, name, email });
      setIsLoading(false);
      onSignUpSuccess();
    }, 1500);
  };

  const commonInputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";

  return (
    <div className="flex items-center justify-center min-h-screen animate-fade-in">
      <Card className="w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Create Your Account</h1>
          <p className="text-gray-600 dark:text-gray-400">Join the future of digital payments</p>
        </div>
        
        <div className="flex w-full mb-6 rounded-t-lg overflow-hidden bg-white dark:bg-dark-card">
            <AccountTypeButton label="Personal" icon={<UserIcon className="w-6 h-6"/>} isActive={accountType === 'personal'} onClick={() => setAccountType('personal')} />
            <AccountTypeButton label="Corporate" icon={<BriefcaseIcon className="w-6 h-6"/>} isActive={accountType === 'corporate'} onClick={() => setAccountType('corporate')} />
        </div>

        <form onSubmit={handleSignUp} className="space-y-4 px-2">
            {accountType === 'personal' ? (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={commonInputClasses} placeholder="Alex Johnson"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gmail Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={commonInputClasses} placeholder="you@gmail.com"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">National ID / Passport No.</label>
                        <input type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} required className={commonInputClasses} placeholder="e.g., 12345678"/>
                    </div>
                </>
            ) : (
                 <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={commonInputClasses} placeholder="e.g., Kenya Coop Inc."/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Official Business ID</label>
                        <input type="text" value={businessId} onChange={(e) => setBusinessId(e.target.value)} required className={commonInputClasses} placeholder="e.g., KRA123456"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={commonInputClasses} placeholder="contact@company.com"/>
                    </div>
                </>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={commonInputClasses} placeholder="••••••••"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={commonInputClasses} placeholder="••••••••"/>
            </div>
          
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            <div>
                <button type="submit" disabled={isLoading} className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400">
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="font-medium text-primary hover:text-primary-dark">
            Sign in
          </button>
        </p>
      </Card>
    </div>
  );
};

export default SignUp;