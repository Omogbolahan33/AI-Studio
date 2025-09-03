import { User } from "./User";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { Category } from "./Category";
import { Chat } from "./Chat";
import { Message } from "./Message";
import { Transaction } from "./Transaction";
import { Dispute } from "./Dispute";
import { Review } from "./Review";
import { Notification } from "./Notification";
import { ActivityLog } from "./ActivityLog";
import { BankAccount } from "./BankAccount";
import { Address } from "./Address";

// USER
User.hasMany(Post, { foreignKey: "authorId", as: "posts" });
Post.belongsTo(User, { foreignKey: "authorId", as: "author" });

User.hasMany(Comment, { foreignKey: "authorId", as: "comments" });
Comment.belongsTo(User, { foreignKey: "authorId", as: "author" });

User.hasMany(Review, { foreignKey: "userId", as: "receivedReviews" });
User.hasMany(Review, { foreignKey: "reviewerId", as: "writtenReviews" });
Review.belongsTo(User, { foreignKey: "userId", as: "user" });
Review.belongsTo(User, { foreignKey: "reviewerId", as: "reviewer" });

User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(ActivityLog, { foreignKey: "userId", as: "activityLogs" });
ActivityLog.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(BankAccount, { foreignKey: "userId", as: "bankAccounts" });
BankAccount.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Address, { foreignKey: "userId", as: "addresses" });
Address.belongsTo(User, { foreignKey: "userId", as: "user" });

// POST
Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });

Post.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(Post, { foreignKey: "categoryId", as: "posts" });

Post.hasMany(Transaction, { foreignKey: "postId", as: "transactions" });
Transaction.belongsTo(Post, { foreignKey: "postId", as: "post" });

// CATEGORY
// (already set above)

// CHAT
Chat.hasMany(Message, { foreignKey: "chatId", as: "messages" });
Message.belongsTo(Chat, { foreignKey: "chatId", as: "chat" });

Chat.belongsTo(User, { foreignKey: "buyerId", as: "buyer" });
Chat.belongsTo(User, { foreignKey: "sellerId", as: "seller" });

// TRANSACTION
Transaction.belongsTo(User, { foreignKey: "buyerId", as: "buyer" });
Transaction.belongsTo(User, { foreignKey: "sellerId", as: "seller" });

Transaction.hasMany(Dispute, { foreignKey: "transactionId", as: "disputes" });
Dispute.belongsTo(Transaction, { foreignKey: "transactionId", as: "transaction" });

// DISPUTE
Dispute.belongsTo(User, { foreignKey: "buyerId", as: "buyer" });
Dispute.belongsTo(User, { foreignKey: "sellerId", as: "seller" });
Dispute.belongsTo(User, { foreignKey: "resolvedByAdminId", as: "resolvedByAdmin" });

// REVIEW
Review.belongsTo(Transaction, { foreignKey: "transactionId", as: "transaction" });
Transaction.hasMany(Review, { foreignKey: "transactionId", as: "reviews" });

// NOTIFICATION
Notification.belongsTo(Post, { foreignKey: "postId", as: "post" });
Notification.belongsTo(User, { foreignKey: "actorId", as: "actor" });
Notification.belongsTo(Transaction, { foreignKey: "transactionId", as: "transaction" });
Notification.belongsTo(Chat, { foreignKey: "chatId", as: "chat" });
Notification.belongsTo(Dispute, { foreignKey: "disputeId", as: "dispute" });

export {
  User,
  Post,
  Comment,
  Category,
  Chat,
  Message,
  Transaction,
  Dispute,
  Review,
  Notification,
  ActivityLog,
  BankAccount,
  Address,
};