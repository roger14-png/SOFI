import React, { useState, useEffect } from 'react';
import { User, Transaction } from '../types';
import { getSecurityTips } from '../services/geminiService';
import Card from './common/Card';
import InfoIcon from './icons/InfoIcon';
import BotIcon from './icons/BotIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import SpinnerIcon from './icons/SpinnerIcon';

interface SecurityProps {
  user: User;
  transactions: Transaction[];
}

const Security: React.FC<SecurityProps> = ({ user, transactions }) => {
  const [securityTips, setSecurityTips] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      setIsLoading(true);
      const tips = await getSecurityTips();
      setSecurityTips(tips);
      setIsLoading(false);
    };
    fetchTips();
  }, []);
  
  const recentSecurityEvents = [
      { id: 1, type: 'login', description: `Successful login from ${user.name}'s MacBook Pro`, date: new Date().toISOString(), icon: <ShieldCheckIcon className="w-5 h-5 text-success" /> },
      ...transactions.filter(t => t.isSuspicious).map(t => ({
        id: t.id,
        type: 'suspicious',
        description: `Suspicious transaction of $${t.amount.toFixed(2)} to ${t.payee} was flagged`,
        date: t.date,
        icon: <AlertTriangleIcon className="w-5 h-5 text-warning" />
      }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Security Center</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account security and review recent activity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <h3 className="text-xl font-bold mb-4">Security Overview</h3>
                <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <ShieldCheckIcon className="w-10 h-10 text-success mr-4" />
                    <div>
                        <p className="font-bold text-lg text-gray-800 dark:text-white">Your account is secure.</p>
                        <p className="text-gray-600 dark:text-gray-300">No immediate threats detected. Review recent activity below.</p>
                    </div>
                </div>
            </Card>

            <Card>
                <h3 className="text-xl font-bold mb-4">Recent Security Activity</h3>
                <div className="space-y-4">
                    {recentSecurityEvents.map(event => (
                        <div key={event.id} className="flex items-center p-3 -mx-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60">
                            <div className="mr-4">{event.icon}</div>
                            <div className="flex-grow">
                                <p className="font-semibold text-gray-700 dark:text-gray-200">{event.description}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(event.date).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                    {recentSecurityEvents.length === 0 && (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No recent security events found.</p>
                    )}
                </div>
            </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="flex flex-col h-full">
            <div className="flex items-center mb-3">
              <BotIcon className="w-6 h-6 mr-3 text-primary dark:text-accent"/>
              <h3 className="text-xl font-bold">AI Security Advisor</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Powered by Gemini, here are some tips to keep your account safe:</p>
            {isLoading ? (
                <div className="flex-grow flex items-center justify-center">
                    <SpinnerIcon className="w-8 h-8 text-primary" />
                </div>
            ) : (
                <div className="space-y-3 text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">
                    {securityTips.split('\n').map((tip, index) => (
                        <div key={index} className="flex items-start">
                            <InfoIcon className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0 text-primary" />
                            <span>{tip.replace(/•\s*/, '')}</span>
                        </div>
                    ))}
                </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Security;