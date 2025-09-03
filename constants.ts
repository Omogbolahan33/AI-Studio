import type { Transaction, Dispute, Post, Chat, User, Category, Notification, ActivityLog, Message } from './types';

const now = new Date();
const timeAgo = (value: number, unit: 's' | 'm' | 'h' | 'd') => {
    let multiplier = 1000;
    if (unit === 's') multiplier *= 1;
    if (unit === 'm') multiplier *= 60;
    if (unit === 'h') multiplier *= 60 * 60;
    if (unit === 'd') multiplier *= 60 * 60 * 24;
    return new Date(now.getTime() - value * multiplier).toISOString();
};

export const mockUsers: User[] = [
    { id: 'user-01', username: 'superadmin', password: 'password', role: 'Super Admin', name: 'Super Admin User', avatarUrl: 'https://i.pravatar.cc/150?u=superadmin', email: 'superadmin@market.com', address: '123 Admin Ave', city: 'Adminville', zipCode: '90210', followingIds: [], blockedUserIds: [], isActive: true, banExpiresAt: null, banReason: null, banStartDate: null, isVerified: true, reviews: [], pendingFollowerIds: [] },
    { id: 'user-02', username: 'alice', password: 'password', role: 'Member', name: 'Alice', avatarUrl: 'https://i.pravatar.cc/150?u=alice', email: 'alice@example.com', address: '456 Member Ln', city: 'Userburg', zipCode: '12345', followingIds: ['user-03'], blockedUserIds: [], isActive: true, banExpiresAt: null, banReason: null, banStartDate: null, isVerified: true, reviews: [
        { id: 'review-1', reviewerId: 'user-06', rating: 5, comment: 'Great seller, item arrived as described. Fast shipping!', timestamp: timeAgo(2, 'd'), isVerifiedPurchase: true, transactionId: 'TXN74839'},
        { id: 'review-2', reviewerId: 'user-07', rating: 4, comment: 'Good communication, would buy from again.', timestamp: timeAgo(5, 'd')},
    ], pendingFollowerIds: ['user-04'], savedStickers: ['/stickers/sticker1.png', '/stickers/sticker4.png'] },
    { id: 'user-03', username: 'anonymouspanda', password: 'password', role: 'Member', name: 'AnonymousPanda', avatarUrl: 'https://i.pravatar.cc/150?u=panda', email: 'panda@example.com', address: '789 Bamboo Rd', city: 'Forest', zipCode: '54321', followingIds: [], blockedUserIds: [], isActive: true, banExpiresAt: null, banReason: null, banStartDate: null, isVerified: false, reviews: [], pendingFollowerIds: [], savedStickers: [] },
    { id: 'user-04', username: 'anonymousfox', password: 'password', role: 'Member', name: 'AnonymousFox', avatarUrl: 'https://i.pravatar.cc/150?u=fox', email: 'fox@example.com', address: '101 Den Way', city: 'Meadow', zipCode: '67890', followingIds: [], blockedUserIds: [], isActive: false, banExpiresAt: null, banReason: null, banStartDate: null, isVerified: false, reviews: [], pendingFollowerIds: [], savedStickers: [] },
    { id: 'user-05', username: 'anonymoustiger', password: 'password', role: 'Member', name: 'AnonymousTiger', avatarUrl: 'https://i.pravatar.cc/150?u=tiger', email: 'tiger@example.com', address: '210 Jungle Blvd', city: 'Savannah', zipCode: '11223', followingIds: [], blockedUserIds: [], isActive: true, banExpiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), banReason: 'Spamming the forum with irrelevant content.', banStartDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), isVerified: false, reviews: [], pendingFollowerIds: [], savedStickers: [] },
    { id: 'user-06', username: 'bob', password: 'password', role: 'Member', name: 'Bob', avatarUrl: 'https://i.pravatar.cc/150?u=bob', email: 'bob@example.com', address: '111 Oak St', city: 'Mapleton', zipCode: '12345', followingIds: ['user-02'], blockedUserIds: [], isActive: true, banExpiresAt: null, banReason: null, banStartDate: null, isVerified: true, reviews: [], pendingFollowerIds: [], savedStickers: [] },
    { id: 'user-07', username: 'charlie', password: 'password', role: 'Member', name: 'Charlie', avatarUrl: 'https://i.pravatar.cc/150?u=charlie', email: 'charlie@example.com', address: '222 Pine St', city: 'Riverdale', zipCode: '54321', followingIds: ['user-03'], blockedUserIds: [], isActive: true, banExpiresAt: null, banReason: null, banStartDate: null, isVerified: false, reviews: [], pendingFollowerIds: [], savedStickers: [] },
    { id: 'user-08', username: 'admin2', password: 'password', role: 'Admin', name: 'Admin Two', avatarUrl: 'https://i.pravatar.cc/150?u=admin2', email: 'admin2@market.com', address: '456 Admin Rd', city: 'Adminville', zipCode: '90210', followingIds: [], blockedUserIds: [], isActive: true, banExpiresAt: null, banReason: null, banStartDate: null, isVerified: true, reviews: [], pendingFollowerIds: [], savedStickers: [] },
];

