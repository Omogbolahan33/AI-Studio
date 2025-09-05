/**
 * @file This file defines a potential API contract for a Social Marketplace backend.
 * 
 * NOTE: The application is currently running in a client-only mode with mock data.
 * These API functions are placeholders and are not currently used.
 * They serve as a specification for future backend development and are not required
 * for the application to function in its current state.
 */

import type {
  User,
  Post,
  Comment,
  Transaction,
  Dispute,
  Chat,
  Message,
  Notification,
  ActivityLog,
  Review,
  UserRole,
  PostCondition,
  AIAnalysis,
  BankAccount,
  AdminAction
} from '../types';

// ==================================
// SECTION: Backend APIs
// ==================================
// This section details all the APIs that the backend server is expected to expose
// for the frontend application to consume. For security, all external services
// like the Gemini API should be called from the backend, not directly from the client.

// --- AUTHENTICATION ---

/**
 * API: Login User
 * @description Logs in a user with their credentials.
 * @method POST
 * @endpoint /api/auth/login
 * @body { identifier: string, password: string }
 * @response { user: User, token: string }
 * @businessLogic 
 * - Validate identifier (can be username or email) and password against the database.
 * - On success, generate a JWT containing at least the userId and role.
 * - The backend should check if the user's `isActive` flag is true. If not, return a 403 Forbidden error.
 */
export const login = async (credentials: { identifier, password }): Promise<User> => {
  console.log('API CALL: login', { credentials });
  // MOCK: In a real app, this would make a POST request and return the user object.
  // For now, it's handled client-side. The API spec is for backend integration.
  throw new Error("API function not implemented");
};

/**
 * API: SSO Login
 * @description Logs in a user via a third-party SSO provider.
 * @method POST
 * @endpoint /api/auth/sso
 * @body { provider: 'google' | 'facebook', token: string } // The token from the SSO provider
 * @response { user: User, token: string }
 * @businessLogic
 * - The backend validates the SSO token with the respective provider.
 * - It finds an existing user or creates a new one based on the SSO profile.
 * - Generates a JWT for the user session.
 */
export const ssoLogin = async (provider: 'google' | 'facebook'): Promise<User> => {
    console.log('API CALL: ssoLogin', { provider });
    throw new Error("API function not implemented");
};

/**
 * API: Sign Up
 * @description Registers a new user.
 * @method POST
 * @endpoint /api/auth/signup
 * @body { username: string, email: string, password: string }
 * @response { user: User, token: string }
 * @businessLogic
 * - The backend must validate that the username and email are unique.
 * - The password must be securely hashed before being stored in the database.
 * - A new user is created with the 'Member' role by default.
 * - An email verification token/OTP should be generated and sent to the user's email address.
 */
export const signUp = async (userInfo: { username, email, password }): Promise<User> => {
    console.log('API CALL: signUp', { userInfo });
    throw new Error("API function not implemented");
};

/**
 * API: Verify Email
 * @description Verifies a user's email address using an OTP.
 * @method POST
 * @endpoint /api/auth/verify-email
 * @body { otp: string }
 * @response { success: boolean, message: string }
 * @authorization Requires user to be logged in.
 * @businessLogic
 * - The backend validates the OTP against the one stored for the user.
 * - On success, the user's `isVerified` flag is set to true.
 */
export const verifyEmail = async (otp: string): Promise<{ success: boolean }> => {
    console.log('API CALL: verifyEmail', { otp });
    return { success: true };
};

/**
 * API: Request Password Reset
 * @description Initiates the password reset process by sending an OTP to the user's email.
 * @method POST
 * @endpoint /api/auth/request-password-reset
 * @body { email: string }
 * @response { success: boolean, message: string }
 * @businessLogic
 * - The backend finds the user by email.
 * - Generates a secure, time-limited OTP and stores it for the user.
 * - Sends an email to the user with the OTP.
 */
export const requestPasswordReset = async (email: string): Promise<{ success: boolean }> => {
    console.log('API CALL: requestPasswordReset', { email });
    return { success: true };
};

