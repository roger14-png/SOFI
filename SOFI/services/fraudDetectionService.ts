import { Transaction } from '../types';
import { KNOWN_BUSINESSES } from '../constants';

const SUSPICIOUS_KEYWORDS = ['cash', 'crypto', 'exchange', 'vortex', 'services', 'quickcash'];
const SUSPICIOUS_LOCATIONS = [
  'Lisbon, Portugal',
  'Remote Server via VPN',
  'Cyberjaya, Malaysia',
  'St. Petersburg, Russia',
  'Lagos, Nigeria',
];
const SUSPICIOUS_DEVICES = [
  'Unknown Android Device',
  'Chrome on Linux',
  'Firefox on Windows 10 (Tor Browser)',
  'Safari on Jailbroken iPhone',
  'Postman API Client',
];

const getRandomItem = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

export const detectSuspiciousActivity = (
  transactionData: Omit<Transaction, 'id' | 'status' | 'date'>
): { isSuspicious: boolean; location?: string; device?: string } => {
  const { payee, amount } = transactionData;
  const payeeLower = payee.toLowerCase();

  let score = 0;

  // Rule 1: High amount
  if (amount > 4000) {
    score += 3;
  }

  // Rule 2: Suspicious keywords in payee name
  if (SUSPICIOUS_KEYWORDS.some(keyword => payeeLower.includes(keyword))) {
    score += 4;
  }

  // Rule 3: Payee is not a known, verified business
  const isKnown = KNOWN_BUSINESSES.some(b => b.name.toLowerCase() === payeeLower);
  if (!isKnown) {
    score += 2;
  }
  
  // Rule 4: Small random chance for any transaction to be flagged for review
  if (Math.random() < 0.1) {
    score += 2;
  }
  
  // Determine if suspicious based on score
  const isSuspicious = score >= 5;

  if (isSuspicious) {
    return {
      isSuspicious: true,
      location: getRandomItem(SUSPICIOUS_LOCATIONS),
      device: getRandomItem(SUSPICIOUS_DEVICES),
    };
  }

  return { isSuspicious: false };
};