export const mockCategories: Category[] = [
    { id: 'cat-01', name: 'General Discussion', description: 'Talk about anything and everything.', type: 'discussion' },
    { id: 'cat-02', name: 'Technology', description: 'Gadgets, software, and the future.', type: 'discussion' },
    { id: 'cat-03', name: 'Hobbies & Crafts', description: 'Share your passions and projects.', type: 'discussion' },
    { id: 'cat-sale-01', name: 'Electronics', description: 'Find deals on phones, laptops, and more.', type: 'advert' },
    { id: 'cat-sale-02', name: 'Fashion & Apparel', description: 'Clothing, shoes, and accessories.', type: 'advert' },
    { id: 'cat-sale-03', name: 'Home Goods', description: 'Furniture, decor, and kitchenware.', type: 'advert' },
    { id: 'cat-sale-04', name: 'Real Estate', description: 'Homes, apartments, and properties for sale or rent.', type: 'advert' },
];

export const mockPosts: Post[] = [
    {
        id: 'POST001',
        author: 'AnonymousPanda',
        timestamp: timeAgo(2, 'h'),
        lastActivityTimestamp: timeAgo(1, 'h'),
        title: 'For Sale: Barely Used Electric Guitar',
        content: 'Selling my Fender Stratocaster, sunburst color. It\'s in excellent condition, barely played. Comes with a soft case and a strap. Perfect for beginners or intermediate players. DM for more pictures!',
        comments: [
            { id: 'C1', author: 'AnonymousFox', content: 'What year is it?', timestamp: timeAgo(1, 'h'), flaggedBy: [] },
            { id: 'C2', author: 'AnonymousPanda', content: 'It\'s a 2021 model.', timestamp: timeAgo(1, 'h'), flaggedBy: [] }
        ],
        isAdvert: true,
        price: 450,
        categoryId: 'cat-sale-01',
        likedBy: ['user-02', 'user-06'],
        dislikedBy: [],
        brand: 'Fender',
        condition: 'Used - Like New',
        flaggedBy: [],
    },
    {
        id: 'POST002',
        author: 'Alice',
        timestamp: timeAgo(1, 'd'),
        lastActivityTimestamp: timeAgo(3, 'h'),
        title: 'What is your favorite programming language and why?',
        content: 'I\'m curious to hear what everyone is passionate about. I\'ve been using TypeScript a lot lately and I\'m really enjoying the type safety it provides. What about you?',
        comments: [
             { id: 'C3', author: 'AnonymousFox', content: 'Python, for its readability and extensive libraries.', timestamp: timeAgo(3, 'h'), flaggedBy: [] },
        ],
        isAdvert: false,
        categoryId: 'cat-02',
        likedBy: ['user-03', 'user-04'],
        dislikedBy: [],
        flaggedBy: [],
    },
    {
        id: 'POST003',
        author: 'AnonymousTiger',
        timestamp: timeAgo(2, 'd'),
        lastActivityTimestamp: timeAgo(1, 'd'),
        title: 'Tips for beginner gardeners?',
        content: 'I\'m starting my first vegetable garden and could use some advice. What are some easy-to-grow plants for beginners? Any tips on soil or watering?',
        comments: [],
        isAdvert: false,
        categoryId: 'cat-03',
        likedBy: ['user-02'],
        dislikedBy: [],
        flaggedBy: [],
    },
    {
        id: 'POST004',
        author: 'Super Admin User',
        timestamp: timeAgo(2, 'd'),
        lastActivityTimestamp: timeAgo(2, 'd'),
        title: 'Welcome to the new forum!',
        content: 'We are excited to launch this new community space. Please be respectful of others and enjoy the discussions!',
        comments: [],
        isAdvert: false,
        categoryId: 'cat-01',
        likedBy: ['user-02', 'user-03', 'user-04', 'user-05', 'user-06', 'user-07'],
        dislikedBy: [],
        pinnedAt: timeAgo(12, 'h'),
        flaggedBy: [],
    },
    {
        id: 'POST005',
        author: 'Alice',
        timestamp: timeAgo(4, 'd'),
        lastActivityTimestamp: timeAgo(4, 'd'),
        title: 'Apartment for Rent - 2 Bed, 1 Bath',
        content: 'Spacious apartment available in downtown Userburg. Great location, close to public transport. Includes all major appliances. Looking for a quiet, responsible tenant.',
        comments: [],
        isAdvert: true,
        price: 1200,
        categoryId: 'cat-sale-04',
        likedBy: ['user-07'],
        dislikedBy: [],
        brand: 'N/A',
        condition: 'Used - Good',
        flaggedBy: ['user-07'],
    },
    // Added Posts to match transactions
    {
        id: 'POST006',
        author: 'AnonymousPanda',
        timestamp: timeAgo(3, 'd'),
        lastActivityTimestamp: timeAgo(3, 'd'),
        title: 'For Sale: Vintage Camera',
        content: 'Selling a classic film camera. In working condition, a true collector\'s item.',
        comments: [],
        isAdvert: true,
        price: 250,
        categoryId: 'cat-sale-01',
        likedBy: ['user-02'],
        dislikedBy: [],
        brand: 'Canon',
        condition: 'Used - Good',
        flaggedBy: [],
    },
    {
        id: 'POST007',
        author: 'Alice',
        timestamp: timeAgo(8, 'd'),
        lastActivityTimestamp: timeAgo(8, 'd'),
        title: 'For Sale: Handmade Scarf',
        content: '100% wool scarf, very warm. Made by hand.',
        comments: [],
        isAdvert: true,
        price: 45,
        categoryId: 'cat-sale-02',
        likedBy: [],
        dislikedBy: [],
        brand: 'Handmade',
        condition: 'New',
        flaggedBy: [],
    },
    {
        id: 'POST008',
        author: 'Alice',
        timestamp: timeAgo(4, 'd'),
        lastActivityTimestamp: timeAgo(4, 'd'),
        title: 'For Sale: Signed Poster',
        content: 'Rare signed movie poster. A must-have for fans.',
        comments: [],
        isAdvert: true,
        price: 120,
        categoryId: 'cat-sale-03',
        likedBy: [],
        dislikedBy: [],
        brand: 'N/A',
        condition: 'Used - Like New',
        flaggedBy: [],
    },
    {
        id: 'POST009',
        author: 'AnonymousPanda',
        timestamp: timeAgo(5, 'd'),
        lastActivityTimestamp: timeAgo(5, 'd'),
        title: 'For Sale: Antique Vase',
        content: 'Beautiful antique vase from the 19th century. Perfect for home decor.',
        comments: [],
        isAdvert: true,
        price: 600,
        categoryId: 'cat-sale-03',
        likedBy: [],
        dislikedBy: [],
        brand: 'N/A',
        condition: 'Used - Fair',
        flaggedBy: [],
    },
    {
        id: 'POST010',
        author: 'Alice',
        timestamp: timeAgo(6, 'd'),
        lastActivityTimestamp: timeAgo(6, 'd'),
        title: 'For Sale: Gaming Console',
        content: 'Latest generation gaming console, comes with two controllers. Lightly used.',
        comments: [],
        isAdvert: true,
        price: 350,
        categoryId: 'cat-sale-01',
        likedBy: [],
        dislikedBy: [],
        brand: 'Sony',
        condition: 'Used - Like New',
        flaggedBy: [],
    },
];