/**
 * API: Reset Password
 * @description Sets a new password for the user after verifying the OTP.
 * @method POST
 * @endpoint /api/auth/reset-password
 * @body { email: string, otp: string, newPassword: string }
 * @response { success: boolean, message: string }
 * @businessLogic
 * - The backend validates the OTP for the given email.
 * - If the OTP is valid, the user's password is updated (after hashing the new password).
 * - The OTP is invalidated after use.
 */
export const resetPassword = async (data: { email: string, otp: string, newPassword: string }): Promise<{ success: boolean }> => {
    console.log('API CALL: resetPassword');
    return { success: true };
};


/**
 * API: Sign Out
 * @description Logs out the currently authenticated user by invalidating the token.
 * @method POST
 * @endpoint /api/auth/signout
 * @response { success: boolean }
 * @businessLogic
 * - If using a token blocklist, add the current JWT to it.
 * - Clear any session-related cookies if applicable.
 */
export const signOut = async (): Promise<{ success: boolean }> => {
    console.log('API CALL: signOut');
    return { success: true };
};

// --- USER & PROFILE ---

/**
 * API: Get Current User
 * @description Fetches the complete data for the currently authenticated user using their token.
 * @method GET
 * @endpoint /api/users/me
 * @response { User }
 */
export const getCurrentUser = async (): Promise<User> => {
    console.log('API CALL: getCurrentUser');
    throw new Error("API function not implemented");
};

/**
 * API: Get User Profile
 * @description Fetches the public profile data for a specific user.
 * @method GET
 * @endpoint /api/users/{userId}
 * @response { User }
 */
export const getUserProfile = async (userId: string): Promise<User> => {
    console.log('API CALL: getUserProfile', { userId });
    throw new Error("API function not implemented");
};

/**
 * API: Update User Settings
 * @description Updates the settings for the current user.
 * @method PUT
 * @endpoint /api/users/me
 * @body Partial<User> // e.g., { username, email, address, city, zipCode, password }
 * @response { User } // The updated user object
 * @businessLogic
 * - If the password is being updated, it must be re-hashed.
 * - If the username is being updated, uniqueness must be checked again.
 */
export const updateUserSettings = async (userId: string, settingsData: Partial<User>): Promise<User> => {
    console.log('API CALL: updateUserSettings', { userId, settingsData });
    throw new Error("API function not implemented");
};

/**
 * API: Update User Bank Account
 * @description Adds or updates a user's payout bank account.
 * @method PUT
 * @endpoint /api/users/me/bank-account
 * @body { BankAccount }
 * @response { User }
 */
export const updateUserBankAccount = async (userId: string, bankAccount: BankAccount): Promise<User> => {
    console.log('API CALL: updateUserBankAccount', { userId, bankAccount });
    throw new Error("API function not implemented");
}

/**
 * API: Request Follow
 * @description Sends a follow request to another user.
 * @method POST
 * @endpoint /api/users/{userIdToFollow}/follow
 * @response { success: boolean }
 * @businessLogic
 * - Add the current user's ID to the target user's `pendingFollowerIds`.
 * - Send a 'follow_request' notification to the target user.
 */
export const requestFollow = async (userIdToFollow: string): Promise<{ success: boolean }> => {
    console.log('API CALL: requestFollow', { userIdToFollow });
    return { success: true };
};

/**
 * API: Accept Follow Request
 * @description Accepts a follow request from another user.
 * @method POST
 * @endpoint /api/users/follow-requests/{requesterId}/accept
 * @response { success: boolean }
 * @businessLogic
 * - Remove `requesterId` from the current user's `pendingFollowerIds`.
 * - Add the current user's ID to the `requesterId`'s `followingIds`.
 * - Send a 'follow' notification to the `requesterId`.
 */
export const acceptFollowRequest = async (requesterId: string): Promise<{ success: boolean }> => {
    console.log('API CALL: acceptFollowRequest', { requesterId });
    return { success: true };
};

