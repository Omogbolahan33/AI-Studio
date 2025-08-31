
import type { Transaction, Dispute, Post, Chat, User, Category } from './types';

export const mockUsers: User[] = [
    { id: 'user-01', username: 'admin', password: 'password', role: 'Admin', name: 'Admin User' },
    { id: 'user-02', username: 'alice', password: 'password', role: 'Member', name: 'Alice' },
];

export const mockCategories: Category[] = [
    { id: 'cat-01', name: 'General Discussion', description: 'Talk about anything and everything.', type: 'discussion' },
    { id: 'cat-02', name: 'Technology', description: 'Gadgets, software, and the future.', type: 'discussion' },
    { id: 'cat-03', name: 'Hobbies & Crafts', description: 'Share your passions and projects.', type: 'discussion' },
    { id: 'cat-sale-01', name: 'Electronics', description: 'Find deals on phones, laptops, and more.', type: 'advert' },
    { id: 'cat-sale-02', name: 'Fashion & Apparel', description: 'Clothing, shoes, and accessories.', type: 'advert' },
    { id: 'cat-sale-03', name: 'Home Goods', description: 'Furniture, decor, and kitchenware.', type: 'advert' },
];

export const mockTransactions: Transaction[] = [
  { id: 'TXN74839', buyer: 'Alice', seller: 'Bob', item: 'Vintage Camera', amount: 250, status: 'Completed', date: '2023-10-26' },
  { id: 'TXN93842', buyer: 'Charlie', seller: 'David', item: 'Handmade Scarf', amount: 45, status: 'In Escrow', date: '2023-10-25' },
  { id: 'TXN10293', buyer: 'Eve', seller: 'Frank', item: 'Signed Poster', amount: 120, status: 'Pending', date: '2023-10-25' },
  { id: 'TXN58391', buyer: 'Grace', seller: 'Heidi', item: 'Antique Vase', amount: 600, status: 'Completed', date: '2023-10-24' },
  { id: 'TXN69382', buyer: 'Alice', seller: 'Judy', item: 'Gaming Console', amount: 350, status: 'Failed', date: '2023-10-23' },
];

export const mockDisputes: Dispute[] = [
  { 
    id: 'DISP001', 
    transactionId: 'TXN58391', 
    buyer: 'Grace', 
    seller: 'Heidi', 
    reason: 'Item not as described', 
    status: 'Open', 
    openedDate: '2023-10-25',
    chatHistory: [
      { sender: 'buyer', message: 'Hi, the vase arrived but it has a crack that wasn\'t in the photos.', timestamp: '2023-10-25 10:00' },
      { sender: 'seller', message: 'I packed it very carefully. It must have been damaged during shipping. I have photos showing it was perfect before I sent it.', timestamp: '2023-10-25 10:05' },
      { sender: 'buyer', message: 'The box was not damaged at all. The crack is old. You can see dust in it. This is unacceptable.', timestamp: '2023-10-25 10:10' }
    ]
  },
  { 
    id: 'DISP002', 
    transactionId: 'TXN10293', 
    buyer: 'Eve', 
    seller: 'Frank', 
    reason: 'Item not received', 
    status: 'Open', 
    openedDate: '2023-10-28',
    chatHistory: [
        { sender: 'buyer', message: 'It\'s been 3 days past the expected delivery. Where is my poster?', timestamp: '2023-10-28 14:00' },
        { sender: 'seller', message: 'The tracking number says it was delivered yesterday. Check with your neighbors maybe?', timestamp: '2023-10-28 14:02' },
        { sender: 'buyer', message: 'I did. No one has seen it. I think it was stolen or you sent it to the wrong address.', timestamp: '2023-10-28 14:05' }
    ]
  },
  { 
    id: 'DISP003', 
    transactionId: 'TXN74839', 
    buyer: 'Alice', 
    seller: 'Bob', 
    reason: 'Fraudulent transaction', 
    status: 'Resolved', 
    openedDate: '2023-10-20',
    chatHistory: []
  },
];

