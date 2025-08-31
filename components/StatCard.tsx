
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'text-primary' }) => {
  return (
    <div className="bg-surface rounded-lg shadow p-5 flex items-center space-x-4">
      <div className={`p-3 rounded-full bg-primary-light ${color}`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-8 h-8' })}
      </div>
      <div>
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
      </div>
    </div>
  );
};