/**
 * API: Decline Follow Request
 * @description Declines a follow request from another user.
 * @method POST
 * @endpoint /api/users/follow-requests/{requesterId}/decline
 * @response { success: boolean }
 * @businessLogic
 * - Remove `requesterId` from the current user's `pendingFollowerIds`.
 * - No notification is sent on decline.
 */
export const declineFollowRequest = async (requesterId: string): Promise<{ success: boolean }> => {
    console.log('API CALL: declineFollowRequest', { requesterId });
    return { success: true };
};


/**
 * API: Unfollow User
 * @description Unfollows a user.
 * @method DELETE
 * @endpoint /api/users/{userIdToUnfollow}/follow
 * @response { success: boolean }
 * @businessLogic
 * - Remove `userIdToUnfollow` from the current user's `followingIds`.
 */
export const unfollowUser = async (userIdToUnfollow: string): Promise<{ success: boolean }> => {
    console.log('API CALL: unfollowUser', { userIdToUnfollow });
    return { success: true };
};

/**
 * API: Block User
 * @description Blocks another user.
 * @method POST
 * @endpoint /api/users/{userIdToBlock}/block
 * @response { success: boolean }
 * @businessLogic
 * - Add `userIdToBlock` to the current user's `blockedUserIds`.
 * - If the current user was following the blocked user, that relationship should be removed.
 */
export const blockUser = async (userIdToBlock: string): Promise<{ success: boolean }> => {
    console.log('API CALL: blockUser', { userIdToBlock });
    return { success: true };
};

/**
 * API: Unblock User
 * @description Unblocks a previously blocked user.
 * @method DELETE
 * @endpoint /api/users/{userIdToUnblock}/block
 * @response { success: boolean }
 */
export const unblockUser = async (userIdToUnblock: string): Promise<{ success: boolean }> => {
    console.log('API CALL: unblockUser', { userIdToUnblock });
    return { success: true };
};

/**
 * API: Add Review
 * @description Submits a review for a user.
 * @method POST
 * @endpoint /api/users/{userId}/reviews
 * @body { rating: number; comment: string; transactionId?: string }
 * @response { Review }
 * @businessLogic
 * - The backend should ensure a user can only review a transaction once.
 * - If `transactionId` is provided, the `isVerifiedPurchase` flag should be set to true.
 */
export const addReview = async (userId: string, reviewData: { rating: number; comment: string; transactionId?: string }): Promise<Review> => {
    console.log('API CALL: addReview', { userId, reviewData });
    throw new Error("API function not implemented");
};

// --- POSTS & FORUM ---

/**
 * API: Get Posts
 * @description Fetches a list of posts based on filters and sorting.
 * @method GET
 * @endpoint /api/posts
 * @params { viewMode: 'discussions' | 'adverts', sortMode?: 'top' | 'trending', ... }
 * @response { Post[] }
 */
export const getPosts = async (filters: { viewMode: 'discussions' | 'adverts'; sortMode?: 'top' | 'trending'; advertSort?: 'newest' | 'price_asc'; minPrice?: number }): Promise<Post[]> => {
    console.log('API CALL: getPosts', { filters });
    return [];
};

/**
 * API: Get Post Details
 * @description Fetches the details of a single post, including all comments.
 * @method GET
 * @endpoint /api/posts/{postId}
 * @response { Post }
 */
export const getPostDetails = async (postId: string): Promise<Post> => {
    console.log('API CALL: getPostDetails', { postId });
    throw new Error("API function not implemented");
};

/**
 * API: Create Post
 * @description Creates a new post. Media should be handled via a separate upload endpoint first if large.
 * @method POST
 * @endpoint /api/posts
 * @body { title, content, isAdvert, price, categoryId, mediaUrl?, ... }
 * @response { Post }
 * @businessLogic
 * - If `isAdvert` is true, the backend must validate that the user has a linked bank account. If not, return a 400 Bad Request.
 * - Create the post in the database.
 * - Send a 'post' notification to all followers of the current user.
 * - Create an 'Created Post' entry in the user's activity log.
 */