export const mockTransactions: Transaction[] = [
  { id: 'TXN74839', postId: 'POST006', buyer: 'Alice', seller: 'AnonymousPanda', item: 'Vintage Camera', amount: 250, status: 'Completed', date: timeAgo(3, 'd'), completedAt: timeAgo(2, 'd') },
  { id: 'TXN93842', postId: 'POST007', buyer: 'AnonymousTiger', seller: 'Alice', item: 'Handmade Scarf', amount: 45, status: 'In Escrow', date: timeAgo(8, 'd') }, // Stalled transaction
  { id: 'TXN10293', postId: 'POST008', buyer: 'AnonymousPanda', seller: 'Alice', item: 'Signed Poster', amount: 120, status: 'Shipped', date: timeAgo(4, 'd'), trackingNumber: '1Z999AA10123456784', shippedAt: timeAgo(3, 'd') },
  { id: 'TXN58391', postId: 'POST009', buyer: 'Alice', seller: 'AnonymousPanda', item: 'Antique Vase', amount: 600, status: 'Delivered', date: timeAgo(5, 'd'), trackingNumber: '1Z999AA10123456785', shippedAt: timeAgo(4, 'd'), deliveredAt: timeAgo(1, 'd'), inspectionPeriodEnds: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'TXN69382', postId: 'POST010', buyer: 'AnonymousFox', seller: 'Alice', item: 'Gaming Console', amount: 350, status: 'Disputed', date: timeAgo(6, 'd') },
  { id: 'TXN84920', postId: 'POST001', buyer: 'Bob', seller: 'AnonymousPanda', item: 'Barely Used Electric Guitar', amount: 450, status: 'Pending', date: timeAgo(5, 'm') },
];

