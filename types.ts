
import React from 'react';

export type View = 'Dashboard' | 'Transactions' | 'Disputes' | 'Users' | 'Settings' | 'Forum' | 'My Transactions' | 'My Disputes' | 'My Chats';
export type UserRole = 'Admin' | 'Member';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
}

export interface Transaction {
  id: string;
  buyer: string;
  seller: string;
  item: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed' | 'In Escrow';
  date: string;
}

export interface Dispute {
  id: string;
  transactionId: string;
  buyer: string;
  seller: string;
  reason: string;
  status: 'Open' | 'Resolved' | 'Escalated';
  openedDate: string;
  chatHistory: { sender: 'buyer' | 'seller'; message: string; timestamp: string }[];
}

export interface AIAnalysis {
    summary: string;
    buyer_claims: string[];
    seller_claims: string[];
    policy_violations: string[];
    suggested_resolution: string;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    type: 'discussion' | 'advert';
}

export interface Comment {
    id: string;
    author: string;
    content: string;
    timestamp: string;
}

export interface Post {
    id: string;
    author: string;
    timestamp: string;
    title: string;
    content: string;
    comments: Comment[];
    isAdvert: boolean;
    price?: number;
    categoryId: string;
    likes: number;
    dislikes: number;
}

export interface Message {
  sender: 'buyer' | 'seller' | 'me';
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  postId: string;
  postTitle: string;
  buyer: string;
  seller: string;
  messages: Message[];
  lastMessage: string;
  lastMessageTimestamp: string;
}


// FIX: Replaced JSX with React.createElement to fix parsing errors in a .ts file.
export const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" })
  )
);

// FIX: Replaced JSX with React.createElement to fix parsing errors in a .ts file.
export const CurrencyDollarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.826-1.106-2.156 0-2.982.553-.414 1.278-.659 2.003-.659.768 0 1.536.219 2.232.659l.879.659m0 0c-.015.01-.03.018-.046.026M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.826-1.106-2.156 0-2.982.553-.414 1.278-.659 2.003-.659.768 0 1.536.219 2.232.659l.879.659m0 0c-.015.01-.03.018-.046.026" })
  )
);

// FIX: Replaced JSX with React.createElement to fix parsing errors in a .ts file.
export const ShieldExclamationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" })
  )
);

// FIX: Replaced JSX with React.createElement to fix parsing errors in a .ts file.
export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" })
    )
);

// FIX: Replaced JSX with React.createElement to fix parsing errors in a .ts file.
export const DocumentReportIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" })
    )
);

// FIX: Replaced JSX with React.createElement to fix parsing errors in a .ts file.
export const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6a6 6 0 016 6v1h-3M15 21a3 3 0 00-3-3H6a3 3 0 00-3 3" })
    )
);

// FIX: Replaced JSX with React.createElement to fix parsing errors in a .ts file.
export const CogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.343 3.94c.09-.542.56-1.007 1.11-1.226l.043-.018a2.25 2.25 0 012.062 0l.043.018c.55.219 1.02.684 1.11 1.226l.043.25a2.25 2.25 0 01-1.397 2.47l-.18.067a2.25 2.25 0 00-2.585 0l-.18-.067a2.25 2.25 0 01-1.397-2.47l.043-.25zM12 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM3.75 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM20.25 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM3.75 14.25a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM20.25 14.25a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12 14.25a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" })
    )
);

export const ChatBubbleLeftRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a1.05 1.05 0 01-1.485 0l-3.72-3.72A2.1 2.1 0 014.5 17.097V8.511c0-.97.616-1.813 1.5-2.097m6.5 0a2.1 2.1 0 012.1 2.1v4.286c0 1.136.847 2.1 1.98 2.193l3.72 3.72a1.05 1.05 0 001.485 0l3.72-3.72a2.1 2.1 0 001.98-2.193V8.511c0-.97-.616-1.813-1.5-2.097M15 5.25a2.1 2.1 0 00-2.1-2.1H8.1a2.1 2.1 0 00-2.1 2.1v4.286c0 1.135.847 2.1 1.98 2.193l3.72 3.72a1.05 1.05 0 001.485 0l3.72-3.72A2.1 2.1 0 0015 11.636V5.25z" })
    )
);

export const ChatBubbleOvalLeftEllipsisIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.388A.75.75 0 018.25 19.5a.75.75 0 01.53.22l3 3a.75.75 0 01-1.06 1.06l-3-3a.75.75 0 01-.22-.53A9.755 9.755 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" })
    )
);

export const ArrowLeftOnRectangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" })
    )
);

export const TagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" }),
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 6h.008v.008H6V6z" })
    )
);

export const HandThumbUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M6.633 10.5l-1.07-1.07a.454.454 0 00-.638 0l-1.07 1.07H6.633z" })
    )
);

export const HandThumbDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6.633 10.5c.806 0 1.533.446 2.031 1.08a9.041 9.041 0 012.861 2.4c.723.384 1.35.956 1.653 1.715a4.498 4.498 0 00.322 1.672V21a.75.75 0 01-.75.75A2.25 2.25 0 0113.5 19.5c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.126c-1.026 0-1.945-.694-2.054-1.715A11.94 11.94 0 012.25 12c0-.435.023-.863.068-1.285C2.427 9.694 3.346 9 4.372 9h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 13.5V15a.75.75 0 00.75.75h5.23c.483 0 .964.078 1.423.23l3.114 1.04a4.5 4.5 0 001.423.23h1.294M6.633 10.5l-1.07 1.07a.454.454 0 00.638 0l1.07-1.07H6.633z" })
    )
);

export const ChatBubbleBottomCenterTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632zM8.25 12h7.5" })
    )
);