export const createPost = async (postData: { title: string; content: string; isAdvert: boolean; price?: number; categoryId: string; mediaUrl?: string; mediaType?: 'image' | 'video'; brand?: string; condition?: PostCondition; }): Promise<Post> => {
    console.log('API CALL: createPost', { postData });
    throw new Error("API function not implemented");
};

/**
 * API: Update Post
 * @description Updates an existing post.
 * @method PUT
 * @endpoint /api/posts/{postId}
 * @body Partial<Post>
 * @response { Post }
 * @authorization User must be the author of the post.
 */
export const updatePost = async (postId: string, postData: Partial<Post>): Promise<Post> => {
    console.log('API CALL: updatePost', { postId, postData });
    throw new Error("API function not implemented");
};

/**
 * API: Delete Post
 * @description Deletes a post.
 * @method DELETE
 * @endpoint /api/posts/{postId}
 * @response { success: boolean }
 * @authorization User must be the author of the post or an Admin/Super Admin.
 */
export const deletePost = async (postId: string): Promise<{ success: boolean }> => {
    console.log('API CALL: deletePost', { postId });
    return { success: true };
};

/**
 * API: Like Post
 * @description Likes a post. The backend should handle toggling logic.
 * @method POST
 * @endpoint /api/posts/{postId}/like
 * @response { likedBy: string[], dislikedBy: string[] }
 * @businessLogic
 * - If the user has disliked the post, the dislike is removed.
 * - The like is toggled (add/remove user ID from `likedBy`).
 * - If a like is added (and it's not a self-like), send a 'like' notification to the post author.
 * - Update the post's `lastActivityTimestamp`.
 */
export const likePost = async (postId: string): Promise<{ likedBy: string[]; dislikedBy: string[] }> => {
    console.log('API CALL: likePost', { postId });
    return { likedBy: [], dislikedBy: [] };
};

/**
 * API: Dislike Post
 * @description Dislikes a post. The backend should handle toggling logic.
 * @method POST
 * @endpoint /api/posts/{postId}/dislike
 * @response { likedBy: string[], dislikedBy: string[] }
 * @businessLogic
 * - If the user has liked the post, the like is removed.
 * - The dislike is toggled (add/remove user ID from `dislikedBy`).
 * - No notifications are sent for dislikes.
 */
export const dislikePost = async (postId: string): Promise<{ likedBy: string[]; dislikedBy: string[] }> => {
    console.log('API CALL: dislikePost', { postId });
    return { likedBy: [], dislikedBy: [] };
};

/**
 * API: Flag Post
 * @description Flags a post for moderator review.
 * @method POST
 * @endpoint /api/posts/{postId}/flag
 * @response { success: boolean }
 * @businessLogic
 * - Add the current user's ID to the post's `flaggedBy` array.
 * - Backend should prevent duplicate flags from the same user.
 */
export const flagPost = async (postId: string): Promise<{ success: boolean }> => {
    console.log('API CALL: flagPost', { postId });
    return { success: true };
};

// --- COMMENTS ---

/**
 * API: Add Comment
 * @description Adds a comment or reply to a post.
 * @method POST
 * @endpoint /api/posts/{postId}/comments
 * @body { content: string; mediaUrl?: string; parentId?: string | null }
 * @response { Comment }
 * @businessLogic
 * - Update the parent post's `lastActivityTimestamp`.
 * - Parse the comment content for @mentions.
 * - Notification Logic (do not notify user for their own actions):
 *   1. **Mentions**: For each valid @mentioned user, send a 'mention' notification.
 *   2. **Replies**: If `parentId` is present, find the author of the parent comment. If they are not the current user and not already mentioned, send a 'comment' (reply) notification.
 *   3. **Post Author**: If the post author is not the current user, not mentioned, and not the parent comment author, send a 'comment' notification.
 * - Create an 'Commented on Post' entry in the user's activity log.
 */
export const addComment = async (postId: string, commentData: { content: string; mediaUrl?: string }, parentId: string | null): Promise<Comment> => {
    console.log('API CALL: addComment', { postId, commentData, parentId });
    throw new Error("API function not implemented");
};

