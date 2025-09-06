

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatCard } from './components/StatCard';
import { TransactionsTable } from './components/TransactionsTable';
import { DisputesTable } from './components/DisputesTable';
import { DisputeModal } from './components/DisputeModal';
import { ForumPage } from './components/ForumPage';
import { ChatPage } from './components/ChatPage';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { UserProfilePage } from './components/UserProfilePage';
import { BanUserModal } from './components/BanUserModal';
import { MyProfilePage } from './components/MyProfilePage';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { BanNotificationBanner } from './components/BanNotificationBanner';
import { ToastNotification } from './components/ToastNotification';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ReviewModal } from './components/ReviewModal';
import { PolicyModal } from './components/PolicyModal';
import { ChatModal } from './components/ChatModal';
import { CallModal } from './components/CallModal';
import { CallTypeSelectionModal } from './components/CallTypeSelectionModal';
import { ForwardMessageModal } from './components/ForwardMessageModal';
import { AddBankAccountModal } from './components/AddBankAccountModal';
import { AddAddressModal } from './components/AddAddressModal';
import { MaintenancePage } from './components/MaintenancePage';
import { MaintenanceBanner } from './components/MaintenanceBanner';
import { EmailVerificationModal } from './components/EmailVerificationModal';
import { VerificationBanner } from './components/VerificationBanner';
import { PasswordResetPage } from './components/PasswordResetPage';
import { RaiseDisputeModal } from './components/RaiseDisputeModal';
import { AnalyticsPage } from './components/AnalyticsPage';
import { ChartBarIcon, DocumentReportIcon, ShieldExclamationIcon, ClockIcon, FlagIcon } from './types';
import type { Dispute, Post, Chat, User, Category, Comment, Transaction, Notification, ActivityLog, PostCondition, Review, View, AdminAction, UserRole, Message, BankAccount, DisputeMessage, FileAttachment } from './types';
import { mockTransactions, mockDisputes, mockPosts, mockChats, mockUsers, mockCategories, mockNotifications, mockActivityLog, mockStickers } from './constants';
import { SettingsPage } from './components/SettingsPage';
import { TransactionManagementPage } from './components/TransactionManagementPage';
import { privacyPolicyContent, termsOfServiceContent } from './policyContent';

const AttentionRequiredPanel: React.FC<{
  stalledTransactions: Transaction[];
  flaggedPosts: Post[];
  flaggedComments: (Comment & { postTitle: string; postId: string })[];
  disputedTransactions: Transaction[];
  posts: Post[];
  onSelectTransaction: (transaction: Transaction) => void;
  onSelectPost: (post: Post) => void;
  onSelectDisputedTransaction: () => void;
}> = ({ stalledTransactions, flaggedPosts, flaggedComments, disputedTransactions, posts, onSelectTransaction, onSelectPost, onSelectDisputedTransaction }) => {
    
    const PanelSection: React.FC<{ title: string; icon: React.ReactNode; count: number; children: React.ReactNode }> = ({ title, icon, count, children }) => (
        <div>
            <h4 className="flex items-center text-md font-semibold text-text-primary dark:text-dark-text-primary mb-2">
                <span className="p-1 bg-yellow-100 dark:bg-yellow-900/50 rounded-full mr-2">{icon}</span>
                {title}
                <span className="ml-2 text-xs font-bold bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full px-2 py-0.5">{count}</span>
            </h4>
            {count > 0 ? <div className="space-y-2 pl-4 border-l-2 border-yellow-200 dark:border-yellow-800 ml-4">{children}</div> : <p className="text-sm text-text-secondary dark:text-dark-text-secondary pl-10">Nothing to show.</p>}
        </div>
    );

    const ItemButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
        <button onClick={onClick} className="w-full text-left p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            {children}
        </button>
    );

    return (
        <div className="bg-surface dark:bg-dark-surface rounded-lg shadow p-4 space-y-4">
            <h3 className="font-bold text-lg text-yellow-600 dark:text-yellow-400">Attention Required</h3>
            <div className="space-y-6">
                <PanelSection title="Stalled Transactions" icon={<ClockIcon className="w-5 h-5 text-yellow-700 dark:text-yellow-300" />} count={stalledTransactions.length}>
                    {stalledTransactions.map(t => (
                        <ItemButton key={t.id} onClick={() => onSelectTransaction(t)}>
                            <p className="text-sm font-semibold">{t.item}</p>
                            <p className="text-xs text-text-secondary">ID: {t.id} - In Escrow for over 7 days.</p>
                        </ItemButton>
                    ))}
                </PanelSection>
                 <PanelSection title="Disputed Transactions" icon={<ShieldExclamationIcon className="w-5 h-5 text-yellow-700 dark:text-yellow-300" />} count={disputedTransactions.length}>
                    {disputedTransactions.map(t => (
                        <ItemButton key={t.id} onClick={onSelectDisputedTransaction}>
                            <p className="text-sm font-semibold">{t.item}</p>
                            <p className="text-xs text-text-secondary">ID: {t.id} - Click to view</p>
                        </ItemButton>
                    ))}
                </PanelSection>
                 <PanelSection title="Flagged Posts" icon={<FlagIcon className="w-5 h-5 text-yellow-700 dark:text-yellow-300" />} count={flaggedPosts.length}>
                     {flaggedPosts.map(p => (
                        <ItemButton key={p.id} onClick={() => onSelectPost(p)}>
                            <p className="text-sm font-semibold truncate">{p.title}</p>
                            <p className="text-xs text-text-secondary">by {p.author} - Flagged {p.flaggedBy.length} time(s).</p>
                        </ItemButton>
                    ))}
                </PanelSection>
                 <PanelSection title="Flagged Comments" icon={<FlagIcon className="w-5 h-5 text-yellow-700 dark:text-yellow-300" />} count={flaggedComments.length}>
                     {flaggedComments.map(c => {
                         const post = posts.find(p => p.id === c.postId);
                         return (
                            <ItemButton key={c.id} onClick={() => post && onSelectPost(post)}>
                                <p className="text-sm font-semibold truncate italic">"{c.content.replace(/<[^>]+>/g, '').substring(0, 50)}..."</p>
                                <p className="text-xs text-text-secondary">by {c.author} on post "{c.postTitle}"</p>
                            </ItemButton>
                         )
                    })}
                </PanelSection>
            </div>
        </div>
    );
};

const findParentCommentAuthor = (comments: Comment[], parentId: string): string | null => {
    for (const c of comments) {
        if (c.id === parentId) return c.author;
        if (c.replies) {
            const author = findParentCommentAuthor(c.replies, parentId);
            if (author) return author;
        }
    }
    return null;
}

