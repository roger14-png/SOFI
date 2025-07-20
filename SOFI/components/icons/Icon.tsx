
import React from 'react';

interface IconProps {
  children: React.ReactNode;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ children, className }) => {
  return (
    <div className={className}>
        {children}
    </div>
  );
};