/**
 * API: Edit Comment
 * @description Edits an existing comment.
 * @method PUT
 * @endpoint /api/posts/{postId}/comments/{commentId}
 * @body { newContent: string }
 * @response { Comment }
 * @authorization User must be the author of the comment.
 */
export const editComment = async (postId: string, commentId: string, newContent: string): Promise<Comment> => {
    console.log('API CALL: editComment', { postId, commentId, newContent });
    throw new Error("API function not implemented");
};

/**
 * API: Delete Comment
 * @description Deletes a comment.
 * @method DELETE
 * @endpoint /api/posts/{postId}/comments/{commentId}
 * @response { success: boolean }
 * @authorization User must be the author of the comment or an Admin/Super Admin.
 */
export const deleteComment = async (postId: string, commentId: string): Promise<{ success: boolean }> => {
    console.log('API CALL: deleteComment', { postId, commentId });
    return { success: true };
};

/**
 * API: Like Comment
 * @description Likes a comment.
 * @method POST
 * @endpoint /api/posts/{postId}/comments/{commentId}/like
 * @response { likedBy: string[], dislikedBy: string[] }
 * @businessLogic
 * - Toggles the like and removes any dislike from the user.
 * - If a like is added (and it's not a self-like), send a 'comment_like' notification to the comment author.
 */
export const likeComment = async (postId: string, commentId: string): Promise<{ likedBy: string[]; dislikedBy: string[] }> => {
    console.log('API CALL: likeComment', { postId, commentId });
    return { likedBy: [], dislikedBy: [] };
};

/**
 * API: Dislike Comment
 * @description Dislikes a comment.
 * @method POST
 * @endpoint /api/posts/{postId}/comments/{commentId}/dislike
 * @response { likedBy: string[], dislikedBy: string[] }
 */
export const dislikeComment = async (postId: string, commentId: string): Promise<{ likedBy: string[]; dislikedBy: string[] }> => {
    console.log('API CALL: dislikeComment', { postId, commentId });
    return { likedBy: [], dislikedBy: [] };
};

/**
 * API: Flag Comment
 * @description Flags a comment for moderator review.
 * @method POST
 * @endpoint /api/posts/{postId}/comments/{commentId}/flag
 * @response { success: boolean }
 */
export const flagComment = async (postId: string, commentId: string): Promise<{ success: boolean }> => {
    console.log('API CALL: flagComment', { postId, commentId });
    return { success: true };
};


// --- TRANSACTIONS & DISPUTES ---

/**
 * API: Get User Transactions
 * @description Fetches all transactions for the current user (purchases and sales).
 * @method GET
 * @endpoint /api/transactions
 * @response { Transaction[] }
 */
export const getTransactions = async (): Promise<Transaction[]> => {
    console.log('API CALL: getTransactions');
    return [];
};

/**
 * API: Create Transaction
 * @description Initiates a purchase for an item listed in a post.
 * @method POST
 * @endpoint /api/transactions
 * @body { postId: string }
 * @response { Transaction }
 * @businessLogic
 * - Backend should simulate a payment process (e.g., with a delay and random success/failure).
 * - On success: Update transaction status to 'In Escrow', send 'system' notifications to both buyer and seller.
 * - On failure: Update transaction status to 'Cancelled', add a failure reason, and send a 'system' notification to the buyer.
 */
export const createTransaction = async (postId: string): Promise<Transaction> => {
    console.log('API CALL: createTransaction', { postId });
    throw new Error("API function not implemented");
};

/**
 * API: Update Transaction
 * @description Updates the status of a transaction (e.g., mark as shipped, accept item).
 * @method PUT
 * @endpoint /api/transactions/{transactionId}
 * @body { status?: Transaction['status'], trackingNumber?: string, proofOfShipment?: File }
 * @response { Transaction }
 * @businessLogic
 * - **When status changes to 'Completed' (item accepted):**
 *   - The backend MUST also find the related post (`postId`) and update its `isSold` flag to `true`. This should be an atomic operation.
 *   - Send a notification to the seller that funds have been released.
 * - **When status changes to 'Shipped'**:
 *   - Set the `shippedAt` timestamp.
 *   - Send a notification to the buyer.
 */
