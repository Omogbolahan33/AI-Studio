/**
 * @file This file contains the master prompt for generating the backend server using a generative AI.
 * It is designed to be used in conjunction with `openapi.ts`, `types.ts`, `api.ts`, and `constants.ts`
 * to provide a comprehensive context for the AI.
 * 
 * This file should be updated whenever the API specifications or business logic requirements change.
 */

export const backendGenerationPrompt = `
Act as a world-class senior backend engineer specializing in Node.js, Express, and modern database architecture. Your task is to create a complete, fully functional, and production-ready backend server for an existing frontend application.

**Your final output must be a single zipped file named \`backend.zip\` containing the entire project structure.**

Use the following modern technology stack:
*   **Framework:** Node.js with Express.js
*   **Database:** PostgreSQL (for Supabase)
*   **ORM:** Prisma ORM
*   **Authentication:** JSON Web Tokens (JWT)

You are provided with four essential files from the frontend codebase that serve as your complete specification:
1.  \`openapi.ts\`: The definitive OpenAPI 3.0 specification for all API endpoints.
2.  \`types.ts\`: The TypeScript types defining all data models.
3.  \`api.ts\`: A file containing placeholder functions with detailed JSDoc comments that describe the **critical business logic, authorization rules, and side effects (like notifications)** for every API endpoint.
4.  \`constants.ts\`: Mock data that must be used to create a database seeding script.

### Core Requirements:

1.  **Project Setup:**
    *   Create a \`package.json\` file with all necessary dependencies (\`express\`, \`prisma\`, \`pg\`, \`@prisma/client\`, \`jsonwebtoken\`, \`bcryptjs\`, \`cors\`, \`dotenv\`, etc.) and dev dependencies (\`typescript\`, \`ts-node\`, \`@types/node\`, etc.).
    *   The scripts must include:
        *   \`"dev": "ts-node src/index.ts"\`
        *   \`"build": "tsc"\`
        *   \`"start": "node build/index.js"\`
        *   \`"prisma:migrate:dev": "prisma migrate dev"\`
        *   \`"prisma:seed": "prisma db seed"\`
    *   Create a standard \`.gitignore\` file for a Node.js/TypeScript project (ignore \`node_modules\`, \`.env\`, \`build\`).
    *   Create a \`tsconfig.json\` file configured for this project structure.

2.  **Configuration:**
    *   Implement configuration using a \`.env\` file.
    *   Provide a \`.env.example\` file. It must include:
        *   \`DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[HOST].supabase.co:5432/postgres?sslmode=require"\` (with a note to get this from Supabase).
        *   \`JWT_SECRET="your-super-secret-key"\`
        *   \`PORT="3001"\`

3.  **Database:**
    *   Use the provided \`types.ts\` file to generate a complete and accurate \`schema.prisma\` file. Correctly infer all models, fields, types, and relations.
    *   Ensure the schema includes fields for all business logic, such as \`isSold\` on \`Post\`, \`banExpiresAt\` on \`User\`, and the necessary fields for OTPs (e.g., \`verificationOtp\`, \`otpExpiry\`).

4.  **API Structure:**
    *   Organize the code logically into folders (e.g., \`src/routes\`, \`src/controllers\`, \`src/services\`, \`src/middleware\`).
    *   Create Express routes that exactly match the paths and HTTP methods defined in \`openapi.ts\`.

5.  **Authentication & Authorization:**
    *   Implement JWT-based authentication via an \`auth.ts\` middleware.
    *   Implement user registration (\`/signup\`) with secure password hashing (\`bcryptjs\`).
    *   Implement the full email verification and password reset flows using secure, time-limited OTPs.
    *   Implement role-based authorization middleware and apply it to all admin routes.
    *   Implement record-level authorization within controllers (e.g., a user can only edit their own posts).

6.  **Business Logic Implementation:**
    *   This is the most critical step. You **MUST** implement the specific business logic described in the JSDoc comments of the provided \`api.ts\` file for every single endpoint.
    *   **Auth Logic:** Pay close attention to the auth-related logic. The backend must generate and store OTPs for email verification and password reset, handle their validation and expiry, and update the user's \`isVerified\` status or password accordingly.
    *   **Transaction Logic:** The \`updateTransaction\` endpoint logic must include updating the related \`Post\`'s \`isSold\` status to \`true\` within an atomic database transaction.
    *   **Notification Logic:** The \`addComment\` endpoint must contain the full notification logic for mentions, replies, and post authors.

7.  **Data Seeding:**
    *   Create a \`prisma/seed.ts\` script.
    *   This script **MUST** use the data from the provided \`constants.ts\` file to populate the database.

8.  **Deployment Readiness (Render & Supabase):**
    *   Ensure the main server file (\`src/index.ts\`) listens on host \`0.0.0.0\` and uses the port from \`process.env.PORT\`.
    *   Create a \`render.yaml\` file in the root directory. This file should define a web service for Render:
        *   Use the \`node\` environment.
        *   Set the build command to \`npm install && npm run build\`.
        *   Set the start command to \`npm start\`.
        *   Include an environment variable for \`DATABASE_URL\` that syncs from Render's environment group.

9.  **Documentation:**
    *   Generate a \`README.md\` file that explains:
        1.  **Local Setup:** How to install, set up the \`.env\` file, run migrations, seed the database, and start the dev server.
        2.  **Deployment to Render:**
            *   Create a new "Web Service" on Render and connect it to the GitHub repository.
            *   Explain that Render will automatically use the \`render.yaml\` file for configuration.
            *   Instruct the user to create an Environment Group on Render for their secrets (\`DATABASE_URL\`, \`JWT_SECRET\`).
            *   Explain how to get the \`DATABASE_URL\` from their Supabase project settings.

---
### Input Files:

**\`openapi.ts\`**
\`\`\`typescript
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
            description: "Creates a new post. Business logic: If \`isAdvert\` is true, the user must have a bank account. After creation, a 'post' notification is sent to all followers.",
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
            description: "Toggles a like on a post. Business logic: Removes any existing dislike from the user. If a like is added, sends a 'like' notification to the post author and updates the post's \`lastActivityTimestamp\`.",
            parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { '200': { description: 'Post liked/unliked' } }
        }
    },
    '/posts/{postId}/comments': {
        post: {
            tags: ['Comments'],
            summary: 'Add a comment to a post',
            description: "Adds a comment. Business Logic: Updates the post's \`lastActivityTimestamp\`. Sends notifications for mentions, replies, and to the post author as applicable.",
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
            description: "Updates a transaction. Business Logic: If status is updated to 'Completed', the related post's \`isSold\` flag MUST be set to true in the same database transaction.",
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
            description: "Sends a chat message. Business Logic: Updates the chat's \`lastMessage\` and \`lastMessageTimestamp\`. Sends a notification to the other user in the chat.",
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

\`\`\`

**\`types.ts\`**
\`\`\`typescript
import React from 'react';

export type View = 'Dashboard' | 'Transaction Management' | 'Settings' | 'Forum' | 'My Chats' | 'My Profile' | 'Analytics';
export type UserRole = 'Super Admin' | 'Admin' | 'Member';

export interface Review {
  id: string;
  reviewerId: string;
  rating: number; // 1 to 5
  comment: string;
  timestamp: string;
  isVerifiedPurchase?: boolean;
  transactionId?: string;
}

export interface BankAccount {
  accountName: string;
  accountNumber: string;
  bankName: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  role: UserRole;
  name: string;
  avatarUrl?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  followingIds: string[];
  blockedUserIds: string[];
  isActive: boolean;
  banExpiresAt: string | null;
  banReason?: string | null;
  banStartDate?: string | null;
  isVerified: boolean;
  reviews: Review[];
  pendingFollowerIds: string[];
  savedStickers?: string[];
  bankAccount?: BankAccount;
}

export interface AdminAction {
  id: string;
  adminId: string;
  adminName: string;
  action: 'Forced Payout' | 'Forced Full Refund' | 'Partial Refund' | 'Reversal';
  timestamp: string;
  details?: string; // e.g., refund amount, or ID of action being reversed
  originalStatus?: Transaction['status'];
}

export interface FileAttachment {
  name: string;
  url: string; // data URL for this prototype
  type: 'image' | 'video' | 'pdf' | 'other';
}

export interface Transaction {
  id: string;
  postId?: string;
  buyer: string;
  seller: string;
  item: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'In Escrow' | 'Shipped' | 'Delivered' | 'Disputed' | 'Cancelled';
  date: string;
  trackingNumber?: string;
  shippingProof?: FileAttachment;
  inspectionPeriodEnds?: string;
  shippedAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  failureReason?: string;
  refundedAmount?: number;
  adminActions?: AdminAction[];
}

export interface DisputeMessage {
  sender: string;
  message?: string;
  timestamp: string;
  attachment?: FileAttachment;
}

export interface Dispute {
  id: string;
  transactionId: string;
  buyer: string;
  seller: string;
  reason: string;
  status: 'Open' | 'Resolved' | 'Escalated';
  openedDate: string;
  chatHistory: DisputeMessage[];
  resolvedByAdminId?: string;
}

export interface AIAnalysis {
    summary: string;
    buyer_claims: string[];
    seller_claims: string[];
    policy_violations: string[];
    suggested_resolution: string;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    type: 'discussion' | 'advert';
}

export interface Comment {
    id: string;
    author: string;
    content: string; // This will now be an HTML string
    timestamp: string;
    editedTimestamp?: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    flaggedBy: string[];
    replies: Comment[];
    parentId: string | null;
    likedBy: string[];
    dislikedBy: string[];
}

export type PostCondition = 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';

export interface Post {
    id: string;
    author: string;
    timestamp: string;
    lastActivityTimestamp: string;
    editedTimestamp?: string;
    title: string;
    content: string;
    comments: Comment[];
    isAdvert: boolean;
    price?: number;
    categoryId: string;
    likedBy: string[];
    dislikedBy: string[];
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    brand?: string;
    condition?: PostCondition;
    pinnedAt?: string;
    flaggedBy: string[];
    isCommentingRestricted: boolean;
    isSold: boolean;
}

export interface Message {
  id: string;
  sender: string;
  timestamp: string;
  text?: string;
  stickerUrl?: string;
  voiceNote?: {
    audioUrl: string; // In a real app, this would be a URL to a storage bucket
    duration: number; // in seconds
  };
  attachment?: FileAttachment;
  replyTo?: {
    id: string;
    sender: string;
    contentPreview: string; // "Sticker", "Voice Note (0:15)", or truncated text
  };
  isForwarded?: boolean;
}


export interface Chat {
  id: string;
  postId?: string;
  postTitle?: string;
  transactionId?: string;
  buyer: string;
  seller: string;
  messages: Message[];
  lastMessage: string;
  lastMessageTimestamp: string;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'like' | 'comment_like' | 'comment' | 'follow' | 'system' | 'post' | 'follow_request' | 'mention';
    content: string;
    link: string;
    timestamp: string;
    read: boolean;
    postId?: string;
    actorId?: string;
    transactionId?: string;
    chatId?: string;
    disputeId?: string;
}

export interface ActivityLog {
    id: string;
    userId: string;
    action: string;
    details: string;
    timestamp: string;
}

export interface PolicyModal {
    title: string;
    content: string;
}

// Fix: Replaced JSX with React.createElement to resolve parsing errors in a .ts file.
export const UnverifiedBadge: React.FC = () => (
    React.createElement('span', { className: "unverified-tag" }, '(unverified)')
);

export const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" })
  )
);

export const ChartPieIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 6a7.5 7.5 0 100 12h-3a7.5 7.5 0 000-12h3z" }),
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" })
  )
);

export const CurrencyDollarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.826-1.106-2.156 0-2.982.553-.414 1.278-.659 2.003-.659.768 0 1.536.219 2.232.659l.879.659m0 0c-.015.01-.03.018-.046.026" })
  )
);

export const ShieldExclamationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" })
  )
);

export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" })
    )
);

export const DocumentReportIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" })
    )
);

export const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" })
    )
);

export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 8.25l-7.5 7.5-7.5-7.5" })
    )
);

export const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-2.42 8.25 8.25 0 00-4.47-2.461M6.75 9.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM18.75 9.375a4.125 4.125 0 11-8.25 0 4.125 4.125 0 018.25 0z" })
    )
);

export const UserGroupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.928a4.5 4.5 0 117.082-2.072M3 18.72a9.094 9.094 0 013.741-.479 3 3 0 01-4.682-2.72m7.5-2.928a4.5 4.5 0 10-7.082-2.072" })
    )
);

export const CogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5" })
    )
);

export const Cog8ToothIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.594 3.94c.09-.542.56-1.007 1.11-1.226l.043-.018a2.25 2.25 0 012.062 0l.043.018c.55.219 1.02.684 1.11 1.226l.043.25a2.25 2.25 0 01-1.397 2.47l-.18.067a2.25 2.25 0 00-2.585 0l-.18-.067a2.25 2.25 0 01-1.397-2.47l.043-.25zM12 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM3.75 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM20.25 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM3.75 14.25a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM20.25 14.25a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12 14.25a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" })
    )
);

export const ChatBubbleLeftRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a1.05 1.05 0 01-1.485 0l-3.72-3.72A2.1 2.1 0 014.5 17.097V8.511c0-.97.616-1.813 1.5-2.097m6.5 0a2.1 2.1 0 012.1 2.1v4.286c0 1.136.847 2.1 1.98 2.193l3.72 3.72a1.05 1.05 0 001.485 0l3.72-3.72a2.1 2.1 0 001.98-2.193V8.511c0-.97-.616-1.813-1.5-2.097M15 5.25a2.1 2.1 0 00-2.1-2.1H8.1a2.1 2.1 0 00-2.1 2.1v4.286c0 1.135.847 2.1 1.98 2.193l3.72 3.72a1.05 1.05 0 001.485 0l3.72-3.72A2.1 2.1 0 0015 11.636V5.25z" })
    )
);

export const ChatBubbleOvalLeftEllipsisIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.372A.75.75 0 019 19.5v-1.5a.75.75 0 01.75-.75h3.75a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75H9.375a3 3 0 00-3 3V19.5A.75.75 0 015.625 20.25 9.76 9.76 0 013 19.875c-4.97 0-9-3.694-9-8.25s4.03-8.25 9-8.25 9 3.694 9 8.25z" })
    )
);

export const ChatBubbleBottomCenterTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" })
    )
);

export const HandThumbUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V2.75a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.162-1.581c-.827-.413-1.71-.413-2.537 0l-3.162 1.581c-.459.152-.94.23-1.423.23H2.896c-.618 0-1.227-.247-1.605-.729A11.95 11.95 0 010 12.25c0-.435.023-.863.068-1.285C.177 9.934 1.096 9.24 2.122 9.24h3.126c.618 0 .991.724.725 1.282C5.565 11.5 5.25 12.25 5.25 13.5a.75.75 0 00.75.75h.383c.621 0 1.206-.414 1.4-1.022a4.49 4.49 0 00.322-1.672V10.25z" })
    )
);

export const HandThumbDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6.633 13.75c.806 0 1.533.446 2.031 1.08a9.041 9.041 0 002.861 2.4c.723.384 1.35.956 1.653 1.715a4.498 4.498 0 00.322 1.672v1.05a.75.75 0 00.75.75 2.25 2.25 0 002.25-2.25c0-1.152-.26-2.243-.723-3.218-.266-.558.107-1.282.725-1.282h3.126c1.026 0 1.945-.694 2.054-1.715.045-.422.068-.85.068-1.285a11.95 11.95 0 00-2.649-7.521c-.388-.482-.987-.729-1.605-.729H13.48c-.483 0-.964.078-1.423-.23l-3.162 1.581c-.827.413-1.71-.413-2.537 0l-3.162-1.581c-.459-.152-.94-.23-1.423-.23H2.896c-.618 0-1.227-.247-1.605-.729A11.95 11.95 0 000 11.75c0 .435.023.863.068 1.285C.177 14.066 1.096 14.76 2.122 14.76h3.126c.618 0 .991-.724.725-1.282C5.565 12.5 5.25 11.75 5.25 10.5a.75.75 0 01.75-.75h.383c.621 0 1.206-.414 1.4 1.022a4.49 4.49 0 01.322 1.672v1.05z" })
  )
);

export const Bars3Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" })
  )
);

export const BellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" })
  )
);

export const EnvelopeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" })
  )
);

export const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" })
  )
);

export const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" })
  )
);

export const MagnifyingGlassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" })
  )
);

export const ChevronLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 19.5L8.25 12l7.5-7.5" })
  )
);

export const ChevronRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M8.25 4.5l7.5 7.5-7.5-7.5" })
  )
);

export const CommunityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.928a4.5 4.5 0 117.082-2.072M3 18.72a9.094 9.094 0 013.741-.479 3 3 0 01-4.682-2.72m7.5-2.928a4.5 4.5 0 10-7.082-2.072" })
    )
);

export const UserPlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.5 21h-5a12.318 12.318 0 01-1.5-1.765z" })
    )
);

export const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" })
    )
);

export const ArrowUpTrayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" })
    )
);

export const PinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" })
    )
);

export const FlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" })
  )
);

export const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" })
  )
);

export const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" })
    )
);
export const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" })
    )
);
export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.5v15m7.5-7.5h-15" })
    )
);
export const FireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6c.001.024.002.048.003.072a8.25 8.25 0 013.36-3.797zM12 15.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" })
    )
);
export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.5 18.75h-9a9.75 9.75 0 1011.64-8.913M12 14.25v5.25m-4.5-5.25v5.25m9-5.25v5.25M9 9.75h6M12 3v1.5" })
    )
);
export const FilterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.572a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" })
    )
);
export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" })
    )
);
export const ShieldCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" })
    )
);
export const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" }),
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })
    )
);
export const EyeSlashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" })
    )
);
export const LockClosedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" })
    )
);
export const LockOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M13.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" })
    )
);
export const BoldIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 4.5h3.75a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25H10.5m0-6V18m0-6h4.5a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25H10.5" })
    )
);
export const ItalicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 4.5l6 15m6-15l-6 15" })
    )
);
export const Bars3BottomLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" })
    )
);
export const Bars3BottomRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" })
    )
);
export const Bars4Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 6.75h16.5M6 12h12m-10.5 5.25h9" })
    )
);
export const ListBulletIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M8.25 6.75h12M8.25 12h12M8.25 17.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" })
    )
);
export const ListNumberedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M5.25 8.25h13.5m-13.5 7.5h13.5m-1.5-15l-3 15m-2.25-15l-3 15" })
    )
);
export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.456-2.456L12.75 18l1.178-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.178a3.375 3.375 0 002.456 2.456L20.25 18l-1.178.398a3.375 3.375 0 00-2.456 2.456z" })
    )
);
export const TagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l6.499 6.5a2.25 2.25 0 003.182 0l4.318-4.318a2.25 2.25 0 000-3.182l-6.5-6.5A2.25 2.25 0 009.568 3z" }),
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 6h.008v.008H6V6z" })
    )
);
export const PaperClipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M18.375 12.739l-7.69 7.69a6.75 6.75 0 01-9.546-9.546l7.69-7.69a4.5 4.5 0 016.364 6.364l-7.69 7.69a2.25 2.25 0 01-3.182-3.182l6.815-6.815a.75.75 0 011.06 1.06l-6.815 6.815a.75.75 0 001.06 1.06l7.69-7.69a3 3 0 00-4.242-4.242l-7.69 7.69a5.25 5.25 0 007.424 7.424l7.69-7.69" })
    )
);
export const FaceSmileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75h.008v.008H9V9.75zm6 0h.008v.008H15V9.75z" })
    )
);
export const PaintBrushIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 013.388-1.62m0 0a15.998 15.998 0 013.388-1.62m0 0a15.998 15.998 0 013.388-1.62m-11.8 4.875a15.998 15.998 0 00-3.388-1.62m0 0A15.998 15.998 0 013 10.125m11.8 4.875c-1.121-2.3-2.1-4.684-2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.106c0-1.223.995-2.218 2.218-2.218h4.042a2.25 2.25 0 012.218 2.218L13.5 14.25m-6 0h6" })
    )
);
export const NoSymbolIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" })
    )
);
export const StopCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }),
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.563C9.252 15 9 14.748 9 14.437V9.564z" })
    )
);
export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
    )
);
export const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.336 1.01l-4.125 3.572a.563.563 0 00-.162.632l1.24 5.33c.084.36-.31.66-.642.49l-4.99-2.94a.563.563 0 00-.59 0l-4.99 2.94c-.332.17-.726-.13-.642-.49l1.24-5.33a.563.563 0 00-.162-.632l-4.125-3.572c-.365-.347-.163-.97.336-1.01l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" })
    )
);
export const UserMinusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" })
    )
);
export const ArrowUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M4.5 15.75l7.5-7.5 7.5 7.5" })
    )
);
export const ArrowDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 8.25l-7.5 7.5-7.5-7.5" })
    )
);
export const ArrowUturnLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" })
    )
);
export const PhotoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" })
    )
);
export const CheckBadgeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.4-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.4-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.4 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.4.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" })
    )
);
export const PhoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" })
    )
);
export const MicrophoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 016 0v8.25a3 3 0 01-3 3z" })
    )
);
export const MicrophoneSlashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M17.25 9.75v-.375c0-1.621-.624-3.129-1.758-4.242-1.134-1.114-2.621-1.758-4.242-1.758-1.621 0-3.108.644-4.242 1.758-1.134 1.113-1.758 2.621-1.758 4.242v.375m13.5 0v.375c0 1.621-.624 3.129-1.758-4.242-1.134 1.114-2.621 1.758-4.242 1.758-1.621 0-3.108.644-4.242 1.758-1.134 1.113-1.758 2.621-1.758 4.242v.375M19.5 10.5v.75c0 4.142-3.358 7.5-7.5 7.5s-7.5-3.358-7.5-7.5v-.75m15 0a9 9 0 00-9-9-9 9 0 00-9 9m18 0l-3.35-3.35m-12.8 0L3 13.65" })
    )
);
export const VideoCameraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" })
    )
);
export const VideoCameraSlashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5A2.25 2.25 0 012.25 16.5v-9A2.25 2.25 0 014.5 5.25H6m9 0h1.5A2.25 2.25 0 0118.75 7.5v3.286m-3.286 6.214l-6.214-6.214M21 21l-6-6" })
    )
);
export const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.195.025.39.05.588.08m0 0a2.25 2.25 0 11-3.126 3.126m3.126-3.126L6.536 5.636a2.25 2.25 0 00-3.126 3.126m3.126 3.126L17.464 21.364a2.25 2.25 0 003.126-3.126m-3.126-3.126l-6.536-6.536" })
    )
);
export const BookmarkSquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" })
    )
);
export const PlayCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }),
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" })
    )
);
export const PauseCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
    )
);
export const PaperAirplaneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" })
  )
);
export const StopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" })
    )
);
export const AtSymbolIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" })
    )
);
export const GoogleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 48 48", ...props },
        React.createElement('path', { fill: "#FFC107", d: "M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" }),
        React.createElement('path', { fill: "#FF3D00", d: "M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" }),
        React.createElement('path', { fill: "#4CAF50", d: "M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.65-3.657-11.303-8H6.306C9.656,39.663,16.318,44,24,44z" }),
        React.createElement('path', { fill: "#1976D2", d: "M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.904,38.638,44,31.883,44,24C44,22.659,43.862,21.35,43.611,20.083z" })
    )
);
export const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", ...props },
      React.createElement('path', { fill: "#1877F2", d: "M22,12c0-5.523-4.477-10-10-10S2,6.477,2,12c0,4.99,3.657,9.128,8.438,9.878V15.89H8.207v-3.774h2.231v-2.82c0-2.204,1.31-3.41,3.28-3.41c0.938,0,1.95,0.17,1.95,0.17v3.23h-1.63c-1.09,0-1.42,0.67-1.42,1.35v1.48h3.58l-0.56,3.774h-3.02V21.878C18.343,21.128,22,16.99,22,12z" })
    )
);

export const DocumentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" })
    )
);
export const ArrowPathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-11.667 0l3.181-3.183a8.25 8.25 0 011.667 0l3.181 3.183" })
    )
);
\`\`\`

**\`api.ts\`**
\`\`\`typescript
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
 * - The backend should check if the user's \`isActive\` flag is true. If not, return a 403 Forbidden error.
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
 * - On success, the user's \`isVerified\` flag is set to true.
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
 * - Add the current user's ID to the target user's \`pendingFollowerIds\`.
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
 * - Remove \`requesterId\` from the current user's \`pendingFollowerIds\`.
 * - Add the current user's ID to the \`requesterId\`'s \`followingIds\`.
 * - Send a 'follow' notification to the \`requesterId\`.
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
 * - Remove \`requesterId\` from the current user's \`pendingFollowerIds\`.
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
 * - Remove \`userIdToUnfollow\` from the current user's \`followingIds\`.
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
 * - Add \`userIdToBlock\` to the current user's \`blockedUserIds\`.
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
 * - If \`transactionId\` is provided, the \`isVerifiedPurchase\` flag should be set to true.
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
 * - If \`isAdvert\` is true, the backend must validate that the user has a linked bank account. If not, return a 400 Bad Request.
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
 * - The like is toggled (add/remove user ID from \`likedBy\`).
 * - If a like is added (and it's not a self-like), send a 'like' notification to the post author.
 * - Update the post's \`lastActivityTimestamp\`.
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
 * - The dislike is toggled (add/remove user ID from \`dislikedBy\`).
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
 * - Add the current user's ID to the post's \`flaggedBy\` array.
 * - Backend should prevent duplicate flags from the same user.
 */
export const flagPost = async (postId: string): Promise<{ success: boolean }> => {
    console.log('API CALL: flagPost', { postId });
    return { success: true };
};

/**
 * API: Toggle Post Sold Status
 * @description Toggles the 'isSold' status of an advertisement post.
 * @method POST
 * @endpoint /api/posts/{postId}/toggle-sold
 * @response { Post }
 * @authorization User must be the author of the post.
 */
export const toggleSoldStatus = async (postId: string): Promise<Post> => {
    console.log('API CALL: toggleSoldStatus', { postId });
    throw new Error("API function not implemented");
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
 * - Update the parent post's \`lastActivityTimestamp\`.
 * - Parse the comment content for @mentions.
 * - Notification Logic (do not notify user for their own actions):
 *   1. **Mentions**: For each valid @mentioned user, send a 'mention' notification.
 *   2. **Replies**: If \`parentId\` is present, find the author of the parent comment. If they are not the current user and not already mentioned, send a 'comment' (reply) notification.
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
 * - Backend must validate that the current user (buyer) has a shipping address on file. If not, return a 400 Bad Request.
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
 *   - The backend MUST also find the related post (\`postId\`) and update its \`isSold\` flag to \`true\`. This should be an atomic operation.
 *   - Send a notification to the seller that funds have been released.
 * - **When status changes to 'Shipped'**:
 *   - Set the \`shippedAt\` timestamp.
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
 * - Update the parent chat's \`lastMessage\` and \`lastMessageTimestamp\`.
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
 * - For each \`targetChatId\`, create a new message with \`isForwarded: true\` and the content of the original message.
 * - This should trigger the same logic as \`sendMessage\` for each target chat (update timestamps, send notifications).
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
 * @description Resolves (dismisses) a flag on a post by clearing the \`flaggedBy\` array.
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
 * - Periodically query for transactions where \`status\` is 'Delivered' and the \`inspectionPeriodEnds\` date has passed.
 * - For each such transaction:
 *   1. Update its \`status\` to 'Completed'.
 *   2. Update the related post's \`isSold\` flag to \`true\`.
 *   3. Send 'system' notifications to both the buyer and seller about the automatic completion.
 */
// This is a conceptual function representing a backend job.
export const scheduledAutoComplete = async () => {
    console.log('BACKEND JOB: Running scheduledAutoComplete');
}
\`\`\`

**\`constants.ts\`**
\`\`\`typescript
import type { Transaction, Dispute, Post, Chat, User, Category, Notification, ActivityLog, Message, DisputeMessage } from './types';

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
    { id: 'user-02', username: 'alice', password: 'password', role: 'Member', name: 'Alice', avatarUrl: 'https://i.pravatar.cc/150?u=alice