export const mockDisputes: Dispute[] = [
  { 
    id: 'DISP001', 
    transactionId: 'TXN58391', 
    buyer: 'Alice', 
    seller: 'AnonymousPanda', 
    reason: 'Item not as described', 
    status: 'Open', 
    openedDate: timeAgo(4, 'd'),
    chatHistory: [
      { sender: 'Alice', message: 'Hi, the vase arrived but it has a crack that wasn\'t in the photos.', timestamp: timeAgo(4, 'd') },
      { sender: 'AnonymousPanda', message: 'I packed it very carefully. It must have been damaged during shipping. I have photos showing it was perfect before I sent it.', timestamp: timeAgo(4, 'd') },
      { sender: 'Alice', message: 'The box was not damaged at all. The crack is old. You can see dust in it. This is unacceptable.', timestamp: timeAgo(4, 'd') }
    ]
  },
  { 
    id: 'DISP002', 
    transactionId: 'TXN10293', 
    buyer: 'AnonymousPanda', 
    seller: 'Alice', 
    reason: 'Item not received', 
    status: 'Open', 
    openedDate: timeAgo(1, 'd'),
    chatHistory: [
        { sender: 'AnonymousPanda', message: 'It\'s been 3 days past the expected delivery. Where is my poster?', timestamp: timeAgo(1, 'd') },
        { sender: 'Alice', message: 'The tracking number says it was delivered yesterday. Check with your neighbors maybe?', timestamp: timeAgo(1, 'd') },
        { sender: 'AnonymousPanda', message: 'I did. No one has seen it. I think it was stolen or you sent it to the wrong address.', timestamp: timeAgo(1, 'd') }
    ]
  },
  { 
    id: 'DISP003', 
    transactionId: 'TXN74839', 
    buyer: 'Alice', 
    seller: 'AnonymousPanda', 
    reason: 'Fraudulent transaction', 
    status: 'Resolved', 
    openedDate: timeAgo(9, 'd'),
    chatHistory: []
  },
];

