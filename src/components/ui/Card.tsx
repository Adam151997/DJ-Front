import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-soft hover:shadow-medium transition-shadow duration-200 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`p-5 pb-3 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <h3 className={`text-base font-semibold text-gray-900 leading-none ${className}`}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
};