// Fix: Export the App component to be used in index.tsx
export const App: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgotPassword'>('login');
  
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>(mockActivityLog);

  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('Dashboard');
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [viewingProfileOfUser, setViewingProfileOfUser] = useState<User | null>(null);
  const [userToBan, setUserToBan] = useState<User | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [confirmation, setConfirmation] = useState<{ title: string; message: string; onConfirm: () => void; confirmText?: string; variant?: 'danger' | 'primary'; validationText?: string; validationPrompt?: string; } | null>(null);
  const [reviewModalState, setReviewModalState] = useState<{ transaction: Transaction } | null>(null);
  const [policyModal, setPolicyModal] = useState<{ title: string; content: string } | null>(null);
  const [chatIdInModal, setChatIdInModal] = useState<string | null>(null);
  const [initialTxMgmtTab, setInitialTxMgmtTab] = useState<'transactions' | 'disputes'>('transactions');
  const [activeCall, setActiveCall] = useState<{ withUser: User; type: 'video' | 'audio' } | null>(null);
  const [callSelectionForUser, setCallSelectionForUser] = useState<User | null>(null);
  const [forwardMessageState, setForwardMessageState] = useState<{ message: Message; isOpen: boolean }>({ message: mockChats[0].messages[0], isOpen: false });
  
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [isAddBankAccountModalOpen, setIsAddBankAccountModalOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [raiseDisputeState, setRaiseDisputeState] = useState<Transaction | null>(null);

  // Fix: Add isMaintenanceMode state.
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  const chatInModal = useMemo(() => chats.find(c => c.id === chatIdInModal), [chats, chatIdInModal]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (userPrefersDark) {
        setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const postIdFromUrl = urlParams.get('postId');
    if (postIdFromUrl && posts.length > 0) {
      const postExists = posts.some(p => p.id === postIdFromUrl);
      if (postExists && loggedInUser) {
        setActiveView('Forum');
        setSelectedPostId(postIdFromUrl);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [loggedInUser, posts]);
  
  useEffect(() => {
    const checkAndCompleteTransactions = () => {
      const now = new Date();
      const transactionsToComplete: Transaction[] = [];

      transactions.forEach(t => {
        if (t.status === 'Delivered' && t.inspectionPeriodEnds && new Date(t.inspectionPeriodEnds) < now) {
          transactionsToComplete.push(t);
        }
      });

      if (transactionsToComplete.length > 0) {
        const completedIds = transactionsToComplete.map(t => t.id);
        const completionTime = new Date().toISOString();

        setTransactions(prev => prev.map(t => 
          completedIds.includes(t.id) 
            ? { ...t, status: 'Completed', completedAt: completionTime } 
            : t
        ));
        
        const postIdsToMarkSold = transactionsToComplete
            .map(t => t.postId)
            .filter((postId): postId is string => !!postId);
        
        setPosts(prev => prev.map(post => 
            postIdsToMarkSold.includes(post.id) ? { ...post, isSold: true } : post
        ));

        const newNotifications: Notification[] = [];
        transactionsToComplete.forEach(t => {
            const buyer = users.find(u => u.name === t.buyer);
            const seller = users.find(u => u.name === t.seller);
            if(buyer) {
                newNotifications.push({
                    id: `notif-${Date.now()}-auto-b-${t.id}`,
                    userId: buyer.id,
                    type: 'system',
                    content: `The inspection period for "${t.item}" has ended. The transaction was automatically completed.`,
                    link: '#',
                    timestamp: completionTime,
                    read: false,
                    transactionId: t.id,
                });
            }
            if(seller) {
                 newNotifications.push({
                    id: `notif-${Date.now()}-auto-s-${t.id}`,
                    userId: seller.id,
                    type: 'system',
                    content: `The inspection period for "${t.item}" has ended. Funds have been automatically released to your account.`,
                    link: '#',
                    timestamp: completionTime,
                    read: false,
                    transactionId: t.id,
                });
            }
        });
        setNotifications(prev => [...newNotifications, ...prev]);

        setToast({ message: `${transactionsToComplete.length} transaction(s) were automatically completed.`, type: 'success'});
      }
    };

    const intervalId = setInterval(checkAndCompleteTransactions, 30000);
    return () => clearInterval(intervalId);
  }, [transactions, users]);


  const handleToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleNavigation = (view: View) => {
    if (view === 'Transaction Management') {
        setInitialTxMgmtTab('transactions');
    }
    if (view === 'Forum') {
        setSelectedPostId(null);
    }
    setActiveView(view);
  };

  useEffect(() => {
    if (loggedInUser) {
        if (loggedInUser.role === 'Admin' || loggedInUser.role === 'Super Admin') {
            setActiveView('Dashboard');
        } else {
            setActiveView('Forum');
        }
    }
  }, [loggedInUser]);

  const handleLogin = (identifier: string, password: string):void => {
    const user = users.find(u => (u.username.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase()) && u.password === password);
    if (user) {
        if (!user.isActive) {
            setLoginError('Your account has been deactivated. Please contact support.');
            return;
        }
        setLoggedInUser(user);
        setLoginError('');
        setToast({ message: `Welcome back, ${user.name}!`, type: 'success' });
    } else {
        setLoginError('Invalid credentials.');
    }
  };
  
  const handleSsoLogin = (provider: 'google' | 'facebook') => {
    // Simulate SSO login by finding a pre-defined user
    const username = provider === 'google' ? 'alice' : 'bob';
    const user = users.find(u => u.username === username);

    if (user) {
        if (!user.isActive) {
            setLoginError('This account has been deactivated.');
            return;
        }
        setLoggedInUser(user);
        setLoginError('');
        setToast({ message: `Welcome ${user.name}!`, type: 'success' });
    } else {
        setLoginError(`Could not find the test user account for ${provider}.`);
    }
  };

  const handleSignUp = (username: string, email: string, password: string): { success: boolean, message: string } => {
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, message: 'Username is already taken.' };
    }
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'Email address is already in use.' };
    }
    const newUser: User = {
        id: `user-${Date.now()}`,
        username,
        password, // In a real app, this would be hashed
        email,
        role: 'Member',
        name: username, // Default name to username
        isActive: true,
        isVerified: false,
        followingIds: [],
        blockedUserIds: [],
        reviews: [],
        pendingFollowerIds: [],
        banExpiresAt: null,
    };
    setUsers(prev => [...prev, newUser]);
    setLoggedInUser(newUser);
    setIsVerificationModalOpen(true);
    return { success: true, message: 'Account created successfully!' };
  };

  const handleSignOut = () => {
      setLoggedInUser(null);
      
      // Fix: Reset all state to prevent data leakage between sessions
      setTransactions(mockTransactions);
      setDisputes(mockDisputes);
      setPosts(mockPosts);
      setUsers(mockUsers);
      setNotifications(mockNotifications);
      setActivityLog(mockActivityLog);
      setChats(mockChats);
      
      setLoginError('');
      setAuthMode('login');
      setSelectedDispute(null);
      setSelectedTransaction(null);
      setSelectedPostId(null);
      setActiveView('Dashboard');
      setActiveChatId(null);
      setIsMobileSidebarOpen(false);
      setViewingProfileOfUser(null);
      setUserToBan(null);
      setToast(null);
      setConfirmation(null);
      setReviewModalState(null);
      setPolicyModal(null);
      setChatIdInModal(null);
      setInitialTxMgmtTab('transactions');
      setActiveCall(null);
      setCallSelectionForUser(null);
      setForwardMessageState({ message: mockChats[0].messages[0], isOpen: false });
      setPendingAction(null);
      setIsAddBankAccountModalOpen(false);
      setIsAddAddressModalOpen(false);
      setIsVerificationModalOpen(false);
      setRaiseDisputeState(null);
  };
  
  const handleVerifyEmail = (otp: string): { success: boolean, message: string } => {
    if (otp === '123456') {
        if(loggedInUser) {
            const updatedUser = { ...loggedInUser, isVerified: true };
            setLoggedInUser(updatedUser);
            setUsers(users.map(u => u.id === loggedInUser.id ? updatedUser : u));
            setIsVerificationModalOpen(false);
            setToast({ message: 'Email verified successfully! Welcome!', type: 'success' });
            return { success: true, message: 'Success' };
        }
    }
    return { success: false, message: 'Invalid code. Please try again.' };
  };

  const handleSkipVerification = () => {
    setIsVerificationModalOpen(false);
    setToast({ message: `Welcome, ${loggedInUser?.name}! Remember to verify your email.`, type: 'success'});
  };
  
  const handleFindUserByEmail = (email: string): User | undefined => {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  };
  
  const handleUpdatePassword = (email: string, newPassword: string) => {
    setUsers(prev => prev.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, password: newPassword } : u));
    setToast({ message: 'Password has been reset successfully. Please sign in.', type: 'success' });
    setAuthMode('login');
  };

  const createActivityLogEntry = (action: string, details: string) => {
    if (!loggedInUser) return;
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      userId: loggedInUser.id,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setActivityLog(prev => [newLog, ...prev]);
  };

  const totalRevenue = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalTransactions = transactions.length;
  const activeDisputesCount = disputes.filter(d => d.status === 'Open').length;
  
  const handleResolveDispute = (disputeId: string, resolution: string) => {
    setDisputes(prevDisputes =>
      prevDisputes.map(d =>
        d.id === disputeId ? { ...d, status: 'Resolved', resolvedByAdminId: loggedInUser?.id } : d
      )
    );
    setSelectedDispute(null);
  };
  
  const handleInitiatePurchase = (post: Post) => {
    if (!loggedInUser) return;
    
    const initiatePurchaseLogic = (postToBuy: Post) => {
        if (!postToBuy.price) return;
        const fee = postToBuy.price * 0.05;
        const total = postToBuy.price + fee;

        setConfirmation({
          title: "Confirm Purchase",
          message: `Item: ${postToBuy.title}\nPrice: ₦${postToBuy.price?.toLocaleString()}\nPlatform Fee (5%): ₦${fee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}\n--------------------\nTotal: ₦${total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
          onConfirm: () => {
            handleCreateTransaction(postToBuy);
            setConfirmation(null);
          },
          confirmText: "Confirm & Pay",
          variant: 'primary'
        });
    };

    if (!loggedInUser.address || !loggedInUser.city || !loggedInUser.zipCode) {
        setPendingAction(() => () => initiatePurchaseLogic(post));
        setIsAddAddressModalOpen(true);
    } else {
        initiatePurchaseLogic(post);
    }
  };

  const handleConfirmRaiseDispute = async (transactionId: string, reason: string, file?: File) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction || !loggedInUser) return;
    
    let attachment: FileAttachment | undefined;

    if (file) {
        try {
            const dataUrl = await fileToDataUrl(file);
            attachment = {
                name: file.name,
                url: dataUrl,
                type: getFileType(file),
            };
        } catch (error) {
            console.error("Error processing file attachment:", error);
            setToast({ message: "Could not send the file.", type: 'error' });
            return;
        }
    }

    // 1. Update transaction status
    setTransactions(prev => prev.map(t => 
        t.id === transactionId ? { ...t, status: 'Disputed' } : t
    ));

    // 2. Create new dispute
    const newDispute: Dispute = {
        id: `DISP${Math.floor(Math.random() * 900) + 100}`,
        transactionId,
        buyer: transaction.buyer,
        seller: transaction.seller,
        reason,
        status: 'Open',
        openedDate: new Date().toISOString(),
        chatHistory: [
            {
                sender: loggedInUser.name,
                message: `Dispute opened. Reason: ${reason}`,
                timestamp: new Date().toISOString(),
                attachment,
            }
        ],
    };
    setDisputes(prev => [newDispute, ...prev]);

    // 3. Send notification to seller
    const seller = users.find(u => u.name === transaction.seller);
    if (seller) {
        const notification: Notification = {
            id: `notif-dispute-${Date.now()}`,
            userId: seller.id,
            type: 'system',
            content: `${transaction.buyer} has opened a dispute for the transaction involving "${transaction.item}".`,
            link: '#', // Should link to dispute page later
            timestamp: new Date().toISOString(),
            read: false,
            transactionId: transaction.id,
            disputeId: newDispute.id,
        };
        setNotifications(prev => [notification, ...prev]);
    }

    // 4. Close modals
    setRaiseDisputeState(null);
    setSelectedTransaction(null); // Also close the detail view

    // 5. Show toast
    setToast({ message: 'Dispute has been successfully raised.', type: 'success' });
};

  const handleCreateTransaction = (post: Post) => {
    if (!loggedInUser || loggedInUser.role !== 'Member') return;

    const seller = users.find(u => u.name === post.author);
    if (!seller) {
        setToast({ message: 'Could not find the seller for this post.', type: 'error' });
        return;
    }
    
    const now = new Date().toISOString();
    const newTransaction: Transaction = {
        id: `TXN${Math.floor(Math.random() * 90000) + 10000}`,
        postId: post.id,
        buyer: loggedInUser.name,
        seller: post.author,
        item: post.title,
        amount: post.price || 0,
        status: 'Pending',
        date: now,
    };
    setTransactions(prev => [newTransaction, ...prev]);

    const processingNotification: Notification = {
      id: `notif-${now}-process`,
      userId: loggedInUser.id,
      type: 'system',
      content: `Your purchase of "${post.title}" is being processed.`,
      link: '#',
      timestamp: now,
      read: false,
      transactionId: newTransaction.id,
    };
    setNotifications(prev => [processingNotification, ...prev]);
    setToast({ message: `Processing your payment for "${post.title}"...`, type: 'success' });
    
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% success rate

      if (isSuccess) {
        setTransactions(prev => prev.map(t => 
          t.id === newTransaction.id ? { ...t, status: 'In Escrow' } : t
        ));

        const successTime = new Date().toISOString();
        const successNotifications: Notification[] = [];
        successNotifications.push({
          id: `notif-${successTime}-s`,
          userId: seller.id,
          actorId: loggedInUser.id,
          type: 'system',
          content: `${loggedInUser.name} purchased "${post.title}". Payment is secured, you can now ship the item.`,
          link: '#',
          timestamp: successTime,
          read: false,
          transactionId: newTransaction.id,
        });
        successNotifications.push({
          id: `notif-${successTime}-b`,
          userId: loggedInUser.id,
          type: 'system',
          content: `Your payment for "${post.title}" was successful and is now secured in escrow.`,
          link: '#',
          timestamp: successTime,
          read: false,
          transactionId: newTransaction.id,
        });
        setNotifications(prev => [...successNotifications, ...prev]);
        setToast({ message: `Payment for "${post.title}" was successful!`, type: 'success' });
        setActiveView('My Profile');
      } else {
        const failureTime = new Date().toISOString();
        const failedTransaction: Transaction = { 
            ...newTransaction, 
            status: 'Cancelled', 
            cancelledAt: failureTime, 
            failureReason: 'Payment provider declined the transaction.' 
        };

        setTransactions(prev => prev.map(t => 
          t.id === newTransaction.id ? failedTransaction : t
        ));

        const failureNotification: Notification = {
            id: `notif-${failureTime}-fail`,
            userId: loggedInUser.id,
            type: 'system',
            content: `Your payment for "${post.title}" failed. Please try again or use a different payment method.`,
            link: '#',
            timestamp: failureTime,
            read: false,
            transactionId: newTransaction.id,
        };
        setNotifications(prev => [failureNotification, ...prev]);
        setToast({ message: `Payment for "${post.title}" failed.`, type: 'error' });
        setSelectedTransaction(failedTransaction);
      }

    }, 3000);
  };
  
  const handleStartChat = (options: { post?: Post; userToMessage?: User }) => {
    if (!loggedInUser) return;
    const { post, userToMessage } = options;

    let otherPartyName: string;
    let otherPartyId: string;
    
    const otherUser = post ? users.find(u => u.name === post.author) : userToMessage;
    if (!otherUser) return;
    
    otherPartyName = otherUser.name;
    otherPartyId = otherUser.id;

    if (otherPartyId === loggedInUser.id) {
        setToast({ message: "You can't start a chat with yourself.", type: 'error' });
        return;
    }
    
    const initiatorName = loggedInUser.name;

    let chat = chats.find(c => {
        const participants = [c.buyer, c.seller];
        if (post) {
            return c.postId === post.id && participants.includes(initiatorName) && participants.includes(otherPartyName);
        } else {
            return !c.postId && participants.includes(initiatorName) && participants.includes(otherPartyName);
        }
    });

    if (!chat) {
        chat = {
            id: `CHAT${Math.random().toString(36).substring(2, 9)}`,
            postId: post?.id,
            postTitle: post?.title,
            buyer: initiatorName, 
            seller: otherPartyName,
            messages: [],
            lastMessage: 'Chat started.',
            lastMessageTimestamp: new Date().toISOString(),
        };
        setChats(prev => [chat!, ...prev]);
    }

    setActiveChatId(chat.id);
    if(viewingProfileOfUser) setViewingProfileOfUser(null);
    setActiveView('My Chats');
  };
  
  const handleOpenTransactionChat = (transaction: Transaction) => {
    if (!loggedInUser) return;
    
    const existingChat = chats.find(c => c.transactionId === transaction.id);

    if (existingChat) {
        setChatIdInModal(existingChat.id);
    } else {
        const newChat: Chat = {
            id: `CHAT-TXN-${transaction.id}`,
            transactionId: transaction.id,
            postTitle: transaction.item,
            buyer: transaction.buyer,
            seller: transaction.seller,
            messages: [],
            lastMessage: 'Transaction chat started.',
            lastMessageTimestamp: new Date().toISOString(),
        };
        setChats(prev => [newChat, ...prev]);
        setChatIdInModal(newChat.id);
    }
  };

  const getMessageContentPreview = (message: Message): string => {
    if (message.text) return message.text;
    if (message.stickerUrl) return 'Sticker';
    if (message.voiceNote) return 'Voice Note';
    if (message.attachment) return `Attachment: ${message.attachment.name}`;
    return '...';
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  };

  const getFileType = (file: File): FileAttachment['type'] => {
      if (file.type.startsWith('image/')) return 'image';
      if (file.type.startsWith('video/')) return 'video';
      if (file.type === 'application/pdf') return 'pdf';
      return 'other';
  };

  const handleSendMessage = async (chatId: string, messageContent: Omit<Message, 'id' | 'sender' | 'timestamp'> & { attachmentFile?: File }) => {
    if (!loggedInUser) return;
    
    let updatedChat: Chat | undefined;
    let attachment: FileAttachment | undefined;

    if (messageContent.attachmentFile) {
        try {
            const dataUrl = await fileToDataUrl(messageContent.attachmentFile);
            attachment = {
                name: messageContent.attachmentFile.name,
                url: dataUrl,
                type: getFileType(messageContent.attachmentFile),
            };
        } catch (error) {
            console.error("Error processing file attachment:", error);
            setToast({ message: "Could not send the file.", type: 'error' });
            return;
        }
    }

    setChats(prevChats => prevChats.map(chat => {
        if (chat.id === chatId) {
            const newMessage: Message = {
                id: `MSG-${Date.now()}`,
                sender: loggedInUser.name,
                timestamp: new Date().toISOString(),
                text: messageContent.text,
                stickerUrl: messageContent.stickerUrl,
                voiceNote: messageContent.voiceNote,
                replyTo: messageContent.replyTo,
                isForwarded: messageContent.isForwarded,
                attachment,
            };
            updatedChat = {
                ...chat,
                messages: [...chat.messages, newMessage],
                lastMessage: getMessageContentPreview(newMessage),
                lastMessageTimestamp: newMessage.timestamp,
            };
            return updatedChat;
        }
        return chat;
    }));

    if (updatedChat) {
        const otherPartyName = updatedChat.buyer === loggedInUser.name ? updatedChat.seller : updatedChat.buyer;
        const otherParty = users.find(u => u.name === otherPartyName);
        if (otherParty) {
             const newNotification: Notification = {
                id: `notif-chat-${Date.now()}`,
                userId: otherParty.id,
                actorId: loggedInUser.id,
                type: 'system',
                content: `You have a new message from ${loggedInUser.name}.`,
                link: '#',
                timestamp: new Date().toISOString(),
                read: false,
                chatId: updatedChat.id,
            };
            setNotifications(prev => [newNotification, ...prev]);
        }
    }
  };
  
  const handleForwardMessage = (message: Message, targetChatIds: string[]) => {
    if (!loggedInUser) return;

    const messageToForward = {
        text: message.text,
        stickerUrl: message.stickerUrl,
        voiceNote: message.voiceNote,
        attachment: message.attachment, // Forward attachments too
        isForwarded: true,
    };

    targetChatIds.forEach(chatId => {
        handleSendMessage(chatId, messageToForward);
    });

    setToast({ message: `Message forwarded to ${targetChatIds.length} chat(s).`, type: 'success' });
  };
  
  const handleSaveSticker = (stickerUrl: string) => {
    if (!loggedInUser) return;

    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === loggedInUser.id) {
        const savedStickers = user.savedStickers || [];
        if (!savedStickers.includes(stickerUrl)) {
          const updatedUser = { ...user, savedStickers: [...savedStickers, stickerUrl] };
          setLoggedInUser(updatedUser); // Update logged in user state as well
          setToast({ message: "Sticker saved!", type: 'success' });
          return updatedUser;
        } else {
          setToast({ message: "You've already saved this sticker.", type: 'error' });
        }
      }
      return user;
    }));
  };

  const handleCreatePost = (newPostData: { title: string; content: string; isAdvert: boolean; price?: number, categoryId: string, mediaUrl?: string, mediaType?: 'image' | 'video', brand?: string, condition?: PostCondition }) => {
    if (!loggedInUser) return;
    
    const createPostLogic = (data: typeof newPostData) => {
        const now = new Date().toISOString();
        const newPost: Post = {
          id: `POST${Math.random().toString(36).substring(2, 9)}`,
          author: loggedInUser.name,
          timestamp: now,
          lastActivityTimestamp: now,
          title: data.title,
          content: data.content,
          isAdvert: data.isAdvert,
          price: data.price,
          comments: [],
          categoryId: data.categoryId,
          likedBy: [],
          dislikedBy: [],
          mediaUrl: data.mediaUrl,
          mediaType: data.mediaType,
          brand: data.brand,
          condition: data.condition,
          flaggedBy: [],
          isCommentingRestricted: false,
          isSold: false,
        };
        setPosts(prevPosts => [newPost, ...prevPosts]);
        createActivityLogEntry('Created Post', `"${newPost.title}"`);

        const followers = users.filter(u => u.followingIds.includes(loggedInUser.id));
        const postNotifications: Notification[] = followers.map(follower => ({
            id: `notif-${Date.now()}-${follower.id}`,
            userId: follower.id,
            actorId: loggedInUser.id,
            type: 'post',
            content: `${loggedInUser.name} created a new post: "${newPost.title}"`,
            link: '#',
            postId: newPost.id,
            timestamp: new Date().toISOString(),
            read: false,
        }));
        setNotifications(prev => [...postNotifications, ...prev]);
    };

    if (newPostData.isAdvert && !loggedInUser.bankAccount) {
        setPendingAction(() => () => createPostLogic(newPostData));
        setIsAddBankAccountModalOpen(true);
    } else {
        createPostLogic(newPostData);
    }
  };
  
  const handleEditPost = (postId: string, updatedPostData: { title: string; content: string; isAdvert: boolean; price?: number, categoryId: string, mediaUrl?: string, mediaType?: 'image' | 'video', brand?: string, condition?: PostCondition }) => {
    setPosts(posts.map(p => {
        if (p.id === postId && p.author === loggedInUser?.name) {
            return {
                ...p,
                ...updatedPostData,
                editedTimestamp: new Date().toISOString(),
            };
        }
        return p;
    }));
  };
  
  const handleDeletePost = (postId: string) => {
    const postToDelete = posts.find(p => p.id === postId);
    if (!postToDelete) return;
    if (loggedInUser?.role !== 'Admin' && postToDelete.author !== loggedInUser?.name) return;

    setConfirmation({
        title: "Delete Post",
        message: "Are you sure you want to delete this post? This action cannot be undone.",
        onConfirm: () => {
            setPosts(posts.filter(p => p.id !== postId));
            if (selectedPostId === postId) {
                setSelectedPostId(null);
            }
            setConfirmation(null);
        },
        confirmText: "Delete",
        variant: 'danger'
    });
  };

  const handleLikePost = (postId: string) => {
    if (!loggedInUser) return;
    setPosts(posts.map(p => {
        if (p.id === postId) {
            const hasLiked = p.likedBy.includes(loggedInUser.id);
            const hasDisliked = p.dislikedBy.includes(loggedInUser.id);
            
            const newLikedBy = hasLiked ? p.likedBy.filter(id => id !== loggedInUser.id) : [...p.likedBy, loggedInUser.id];
            const newDislikedBy = hasDisliked ? p.dislikedBy.filter(id => id !== loggedInUser.id) : p.dislikedBy;

            const updatedPost = { ...p, likedBy: newLikedBy, dislikedBy: newDislikedBy };

            if (!hasLiked) { 
                updatedPost.lastActivityTimestamp = new Date().toISOString();
                if (p.author !== loggedInUser.name) {
                    const postAuthor = users.find(u => u.name === p.author);
                    if (postAuthor) {
                        const likeNotification: Notification = {
                            id: `notif-${Date.now()}-${postAuthor.id}`,
                            userId: postAuthor.id,
                            actorId: loggedInUser.id,
                            type: 'like',
                            content: `${loggedInUser.name} liked your post: "${p.title}"`,
                            link: '#',
                            postId: p.id,
                            timestamp: new Date().toISOString(),
                            read: false,
                        };
                        setNotifications(prev => [likeNotification, ...prev]);
                    }
                }
                createActivityLogEntry('Liked Post', `"${p.title}"`);
            }
            return updatedPost;
        }
        return p;
    }));
  };

  const handleDislikePost = (postId: string) => {
    if (!loggedInUser) return;
    setPosts(posts.map(p => {
        if (p.id === postId) {
            const hasLiked = p.likedBy.includes(loggedInUser.id);
            const hasDisliked = p.dislikedBy.includes(loggedInUser.id);
            const newDislikedBy = hasDisliked ? p.dislikedBy.filter(id => id !== loggedInUser.id) : [...p.dislikedBy, loggedInUser.id];
            const newLikedBy = hasLiked ? p.likedBy.filter(id => id !== loggedInUser.id) : p.likedBy;
            if (!hasDisliked) createActivityLogEntry('Disliked Post', `"${p.title}"`);
            return { ...p, likedBy: newLikedBy, dislikedBy: newDislikedBy };
        }
        return p;
    }));
  };

  const handleTogglePostCommentRestriction = (postId: string) => {
    if (!loggedInUser || (loggedInUser.role !== 'Admin' && loggedInUser.role !== 'Super Admin')) return;
    
    setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId) {
            const isRestricted = !post.isCommentingRestricted;
            setToast({ message: isRestricted ? "Comments have been locked for this post." : "Comments have been unlocked for this post.", type: 'success'});
            return { ...post, isCommentingRestricted: isRestricted };
        }
        return post;
    }));
  };

  const handleToggleSoldStatus = (postId: string) => {
    if (!loggedInUser) return;
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId && post.author === loggedInUser.name) {
          const newSoldStatus = !post.isSold;
          setToast({ message: newSoldStatus ? 'Advert marked as sold.' : 'Advert marked as available.', type: 'success' });
          return { ...post, isSold: newSoldStatus };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string, commentData: { content: string; mediaUrl?: string; mediaType?: 'image' | 'video' }, parentId: string | null = null) => {
    if (!loggedInUser) return;

    const postToUpdate = posts.find(p => p.id === postId);
    if(!postToUpdate) return;
    
    const isCommentingDisabled = postToUpdate.isCommentingRestricted && loggedInUser.role === 'Member';
    if(isCommentingDisabled) {
        setToast({ message: "Commenting on this post is restricted.", type: 'error'});
        return;
    }

    const newComment: Comment = {
      id: `C${Math.random().toString(36).substring(2, 9)}`,
      author: loggedInUser.name,
      timestamp: new Date().toISOString(),
      content: commentData.content,
      mediaUrl: commentData.mediaUrl,
      mediaType: commentData.mediaType,
      flaggedBy: [],
      replies: [],
      parentId,
      likedBy: [],
      dislikedBy: [],
    };

    const addReplyToComment = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
            if (comment.id === parentId) {
                return { ...comment, replies: [newComment, ...(comment.replies || [])] };
            }
            if (comment.replies && comment.replies.length > 0) {
                return { ...comment, replies: addReplyToComment(comment.replies) };
            }
            return comment;
        });
    };

    setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId) {
            const updatedPost = { ...post, lastActivityTimestamp: new Date().toISOString() };
            if (parentId) {
                updatedPost.comments = addReplyToComment(post.comments);
            } else {
                updatedPost.comments = [newComment, ...post.comments];
            }

            // Notifications
            const parentAuthorName = parentId ? findParentCommentAuthor(post.comments, parentId) : null;
            const mentionedUsernames = (commentData.content.match(/@(\w+)/g) || []).map(u => u.substring(1));
            
            const participants = new Set<string>([post.author]);
            if (parentAuthorName) {
                participants.add(parentAuthorName);
            }
            mentionedUsernames.forEach(username => {
                const user = users.find(u => u.username === username);
                if (user) participants.add(user.name);
            });
            
            participants.forEach(participantName => {
                if (participantName !== loggedInUser.name) {
                    const userToNotify = users.find(u => u.name === participantName);
                    if (userToNotify) {
                        const isMention = mentionedUsernames.some(u => u === userToNotify.username);
                        const isReplyToThisUser = parentAuthorName && userToNotify.name === parentAuthorName;
                        
                        let notifType: Notification['type'] = 'comment';
                        let notifContent = '';

                        if (isMention) {
                            notifType = 'mention';
                            notifContent = `${loggedInUser.name} mentioned you in a comment on "${post.title}"`;
                        } else if (isReplyToThisUser) {
                            notifType = 'comment';
                            notifContent = `${loggedInUser.name} replied to your comment on "${post.title}"`;
                        } else { // Is post author
                            notifType = 'comment';
                            notifContent = `${loggedInUser.name} commented on your post: "${post.title}"`;
                        }

                        const notif: Notification = {
                            id: `notif-${Date.now()}-${userToNotify.id}`,
                            userId: userToNotify.id,
                            actorId: loggedInUser.id,
                            type: notifType,
                            content: notifContent,
                            link: '#',
                            postId: post.id,
                            timestamp: new Date().toISOString(),
                            read: false,
                        };
                         setNotifications(prev => [notif, ...prev]);
                    }
                }
            });

            return updatedPost;
        }
        return post;
    }));
    createActivityLogEntry('Commented on Post', `"${posts.find(p => p.id === postId)?.title}"`);
  };

  const handleEditComment = (postId: string, commentId: string, newContent: string) => {
    if (!loggedInUser) return;

    const updateCommentRecursive = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId && comment.author === loggedInUser.name) {
          return { ...comment, content: newContent, editedTimestamp: new Date().toISOString() };
        }
        if (comment.replies && comment.replies.length > 0) {
          return { ...comment, replies: updateCommentRecursive(comment.replies) };
        }
        return comment;
      });
    };

    setPosts(posts.map(post => {
        if (post.id === postId) {
            return { ...post, comments: updateCommentRecursive(post.comments) };
        }
        return post;
    }));
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    if (!loggedInUser) return;
    
    setConfirmation({
        title: "Delete Comment",
        message: "Are you sure you want to delete this comment? This action cannot be undone.",
        onConfirm: () => {
            const deleteCommentRecursive = (comments: Comment[]): Comment[] => {
                return comments.filter(c => c.id !== commentId).map(c => {
                    if (c.replies && c.replies.length > 0) {
                        return { ...c, replies: deleteCommentRecursive(c.replies) };
                    }
                    return c;
                });
            };

            setPosts(prevPosts => prevPosts.map(p => {
                if (p.id === postId) {
                    return { ...p, comments: deleteCommentRecursive(p.comments) };
                }
                return p;
            }));
            setConfirmation(null);
        },
        confirmText: "Delete",
        variant: 'danger'
    });
  };
  
  const handleLikeComment = (postId: string, commentId: string) => {
    if (!loggedInUser) return;

    const updateLikesRecursive = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          const hasLiked = comment.likedBy.includes(loggedInUser.id);
          const hasDisliked = comment.dislikedBy.includes(loggedInUser.id);
          
          const newLikedBy = hasLiked ? comment.likedBy.filter(id => id !== loggedInUser.id) : [...comment.likedBy, loggedInUser.id];
          const newDislikedBy = hasDisliked ? comment.dislikedBy.filter(id => id !== loggedInUser.id) : comment.dislikedBy;
          
          const updatedComment = { ...comment, likedBy: newLikedBy, dislikedBy: newDislikedBy };

          if(!hasLiked && comment.author !== loggedInUser.name) {
              const commentAuthor = users.find(u => u.name === comment.author);
              const post = posts.find(p => p.id === postId);
              if (commentAuthor && post) {
                  const likeNotification: Notification = {
                      id: `notif-clike-${Date.now()}`,
                      userId: commentAuthor.id,
                      actorId: loggedInUser.id,
                      type: 'comment_like',
                      content: `${loggedInUser.name} liked your comment on "${post.title}"`,
                      link: '#',
                      postId: postId,
                      timestamp: new Date().toISOString(),
                      read: false,
                  };
                  setNotifications(prev => [likeNotification, ...prev]);
              }
          }
          
          return updatedComment;
        }
        if (comment.replies && comment.replies.length > 0) {
          return { ...comment, replies: updateLikesRecursive(comment.replies) };
        }
        return comment;
      });
    };

    setPosts(posts.map(post => {
        if (post.id === postId) {
            return { ...post, comments: updateLikesRecursive(post.comments) };
        }
        return post;
    }));
  };

  const handleDislikeComment = (postId: string, commentId: string) => {
    if (!loggedInUser) return;

    const updateLikesRecursive = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          const hasLiked = comment.likedBy.includes(loggedInUser.id);
          const hasDisliked = comment.dislikedBy.includes(loggedInUser.id);
          
          const newDislikedBy = hasDisliked ? comment.dislikedBy.filter(id => id !== loggedInUser.id) : [...comment.dislikedBy, loggedInUser.id];
          const newLikedBy = hasLiked ? comment.likedBy.filter(id => id !== loggedInUser.id) : comment.likedBy;

          return { ...comment, likedBy: newLikedBy, dislikedBy: newDislikedBy };
        }
        if (comment.replies && comment.replies.length > 0) {
          return { ...comment, replies: updateLikesRecursive(comment.replies) };
        }
        return comment;
      });
    };

    setPosts(posts.map(post => {
        if (post.id === postId) {
            return { ...post, comments: updateLikesRecursive(post.comments) };
        }
        return post;
    }));
  };

  const handleRequestFollow = (userIdToFollow: string) => {
    if (!loggedInUser) return;
    const followNotification: Notification = {
      id: `notif-${Date.now()}-${userIdToFollow}`,
      userId: userIdToFollow,
      actorId: loggedInUser.id,
      type: 'follow_request',
      content: `${loggedInUser.name} wants to follow you.`,
      link: '#',
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [followNotification, ...prev]);
    
    setUsers(users.map(user => {
      if (user.id === userIdToFollow) {
        return {
          ...user,
          pendingFollowerIds: [...user.pendingFollowerIds, loggedInUser.id]
        };
      }
      return user;
    }));

    setViewingProfileOfUser(prev => {
        if (prev && prev.id === userIdToFollow) {
            return {
                ...prev,
                pendingFollowerIds: [...prev.pendingFollowerIds, loggedInUser.id]
            };
        }
        return prev;
    });

    setToast({ message: 'Follow request sent.', type: 'success' });
  };
  
   const handleCancelFollowRequest = (userIdToUncancel: string) => {
    if (!loggedInUser) return;
    const userToUncancelRequest = users.find(u => u.id === userIdToUncancel);
    if (!userToUncancelRequest) return;
    
    setConfirmation({
        title: `Cancel Follow Request`,
        message: `Are you sure you want to cancel your follow request to @${userToUncancelRequest.username}?`,
        onConfirm: () => {
             setUsers(users.map(user => {
                if (user.id === userIdToUncancel) {
                    return {
                        ...user,
                        pendingFollowerIds: user.pendingFollowerIds.filter(id => id !== loggedInUser.id)
                    };
                }
                return user;
            }));
            setToast({ message: 'Follow request cancelled.', type: 'success'});
            setConfirmation(null);
        },
        confirmText: 'Cancel Request',
        variant: 'danger'
    });
  };


  const handleAcceptFollowRequest = (requesterId: string) => {
    if (!loggedInUser) return;
    
    const updatedLoggedInUser = {
      ...loggedInUser,
      pendingFollowerIds: loggedInUser.pendingFollowerIds.filter(id => id !== requesterId)
    };
    setLoggedInUser(updatedLoggedInUser);

    setUsers(users.map(user => {
      if (user.id === loggedInUser.id) {
        return updatedLoggedInUser;
      }
      if (user.id === requesterId) {
        return {
          ...user,
          followingIds: [...user.followingIds, loggedInUser.id]
        };
      }
      return user;
    }));

    const acceptNotification: Notification = {
      id: `notif-${Date.now()}-${requesterId}`,
      userId: requesterId,
      actorId: loggedInUser.id,
      type: 'follow', 
      content: `${loggedInUser.name} accepted your follow request.`,
      link: '#',
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [acceptNotification, ...prev]);
  };
  
  const handleDeclineFollowRequest = (requesterId: string) => {
    if (!loggedInUser) return;
     const updatedLoggedInUser = {
      ...loggedInUser,
      pendingFollowerIds: loggedInUser.pendingFollowerIds.filter(id => id !== requesterId)
    };
    setLoggedInUser(updatedLoggedInUser);
    setUsers(users.map(user => user.id === loggedInUser.id ? updatedLoggedInUser : user));
  };


  const handleUnfollow = (userIdToUnfollow: string) => {
    if (!loggedInUser) return;
    const userToUnfollow = users.find(u => u.id === userIdToUnfollow);
    if (!userToUnfollow) return;

    setConfirmation({
        title: `Unfollow ${userToUnfollow.name}`,
        message: `Are you sure you want to unfollow @${userToUnfollow.username}?`,
        onConfirm: () => {
            const updatedLoggedInUser = {
              ...loggedInUser,
              followingIds: loggedInUser.followingIds.filter(id => id !== userIdToUnfollow)
            };
            setLoggedInUser(updatedLoggedInUser);
            setUsers(users.map(u => u.id === loggedInUser.id ? updatedLoggedInUser : u));
            setConfirmation(null);
        },
        confirmText: 'Unfollow',
        variant: 'danger'
    });
  };

  const handleToggleBlock = (userIdToBlock: string) => {
    if (!loggedInUser) return;
    setUsers(users.map(user => {
        if (user.id === loggedInUser.id) {
            const isBlocked = user.blockedUserIds.includes(userIdToBlock);
            const newBlockedIds = isBlocked 
                ? user.blockedUserIds.filter(id => id !== userIdToBlock) 
                : [...user.blockedUserIds, userIdToBlock];
            const newFollowingIds = user.followingIds.filter(id => id !== userIdToBlock);
            const updatedUser = { ...user, blockedUserIds: newBlockedIds, followingIds: newFollowingIds };
            setLoggedInUser(updatedUser);
            return updatedUser;
        }
        return user;
    }));
  };

  const handleToggleActivation = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
    setViewingProfileOfUser(prev => prev && prev.id === userId ? { ...prev, isActive: !prev.isActive } : prev);
    setToast({ message: `User account has been ${users.find(u => u.id === userId)?.isActive ? 'deactivated' : 'activated'}.`, type: 'success' });
  };
  
  const handleDeactivateAccount = () => {
    if (!loggedInUser) return;
    setUsers(prevUsers => prevUsers.map(u => 
        u.id === loggedInUser.id ? { ...u, isActive: false } : u
    ));
    setConfirmation(null);
    setToast({ message: "Your account has been successfully deactivated.", type: 'success' });
    setTimeout(() => {
        setLoggedInUser(null);
        setActiveView('Dashboard');
    }, 1500);
};

  const handleRequestDeactivation = () => {
    if (!loggedInUser) return;
    setConfirmation({
        title: "Deactivate Account",
        message: "This action cannot be undone. All your posts, comments, and transaction history will be disassociated. You will be logged out immediately.",
        onConfirm: handleDeactivateAccount,
        confirmText: "Deactivate",
        variant: 'danger',
        validationText: loggedInUser.username,
        validationPrompt: `To confirm, please type your username: "${loggedInUser.username}"`
    });
};
  
  const handleBanUser = (userToBan: User) => {
    setUserToBan(userToBan);
  };
  
  const handleConfirmBan = (userId: string, days: number, reason: string) => {
    const banExpiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    const banStartDate = new Date().toISOString();
    setUsers(users.map(u => u.id === userId ? { ...u, banExpiresAt, banReason: reason, banStartDate } : u));
    setViewingProfileOfUser(prev => prev && prev.id === userId ? { ...prev, banExpiresAt, banReason: reason, banStartDate } : prev);
    setUserToBan(null);
    setToast({ message: `User has been banned for ${days} days.`, type: 'success'});
  };
  
  const handleUnbanUser = (userId: string) => {
      const userToUnban = users.find(u => u.id === userId);
      if(!userToUnban) return;
      setConfirmation({
        title: `Lift Ban for ${userToUnban.name}`,
        message: "Are you sure you want to lift this user's ban?",
        onConfirm: () => {
            setUsers(users.map(u => u.id === userId ? { ...u, banExpiresAt: null, banReason: null, banStartDate: null } : u));
            setViewingProfileOfUser(prev => prev && prev.id === userId ? { ...prev, banExpiresAt: null, banReason: null, banStartDate: null } : prev);
            setToast({ message: `User ban has been lifted.`, type: 'success' });
            setConfirmation(null);
        },
        confirmText: 'Lift Ban',
        variant: 'primary'
    });
  };
  
  const handleSetUserRole = (userId: string, newRole: UserRole) => {
    if (!loggedInUser || loggedInUser.role !== 'Super Admin') return;
    
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;
    
    const actionText = newRole === 'Admin' ? 'promoted to Admin' : 'demoted to Member';
    
    setConfirmation({
        title: `Confirm Role Change`,
        message: `Are you sure you want to change ${userToUpdate.name}'s role to ${newRole}?`,
        onConfirm: () => {
             setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
             setViewingProfileOfUser(prev => prev && prev.id === userId ? { ...prev, role: newRole } : prev);
             setToast({ message: `User ${userToUpdate.name} has been ${actionText}.`, type: 'success' });
             setConfirmation(null);
        },
        confirmText: 'Confirm',
        variant: 'primary'
    });
  };


  const handleUpdateSettings = (userId: string, settingsData: Partial<User>) => {
    setUsers(users.map(u => u.id === userId ? { ...u, ...settingsData } : u));
    setLoggedInUser(prev => prev ? { ...prev, ...settingsData } : null);
    
    const message = settingsData.avatarUrl 
        ? 'Profile picture updated successfully.'
        : 'Your settings have been updated successfully.';
    setToast({ message, type: 'success' });
  };

  const handleToggleMaintenanceMode = () => {
    setIsMaintenanceMode(prev => {
        const newState = !prev;
        setToast({ message: `Maintenance mode has been ${newState ? 'enabled' : 'disabled'}.`, type: 'success' });
        return newState;
    });
  };

  const handleAddReview = (userId: string, rating: number, comment: string, transactionId?: string) => {
    if (!loggedInUser) return;
    const newReview: Review = {
        id: `review-${Date.now()}`,
        reviewerId: loggedInUser.id,
        rating,
        comment,
        timestamp: new Date().toISOString(),
        isVerifiedPurchase: !!transactionId,
        transactionId,
    };
    setUsers(users.map(u => {
        if (u.id === userId) {
            const existingReviews = u.reviews.filter(r => r.reviewerId !== loggedInUser.id);
            return { ...u, reviews: [newReview, ...existingReviews] };
        }
        return u;
    }));
    setToast({ message: 'Your review has been submitted.', type: 'success' });
  };
  
  const handleOpenReviewModal = (transaction: Transaction) => {
    setReviewModalState({ transaction });
  };

  const handleViewProfile = (user: User) => {
    setViewingProfileOfUser(user);
  };
  
  const handleSelectPost = (post: Post) => {
    if (viewingProfileOfUser) setViewingProfileOfUser(null);
    setActiveView('Forum');
    setSelectedPostId(post.id);
  };
  
  const handleTogglePinPost = (postId: string) => {
    if (loggedInUser?.role !== 'Admin' && loggedInUser?.role !== 'Super Admin') return;
    let wasPinned = false;
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        wasPinned = !!post.pinnedAt;
        return { ...post, pinnedAt: wasPinned ? undefined : new Date().toISOString() };
      }
      return post;
    }));
    setToast({ message: wasPinned ? "Post unpinned." : "Post pinned for 24 hours.", type: 'success' });
  };

  const handleAcceptItem = (transactionId: string) => {
    if (!loggedInUser) return;

    let transactionToComplete: Transaction | undefined;
    
    setTransactions(prev =>
        prev.map(t => {
            if (t.id === transactionId && t.status === 'Delivered' && t.buyer === loggedInUser.name) {
                transactionToComplete = { ...t, status: 'Completed', completedAt: new Date().toISOString() };
                return transactionToComplete;
            }
            return t;
        })
    );

    if (transactionToComplete) {
        if (transactionToComplete.postId) {
            setPosts(prevPosts =>
                prevPosts.map(p => (p.id === transactionToComplete!.postId ? { ...p, isSold: true } : p))
            );
        }
        setToast({ message: `Item accepted. Transaction ${transactionId} completed.`, type: 'success' });
        setSelectedTransaction(null);
        handleOpenReviewModal(transactionToComplete);
    }
};

    const currentUserNotifications = useMemo(() => {
        if (!loggedInUser) return [];
        return notifications.filter(n => n.userId === loggedInUser.id);
    }, [notifications, loggedInUser]);

    const currentUserChats = useMemo(() => {
        if (!loggedInUser) return [];
        return chats.filter(c => c.buyer === loggedInUser.name || c.seller === loggedInUser.name);
    }, [chats, loggedInUser]);

  // RENDER LOGIC
  if (isMaintenanceMode && loggedInUser?.role !== 'Admin' && loggedInUser?.role !== 'Super Admin') {
    return <MaintenancePage user={loggedInUser || { name: 'Guest' } as User} onSignOut={handleSignOut} />;
  }

  if (!loggedInUser) {
    switch (authMode) {
      case 'signup':
        return <SignUpPage onSignUp={handleSignUp} onSwitchMode={() => setAuthMode('login')} onSsoLogin={handleSsoLogin} />;
      case 'forgotPassword':
        return <PasswordResetPage onFindUserByEmail={handleFindUserByEmail} onUpdatePassword={handleUpdatePassword} onBackToLogin={() => setAuthMode('login')} />;
      case 'login':
      default:
        return <LoginPage onLogin={handleLogin} error={loginError} onSwitchMode={(mode) => setAuthMode(mode)} onSsoLogin={handleSsoLogin} />;
    }
  }
  
  const isBanned = loggedInUser.banExpiresAt && new Date(loggedInUser.banExpiresAt) > new Date();
  const isAdminOrSuperAdmin = loggedInUser.role === 'Admin' || loggedInUser.role === 'Super Admin';
  const now = new Date();
  const stalledTransactions = transactions.filter(t => t.status === 'In Escrow' && (now.getTime() - new Date(t.date).getTime()) > 7 * 24 * 60 * 60 * 1000);
  const flaggedPosts = posts.filter(p => p.flaggedBy.length > 0);

  const getAllComments = (p: Post, comments: Comment[]): (Comment & { postTitle: string; postId: string })[] => {
    let all: (Comment & { postTitle: string; postId: string })[] = [];
    for (const comment of comments) {
      all.push({ ...comment, postTitle: p.title, postId: p.id });
      if (comment.replies && comment.replies.length > 0) {
        all = all.concat(getAllComments(p, comment.replies));
      }
    }
    return all;
  };
  const flaggedComments = posts.flatMap(p => getAllComments(p, p.comments)).filter(c => c.flaggedBy.length > 0);
  const disputedTransactions = transactions.filter(t => t.status === 'Disputed');


  const renderView = () => {
    switch(activeView) {
      case 'Dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard title="Total Transactions" value={`${totalTransactions}`} icon={<ChartBarIcon />} />
              <StatCard title="Total Revenue" value={`₦${totalRevenue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} icon={<DocumentReportIcon />} />
              <StatCard title="Active Disputes" value={`${activeDisputesCount}`} icon={<ShieldExclamationIcon />} color="text-red-500" />
            </div>
             <AttentionRequiredPanel 
                stalledTransactions={stalledTransactions}
                flaggedPosts={flaggedPosts}
                flaggedComments={flaggedComments}
                disputedTransactions={disputedTransactions}
                posts={posts}
                onSelectTransaction={setSelectedTransaction}
                onSelectPost={handleSelectPost}
                onSelectDisputedTransaction={() => {
                  setInitialTxMgmtTab('disputes');
                  setActiveView('Transaction Management');
                }}
             />
          </div>
        );
      case 'Analytics':
        if (loggedInUser.role === 'Super Admin') {
          return <AnalyticsPage 
            users={users} 
            posts={posts} 
            transactions={transactions} 
            disputes={disputes}
            onViewProfile={handleViewProfile} 
          />;
        }
        return <div>Access Denied</div>;
      case 'Transaction Management':
        return <TransactionManagementPage transactions={transactions} disputes={disputes} onSelectTransaction={setSelectedTransaction} onDisputeSelect={setSelectedDispute} initialTab={initialTxMgmtTab} />;
      case 'Settings':
        return <SettingsPage users={users} onViewProfile={handleViewProfile} isMaintenanceMode={isMaintenanceMode} onToggleMaintenanceMode={handleToggleMaintenanceMode} currentUser={loggedInUser} />;
      case 'Forum':
        return <ForumPage 
          posts={posts}
          transactions={transactions}
          categories={categories}
          users={users}
          currentUser={loggedInUser}
          onInitiatePurchase={handleInitiatePurchase}
          onStartChat={(post) => handleStartChat({post})}
          onCreatePost={handleCreatePost}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
          onLike={handleLikePost}
          onDislike={handleDislikePost}
          onAddComment={handleAddComment}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          onViewProfile={handleViewProfile}
          onTogglePinPost={handleTogglePinPost}
          selectedPostId={selectedPostId}
          onSelectPost={(p) => setSelectedPostId(p.id)}
          onClearSelectedPost={() => setSelectedPostId(null)}
          onFlagPost={(postId: string) => setToast({ message: 'Post flagged for review.', type: 'success'})}
          onFlagComment={(postId: string, commentId: string) => setToast({ message: 'Comment flagged for review.', type: 'success'})}
          onResolvePostFlag={(postId: string) => setToast({ message: 'Post flag resolved.', type: 'success'})}
          onResolveCommentFlag={(postId: string, commentId: string) => setToast({ message: 'Comment flag resolved.', type: 'success'})}
          onTogglePostCommentRestriction={handleTogglePostCommentRestriction}
          onLikeComment={handleLikeComment}
          onDislikeComment={handleDislikeComment}
          onToggleSoldStatus={handleToggleSoldStatus}
        />;
      case 'My Chats':
        return <ChatPage 
          chats={currentUserChats}
          activeChatId={activeChatId}
          onSelectChat={setActiveChatId}
          onSendMessage={handleSendMessage}
          currentUser={loggedInUser}
          users={users}
          posts={posts}
          transactions={transactions}
          onSelectTransaction={setSelectedTransaction}
          onViewProfile={handleViewProfile}
          onSelectPost={handleSelectPost}
          onInitiateCall={(user) => setCallSelectionForUser(user)}
          allStickers={mockStickers}
          onSaveSticker={handleSaveSticker}
          onForwardMessage={(message) => setForwardMessageState({ message, isOpen: true })}
        />;
      case 'My Profile':
        return <MyProfilePage 
          currentUser={loggedInUser}
          allPosts={posts}
          allTransactions={transactions}
          allDisputes={disputes}
          activityLog={activityLog}
          users={users}
          onDisputeSelect={setSelectedDispute}
          onSelectTransaction={setSelectedTransaction}
          onUpdateSettings={handleUpdateSettings}
          onDeactivateAccount={handleRequestDeactivation}
          onLike={handleLikePost}
          onDislike={handleDislikePost}
          onViewProfile={handleViewProfile}
          onAddComment={handleAddComment}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          onUnfollow={handleUnfollow}
          onStartChat={(user) => handleStartChat({userToMessage: user})}
          onAddReview={handleAddReview}
          onSelectPost={handleSelectPost}
          onTogglePinPost={handleTogglePinPost}
          onFlagPost={()=>{}}
          onFlagComment={()=>{}}
          onResolvePostFlag={()=>{}}
          onResolveCommentFlag={()=>{}}
          onTogglePostCommentRestriction={handleTogglePostCommentRestriction}
          onLikeComment={handleLikeComment}
          onDislikeComment={handleDislikeComment}
          onToggleSoldStatus={handleToggleSoldStatus}
          onOpenBankAccountModal={() => setIsAddBankAccountModalOpen(true)}
        />;
      default:
        return <div>Not implemented</div>
    }
  }

  return (
    <div className={`flex h-screen bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary font-sans antialiased ${theme === 'dark' ? 'dark' : ''}`}>
      {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmation && <ConfirmationModal isOpen={!!confirmation} onClose={() => setConfirmation(null)} {...confirmation} />}
      {isVerificationModalOpen && loggedInUser && (
        <EmailVerificationModal 
            email={loggedInUser.email}
            onClose={() => setIsVerificationModalOpen(false)}
            onVerify={handleVerifyEmail}
            onSkip={handleSkipVerification}
        />
      )}
      {selectedDispute && <DisputeModal dispute={selectedDispute} transaction={transactions.find(t => t.id === selectedDispute.transactionId)} currentUser={loggedInUser} users={users} onClose={() => setSelectedDispute(null)} onResolve={handleResolveDispute} onSendMessage={() => {}} />}
      {selectedTransaction && <TransactionDetailModal transaction={selectedTransaction} currentUser={loggedInUser} users={users} posts={posts} onClose={() => setSelectedTransaction(null)} onViewProfile={(user) => { setSelectedTransaction(null); handleViewProfile(user); }} onRaiseDispute={(transaction) => { setSelectedTransaction(null); setRaiseDisputeState(transaction); }} onMarkAsShipped={()=>{}} onAcceptItem={handleAcceptItem} onAdminUpdateTransaction={()=>{}} onSelectPost={handleSelectPost} onOpenReviewModal={(transaction) => { setSelectedTransaction(null); handleOpenReviewModal(transaction); }} onOpenTransactionChat={(transaction) => { setSelectedTransaction(null); handleOpenTransactionChat(transaction); }} onReverseAdminAction={() => {}} />}
      {userToBan && <BanUserModal user={userToBan} onClose={() => setUserToBan(null)} onConfirm={handleConfirmBan} />}
      {reviewModalState && <ReviewModal userToReview={users.find(u => u.name === (loggedInUser.name === reviewModalState.transaction.buyer ? reviewModalState.transaction.seller : reviewModalState.transaction.buyer))!} onClose={() => setReviewModalState(null)} onSubmit={(rating, comment) => { const userToReview = users.find(u => u.name === (loggedInUser.name === reviewModalState.transaction.buyer ? reviewModalState.transaction.seller : reviewModalState.transaction.buyer)); if(userToReview) handleAddReview(userToReview.id, rating, comment, reviewModalState.transaction.id); setReviewModalState(null); }} />}
      {policyModal && <PolicyModal title={policyModal.title} content={policyModal.content} onClose={() => setPolicyModal(null)} />}
      {chatInModal && <ChatModal chat={chatInModal} currentUser={loggedInUser} users={users} posts={posts} onSendMessage={handleSendMessage} onClose={() => setChatIdInModal(null)} onViewProfile={(user) => { setChatIdInModal(null); handleViewProfile(user); }} onSelectPost={(post) => { setChatIdInModal(null); handleSelectPost(post); }} onInitiateCall={(user) => { setChatIdInModal(null); setCallSelectionForUser(user); }} allStickers={mockStickers} onSaveSticker={handleSaveSticker} onForwardMessage={(message) => setForwardMessageState({ message, isOpen: true })} />}
      {activeCall && <CallModal currentUser={loggedInUser} otherUser={activeCall.withUser} type={activeCall.type} onEndCall={() => setActiveCall(null)} />}
      {callSelectionForUser && <CallTypeSelectionModal userToCall={callSelectionForUser} onClose={() => setCallSelectionForUser(null)} onStartCall={(user, type) => { setActiveCall({ withUser: user, type }); setCallSelectionForUser(null); }} />}
      {forwardMessageState.isOpen && <ForwardMessageModal messageToForward={forwardMessageState.message} userChats={chats} currentUser={loggedInUser} users={users} onClose={() => setForwardMessageState({ ...forwardMessageState, isOpen: false })} onConfirm={(targetChatIds) => { handleForwardMessage(forwardMessageState.message, targetChatIds); setForwardMessageState({ ...forwardMessageState, isOpen: false }); }} />}
      {isAddBankAccountModalOpen && <AddBankAccountModal onClose={() => setIsAddBankAccountModalOpen(false)} onSave={(account) => { handleUpdateSettings(loggedInUser.id, { bankAccount: account }); setIsAddBankAccountModalOpen(false); if(pendingAction) { pendingAction(); setPendingAction(null); } }} existingAccount={loggedInUser.bankAccount}/>}
      {isAddAddressModalOpen && <AddAddressModal onClose={() => setIsAddAddressModalOpen(false)} onSave={(address) => { handleUpdateSettings(loggedInUser.id, address); setIsAddAddressModalOpen(false); if(pendingAction) { pendingAction(); setPendingAction(null); } }} />}
      {raiseDisputeState && <RaiseDisputeModal transaction={raiseDisputeState} onClose={() => setRaiseDisputeState(null)} onSubmit={handleConfirmRaiseDispute} />}

      {viewingProfileOfUser && <UserProfilePage 
        user={viewingProfileOfUser} 
        allPosts={posts} 
        transactions={transactions}
        users={users} 
        currentUser={loggedInUser} 
        onClose={() => setViewingProfileOfUser(null)} 
        onStartChat={(user) => handleStartChat({userToMessage: user})}
        onRequestFollow={handleRequestFollow}
        onUnfollow={handleUnfollow}
        onCancelFollowRequest={handleCancelFollowRequest}
        onToggleBlock={handleToggleBlock}
        onToggleActivation={handleToggleActivation}
        onBanUser={handleBanUser}
        onUnbanUser={handleUnbanUser}
        onViewProfile={handleViewProfile}
        onLike={handleLikePost}
        onDislike={handleDislikePost}
        onAddReview={handleAddReview}
        onSelectPost={handleSelectPost}
        onTogglePinPost={handleTogglePinPost}
        onFlagPost={()=>{}}
        onFlagComment={()=>{}}
        onResolvePostFlag={()=>{}}
        onResolveCommentFlag={()=>{}}
        onAddComment={handleAddComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
        onSetUserRole={handleSetUserRole}
        onTogglePostCommentRestriction={handleTogglePostCommentRestriction}
        onLikeComment={handleLikeComment}
        onDislikeComment={handleDislikeComment}
        onToggleSoldStatus={handleToggleSoldStatus}
      />}
      
      { isAdminOrSuperAdmin ? (
        <div className="flex w-full h-full">
            <Sidebar activeView={activeView} onNavigate={handleNavigation} role={loggedInUser.role} isMobileOpen={isMobileSidebarOpen} onCloseMobile={() => setIsMobileSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                {isMaintenanceMode && <MaintenanceBanner />}
                <Header 
                    role={loggedInUser.role}
                    activeView={activeView}
                    onToggleMobileSidebar={() => setIsMobileSidebarOpen(p => !p)}
                    userName={loggedInUser.name}
                    onSignOut={handleSignOut}
                    onNavigate={handleNavigation}
                    notifications={notifications}
                    messages={chats}
                    onNotificationClick={(item) => {
                      if ('type' in item) { // Is a Notification
                        if (item.postId) {
                          handleNavigation('Forum');
                          setSelectedPostId(item.postId);
                        }
                      }
                      // No action for chat items for admins
                    }}
                    theme={theme}
                    onToggleTheme={handleToggleTheme}
                    currentUser={loggedInUser}
                    users={users}
                    posts={posts}
                    onStartChat={(user) => handleStartChat({userToMessage: user})}
                    onViewProfile={handleViewProfile}
                    onSelectPost={handleSelectPost}
                    onAcceptFollowRequest={handleAcceptFollowRequest}
                    onDeclineFollowRequest={handleDeclineFollowRequest}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 bg-gray-100 dark:bg-dark-background">
                    {isBanned && <BanNotificationBanner user={loggedInUser}/>}
                    {!loggedInUser.isVerified && <VerificationBanner onStartVerification={() => setIsVerificationModalOpen(true)} />}
                    {renderView()}
                </main>
            </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
            <Header 
                role={loggedInUser.role}
                activeView={activeView}
                onToggleMobileSidebar={() => {}}
                userName={loggedInUser.name}
                onSignOut={handleSignOut}
                onNavigate={handleNavigation}
                notifications={currentUserNotifications}
                messages={currentUserChats}
                onNotificationClick={(item) => {
                    if ('type' in item) { // Notification
                        if (item.postId) { handleNavigation('Forum'); setSelectedPostId(item.postId); }
                        if (item.chatId) { handleNavigation('My Chats'); setActiveChatId(item.chatId); }
                    } else { // Chat
                        handleNavigation('My Chats');
                        setActiveChatId(item.id);
                    }
                }}
                theme={theme}
                onToggleTheme={handleToggleTheme}
                currentUser={loggedInUser}
                users={users}
                posts={posts}
                onStartChat={(user) => handleStartChat({userToMessage: user})}
                onViewProfile={handleViewProfile}
                onSelectPost={handleSelectPost}
                onAcceptFollowRequest={handleAcceptFollowRequest}
                onDeclineFollowRequest={handleDeclineFollowRequest}
            />
             <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 bg-gray-100 dark:bg-dark-background">
                {isBanned && <BanNotificationBanner user={loggedInUser}/>}
                {!loggedInUser.isVerified && <VerificationBanner onStartVerification={() => setIsVerificationModalOpen(true)} />}
                {renderView()}
            </main>
        </div>
      )}

    </div>
  );
};