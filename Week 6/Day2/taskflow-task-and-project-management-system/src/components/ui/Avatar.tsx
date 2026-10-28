import React from 'react';

export interface AvatarProps {
  initials: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  initials,
  name,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
    xl: 'w-16 h-16 text-lg font-bold',
  }[size];

  return (
    <div
      aria-label={name || 'User avatar'}
      className={`relative inline-flex items-center justify-center rounded-full bg-primary font-bold text-white shadow-xs select-none shrink-0 ${sizeClasses} ${className}`}
    >
      <span>{initials}</span>
    </div>
  );
};
