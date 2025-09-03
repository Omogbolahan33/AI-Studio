import React, { useState } from 'react';
import { StarIcon } from '../types';

interface StarRatingProps {
  rating: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, interactive = false, onRate, size = 'md' }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
  };

  const handleRate = (rate: number) => {
    if (interactive && onRate) {
      onRate(rate);
    }
  };

  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;
    const currentRating = hoverRating || rating;
    let fillClass = 'text-gray-300 dark:text-gray-600';
    if (starValue <= currentRating) {
        fillClass = 'text-yellow-400';
    }

    const starIcon = <StarIcon className={`transition-colors ${fillClass}`} />;

    if (interactive) {
        return (
          <button
            key={starValue}
            type="button"
            onClick={() => handleRate(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            className={`cursor-pointer ${sizeClasses[size]}`}
            aria-label={`Rate ${starValue} out of 5 stars`}
          >
            {starIcon}
          </button>
        );
    }
    
    // Non-interactive version to prevent nesting buttons
    return (
        <div key={starValue} className={sizeClasses[size]}>
            {starIcon}
        </div>
    );
  });

  return <div className="flex items-center" role="img" aria-label={`Rating: ${rating} out of 5 stars`}>{stars}</div>;
};
