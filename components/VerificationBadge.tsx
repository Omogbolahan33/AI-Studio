import React from 'react';
import { CheckBadgeIcon } from '../types';

export const VerificationBadge: React.FC = () => (
    <div title="Verified User" className="flex-shrink-0">
        <CheckBadgeIcon className="w-5 h-5 text-blue-500" />
    </div>
);
