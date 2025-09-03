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


const App: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
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
  const [confirmation, setConfirmation] = useState<{ title: string; message: string; onConfirm: () => void; confirmText?: string; variant?: 'danger' | 'primary'; } | null>(null);
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

  const handleLogin = (username: string, password: string):void => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        if (!user.isActive) {
            setLoginError('Your account has been deactivated. Please contact support.');
            return;
        }
        setLoggedInUser(user);
        setLoginError('');
        setToast({ message: `Welcome ${user.name}!`, type: 'success' });
    } else {
        setLoginError('Invalid username or password.');
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

  const handleSignUp = (username: string, password: string): { success: boolean, message: string } => {
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, message: 'Username is already taken.' };
    }
    const newUser: User = {
        id: `user-${Date.now()}`,
        username,
        password, // In a real app, this would be hashed
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
    setToast({ message: `Welcome ${newUser.name}!`, type: 'success' });
    return { success: true, message: 'Account created successfully!' };
  };

  const handleSignOut = () => {
      setLoggedInUser(null);
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

  const handleAddComment = (postId: string, commentData: { content: string; mediaUrl?: string; mediaType?: 'image' | 'video'; }) => {
    if (!loggedInUser) return;
    const newComment: Comment = {
      id: `C${Math.random().toString(36).substring(2, 9)}`,
      author: loggedInUser.name,
      timestamp: new Date().toISOString(),
      content: commentData.content,
      mediaUrl: commentData.mediaUrl,
      mediaType: commentData.mediaType,
      flaggedBy: [],
    };

    const post = posts.find(p => p.id === postId);
    if (post && post.author !== loggedInUser.name) {
        const postAuthor = users.find(u => u.name === post.author);
        if (postAuthor) {
            const commentNotification: Notification = {
                id: `notif-${Date.now()}-${postAuthor.id}`,
                userId: postAuthor.id,
                actorId: loggedInUser.id,
                type: 'comment',
                content: `${loggedInUser.name} commented on your post: "${post.title}"`,
                link: '#',
                postId: post.id,
                timestamp: new Date().toISOString(),
                read: false,
            };
            setNotifications(prev => [commentNotification, ...prev]);
        }
    }

    setPosts(prevPosts => prevPosts.map(post => post.id === postId
        ? { ...post, comments: [newComment, ...post.comments], lastActivityTimestamp: new Date().toISOString() }
        : post
    ));
    createActivityLogEntry('Commented on Post', `"${posts.find(p => p.id === postId)?.title}"`);
  };

  const handleEditComment = (postId: string, commentId: string, newContent: string) => {
    if (!loggedInUser) return;
    setPosts(posts.map(post => {
        if (post.id === postId) {
            return {
                ...post,
                comments: post.comments.map(comment => {
                    if (comment.id === commentId && comment.author === loggedInUser.name) {
                        return { ...comment, content: newContent, editedTimestamp: new Date().toISOString() };
                    }
                    return comment;
                })
            };
        }
        return post;
    }));
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    if (!loggedInUser) return;
    const post = posts.find(p => p.id === postId);
    const comment = post?.comments.find(c => c.id === commentId);
    if (!comment) return;
    if (comment.author !== loggedInUser.name && loggedInUser.role !== 'Admin' && loggedInUser.role !== 'Super Admin') return;
    
    setConfirmation({
        title: "Delete Comment",
        message: "Are you sure you want to delete this comment? This action cannot be undone.",
        onConfirm: () => {
            setPosts(prevPosts => prevPosts.map(p => {
                if (p.id === postId) {
                    return { ...p, comments: p.comments.filter(c => c.id !== commentId) };
                }
                return p;
            }));
            setConfirmation(null);
        },
        confirmText: "Delete",
        variant: 'danger'
    });
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
    setToast({ message: wasPinned ? "Post unpinned." : "Post pinned for 24 hours.", type: 'success'});
  };

  const handleSendDisputeMessage = async (disputeId: string, message: { text?: string; attachmentFile?: File }) => {
    if (!loggedInUser) return;

    let attachment: FileAttachment | undefined;
    if (message.attachmentFile) {
        try {
            const dataUrl = await fileToDataUrl(message.attachmentFile);
            attachment = {
                name: message.attachmentFile.name,
                url: dataUrl,
                type: getFileType(message.attachmentFile),
            };
        } catch (error) {
            setToast({ message: "Could not attach file.", type: 'error' });
            return;
        }
    }

    let updatedDispute: Dispute | undefined;
    
    setDisputes(prev => prev.map(d => {
        if (d.id === disputeId) {
            const newHistory: DisputeMessage = {
                sender: loggedInUser.name,
                message: message.text,
                attachment: attachment,
                timestamp: new Date().toISOString()
            };
            updatedDispute = { ...d, chatHistory: [...d.chatHistory, newHistory] };
            return updatedDispute;
        }
        return d;
    }));

    if (updatedDispute) {
        const otherParties = [
            users.find(u => u.name === updatedDispute!.buyer),
            users.find(u => u.name === updatedDispute!.seller),
        ].filter(Boolean) as User[];
        
        const newNotifications: Notification[] = [];
        const content = `${loggedInUser.name} sent a message in your dispute for transaction ${updatedDispute.transactionId}.`;
        
        otherParties.forEach(party => {
            if (party.id !== loggedInUser.id) {
                newNotifications.push({
                    id: `notif-disp-msg-${Date.now()}-${party.id}`, userId: party.id, type: 'system',
                    content, link: '#', timestamp: new Date().toISOString(), read: false, disputeId
                });
            }
        });
        setNotifications(prev => [...newNotifications, ...prev]);
    }
  };

  const handleFlagPost = (postId: string) => {
      if (!loggedInUser) return;
      setPosts(prev => prev.map(p => {
          if (p.id === postId && !p.flaggedBy.includes(loggedInUser.id)) {
              return { ...p, flaggedBy: [...p.flaggedBy, loggedInUser.id] };
          }
          return p;
      }));
      setToast({ message: "Post has been flagged for review.", type: 'success' });
  };

  const handleFlagComment = (postId: string, commentId: string) => {
      if (!loggedInUser) return;
      setPosts(prev => prev.map(p => {
          if (p.id === postId) {
              return {
                  ...p,
                  comments: p.comments.map(c => {
                      if (c.id === commentId && !c.flaggedBy.includes(loggedInUser.id)) {
                          return { ...c, flaggedBy: [...c.flaggedBy, loggedInUser.id] };
                      }
                      return c;
                  })
              };
          }
          return p;
      }));
      setToast({ message: "Comment has been flagged for review.", type: 'success' });
  };
  
  const handleResolvePostFlag = (postId: string) => {
    if (loggedInUser?.role !== 'Admin' && loggedInUser?.role !== 'Super Admin') return;
    setPosts(prev => prev.map(p => {
        if (p.id === postId) {
            return { ...p, flaggedBy: [] };
        }
        return p;
    }));
    setToast({ message: "Post flag has been resolved.", type: 'success' });
  };

  const handleResolveCommentFlag = (postId: string, commentId: string) => {
    if (loggedInUser?.role !== 'Admin' && loggedInUser?.role !== 'Super Admin') return;
    setPosts(prev => prev.map(p => {
        if (p.id === postId) {
            return {
                ...p,
                comments: p.comments.map(c => {
                    if (c.id === commentId) {
                        return { ...c, flaggedBy: [] };
                    }
                    return c;
                })
            };
        }
        return p;
    }));
     setToast({ message: "Comment flag has been resolved.", type: 'success' });
  };


  const handleRaiseDispute = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction || !loggedInUser) return;

    const now = new Date().toISOString();

    const newDispute: Dispute = {
        id: `DISP${Math.floor(Math.random() * 900) + 100}`,
        transactionId: transaction.id,
        buyer: transaction.buyer,
        seller: transaction.seller,
        reason: 'Item not as described', // This can be made more dynamic
        status: 'Open',
        openedDate: now,
        chatHistory: [{
            sender: loggedInUser.name,
            message: "I am raising a dispute for this transaction.",
            timestamp: now
        }]
    };
    setDisputes(prev => [newDispute, ...prev]);

    const updatedTransaction = { ...transaction, status: 'Disputed' as const };
    setTransactions(transactions.map(t => t.id === transactionId ? updatedTransaction : t));
    setSelectedTransaction(updatedTransaction);
    
    // Notifications
    const newNotifications: Notification[] = [];
    const seller = users.find(u => u.name === transaction.seller);
    const admins = users.filter(u => u.role === 'Admin' || u.role === 'Super Admin');

    if (seller) {
        newNotifications.push({
            id: `notif-${now}-s-disp`, userId: seller.id, type: 'system',
            content: `A dispute has been opened by ${loggedInUser.name} for transaction ${transaction.id}.`,
            link: '#', timestamp: now, read: false, disputeId: newDispute.id,
        });
    }
    admins.forEach(admin => {
        newNotifications.push({
            id: `notif-${now}-a-disp-${admin.id}`, userId: admin.id, type: 'system',
            content: `New dispute ${newDispute.id} requires your attention.`,
            link: '#', timestamp: now, read: false, disputeId: newDispute.id,
        });
    });
    setNotifications(prev => [...newNotifications, ...prev]);

    setToast({ message: 'Dispute raised. An admin will review your case.', type: 'success' });
  };
  
  const handleMarkAsShipped = async (transactionId: string, trackingNumber: string, proofOfShipment: File) => {
    const now = new Date().toISOString();
    let updatedTransaction: Transaction | null = null;
    
    let shippingProof: FileAttachment | undefined;
    try {
        const dataUrl = await fileToDataUrl(proofOfShipment);
        shippingProof = {
            name: proofOfShipment.name,
            url: dataUrl,
            type: getFileType(proofOfShipment),
        };
    } catch (error) {
        setToast({ message: "Could not process proof of shipment.", type: 'error' });
        return;
    }

    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        updatedTransaction = { ...t, status: 'Shipped', trackingNumber, shippedAt: now, shippingProof };
        return updatedTransaction;
      }
      return t;
    }));

    if (updatedTransaction) {
      setSelectedTransaction(updatedTransaction);
      setToast({ message: 'Transaction marked as shipped.', type: 'success' });
      
      const buyer = users.find(u => u.name === updatedTransaction!.buyer);
      if(buyer) {
        const shipNotification: Notification = {
            id: `notif-${now}-ship`, userId: buyer.id, type: 'system',
            content: `Your item "${updatedTransaction!.item}" has been shipped! Tracking: ${trackingNumber}`,
            link: '#', timestamp: now, read: false, transactionId,
        };
        setNotifications(prev => [shipNotification, ...prev]);
      }
      
      // Simulate delivery
      setTimeout(() => {
        const deliveredAt = new Date().toISOString();
        const inspectionPeriodEnds = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
        let finalTransaction: Transaction | null = null;
        
        setTransactions(prev => prev.map(t => {
          if (t.id === transactionId && t.status === 'Shipped') {
            finalTransaction = { ...t, status: 'Delivered', deliveredAt, inspectionPeriodEnds };
            return finalTransaction;
          }
          return t;
        }));
        
        // Update modal view if it's still open for this transaction
        if (selectedTransaction && selectedTransaction.id === transactionId) {
            setSelectedTransaction(finalTransaction);
        }
        
        // Delivery notifications
        const deliveryNotifications: Notification[] = [];
        if (buyer) {
             deliveryNotifications.push({
                id: `notif-${deliveredAt}-b-deliv`, userId: buyer.id, type: 'system',
                content: `Your item "${updatedTransaction!.item}" has been delivered. Please inspect it within 3 days.`,
                link: '#', timestamp: deliveredAt, read: false, transactionId,
            });
        }
        const seller = users.find(u => u.name === updatedTransaction!.seller);
        if(seller) {
            deliveryNotifications.push({
                id: `notif-${deliveredAt}-s-deliv`, userId: seller.id, type: 'system',
                content: `Item "${updatedTransaction!.item}" has been delivered. The buyer's 3-day inspection period has started.`,
                link: '#', timestamp: deliveredAt, read: false, transactionId,
            });
        }
        setNotifications(prev => [...deliveryNotifications, ...prev]);

      }, 5000); // 5 second delay for demo
    }
  };
  
  const handleAcceptItem = (transactionId: string) => {
    const now = new Date().toISOString();
    let updatedTransaction: Transaction | null = null;
    
    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        updatedTransaction = { ...t, status: 'Completed', completedAt: now };
        return updatedTransaction;
      }
      return t;
    }));

    if (updatedTransaction) {
      setSelectedTransaction(updatedTransaction);
      
      const seller = users.find(u => u.name === updatedTransaction!.seller);
      if(seller) {
        const releaseNotification: Notification = {
            id: `notif-${now}-release`, userId: seller.id, type: 'system',
            content: `Funds for "${updatedTransaction!.item}" have been released by the buyer.`,
            link: '#', timestamp: now, read: false, transactionId,
        };
        setNotifications(prev => [releaseNotification, ...prev]);
      }

      setToast({ message: 'Item accepted and funds released to seller.', type: 'success' });
    }
  };
  
  const handleAdminUpdateTransaction = (transactionId: string, updates: Partial<Transaction>) => {
    if (!loggedInUser || (loggedInUser.role !== 'Admin' && loggedInUser.role !== 'Super Admin')) return;

    let updatedTransaction: Transaction | null = null;
    const now = new Date().toISOString();
    
    let action: AdminAction['action'] | null = null;
    let details: string | undefined;

    const originalTransaction = transactions.find(t => t.id === transactionId);
    if (!originalTransaction) return;

    if (updates.status === 'Completed') {
        action = 'Forced Payout';
    } else if (updates.status === 'Cancelled') {
        if (updates.refundedAmount) {
            action = 'Partial Refund';
            details = `₦${updates.refundedAmount.toLocaleString()}`;
        } else {
            action = 'Forced Full Refund';
        }
    }
    
    if (!action) return;

    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        const newAction: AdminAction = {
            id: `act-${Date.now()}`,
            adminId: loggedInUser.id,
            adminName: loggedInUser.name,
            action: action!,
            timestamp: now,
            details,
            originalStatus: t.status,
        };
        updatedTransaction = { 
            ...t, 
            ...updates,
            adminActions: [...(t.adminActions || []), newAction]
        };
        return updatedTransaction;
      }
      return t;
    }));

    if (updatedTransaction) {
      setSelectedTransaction(updatedTransaction);
      
      const buyer = users.find(u => u.name === updatedTransaction!.buyer);
      const seller = users.find(u => u.name === updatedTransaction!.seller);
      const adminNotifications: Notification[] = [];

      let toastMessage = `Transaction ${transactionId} has been updated by admin.`;
      let buyerContent = `An admin has updated transaction ${transactionId}. New status: ${updates.status}.`;
      let sellerContent = buyerContent;

      if (updates.status === 'Completed') {
          buyerContent = `An admin has completed the transaction for "${updatedTransaction.item}".`;
          sellerContent = `An admin has released payment for "${updatedTransaction.item}" to you.`;
          toastMessage = `Payment released for transaction ${transactionId}.`;
      }
      
      if (updates.status === 'Cancelled') {
          if (updates.refundedAmount && updatedTransaction) { // Partial refund
              const refundAmountStr = updates.refundedAmount.toLocaleString();
              const remainingAmountStr = (updatedTransaction.amount - updates.refundedAmount).toLocaleString();
              
              buyerContent = `An admin has issued a partial refund of ₦${refundAmountStr} for "${updatedTransaction.item}".`;
              sellerContent = `An admin has resolved the transaction for "${updatedTransaction.item}". A partial refund was issued to the buyer, and the remaining ₦${remainingAmountStr} has been released to you.`;
              toastMessage = `Partial refund for transaction ${transactionId} processed.`;
          } else { // Full refund
              buyerContent = `An admin has issued a full refund for "${updatedTransaction.item}".`;
              sellerContent = `An admin has cancelled the transaction for "${updatedTransaction.item}" and issued a full refund to the buyer.`;
              toastMessage = `Full refund issued for transaction ${transactionId}.`;
          }
      }

      if(buyer) adminNotifications.push({ id: `notif-${now}-b-admin`, userId: buyer.id, type: 'system', content: buyerContent, link: '#', timestamp: now, read: false, transactionId });
      if(seller) adminNotifications.push({ id: `notif-${now}-s-admin`, userId: seller.id, type: 'system', content: sellerContent, link: '#', timestamp: now, read: false, transactionId });
      setNotifications(prev => [...adminNotifications, ...prev]);
      
      setToast({ message: toastMessage, type: 'success' });
    }
  };
  
   const handleReverseAdminAction = (transactionId: string, actionToReverseId: string) => {
    if (!loggedInUser || loggedInUser.role !== 'Super Admin') return;

    let updatedTransaction: Transaction | null = null;
    const now = new Date().toISOString();
    
    setTransactions(prev => prev.map(t => {
        if (t.id === transactionId) {
            const actionToReverse = t.adminActions?.find(a => a.id === actionToReverseId);
            if (!actionToReverse || !actionToReverse.originalStatus) return t;
            
            const reversalAction: AdminAction = {
                id: `act-rev-${Date.now()}`,
                adminId: loggedInUser.id,
                adminName: loggedInUser.name,
                action: 'Reversal',
                timestamp: now,
                details: `Reversed action ${actionToReverse.id} ("${actionToReverse.action}") by ${actionToReverse.adminName}`,
                originalStatus: t.status,
            };
            
            updatedTransaction = {
                ...t,
                status: actionToReverse.originalStatus,
                adminActions: [...(t.adminActions || []), reversalAction],
                cancelledAt: undefined,
                completedAt: undefined,
                refundedAmount: undefined,
                failureReason: undefined,
            };
            
            return updatedTransaction;
        }
        return t;
    }));
    
    if (updatedTransaction) {
        setSelectedTransaction(updatedTransaction);
        setToast({ message: `Admin action has been reversed for transaction ${transactionId}.`, type: 'success' });
    }
  };


  const handleNotificationClick = (item: Notification | Chat) => {
    // Mark as read
    if ('read' in item) {
        setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
    }

    if(viewingProfileOfUser) setViewingProfileOfUser(null);
    
    if ('type' in item) { // Is a Notification
      const notification = item as Notification;
      if (notification.postId) {
          const postExists = posts.some(p => p.id === notification.postId);
          if (postExists) {
              setActiveView('Forum');
              setSelectedPostId(notification.postId);
          } else {
              setToast({ message: "The related post may have been deleted.", type: 'error' });
          }
      } else if (notification.transactionId) {
          const transaction = transactions.find(t => t.id === notification.transactionId);
          if (transaction) {
              setSelectedTransaction(transaction);
          } else {
               setToast({ message: "The related transaction could not be found.", type: 'error' });
          }
      } else if (notification.disputeId) {
          const dispute = disputes.find(d => d.id === notification.disputeId);
          if (dispute) {
            setSelectedDispute(dispute);
          } else {
            setToast({ message: "The related dispute could not be found.", type: 'error' });
          }
      } else if (notification.chatId) {
          const chat = chats.find(c => c.id === notification.chatId);
          if (chat) {
            if (chat.transactionId) {
                setChatIdInModal(chat.id);
            } else {
                setActiveView('My Chats');
                setActiveChatId(chat.id);
            }
          }
      } else if ((notification.type === 'follow' || notification.type === 'follow_request') && notification.actorId) {
          const actor = users.find(u => u.id === notification.actorId);
          if (actor) {
              handleViewProfile(actor);
          }
      }
    } else { // Is a Chat
      const chat = item as Chat;
      setActiveChatId(chat.id);
      setActiveView('My Chats');
    }
  };
  
    const handleInitiateCall = (userToCall: User) => {
        if (!loggedInUser) return;
        
        const canCall = loggedInUser.followingIds.includes(userToCall.id) || userToCall.followingIds.includes(loggedInUser.id);
        if (!canCall) {
            setToast({ message: "At least one of you must follow the other to start a call.", type: 'error'});
            return;
        }

        setCallSelectionForUser(userToCall);
    };
    
    const handleStartCall = (user: User, type: 'video' | 'audio') => {
        setCallSelectionForUser(null);
        setActiveCall({ withUser: user, type });
    };

    const handleEndCall = () => {
        setActiveCall(null);
    };
    
    const handleSaveBankAccount = (account: BankAccount) => {
        if (!loggedInUser) return;
        
        const updatedUser = { ...loggedInUser, bankAccount: account };
        setLoggedInUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === loggedInUser.id ? updatedUser : u));

        setIsAddBankAccountModalOpen(false);
        
        setTimeout(() => {
            pendingAction?.();
            setPendingAction(null);
        }, 0);

        setToast({ message: 'Payout account saved successfully.', type: 'success' });
    };

    const handleSaveAddress = (addressDetails: { address: string; city: string; zipCode: string }) => {
        if (!loggedInUser) return;
        
        const updatedUser = { ...loggedInUser, ...addressDetails };
        setLoggedInUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === loggedInUser.id ? updatedUser : u));

        setIsAddAddressModalOpen(false);

        setTimeout(() => {
            pendingAction?.();
            setPendingAction(null);
        }, 0);
        
        setToast({ message: 'Shipping address saved successfully.', type: 'success' });
    };


  if (!loggedInUser) {
    if (authMode === 'signup') {
        return <SignUpPage onSignUp={handleSignUp} onSwitchMode={setAuthMode} onSsoLogin={handleSsoLogin} />
    }
    return <LoginPage onLogin={handleLogin} error={loginError} onSwitchMode={setAuthMode} onSsoLogin={handleSsoLogin} />;
  }
  
  const mainContent = () => {
    if (viewingProfileOfUser) {
      return <UserProfilePage 
        user={viewingProfileOfUser} 
        allPosts={posts} 
        transactions={transactions}
        users={users} 
        currentUser={loggedInUser}
        onClose={() => setViewingProfileOfUser(null)}
        onStartChat={(userToMessage) => handleStartChat({ userToMessage })}
        onRequestFollow={handleRequestFollow}
        onUnfollow={handleUnfollow}
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
        onCancelFollowRequest={handleCancelFollowRequest}
        onFlagPost={handleFlagPost}
        onFlagComment={handleFlagComment}
        onResolvePostFlag={handleResolvePostFlag}
        onResolveCommentFlag={handleResolveCommentFlag}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
        onSetUserRole={handleSetUserRole}
      />
    }

    switch (activeView) {
      case 'Dashboard':
        const stalledTransactions = transactions.filter(t => t.status === 'In Escrow' && new Date(t.date) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
        const flaggedPosts = posts.filter(p => p.flaggedBy.length > 0);
        const flaggedComments = posts.flatMap(p => p.comments.filter(c => c.flaggedBy.length > 0).map(c => ({...c, postTitle: p.title, postId: p.id})));
        const disputedTransactions = transactions.filter(t => t.status === 'Disputed');
        
        return (
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Revenue" value={`₦${totalRevenue.toLocaleString()}`} icon={<DocumentReportIcon />} />
                    <StatCard title="Transactions" value={totalTransactions.toString()} icon={<ChartBarIcon />} color="text-green-500" />
                    <StatCard title="Active Disputes" value={activeDisputesCount.toString()} icon={<ShieldExclamationIcon />} color="text-yellow-500" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-surface dark:bg-dark-surface rounded-lg shadow p-4">
                        <h3 className="font-bold text-lg mb-2 text-text-primary dark:text-dark-text-primary">Disputes</h3>
                        <DisputesTable disputes={disputes} onDisputeSelect={setSelectedDispute} />
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
            </div>
        );
      case 'Transaction Management':
        return <TransactionManagementPage
          transactions={transactions}
          disputes={disputes}
          onSelectTransaction={setSelectedTransaction}
          onDisputeSelect={setSelectedDispute}
          initialTab={initialTxMgmtTab}
        />;
      case 'Settings':
        return <SettingsPage users={users} onViewProfile={handleViewProfile} />;
      case 'Forum':
        return <div className="p-4 sm:p-6"><ForumPage transactions={transactions} posts={posts.filter(p => !loggedInUser.blockedUserIds.includes(users.find(u => u.name === p.author)?.id || ''))} categories={categories} users={users} currentUser={loggedInUser} onInitiatePurchase={handleInitiatePurchase} onStartChat={(post) => handleStartChat({ post })} onCreatePost={handleCreatePost} onEditPost={handleEditPost} onDeletePost={handleDeletePost} onLike={handleLikePost} onDislike={handleDislikePost} onAddComment={handleAddComment} onEditComment={handleEditComment} onDeleteComment={handleDeleteComment} onViewProfile={handleViewProfile} onTogglePinPost={handleTogglePinPost} selectedPostId={selectedPostId} onSelectPost={(post) => setSelectedPostId(post.id)} onClearSelectedPost={() => setSelectedPostId(null)} onFlagPost={handleFlagPost} onFlagComment={handleFlagComment} onResolvePostFlag={handleResolvePostFlag} onResolveCommentFlag={handleResolveCommentFlag} /></div>;
      case 'My Chats':
        const userChats = (loggedInUser.role === 'Admin' || loggedInUser.role === 'Super Admin')
            ? chats.filter(c => !c.transactionId && (c.buyer === loggedInUser.name || c.seller === loggedInUser.name)) 
            : chats.filter(c => c.buyer === loggedInUser.name || c.seller === loggedInUser.name);
        return <div className="h-[calc(100vh-80px)]"><ChatPage 
            chats={userChats} 
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
            onInitiateCall={handleInitiateCall}
            allStickers={mockStickers}
            onSaveSticker={handleSaveSticker}
            onForwardMessage={(message) => setForwardMessageState({ message, isOpen: true })}
        /></div>;
      case 'My Profile':
        return <MyProfilePage currentUser={loggedInUser} allPosts={posts} allTransactions={transactions} allDisputes={disputes} activityLog={activityLog.filter(log => log.userId === loggedInUser.id)} users={users} onDisputeSelect={setSelectedDispute} onSelectTransaction={setSelectedTransaction} onUpdateSettings={handleUpdateSettings} onLike={handleLikePost} onDislike={handleDislikePost} onViewProfile={handleViewProfile} onEditComment={handleEditComment} onDeleteComment={handleDeleteComment} onUnfollow={handleUnfollow} onStartChat={(userToMessage) => handleStartChat({ userToMessage })} onAddReview={handleAddReview} onSelectPost={handleSelectPost} onTogglePinPost={handleTogglePinPost} onFlagPost={handleFlagPost} onFlagComment={handleFlagComment} onResolvePostFlag={handleResolvePostFlag} onResolveCommentFlag={handleResolveCommentFlag} />;
      default:
        return <div>Select a view</div>;
    }
  };

  return (
    <div className={`flex h-screen bg-background dark:bg-dark-background font-sans ${theme}`}>
      {(loggedInUser.role === 'Admin' || loggedInUser.role === 'Super Admin') && <Sidebar activeView={activeView} onNavigate={handleNavigation} role={loggedInUser.role} isMobileOpen={isMobileSidebarOpen} onCloseMobile={() => setIsMobileSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            role={loggedInUser.role}
            activeView={activeView}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
            userName={loggedInUser.name}
            onSignOut={handleSignOut}
            onNavigate={setActiveView}
            notifications={notifications.filter(n => n.userId === loggedInUser.id)}
            messages={chats.filter(c => c.buyer === loggedInUser.name || c.seller === loggedInUser.name)}
            onNotificationClick={handleNotificationClick}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            currentUser={loggedInUser}
            users={users}
            posts={posts}
            onStartChat={(user) => handleStartChat({ userToMessage: user })}
            onViewProfile={handleViewProfile}
            onSelectPost={handleSelectPost}
            onAcceptFollowRequest={handleAcceptFollowRequest}
            onDeclineFollowRequest={handleDeclineFollowRequest}
        />
        <BanNotificationBanner user={loggedInUser} />
        <main className="flex-1 overflow-y-auto">
          {mainContent()}
        </main>
        <footer className="p-4 bg-gray-100 dark:bg-dark-surface border-t dark:border-gray-700 text-center text-xs text-text-secondary">
          <button onClick={() => setPolicyModal({ title: 'Terms of Service', content: termsOfServiceContent })} className="hover:underline">Terms of Service</button>
          <span className="mx-2">|</span>
          <button onClick={() => setPolicyModal({ title: 'Privacy Policy', content: privacyPolicyContent })} className="hover:underline">Privacy Policy</button>
        </footer>
      </div>
       {selectedDispute && <DisputeModal dispute={selectedDispute} transaction={transactions.find(t => t.id === selectedDispute.transactionId)} currentUser={loggedInUser} users={users} onClose={() => setSelectedDispute(null)} onResolve={handleResolveDispute} onSendMessage={handleSendDisputeMessage} />}
       {selectedTransaction && <TransactionDetailModal transaction={selectedTransaction} currentUser={loggedInUser} users={users} posts={posts} onClose={() => setSelectedTransaction(null)} onViewProfile={handleViewProfile} onRaiseDispute={handleRaiseDispute} onMarkAsShipped={handleMarkAsShipped} onAcceptItem={handleAcceptItem} onAdminUpdateTransaction={handleAdminUpdateTransaction} onSelectPost={handleSelectPost} onOpenReviewModal={handleOpenReviewModal} onOpenTransactionChat={handleOpenTransactionChat} onReverseAdminAction={handleReverseAdminAction} />}
       {userToBan && <BanUserModal user={userToBan} onClose={() => setUserToBan(null)} onConfirm={handleConfirmBan} />}
       {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
       {confirmation && <ConfirmationModal isOpen={true} title={confirmation.title} message={confirmation.message} confirmText={confirmation.confirmText} variant={confirmation.variant} onClose={() => setConfirmation(null)} onConfirm={confirmation.onConfirm} />}
       {reviewModalState && <ReviewModal userToReview={users.find(u => u.name === (loggedInUser.name === reviewModalState.transaction.buyer ? reviewModalState.transaction.seller : reviewModalState.transaction.buyer))!} onClose={() => setReviewModalState(null)} onSubmit={(rating, comment) => {
           const userToReview = users.find(u => u.name === (loggedInUser.name === reviewModalState.transaction.buyer ? reviewModalState.transaction.seller : reviewModalState.transaction.buyer));
           if (userToReview) {
               handleAddReview(userToReview.id, rating, comment, reviewModalState.transaction.id);
           }
       }} />}
       {policyModal && <PolicyModal title={policyModal.title} content={policyModal.content} onClose={() => setPolicyModal(null)} />}
       {chatInModal && <ChatModal
            chat={chatInModal}
            currentUser={loggedInUser}
            users={users}
            posts={posts}
            onSendMessage={handleSendMessage}
            onClose={() => setChatIdInModal(null)}
            onBack={chatInModal.transactionId ? () => setChatIdInModal(null) : undefined}
            onViewProfile={handleViewProfile}
            onSelectPost={handleSelectPost}
            onInitiateCall={handleInitiateCall}
            allStickers={mockStickers}
            onSaveSticker={handleSaveSticker}
            onForwardMessage={(message) => setForwardMessageState({ message, isOpen: true })}
        />}
        {callSelectionForUser && <CallTypeSelectionModal 
            userToCall={callSelectionForUser}
            onClose={() => setCallSelectionForUser(null)}
            onStartCall={handleStartCall}
        />}
        {activeCall && <CallModal
            currentUser={loggedInUser}
            otherUser={activeCall.withUser}
            type={activeCall.type}
            onEndCall={handleEndCall}
        />}
        {forwardMessageState.isOpen && <ForwardMessageModal
            messageToForward={forwardMessageState.message}
            userChats={chats.filter(c => c.buyer === loggedInUser.name || c.seller === loggedInUser.name)}
            currentUser={loggedInUser}
            users={users}
            onClose={() => setForwardMessageState({ message: mockChats[0].messages[0], isOpen: false })}
            onConfirm={(targetChatIds) => {
                handleForwardMessage(forwardMessageState.message, targetChatIds);
                setForwardMessageState({ message: mockChats[0].messages[0], isOpen: false });
            }}
        />}
        {isAddBankAccountModalOpen && <AddBankAccountModal 
            onClose={() => { setIsAddBankAccountModalOpen(false); setPendingAction(null); }} 
            onSave={handleSaveBankAccount} 
        />}
        {isAddAddressModalOpen && <AddAddressModal 
            onClose={() => { setIsAddAddressModalOpen(false); setPendingAction(null); }} 
            onSave={handleSaveAddress} 
        />}
    </div>
  );
}

export default App;