const mockChatMessages: Message[] = [
    { id: 'M1', sender: 'Alice', text: 'Is this still available?', timestamp: timeAgo(2, 'm') },
    { id: 'M2', sender: 'AnonymousPanda', text: 'Yes it is!', timestamp: timeAgo(1, 'm') },
    { 
        id: 'M3', 
        sender: 'Alice', 
        text: 'Great, would you take ₦200 for it?', 
        timestamp: timeAgo(1, 'm'),
        replyTo: { id: 'M2', sender: 'AnonymousPanda', contentPreview: 'Yes it is!' }
    },
    { id: 'M4', sender: 'AnonymousPanda', stickerUrl: '/stickers/sticker5.png', timestamp: timeAgo(50, 's') },
    { 
        id: 'M5', 
        sender: 'Alice', 
        voiceNote: { audioUrl: '', duration: 8 }, 
        timestamp: timeAgo(40, 's')
    },
    { id: 'M6', sender: 'Alice', text: 'Sorry, I meant ₦220!', timestamp: timeAgo(30, 's'), isForwarded: true },
];

export const mockChats: Chat[] = [
  { id: 'CHAT001', postId: 'POST006', postTitle: 'Vintage Camera', buyer: 'Alice', seller: 'AnonymousPanda', messages: mockChatMessages, lastMessage: 'Sorry, I meant ₦220!', lastMessageTimestamp: timeAgo(30, 's') },
  { id: 'CHAT002', postId: 'POST007', postTitle: 'Handmade Scarf', buyer: 'AnonymousTiger', seller: 'Alice', messages: [{ id: 'M7', sender: 'AnonymousTiger', text: 'Great, I will take it!', timestamp: timeAgo(10, 'm') }], lastMessage: 'Great, I will take it!', lastMessageTimestamp: timeAgo(10, 'm') },
  { id: 'CHAT003', buyer: 'Bob', seller: 'Alice', messages: [{ id: 'M8', sender: 'Bob', text: 'Just wanted to follow up on our discussion.', timestamp: timeAgo(2, 'h') }], lastMessage: 'Just wanted to follow up on our discussion.', lastMessageTimestamp: timeAgo(2, 'h') }
];

export const mockNotifications: Notification[] = [
    { id: 'notif-1', userId: 'user-02', type: 'like', content: 'AnonymousPanda liked your post: "What is your favorite programming language and why?"', link: '#', timestamp: timeAgo(5, 'm'), read: false, postId: 'POST002', actorId: 'user-03' },
    { id: 'notif-2', userId: 'user-03', type: 'comment', content: 'Alice commented on your post: "For Sale: Barely Used Electric Guitar"', link: '#', timestamp: timeAgo(15, 'm'), read: false, postId: 'POST001', actorId: 'user-02' },
    { id: 'notif-3', userId: 'user-02', type: 'follow', content: 'Bob started following you.', link: '#', timestamp: timeAgo(1, 'h'), read: true, actorId: 'user-06' },
];

export const mockActivityLog: ActivityLog[] = [
    { id: 'act-1', userId: 'user-02', action: 'Created Post', details: '"What is your favorite programming language and why?"', timestamp: timeAgo(1, 'd')},
    { id: 'act-2', userId: 'user-03', action: 'Liked Post', details: '"Tips for beginner gardeners?"', timestamp: timeAgo(1, 'd')},
    { id: 'act-3', userId: 'user-01', action: 'Resolved Dispute', details: 'DISP003', timestamp: timeAgo(2, 'd')},
];

export const mockStickers: string[] = [
    '/stickers/sticker1.png',
    '/stickers/sticker2.png',
    '/stickers/sticker3.png',
    '/stickers/sticker4.png',
    '/stickers/sticker5.png',
    '/stickers/sticker6.png',
    '/stickers/sticker7.png',
    '/stickers/sticker8.png',
];