export const updateTransaction = async (transactionId: string, updates: { status?: Transaction['status'], trackingNumber?: string, proofOfShipment?: File }): Promise<Transaction> => {
    console.log('API CALL: updateTransaction', { transactionId, updates });
    throw new Error("API function not implemented");
};

/**
 * API: Create Dispute
 * @description Creates a dispute for a transaction.
 * @method POST
 * @endpoint /api/transactions/{transactionId}/disputes
 * @body { reason: string }
 * @response { Dispute }
 * @businessLogic
 * - Change the transaction's status to 'Disputed'.
 * - Create a new dispute record.
 */
export const createDispute = async (transactionId: string, reason: string): Promise<Dispute> => {
    console.log('API CALL: createDispute', { transactionId, reason });
    throw new Error("API function not implemented");
};

/**
 * API: Get All Disputes (Admin)
 * @description Fetches all disputes for an admin.
 * @method GET
 * @endpoint /api/disputes
 * @response { Dispute[] }
 * @authorization Requires 'Admin' or 'Super Admin' role.
 */
export const getDisputes = async (): Promise<Dispute[]> => {
    console.log('API CALL: getDisputes');
    return [];
};

/**
 * API: Add Dispute Message
 * @description Adds a message to a dispute's chat history.
 * @method POST
 * @endpoint /api/disputes/{disputeId}/messages
 * @body { text?: string; attachmentFile?: File }
 * @response { Dispute }
 */
export const addDisputeMessage = async (disputeId: string, message: { text?: string; attachmentFile?: File }): Promise<Dispute> => {
    console.log('API CALL: addDisputeMessage', { disputeId, message });
    throw new Error("API function not implemented");
};

// --- CHAT ---

/**
 * API: Get User Chats
 * @description Fetches the list of all chats for the current user.
 * @method GET
 * @endpoint /api/chats
 * @response { Chat[] }
 */
export const getChats = async (): Promise<Chat[]> => {
    console.log('API CALL: getChats');
    return [];
};

/**
 * API: Start Chat
 * @description Starts a new chat or retrieves an existing one.
 * @method POST
 * @endpoint /api/chats
 * @body { postId?: string; userToMessageId?: string }
 * @response { Chat }
 * @businessLogic
 * - The backend should check if a chat already exists between the two users (and for the same post, if applicable) before creating a new one.
 */
export const startChat = async (options: { postId?: string; userId?: string }): Promise<Chat> => {
    console.log('API CALL: startChat', { options });
    throw new Error("API function not implemented");
};

/**
 * API: Send Message
 * @description Sends a message in a chat.
 * @method POST
 * @endpoint /api/chats/{chatId}/messages
 * @body Omit<Message, 'id' | 'sender' | 'timestamp'>
 * @response { Message }
 * @businessLogic
 * - Update the parent chat's `lastMessage` and `lastMessageTimestamp`.
 * - Send a 'system' (chat) notification to the other party in the chat.
 */
export const sendMessage = async (chatId: string, messageContent: Omit<Message, 'id' | 'sender' | 'timestamp'>): Promise<Message> => {
    console.log('API CALL: sendMessage', { chatId, messageContent });
    throw new Error("API function not implemented");
};

/**
 * API: Forward Message
 * @description Forwards a message to one or more chats.
 * @method POST
 * @endpoint /api/chats/forward-message
 * @body { originalMessageId: string, targetChatIds: string[] }
 * @response { success: boolean }
 * @businessLogic
 * - For each `targetChatId`, create a new message with `isForwarded: true` and the content of the original message.
 * - This should trigger the same logic as `sendMessage` for each target chat (update timestamps, send notifications).
 */
export const forwardMessage = async (originalMessageId: string, targetChatIds: string[]): Promise<{ success: boolean }> => {
    console.log('API CALL: forwardMessage', { originalMessageId, targetChatIds });
    return { success: true };
};

/**
 * API: Save Sticker
 * @description Saves a received sticker to the user's collection.
 * @method POST
 * @endpoint /api/users/me/stickers
 * @body { stickerUrl: string }
 * @response { success: boolean }
 */
