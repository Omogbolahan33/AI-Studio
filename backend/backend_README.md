# AI Studio Backend

## Prerequisites
- Node.js (>=18)
- PostgreSQL (installed and running)
- Yarn or npm

## Setup

1. Copy `.env.example` to `.env` and fill in your PostgreSQL and JWT credentials.
2. Run `npm install` in `/backend`.
3. Create the database specified in `.env`.
4. Run `npm run dev` to start the server.

## Structure

- `src/models/` - Sequelize models for DB tables
- `src/controllers/` - Request logic for each entity
- `src/routes/` - API endpoints
- `src/middleware/` - Auth, permissions, etc.
- `src/utils/` - DB connection, helpers

## API

See route files in `src/routes/` for all available endpoints.