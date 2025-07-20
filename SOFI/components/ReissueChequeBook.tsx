
import React from 'react';
import Card from './common/Card';
import InfoIcon from './icons/InfoIcon';

const ReissueChequeBook: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Account Settings</h2>
      <Card className="max-w-4xl mx-auto">
        <div className="p-8 text-center">
            <InfoIcon className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Settings & Preferences</h3>
            <p className="text-gray-600 dark:text-gray-400">
                This area will be used to manage your account details, notification preferences, and other settings.
            </p>
        </div>
      </Card>
    </div>
  );
};

export default ReissueChequeBook;