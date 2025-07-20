import React from 'react';

const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.186 0-9.45 3.633-10.165 8.356a.75.75 0 00.75.894h18.83a.75.75 0 00.75-.894C21.45 5.883 17.186 2.25 12 2.25zM4.061 12.75a9.014 9.014 0 011.09-4.839 9.014 9.014 0 014.84-3.666 9.014 9.014 0 0111.97 4.84 9.014 9.014 0 01-3.665 4.839H4.06zM2.835 14.25a.75.75 0 00-.75.75v4.5a.75.75 0 00.75.75h18.33a.75.75 0 00.75-.75v-4.5a.75.75 0 00-.75-.75H2.835z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M12 15.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);

export default ShieldCheckIcon;