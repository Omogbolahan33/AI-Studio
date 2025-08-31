
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
import { ChartBarIcon, CurrencyDollarIcon, ShieldExclamationIcon, Transaction, View } from './types';
import type { Dispute, Post, Chat, User, Category } from './types';
import { mockTransactions, mockDisputes, mockPosts, mockChats, mockUsers, mockCategories } from './constants';

const App: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState('');
  
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [activeView, setActiveView] = useState<View>('Dashboard');
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (user) {
        setLoggedInUser(user);
        setLoginError('');
    } else {
        setLoginError('Invalid username or password.');
    }
  };

  const handleSignOut = () => {
      setLoggedInUser(null);
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
        buyer: loggedInUser.name,
        seller: post.author,
        item: post.title,
        amount: post.price || 0,
        status: 'In Escrow',
        date: new Date().toISOString().split('T')[0],
    };
    setTransactions(prev => [newTransaction, ...prev]);
    alert(`Transaction for "${post.title}" created! View it in 'My Transactions'.`);
    setActiveView('My Transactions');
  };
  
  const handleStartChat = (post: Post) => {
    if (!loggedInUser || loggedInUser.role !== 'Member') return;
    if (post.author === loggedInUser.name) {
        alert("You can't start a chat about your own post.");
        return;
    }

    let chat = chats.find(c => c.postId === post.id && c.buyer === loggedInUser?.name);

    if (!chat) {
        chat = {
            id: `CHAT${Math.random().toString(36).substring(2, 9)}`,
            postId: post.id,
            postTitle: post.title,
            buyer: loggedInUser.name,
            seller: post.author,
            messages: [],
            lastMessage: 'Chat started.',
            lastMessageTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChats(prev => [chat!, ...prev]);
    }

    setActiveChatId(chat.id);
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

  const handleCreatePost = (newPostData: { title: string; content: string; isAdvert: boolean; price?: number, categoryId: string }) => {
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
      likes: 0,
      dislikes: 0,
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
  };
  
  const handleLikePost = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleDislikePost = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, dislikes: p.dislikes + 1 } : p));
  };


  const toggleSidebar = () => {
    setIsSidebarCollapsed(prevState => !prevState);
  };

  if (!loggedInUser) {
    return <LoginPage onLogin={handleLogin} error={loginError} />;
  }

  const { role, name: userName } = loggedInUser;
  const currentMember = role === 'Member' ? userName : '';

  const renderAdminContent = () => {
    switch (activeView) {
      case 'Transactions':
        return <div className="p-6"><h1 className="text-3xl font-bold text-text-primary mb-6">All Transactions</h1><div className="bg-surface rounded-lg shadow p-6"><TransactionsTable transactions={transactions} /></div></div>;
      case 'Disputes':
        return <div className="p-6"><h1 className="text-3xl font-bold text-text-primary mb-6">All Disputes</h1><div className="bg-surface rounded-lg shadow p-6"><DisputesTable disputes={disputes} onDisputeSelect={setSelectedDispute} /></div></div>;
      case 'Forum':
        return <div className="p-6"><ForumPage posts={posts} categories={categories} onInitiatePurchase={handleCreateTransaction} onStartChat={handleStartChat} onCreatePost={handleCreatePost} onLike={handleLikePost} onDislike={handleDislikePost} currentUser={loggedInUser} /></div>;
      case 'Users':
        return <div className="p-6"><h1 className="text-3xl font-bold text-text-primary mb-6">User Management</h1></div>;
      case 'Settings':
        return <div className="p-6"><h1 className="text-3xl font-bold text-text-primary mb-6">Settings</h1></div>;
      case 'Dashboard':
      default:
        return (
          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold text-text-primary mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<CurrencyDollarIcon />} />
              <StatCard title="Total Transactions" value={totalTransactions.toString()} icon={<ChartBarIcon />} />
              <StatCard title="Active Disputes" value={activeDisputesCount.toString()} icon={<ShieldExclamationIcon />} color="text-red-500" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-surface rounded-lg shadow p-6"><h2 className="text-xl font-semibold mb-4 text-text-primary">Recent Transactions</h2><TransactionsTable transactions={transactions.slice(0, 5)} /></div>
              <div className="bg-surface rounded-lg shadow p-6"><h2 className="text-xl font-semibold mb-4 text-text-primary">Active Disputes</h2><DisputesTable disputes={disputes.filter(d => d.status === 'Open')} onDisputeSelect={setSelectedDispute} /></div>
            </div>
          </div>
        );
    }
  };
  
  const renderMemberContent = () => {
    switch (activeView) {
      case 'My Transactions':
        return <div className="p-6"><h1 className="text-3xl font-bold text-text-primary mb-6">My Transactions</h1><div className="bg-surface rounded-lg shadow p-6"><TransactionsTable transactions={transactions.filter(t => t.buyer === currentMember || t.seller === currentMember)} /></div></div>;
      case 'My Disputes':
        return <div className="p-6"><h1 className="text-3xl font-bold text-text-primary mb-6">My Disputes</h1><div className="bg-surface rounded-lg shadow p-6"><DisputesTable disputes={disputes.filter(d => d.buyer === currentMember || d.seller === currentMember)} onDisputeSelect={setSelectedDispute} /></div></div>;
      case 'My Chats':
        return <ChatPage chats={chats.filter(c => c.buyer === currentMember)} activeChatId={activeChatId} onSelectChat={setActiveChatId} onSendMessage={handleSendMessage} />;
      case 'Forum':
      default:
        return <div className="p-6"><ForumPage posts={posts} categories={categories} onInitiatePurchase={handleCreateTransaction} onStartChat={handleStartChat} onCreatePost={handleCreatePost} onLike={handleLikePost} onDislike={handleDislikePost} currentUser={loggedInUser} /></div>;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeView={activeView} 
        onNavigate={setActiveView} 
        role={role} 
        isCollapsed={isSidebarCollapsed}
        userName={userName}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          role={role} 
          onToggleSidebar={toggleSidebar}
          userName={userName}
          onSignOut={handleSignOut}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto h-full">
            {role === 'Admin' ? renderAdminContent() : renderMemberContent()}
          </div>
        </main>
      </div>

      {selectedDispute && (
        <DisputeModal
          dispute={selectedDispute}
          onClose={() => setSelectedDispute(null)}
          onResolve={handleResolveDispute}
        />
      )}
    </div>
  );
};

export default App;
