# Sithuruwana Tyre Mart - Backend API

Backend server for the Sithuruwana Tyre Mart application.

## Setup Instructions

### 1. Install Dependencies

```bash
cd C:\Users\User\Desktop\STM\backend
npm install
```

### 2. Configure Environment Variables

The `.env.local` file is already configured with:
- MongoDB connection string
- JWT secret
- Backend port (5000)
- Admin credentials

### 3. Start MongoDB

Make sure MongoDB is running on your system:
```bash
# If using MongoDB locally, start it
mongod
```

### 4. Run the Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

The backend server will run on **http://localhost:5000**

## Available Endpoints

- `GET /` - API information
- `GET /api/health` - Health check

## Project Structure

```
backend/
├── app/
│   └── api/          # API routes (Next.js format - needs conversion)
├── models/           # Mongoose database models
├── validators/       # Zod validation schemas
├── scripts/          # Database seeding scripts
├── lib/
│   ├── db.ts        # Database connection
│   └── auth.ts      # Authentication utilities
├── server.ts        # Express server entry point
├── package.json     # Dependencies
├── .env.local       # Environment variables
└── tsconfig.json    # TypeScript configuration
```

## Next Steps

The backend server is set up with basic Express configuration. To fully integrate the API routes:

1. Convert Next.js API routes to Express routes
2. Create route handlers for each endpoint
3. Update frontend to call backend API URL

## Seeding Database

To populate the database with initial data:

```bash
npm run seed
```
