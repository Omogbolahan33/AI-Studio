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
// PASTE THE FULL CONTENT OF openapi.ts HERE
\`\`\`

**\`types.ts\`**
\`\`\`typescript
// PASTE THE FULL CONTENT OF types.ts HERE
\`\`\`

**\`api.ts\`**
\`\`\`typescript
// PASTE THE FULL CONTENT OF api.ts HERE
\`\`\`

**\`constants.ts\`**
\`\`\`typescript
// PASTE THE FULL CONTENT OF constants.ts HERE
\`\`\`
---
**Final Reminder: Your entire output must be a single zipped file named \`backend.zip\`.**
`