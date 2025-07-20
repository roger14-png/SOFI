
import React from 'react';

const BookIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19.14 12.86a8.7 8.7 0 0 1 0-1.72l2-1.21a.5.5 0 0 0 .22-.45l-1-1.73a.5.5 0 0 0-.57-.22l-2.4 1a8.7 8.7 0 0 0-1.5-1.5l1-2.4a.5.5 0 0 0-.22-.57l-1.73-1a.5.5 0 0 0-.45.22l-1.21 2a8.7 8.7 0 0 0-1.72 0l-1.21-2a.5.5 0 0 0-.45-.22l-1.73 1a.5.5 0 0 0-.22.57l1 2.4a8.7 8.7 0 0 0-1.5 1.5l-2.4-1a.5.5 0 0 0-.57.22l-1 1.73a.5.5 0 0 0 .22.45l2 1.21a8.7 8.7 0 0 1 0 1.72l-2 1.21a.5.5 0 0 0-.22.45l1 1.73a.5.5 0 0 0 .57.22l2.4-1a8.7 8.7 0 0 0 1.5 1.5l-1 2.4a.5.5 0 0 0 .22-.57l1.73 1a.5.5 0 0 0 .45-.22l1.21-2a8.7 8.7 0 0 0 1.72 0l1.21 2a.5.5 0 0 0 .45.22l1.73-1a.5.5 0 0 0 .22-.57l-1-2.4a8.7 8.7 0 0 0 1.5-1.5l2.4 1a.5.5 0 0 0 .57-.22l1-1.73a.5.5 0 0 0-.22-.45l-2-1.21z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export default BookIcon;