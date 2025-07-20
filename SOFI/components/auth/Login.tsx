import React, { useState } from 'react';
import { USERS } from '../../constants';
import { User } from '../../types';
import Card from '../common/Card';
import LockIcon from '../icons/LockIcon';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  onSwitchToSignUp: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('alex.j@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const userRecord = USERS[email.toLowerCase()];
      if (userRecord && userRecord.password === password) {
        onLoginSuccess(userRecord);
      } else {
        setError('Invalid email or password.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen animate-fade-in">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">SOFI Project</h1>
            <p className="text-gray-600 dark:text-gray-400">Securely sign in to your personal or corporate account.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="e.g., alex.j@example.com or contact@kenyacoop.com"
            />
          </div>

          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-6 border-t dark:border-gray-700 pt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
                <LockIcon className="w-4 h-4 inline-block mr-2" />
                Your information is encrypted and securely transmitted.
            </p>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignUp} className="font-medium text-primary hover:text-primary-dark">
            Sign up
          </button>
        </p>
      </Card>
    </div>
  );
};

export default Login;