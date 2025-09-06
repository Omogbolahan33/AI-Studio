/**
 * @file This file provides a potential OpenAPI 3.0 specification for the Social Marketplace backend.
 * 
 * NOTE: The application is currently running in a client-only mode with mock data.
 * This specification is a blueprint for future backend development and is not currently in use
 * or required for the application to function.
 *
 * For a real-world project, it's recommended to install openapi-types for type safety:
 * npm install --save-dev openapi-types
 * import type { OpenAPIObject } from 'openapi-types';
 */

// Define the spec as a constant. The ': any' is used because we don't have the
// openapi-types package in this environment, but the structure conforms to the OpenAPIObject type.
export const openApiSpec: any = {
  openapi: '3.0.0',
  info: {
    title: 'Social Marketplace API',
    version: '1.0.0',
    description: 'API for a social marketplace platform with features for posts, transactions, disputes, chat, and user management.',
  },
  servers: [
    {
      url: '/api',
      description: 'Development server',
    },
  ],
  components: {
    schemas: {
      UserRole: {
        type: 'string',
        enum: ['Super Admin', 'Admin', 'Member'],
      },
      PostCondition: {
        type: 'string',
        enum: ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'],
      },
      TransactionStatus: {
        type: 'string',
        enum: ['Pending', 'Completed', 'In Escrow', 'Shipped', 'Delivered', 'Disputed', 'Cancelled'],
      },
      Review: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          reviewerId: { type: 'string' },
          rating: { type: 'number', format: 'int32', minimum: 1, maximum: 5 },
          comment: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          isVerifiedPurchase: { type: 'boolean' },
          transactionId: { type: 'string' },
        },
      },
      BankAccount: {
        type: 'object',
        properties: {
            accountName: { type: 'string' },
            accountNumber: { type: 'string' },
            bankName: { type: 'string' },
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          username: { type: 'string' },
          role: { $ref: '#/components/schemas/UserRole' },
          name: { type: 'string' },
          avatarUrl: { type: 'string', format: 'uri', nullable: true },
          email: { type: 'string', format: 'email' },
          address: { type: 'string', nullable: true },
          city: { type: 'string', nullable: true },
          zipCode: { type: 'string', nullable: true },
          followingIds: { type: 'array', items: { type: 'string' } },
          blockedUserIds: { type: 'array', items: { type: 'string' } },
          isActive: { type: 'boolean' },
          banExpiresAt: { type: 'string', format: 'date-time', nullable: true },
          banReason: { type: 'string', nullable: true },
          isVerified: { type: 'boolean' },
          reviews: { type: 'array', items: { $ref: '#/components/schemas/Review' } },
          pendingFollowerIds: { type: 'array', items: { type: 'string' } },
          bankAccount: { $ref: '#/components/schemas/BankAccount', nullable: true },
        },
      },
      Comment: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          author: { type: 'string' },
          content: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          editedTimestamp: { type: 'string', format: 'date-time', nullable: true },
          mediaUrl: { type: 'string', format: 'uri', nullable: true },
          mediaType: { type: 'string', enum: ['image', 'video'], nullable: true },
          flaggedBy: { type: 'array', items: { type: 'string' } },
          replies: { type: 'array', items: { $ref: '#/components/schemas/Comment' } }, // Recursive definition
          parentId: { type: 'string', nullable: true },
          likedBy: { type: 'array', items: { type: 'string' } },
          dislikedBy: { type: 'array', items: { type: 'string' } },
        },
      },
      Post: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          author: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          lastActivityTimestamp: { type: 'string', format: 'date-time' },
          editedTimestamp: { type: 'string', format: 'date-time', nullable: true },
          title: { type: 'string' },
          content: { type: 'string' },
          comments: { type: 'array', items: { $ref: '#/components/schemas/Comment' } },
          isAdvert: { type: 'boolean' },
          price: { type: 'number', format: 'float', nullable: true },
          categoryId: { type: 'string' },
          likedBy: { type: 'array', items: { type: 'string' } },
          dislikedBy: { type: 'array', items: { type: 'string' } },
          mediaUrl: { type: 'string', format: 'uri', nullable: true },
          mediaType: { type: 'string', enum: ['image', 'video'], nullable: true },
          brand: { type: 'string', nullable: true },
          condition: { $ref: '#/components/schemas/PostCondition' },
          pinnedAt: { type: 'string', format: 'date-time', nullable: true },
          flaggedBy: { type: 'array', items: { type: 'string' } },
          isCommentingRestricted: { type: 'boolean' },
          isSold: { type: 'boolean' },
        },
      },
      Transaction: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          postId: { type: 'string', nullable: true },
          buyer: { type: 'string' },
          seller: { type: 'string' },
          item: { type: 'string' },
          amount: { type: 'number', format: 'float' },
          status: { $ref: '#/components/schemas/TransactionStatus' },
          date: { type: 'string', format: 'date-time' },
        },
      },
      Dispute: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          transactionId: { type: 'string' },
          buyer: { type: 'string' },
          seller: { type: 'string' },
          reason: { type: 'string' },
          status: { type: 'string', enum: ['Open', 'Resolved', 'Escalated'] },
          openedDate: { type: 'string', format: 'date-time' },
          resolvedByAdminId: { type: 'string', nullable: true },
        },
      },
      Message: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            sender: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
            text: { type: 'string', nullable: true },
        }
      },
      Chat: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            postId: { type: 'string', nullable: true },
            buyer: { type: 'string' },
            seller: { type: 'string' },
            messages: { type: 'array', items: { $ref: '#/components/schemas/Message' } },
        }
      },
      // Schemas for request bodies
      LoginPayload: {
        type: 'object',
        properties: {
          identifier: { type: 'string', description: 'Username or email address' },
          password: { type: 'string' },
        },
        required: ['identifier', 'password'],
      },
      SignUpPayload: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
        required: ['username', 'email', 'password'],
      },
      VerifyEmailPayload: {
        type: 'object',
        properties: {
          otp: { type: 'string' }
        },
        required: ['otp']
      },
      RequestPasswordResetPayload: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' }
        },
        required: ['email']
      },
      ResetPasswordPayload: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          otp: { type: 'string' },
          newPassword: { type: 'string' },
        },
        required: ['email', 'otp', 'newPassword']
      },
      CreatePostPayload: {
        type: 'object',
        properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            isAdvert: { type: 'boolean' },
            price: { type: 'number', nullable: true },
            categoryId: { type: 'string' },
            mediaUrl: { type: 'string', nullable: true },
        }
      },
      AddCommentPayload: {
        type: 'object',
        properties: {
            content: { type: 'string' },
            parentId: { type: 'string', nullable: true },
        }
      }
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login User',
        description: 'Validates user credentials and returns a JWT for session management. Checks if the user is active.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginPayload' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successful login',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                    token: { type: 'string' },
                  },
                },
              },
            },
          },
          '401': { description: 'Invalid credentials' },
          '403': { description: 'User account is deactivated' },
        },
      },
    },
    '/auth/signup': {
        post: {
            tags: ['Auth'],
            summary: 'Sign Up a new user',
            description: 'Registers a new user. The backend must validate that the username and email are unique and securely hash the password.',
            requestBody: {
                required: true,
                content: { 'application/json': { schema: { $ref: '#/components/schemas/SignUpPayload' } } }
            },
            responses: {
                '201': { description: 'User created successfully', content: { 'application/json': { schema: { properties: { user: { $ref: '#/components/schemas/User' }, token: { type: 'string' } } } } } },
                '400': { description: 'Invalid input or username/email taken' }
            }
        }
    },
    '/auth/verify-email': {
      post: {
        tags: ['Auth'],
        summary: 'Verify email with OTP',
        description: 'Verifies the logged-in user\'s email address. Authorization: Requires user token.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/VerifyEmailPayload' }}}
        },
        responses: {
          '200': { description: 'Email verified successfully' },
          '400': { description: 'Invalid OTP' }
        }
      }
    },
    '/auth/request-password-reset': {
      post: {
        tags: ['Auth'],
        summary: 'Request password reset',
        description: 'Sends an OTP to the user\'s email address to initiate a password reset.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RequestPasswordResetPayload' }}}
        },
        responses: {
          '200': { description: 'Password reset code sent' },
          '404': { description: 'Email not found' }
        }
      }
    },
    '/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password with OTP',
        description: 'Sets a new password after verifying the OTP.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ResetPasswordPayload' }}}
        },
        responses: {
          '200': { description: 'Password has been reset successfully' },
          '400': { description: 'Invalid OTP or email' }
        }
      }
    },
    '/users/me': {
        get: {
            tags: ['User'],
            summary: 'Get current user profile',
            description: 'Fetches the complete profile for the user authenticated by the bearer token.',
            responses: { '200': { description: 'Current user data', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } } }
        },
        put: {
            tags: ['User'],
            summary: 'Update current user settings',
            description: 'Updates user profile information. If a password is included, it must be re-hashed.',
            requestBody: {
                content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } // Should be a partial schema in a real app
            },
            responses: { '200': { description: 'Updated user data', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } } }
        }
    },
    '/users/me/bank-account': {
        put: {
            tags: ['User'],
            summary: 'Update User Bank Account',
            description: "Adds or updates the current user's bank account for payouts.",
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/BankAccount' }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'Bank account updated successfully',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } }
                },
                '400': { description: 'Invalid bank account details provided' }
            }
        }
    },
    '/users/{userId}': {
        get: {
            tags: ['User'],
            summary: 'Get user profile by ID',
            parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { '200': { description: 'User profile data', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } } }
        }
    },
    '/posts': {
        get: {
            tags: ['Posts'],
            summary: 'Get all posts',
            description: 'Fetches posts based on various filters and sorting criteria.',
            responses: { '200': { description: 'A list of posts', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Post' } } } } } }
        },
        post: {
            tags: ['Posts'],
            summary: 'Create a new post',
            description: "Creates a new post. Business logic: If `isAdvert` is true, the user must have a bank account. After creation, a 'post' notification is sent to all followers.",
            requestBody: {
                content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePostPayload' } } }
            },
            responses: { '201': { description: 'Post created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } } }
        }
    },
    '/posts/{postId}': {
        get: {
            tags: ['Posts'],
            summary: 'Get post details',
            parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { '200': { description: 'Post details', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } } }
        },
        put: {
            tags: ['Posts'],
            summary: 'Update a post',
            description: 'Authorization: User must be the author of the post.',
            parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                 content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePostPayload' } } }
            },
            responses: { '200': { description: 'Post updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } } }
        },
        delete: {
            tags: ['Posts'],
            summary: 'Delete a post',
            description: 'Authorization: User must be the author of the post or have an Admin/Super Admin role.',
            parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { '204': { description: 'Post deleted' } }
        }
    },
     '/posts/{postId}/toggle-sold': {
        post: {
            tags: ['Posts'],
            summary: 'Toggle Post Sold Status',
            description: "Toggles the 'isSold' status of an advertisement post. Authorization: User must be the author of the post.",
            parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 
              '200': { 
                description: 'Post updated', 
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } 
              },
              '403': { description: 'User is not the author of the post' },
              '404': { description: 'Post not found' }
            }
        }
    },
    '/posts/{postId}/like': {
        post: {
            tags: ['Posts'],
            summary: 'Like a post',
            description: "Toggles a like on a post. Business logic: Removes any existing dislike from the user. If a like is added, sends a 'like' notification to the post author and updates the post's `lastActivityTimestamp`.",
            parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { '200': { description: 'Post liked/unliked' } }
        }
    },
    '/posts/{postId}/comments': {
        post: {
            tags: ['Comments'],
            summary: 'Add a comment to a post',
            description: "Adds a comment. Business Logic: Updates the post's `lastActivityTimestamp`. Sends notifications for mentions, replies, and to the post author as applicable.",
            parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                content: { 'application/json': { schema: { $ref: '#/components/schemas/AddCommentPayload' } } }
            },
            responses: { '201': { description: 'Comment created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Comment' } } } } }
        }
    },
    '/transactions': {
        get: {
            tags: ['Transactions'],
            summary: 'Get user transactions',
            responses: { '200': { description: 'List of transactions', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Transaction' } } } } } }
        },
        post: {
            tags: ['Transactions'],
            summary: 'Create a transaction from a post',
            description: "Initiates a purchase. Business logic: Backend must validate that the buyer has a shipping address. Backend simulates payment processing and sends notifications to buyer/seller on success or failure.",
            requestBody: {
                content: { 'application/json': { schema: { type: 'object', properties: { postId: { type: 'string' } } } } }
            },
            responses: { 
                '201': { description: 'Transaction created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Transaction' } } } },
                '400': { description: 'Bad Request (e.g., user has no shipping address, post not for sale)' }
            }
        }
    },
    '/transactions/{transactionId}': {
        put: {
            tags: ['Transactions'],
            summary: 'Update transaction status',
            description: "Updates a transaction. Business Logic: If status is updated to 'Completed', the related post's `isSold` flag MUST be set to true in the same database transaction.",
            parameters: [{ name: 'transactionId', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                content: { 'application/json': { schema: { properties: { status: { $ref: '#/components/schemas/TransactionStatus' }, trackingNumber: { type: 'string' } } } } }
            },
            responses: { '200': { description: 'Transaction updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Transaction' } } } } }
        }
    },
     '/disputes': {
        get: {
            tags: ['Admin'],
            summary: 'Get all disputes (Admin)',
            description: "Authorization: Requires 'Admin' or 'Super Admin' role.",
            responses: { '200': { description: 'List of all disputes', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Dispute' } } } } } }
        }
    },
    '/chats': {
        get: {
            tags: ['Chat'],
            summary: 'Get user chats',
            responses: { '200': { description: 'List of user chats', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Chat' } } } } } }
        }
    },
    '/chats/{chatId}/messages': {
        post: {
            tags: ['Chat'],
            summary: 'Send a message',
            description: "Sends a chat message. Business Logic: Updates the chat's `lastMessage` and `lastMessageTimestamp`. Sends a notification to the other user in the chat.",
            parameters: [{ name: 'chatId', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                content: { 'application/json': { schema: { type: 'object', properties: { text: { type: 'string' } } } } }
            },
            responses: { '201': { description: 'Message sent', content: { 'application/json': { schema: { $ref: '#/components/schemas/Message' } } } } }
        }
    },
     '/admin/users': {
        get: {
            tags: ['Admin'],
            summary: 'Get all users',
            description: "Authorization: Requires 'Admin' or 'Super Admin' role.",
            responses: { '200': { description: 'List of all users', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } } }
        }
    },
    '/admin/users/{userId}/ban': {
        post: {
            tags: ['Admin'],
            summary: 'Ban a user',
            description: "Authorization: Requires 'Admin' or 'Super Admin' role.",
            parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                content: { 'application/json': { schema: { type: 'object', properties: { days: { type: 'number' }, reason: { type: 'string' } } } } }
            },
            responses: { '200': { description: 'User banned', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } } }
        }
    },
    '/ai/analyze-dispute': {
      post: {
        tags: ['AI'],
        summary: 'Analyze a dispute with AI (Backend Proxy)',
        description: "The backend forwards the dispute data to the Gemini API for analysis. Authorization: Requires 'Admin' or 'Super Admin' role.",
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Dispute' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successful analysis',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    summary: { type: 'string' },
                    buyer_claims: { type: 'array', items: { type: 'string' } },
                    seller_claims: { type: 'array', items: { type: 'string' } },
                    policy_violations: { type: 'array', items: { type: 'string' } },
                    suggested_resolution: { type: 'string' },
                  },
                },
              },
            },
          },
          '500': { description: 'Error during AI analysis' },
        },
      },
    },
  },
};
