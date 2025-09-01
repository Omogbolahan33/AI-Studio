
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatCard } from './components/StatCard';
import { TransactionsTable } from './components/TransactionsTable';
import { DisputesTable } from './components/DisputesTable';
import { DisputeModal } from './components/DisputeModal';
import { ForumPage } from './components/ForumPage';
import { ChatPage } from './components/ChatPage';
import { LoginPage } from './components/LoginPage';
import { UserProfilePage } from './components/UserProfilePage';
import { BanUserModal } from './components/BanUserModal';
import { UsersPage } from './components/UsersPage';
import { MyProfilePage } from './components/MyProfilePage';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { BanNotificationBanner } from './components/BanNotificationBanner';
import { ChartBarIcon, CurrencyDollarIcon, ShieldExclamationIcon, View } from './types';
import type { Dispute, Post, Chat, User, Category, Comment, Transaction, Notification, ActivityLog } from './types';
import { mockTransactions, mockDisputes, mockPosts, mockChats, mockUsers, mockCategories, mockNotifications, mockActivityLog } from './constants';

const App: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState('');
  
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>(mockActivityLog);

  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [activeView, setActiveView] = useState<View>('Dashboard');
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [viewingProfileOfUser, setViewingProfileOfUser] = useState<User | null>(null);
  const [userToBan, setUserToBan] = useState<User | null>(null);

  useEffect(() => {
    if (loggedInUser) {
        if (loggedInUser.role === 'Admin') {
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
    } else {
        setLoginError('Invalid username or password.');
    }
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
        d.id === disputeId ? { ...d, status: 'Resolved' } : d
      )
    );
    setSelectedDispute(null);
  };

  const handleCreateTransaction = (post: Post) => {
    if (!loggedInUser || loggedInUser.role !== 'Member') return;
    const newTransaction: Transaction = {
        id: `TXN${Math.floor(Math.random() * 90000) + 10000}`,
        postId: post.id,
        buyer: loggedInUser.name,
        seller: post.author,
        item: post.title,
        amount: post.price || 0,
        status: 'In Escrow',
        date: new Date().toISOString().split('T')[0],
    };
    setTransactions(prev => [newTransaction, ...prev]);
    alert(`Transaction for "${post.title}" created! View it in your profile.`);
    setActiveView('My Profile');
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
        alert("You can't start a chat with yourself.");
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
            lastMessageTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChats(prev => [chat!, ...prev]);
    }

    setActiveChatId(chat.id);
    if(viewingProfileOfUser) setViewingProfileOfUser(null);
    setActiveView('My Chats');
  };

  const handleSendMessage = (chatId: string, messageText: string) => {
      setChats(prevChats => prevChats.map(chat => {
          if (chat.id === chatId) {
              const newMessage = {
                  sender: 'me' as const,
                  text: messageText,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };
              return {
                  ...chat,
                  messages: [...chat.messages, newMessage],
                  lastMessage: messageText,
                  lastMessageTimestamp: newMessage.timestamp,
              };
          }
          return chat;
      }));
  };

  const handleCreatePost = (newPostData: { title: string; content: string; isAdvert: boolean; price?: number, categoryId: string, mediaUrl?: string, mediaType?: 'image' | 'video' }) => {
    if (!loggedInUser) return;

    const newPost: Post = {
      id: `POST${Math.random().toString(36).substring(2, 9)}`,
      author: loggedInUser.name,
      timestamp: 'Just now',
      title: newPostData.title,
      content: newPostData.content,
      isAdvert: newPostData.isAdvert,
      price: newPostData.price,
      comments: [],
      categoryId: newPostData.categoryId,
      likedBy: [],
      dislikedBy: [],
      mediaUrl: newPostData.mediaUrl,
      mediaType: newPostData.mediaType,
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
    createActivityLogEntry('Created Post', `"${newPost.title}"`);
  };
  
  const handleEditPost = (postId: string, updatedPostData: { title: string; content: string; isAdvert: boolean; price?: number, categoryId: string, mediaUrl?: string, mediaType?: 'image' | 'video' }) => {
    setPosts(posts.map(p => {
        if (p.id === postId && p.author === loggedInUser?.name) {
            return {
                ...p,
                ...updatedPostData,
                timestamp: 'Edited',
            };
        }
        return p;
    }));
  };
  
  const handleDeletePost = (postId: string) => {
    const postToDelete = posts.find(p => p.id === postId);
    if (!postToDelete) return;
    if (loggedInUser?.role !== 'Admin' && postToDelete.author !== loggedInUser?.name) return;

    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        setPosts(posts.filter(p => p.id !== postId));
    }
  };

  const handleLikePost = (postId: string) => {
    if (!loggedInUser) return;
    setPosts(posts.map(p => {
        if (p.id === postId) {
            const hasLiked = p.likedBy.includes(loggedInUser.id);
            const hasDisliked = p.dislikedBy.includes(loggedInUser.id);
            
            const newLikedBy = hasLiked ? p.likedBy.filter(id => id !== loggedInUser.id) : [...p.likedBy, loggedInUser.id];
            const newDislikedBy = hasDisliked ? p.dislikedBy.filter(id => id !== loggedInUser.id) : p.dislikedBy;
            if(!hasLiked) createActivityLogEntry('Liked Post', `"${p.title}"`);
            return { ...p, likedBy: newLikedBy, dislikedBy: newDislikedBy };
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
            if(!hasDisliked) createActivityLogEntry('Disliked Post', `"${p.title}"`);
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
        timestamp: 'Just now',
        content: commentData.content,
        mediaUrl: commentData.mediaUrl,
        mediaType: commentData.mediaType,
    };
    setPosts(prevPosts => prevPosts.map(post => post.id === postId
        ? { ...post, comments: [newComment, ...post.comments] }
        : post
    ));
    createActivityLogEntry('Commented on Post', `"${posts.find(p=>p.id === postId)?.title}"`);
  };

  const handleEditComment = (postId: string, commentId: string, newContent: string) => {
      if(!loggedInUser) return;
      setPosts(posts.map(post => {
          if (post.id === postId) {
              return {
                  ...post,
                  comments: post.comments.map(comment => {
                      if (comment.id === commentId && comment.author === loggedInUser.name) {
                          return { ...comment, content: newContent, timestamp: 'Edited' };
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
    setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId) {
            const commentToDelete = post.comments.find(c => c.id === commentId);
            if (commentToDelete && (commentToDelete.author === loggedInUser.name || loggedInUser.role === 'Admin')) {
                 if (window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
                    return { ...post, comments: post.comments.filter(c => c.id !== commentId) };
                }
            }
        }
        return post;
    }));
  };

  const handleToggleFollow = (userIdToFollow: string) => {
      if (!loggedInUser) return;
      setUsers(users.map(user => {
          if (user.id === loggedInUser.id) {
              const isFollowing = user.followingIds.includes(userIdToFollow);
              const newFollowingIds = isFollowing
                  ? user.followingIds.filter(id => id !== userIdToFollow)
                  : [...user.followingIds, userIdToFollow];
              
              const newBlockedIds = user.blockedUserIds.filter(id => id !== userIdToFollow);

              const updatedUser = { ...user, followingIds: newFollowingIds, blockedUserIds: newBlockedIds };
              setLoggedInUser(updatedUser);
              return updatedUser;
          }
          return user;
      }));
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
  
  const handleToggleUserActivation = (userId: string) => {
      setUsers(users.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
  };
  
  const handleBanUser = (userId: string, days: number, reason: string) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    
    setUsers(users.map(u => u.id === userId ? { ...u, banExpiresAt: expiryDate.toISOString(), banReason: reason, banStartDate: new Date().toISOString() } : u));
    setUserToBan(null);
  };
  
  const handleUnbanUser = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, banExpiresAt: null, banReason: null, banStartDate: null } : u));
  };

  const handleViewProfile = (user: User) => {
      setViewingProfileOfUser(user);
  };

  const handleCloseProfile = () => {
      setViewingProfileOfUser(null);
  };

  const handleMarkNotificationAsRead = (id: string) => {
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const handleRaiseDispute = (transactionId: string) => {
    alert(`Dispute raised for transaction ${transactionId}. Support will contact you.`);
    setSelectedTransaction(null);
  };

  const handleReportTransaction = (transactionId: string) => {
    alert(`Transaction ${transactionId} has been reported for review.`);
    setSelectedTransaction(null);
  };
  
  const handleUpdateUserSettings = (userId: string, settingsData: Partial<User>) => {
    const updatedUsers = users.map(u => {
        if (u.id === userId) {
            return { ...u, ...settingsData };
        }
        return u;
    });
    setUsers(updatedUsers);

    if (loggedInUser && loggedInUser.id === userId) {
        setLoggedInUser(prev => prev ? { ...prev, ...settingsData } : null);
    }
    alert('Settings updated successfully!');
  };


  if (!loggedInUser) {
    return <LoginPage onLogin={handleLogin} error={loginError} />;
  }
  
  const { role, name: userName } = loggedInUser;
  
  const renderAdminContent = () => {
    switch (activeView) {
      case 'Transactions':
        return <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6">All Transactions</h1>
          <div className="bg-surface rounded-lg shadow p-4 sm:p-6"><TransactionsTable transactions={transactions} onSelectTransaction={setSelectedTransaction}/></div>
        </div>;
      case 'Disputes':
        return <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6">All Disputes</h1>
          <div className="bg-surface rounded-lg shadow p-4 sm:p-6"><DisputesTable disputes={disputes} onDisputeSelect={setSelectedDispute} /></div>
        </div>;
      case 'Forum':
        return <div className="p-4 sm:p-6"><ForumPage posts={posts} categories={categories} users={users} onInitiatePurchase={() => alert('Admin cannot purchase items.')} onStartChat={() => alert('Admin cannot start chats.')} onCreatePost={handleCreatePost} onLike={handleLikePost} onDislike={handleDislikePost} onAddComment={handleAddComment} onEditPost={handleEditPost} onDeletePost={handleDeletePost} onEditComment={handleEditComment} onDeleteComment={handleDeleteComment} currentUser={loggedInUser} onViewProfile={handleViewProfile}/></div>;
      case 'Users':
        return <UsersPage users={users} onViewProfile={handleViewProfile} />;
      case 'Settings':
        return <div className="p-4 sm:p-6"><h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6">Settings</h1></div>;
      case 'Dashboard':
      default:
        return (
          <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-text-primary mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<CurrencyDollarIcon />} />
              <StatCard title="Total Transactions" value={totalTransactions.toString()} icon={<ChartBarIcon />} />
              <StatCard title="Active Disputes" value={activeDisputesCount.toString()} icon={<ShieldExclamationIcon />} color="text-red-500" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-surface rounded-lg shadow p-4 sm:p-6">
                <h2 className="text-xl font-semibold mb-4 text-text-primary">Recent Transactions</h2>
                <TransactionsTable transactions={transactions.slice(0, 5)} onSelectTransaction={setSelectedTransaction}/>
              </div>
              <div className="bg-surface rounded-lg shadow p-4 sm:p-6">
                <h2 className="text-xl font-semibold mb-4 text-text-primary">Active Disputes</h2>
                <DisputesTable disputes={disputes.filter(d => d.status === 'Open')} onDisputeSelect={setSelectedDispute} />
              </div>
            </div>
          </div>
        );
    }
  };

  const renderMemberContent = () => {
    switch (activeView) {
      case 'My Profile':
        return <MyProfilePage 
                    currentUser={loggedInUser}
                    allPosts={posts}
                    allTransactions={transactions}
                    allDisputes={disputes}
                    activityLog={activityLog.filter(log => log.userId === loggedInUser.id)}
                    users={users}
                    onDisputeSelect={setSelectedDispute}
                    onSelectTransaction={setSelectedTransaction}
                    onLike={handleLikePost}
                    onDislike={handleDislikePost}
                    onViewProfile={handleViewProfile}
                    onEditComment={handleEditComment}
                    onDeleteComment={handleDeleteComment}
                    onUpdateSettings={handleUpdateUserSettings}
                />;
      case 'My Chats':
        return <ChatPage chats={chats.filter(c => c.buyer === userName || c.seller === userName)} activeChatId={activeChatId} onSelectChat={setActiveChatId} onSendMessage={handleSendMessage} allTransactions={transactions} onSelectTransaction={setSelectedTransaction} />;
      case 'Forum':
      default:
        return <div className="p-4 sm:p-6"><ForumPage posts={posts} categories={categories} users={users} onInitiatePurchase={handleCreateTransaction} onStartChat={(post) => handleStartChat({post})} onCreatePost={handleCreatePost} onLike={handleLikePost} onDislike={handleDislikePost} onAddComment={handleAddComment} onEditPost={handleEditPost} onDeletePost={handleDeletePost} onEditComment={handleEditComment} onDeleteComment={handleDeleteComment} currentUser={loggedInUser} onViewProfile={handleViewProfile}/></div>;
    }
  };

  const mainContent = role === 'Admin' ? renderAdminContent() : renderMemberContent();
  const isBanned = loggedInUser.banExpiresAt && new Date(loggedInUser.banExpiresAt) > new Date();

  if (role === 'Member') {
    return (
        <div className="flex flex-col h-screen bg-background">
             <Header 
                role={role} 
                onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)} 
                userName={userName} 
                onSignOut={handleSignOut}
                onNavigate={(view) => setActiveView(view)}
                notifications={notifications}
                messages={chats.filter(c => c.buyer === userName || c.seller === userName)}
                onMarkNotificationAsRead={handleMarkNotificationAsRead}
             />
             {isBanned && <BanNotificationBanner user={loggedInUser} />}
             <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto h-full">
                    {mainContent}
                </div>
             </main>
             {selectedDispute && <DisputeModal dispute={selectedDispute} onClose={() => setSelectedDispute(null)} onResolve={handleResolveDispute} />}
             {viewingProfileOfUser && loggedInUser && <UserProfilePage user={viewingProfileOfUser} allPosts={posts} users={users} currentUser={loggedInUser} onClose={handleCloseProfile} onStartChat={(userToMessage) => handleStartChat({ userToMessage })} onToggleFollow={handleToggleFollow} onToggleBlock={handleToggleBlock} onToggleActivation={handleToggleUserActivation} onBanUser={setUserToBan} onUnbanUser={handleUnbanUser}/>}
             {userToBan && <BanUserModal user={userToBan} onClose={() => setUserToBan(null)} onConfirm={handleBanUser} />}
             {selectedTransaction && <TransactionDetailModal transaction={selectedTransaction} users={users} posts={posts} onClose={() => setSelectedTransaction(null)} onViewProfile={handleViewProfile} onRaiseDispute={handleRaiseDispute} onReportTransaction={handleReportTransaction} />}
        </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeView={activeView} 
        onNavigate={(view) => {
            setActiveView(view);
            setIsMobileSidebarOpen(false);
        }} 
        role={role} 
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            role={role} 
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)} 
            userName={userName} 
            onSignOut={handleSignOut}
            onNavigate={(view) => setActiveView(view)}
            notifications={notifications}
            messages={chats.filter(c => c.buyer === userName || c.seller === userName)}
            onMarkNotificationAsRead={handleMarkNotificationAsRead}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto h-full">
            {mainContent}
          </div>
        </main>
      </div>
      {selectedDispute && <DisputeModal dispute={selectedDispute} onClose={() => setSelectedDispute(null)} onResolve={handleResolveDispute} />}
      {viewingProfileOfUser && loggedInUser && <UserProfilePage user={viewingProfileOfUser} allPosts={posts} users={users} currentUser={loggedInUser} onClose={handleCloseProfile} onStartChat={(userToMessage) => handleStartChat({ userToMessage })} onToggleFollow={handleToggleFollow} onToggleBlock={handleToggleBlock} onToggleActivation={handleToggleUserActivation} onBanUser={setUserToBan} onUnbanUser={handleUnbanUser}/>}
      {userToBan && <BanUserModal user={userToBan} onClose={() => setUserToBan(null)} onConfirm={handleBanUser} />}
      {selectedTransaction && <TransactionDetailModal transaction={selectedTransaction} users={users} posts={posts} onClose={() => setSelectedTransaction(null)} onViewProfile={handleViewProfile} onRaiseDispute={handleRaiseDispute} onReportTransaction={handleReportTransaction} />}

    </div>
  );
}

export default App;