export const mockPosts: Post[] = [
    {
        id: 'POST001',
        author: 'AnonymousPanda',
        timestamp: '2 hours ago',
        title: 'For Sale: Barely Used Electric Guitar',
        content: 'Selling my Fender Stratocaster, sunburst color. It\'s in excellent condition, barely played. Comes with a soft case and a strap. Perfect for beginners or intermediate players. DM for more pictures!',
        comments: [
            { id: 'C1', author: 'AnonymousLion', content: 'What year is it?', timestamp: '1 hour ago' },
            { id: 'C2', author: 'AnonymousPanda', content: 'It\'s a 2021 model.', timestamp: '1 hour ago' }
        ],
        isAdvert: true,
        price: 450,
        categoryId: 'cat-sale-01',
        likes: 15,
        dislikes: 1,
    },
    {
        id: 'POST002',
        author: 'AnonymousFox',
        timestamp: '5 hours ago',
        title: 'Tips for keeping indoor plants alive?',
        content: 'I seem to have a black thumb. Every plant I bring home dies within a month. I\'ve tried succulents, snake plants, you name it. What are your best tips for a beginner?',
        comments: [
            { id: 'C3', author: 'AnonymousOwl', content: 'Don\'t overwater! It\'s the #1 killer. Check the soil first.', timestamp: '4 hours ago' },
            { id: 'C4', author: 'AnonymousBear', content: 'Make sure they get enough light. A south-facing window is usually best.', timestamp: '3 hours ago' }
        ],
        isAdvert: false,
        categoryId: 'cat-03',
        likes: 22,
        dislikes: 0,
    },
    {
        id: 'POST003',
        author: 'AnonymousTiger',
        timestamp: '1 day ago',
        title: 'Custom Hand-painted Sneakers - Taking Commissions',
        content: 'I customize sneakers (Vans, Air Force 1s, etc.) with your choice of design. High-quality, durable paint. Check out my portfolio link below. Prices start at $80 + cost of shoes.',
        comments: [],
        isAdvert: true,
        price: 80,
        categoryId: 'cat-sale-02',
        likes: 8,
        dislikes: 0,
    },
    {
        id: 'POST004',
        author: 'Admin User',
        timestamp: '3 days ago',
        title: 'Welcome to the new forum!',
        content: 'This is the start of our new community. Feel free to post in the appropriate categories. Be respectful and have fun!',
        comments: [],
        isAdvert: false,
        categoryId: 'cat-01',
        likes: 50,
        dislikes: 0,
    }
];

export const mockChats: Chat[] = [
  {
    id: 'CHAT001',
    postId: 'POST001',
    postTitle: 'For Sale: Barely Used Electric Guitar',
    buyer: 'Alice',
    seller: 'AnonymousPanda',
    messages: [
      { sender: 'me', text: 'Hi, is this guitar still available?', timestamp: '10:30 AM' },
      { sender: 'seller', text: 'Yes it is!', timestamp: '10:32 AM' },
    ],
    lastMessage: 'Yes it is!',
    lastMessageTimestamp: '10:32 AM',
  },
  {
    id: 'CHAT002',
    postId: 'POST003',
    postTitle: 'Custom Hand-painted Sneakers - Taking Commissions',
    buyer: 'Alice',
    seller: 'AnonymousTiger',
    messages: [
       { sender: 'me', text: 'Hey, I love your work. Can you do a galaxy theme on a pair of AF1s?', timestamp: 'Yesterday' },
       { sender: 'seller', text: 'Absolutely! That sounds awesome. It would be an extra $20 for the detailed work. Is that okay?', timestamp: 'Yesterday' },
       { sender: 'me', text: 'Yeah, that works for me!', timestamp: 'Yesterday' },
    ],
    lastMessage: 'Yeah, that works for me!',
    lastMessageTimestamp: 'Yesterday',
  }
];
