
import React from 'react';
import type { Category } from '../types';
import { TagIcon } from '../types';

interface CategoryListItemProps {
  category: Category;
  onSelect: () => void;
}

export const CategoryListItem: React.FC<CategoryListItemProps> = ({ category, onSelect }) => {
  return (
    <div 
        className="bg-surface rounded-lg shadow p-5 cursor-pointer hover:shadow-md transition-shadow flex items-start space-x-4"
        onClick={onSelect}
    >
      <div className="flex-shrink-0">
          <div className="p-2 bg-primary-light text-primary rounded-lg">
            <TagIcon className="w-6 h-6" />
          </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-text-primary">{category.name}</h3>
        <p className="text-sm text-text-secondary mt-1">{category.description}</p>
      </div>
    </div>
  );
};