export const saveSticker = async (stickerUrl: string): Promise<{ success: boolean }> => {
    console.log('API CALL: saveSticker', { stickerUrl });
    return { success: true };
};

// --- NOTIFICATIONS & ACTIVITY ---

/**
 * API: Get Notifications
 * @description Fetches all notifications for the current user.
 * @method GET
 * @endpoint /api/notifications
 * @response { Notification[] }
 */
export const getNotifications = async (): Promise<Notification[]> => {
    console.log('API CALL: getNotifications');
    return [];
};

/**
 * API: Get Activity Log
 * @description Fetches the activity log for the current user.
 * @method GET
 * @endpoint /api/activity-log
 * @response { ActivityLog[] }
 */
export const getActivityLog = async (): Promise<ActivityLog[]> => {
    console.log('API CALL: getActivityLog');
    return [];
};

// --- ADMIN ---

/**
 * API: Get All Users (Admin)
 * @description Fetches all users for the admin user management page.
 * @method GET
 * @endpoint /api/admin/users
 * @response { User[] }
 * @authorization Requires 'Admin' or 'Super Admin' role.
 */
export const getAllUsers = async (): Promise<User[]> => {
    console.log('API CALL: getAllUsers');
    return [];
};

/**
 * API: Toggle User Activation (Admin)
 * @description Toggles a user's active status.
 * @method POST
 * @endpoint /api/admin/users/{userId}/toggle-activation
 * @response { User }
 * @authorization Requires 'Admin' or 'Super Admin' role.
 */
export const toggleUserActivation = async (userId: string): Promise<User> => {
    console.log('API CALL: toggleUserActivation', { userId });
    throw new Error("API function not implemented");
};

/**
 * API: Ban User (Admin)
 * @description Bans a user for a specified duration and reason.
 * @method POST
 * @endpoint /api/admin/users/{userId}/ban
 * @body { days: number, reason: string }
 * @response { User }
 * @authorization Requires 'Admin' or 'Super Admin' role.
 */
export const banUser = async (userId: string, days: number, reason: string): Promise<User> => {
    console.log('API CALL: banUser', { userId, days, reason });
    throw new Error("API function not implemented");
};

/**
 * API: Unban User (Admin)
 * @description Lifts a ban from a user.
 * @method POST
 * @endpoint /api/admin/users/{userId}/unban
 * @response { User }
 * @authorization Requires 'Admin' or 'Super Admin' role.
 */
export const unbanUser = async (userId: string): Promise<User> => {
    console.log('API CALL: unbanUser', { userId });
    throw new Error("API function not implemented");
};

/**
 * API: Set User Role (Super Admin)
 * @description Sets a new role for a user.
 * @method PUT
 * @endpoint /api/admin/users/{userId}/role
 * @body { newRole: UserRole }
 * @response { User }
 * @authorization Requires 'Super Admin' role.
 */
export const setUserRole = async (userId: string, newRole: UserRole): Promise<User> => {
    console.log('API CALL: setUserRole', { userId, newRole });
    throw new Error("API function not implemented");
};

/**
 * API: Toggle Post Comment Restriction (Admin)
 * @description Toggles the comment restriction on a post.
 * @method POST
 * @endpoint /api/admin/posts/{postId}/toggle-comment-restriction
 * @response { Post }
 * @authorization Requires 'Admin' or 'Super Admin' role.
 */
export const togglePostCommentRestriction = async (postId: string): Promise<Post> => {
    console.log('API CALL: togglePostCommentRestriction', { postId });
    throw new Error("API function not implemented");
};

/**
 * API: Resolve Post Flag (Admin)
 * @description Resolves (dismisses) a flag on a post by clearing the `flaggedBy` array.
 * @method POST
 * @endpoint /api/admin/posts/{postId}/resolve-flag
 * @response { Post }
 * @authorization Requires 'Admin' or 'Super Admin' role.
 */
export const resolvePostFlag = async (postId: string): Promise<Post> => {
    console.log('API CALL: resolvePostFlag', { postId });
    throw new Error("API function not implemented");
};

