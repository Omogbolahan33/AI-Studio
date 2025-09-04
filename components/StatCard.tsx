import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactElement<{ className?: string }>;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'text-primary' }) => {
  return (
    <div className="bg-surface dark:bg-dark-surface rounded-lg shadow p-5 flex items-center space-x-4">
      <div className={`p-3 rounded-full bg-primary-light dark:bg-indigo-900 ${color}`}>
        {React.cloneElement(icon, { className: 'w-8 h-8' })}
      </div>
      <div>
        <p className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{title}</p>
        <p className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">{value}</p>
      </div>
    </div>
  );
};