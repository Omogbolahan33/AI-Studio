/**
 * @file This file provides the OpenAPI 3.0 specification for the Social Marketplace backend as a TypeScript object.
 * It serves as a machine-readable source of truth for the API's contract, detailing all endpoints,
 * data schemas, and security requirements.
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
          email: { type: 'string', format: 'email', nullable: true },
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
          username: { type: 'string' },
          password: { type: 'string' },
        },
        required: ['username', 'password'],
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
        },
      },
    },
    '/auth/signup': {
        post: {
            tags: ['Auth'],
            summary: 'Sign Up a new user',
            requestBody: {
                required: true,
                content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginPayload' } } }
            },
            responses: {
                '201': { description: 'User created successfully', content: { 'application/json': { schema: { properties: { user: { $ref: '#/components/schemas/User' }, token: { type: 'string' } } } } } },
                '400': { description: 'Invalid input or username taken' }
            }
        }
    },
    '/users/me': {
        get: {
            tags: ['User'],
            summary: 'Get current user profile',
            responses: { '200': { description: 'Current user data', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } } }
        },
        put: {
            tags: ['User'],
            summary: 'Update current user settings',
            requestBody: {
                content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } // Should be a partial schema in a real app
            },
            responses: { '200': { description: 'Updated user data', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } } }
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
            responses: { '200': { description: 'A list of posts', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Post' } } } } } }
        },
        post: {
            tags: ['Posts'],
            summary: 'Create a new post',
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
            parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                 content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePostPayload' } } }
            },
            responses: { '200': { description: 'Post updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } } }
        },
        delete: {
            tags: ['Posts'],
            summary: 'Delete a post',
            parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { '204': { description: 'Post deleted' } }
        }
    },
    '/posts/{postId}/like': {
        post: {
            tags: ['Posts'],
            summary: 'Like a post',
            parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { '200': { description: 'Post liked/unliked' } }
        }
    },
    '/posts/{postId}/comments': {
        post: {
            tags: ['Comments'],
            summary: 'Add a comment to a post',
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
            requestBody: {
                content: { 'application/json': { schema: { type: 'object', properties: { postId: { type: 'string' } } } } }
            },
            responses: { '201': { description: 'Transaction created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Transaction' } } } } }
        }
    },
     '/disputes': {
        get: {
            tags: ['Admin'],
            summary: 'Get all disputes (Admin)',
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
            responses: { '200': { description: 'List of all users', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } } }
        }
    },
    '/admin/users/{userId}/ban': {
        post: {
            tags: ['Admin'],
            summary: 'Ban a user',
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
        description: 'The backend forwards the dispute data to the Gemini API for analysis.',
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