/**
 * API: Resolve Comment Flag (Admin)
 * @description Resolves (dismisses) a flag on a comment.
 * @method POST
 * @endpoint /api/admin/comments/{commentId}/resolve-flag
 * @response { Comment }
 * @authorization Requires 'Admin' or 'Super Admin' role.
 */
export const resolveCommentFlag = async (postId: string, commentId: string): Promise<Comment> => {
    console.log('API CALL: resolveCommentFlag', { postId, commentId });
    throw new Error("API function not implemented");
};

/**
 * API: Admin Transaction Action
 * @description Manually updates a transaction as an admin.
 * @method POST
 * @endpoint /api/admin/transactions/{transactionId}/action
 * @body { action: AdminAction['action'], details?: any }
 * @response { Transaction }
 * @authorization Requires 'Admin' or 'Super Admin' role.
 */
export const performAdminTransactionAction = async (transactionId: string, action: AdminAction['action'], details?: any): Promise<Transaction> => {
    console.log('API CALL: performAdminTransactionAction', { transactionId, action, details });
    throw new Error("API function not implemented");
};

/**
 * API: Toggle Maintenance Mode (Super Admin)
 * @description Toggles platform-wide maintenance mode.
 * @method POST
 * @endpoint /api/admin/maintenance
 * @body { isEnabled: boolean }
 * @response { maintenanceMode: boolean }
 * @authorization Requires 'Super Admin' role.
 */
export const toggleMaintenanceMode = async (isEnabled: boolean): Promise<{ maintenanceMode: boolean }> => {
    console.log('API CALL: toggleMaintenanceMode', { isEnabled });
    return { maintenanceMode: isEnabled };
};


// --- AI / GEMINI SERVICES (Backend Proxied) ---

/**
 * API: Analyze Dispute with AI
 * @description The backend receives the dispute data, calls the Gemini API, and returns the analysis.
 * @method POST
 * @endpoint /api/ai/analyze-dispute
 * @body { Dispute }
 * @response { AIAnalysis }
 * @authorization Requires 'Admin' or 'Super Admin' role.
 */
export const analyzeDisputeWithAI = async (dispute: Dispute): Promise<AIAnalysis> => {
    console.log('API CALL: analyzeDisputeWithAI');
    throw new Error("API function not implemented");
};

/**
 * API: Generate Description with AI
 * @description The backend receives media data, calls the Gemini API, and returns a generated description.
 * @method POST
 * @endpoint /api/ai/generate-description
 * @body { mediaData: string (base64), mimeType: string, categoryName?: string }
 * @response { description: string }
 */
export const generateDescriptionFromMediaWithAI = async (mediaData: string, mimeType: string, categoryName?: string): Promise<string> => {
    console.log('API CALL: generateDescriptionFromMediaWithAI', { mimeType, categoryName });
    return "AI Generated Description";
};

/**
 * API: Generate Avatar with AI
 * @description The backend receives a prompt, calls the Gemini API, and returns generated avatar images.
 * @method POST
 * @endpoint /api/ai/generate-avatar
 * @body { prompt: string }
 * @response { avatars: string[] } // Array of base64 image strings
 */
export const generateAvatarWithAI = async (prompt: string): Promise<string[]> => {
    console.log('API CALL: generateAvatarWithAI', { prompt });
    return [];
};

/**
 * API: Scheduled Job - Auto-complete Transactions
 * @description This is not a direct API endpoint, but a scheduled task (e.g., a cron job) the backend must run.
 * @task
 * - Periodically query for transactions where `status` is 'Delivered' and the `inspectionPeriodEnds` date has passed.
 * - For each such transaction:
 *   1. Update its `status` to 'Completed'.
 *   2. Update the related post's `isSold` flag to `true`.
 *   3. Send 'system' notifications to both the buyer and seller about the automatic completion.
 */
// This is a conceptual function representing a backend job.
export const scheduledAutoComplete = async () => {
    console.log('BACKEND JOB: Running scheduledAutoComplete');
}