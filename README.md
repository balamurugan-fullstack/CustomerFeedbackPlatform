# Acowale CRM Machine Test by Balamurugan N

A lightweight customer feedback platform where users can submit feedback and administrators can analyze trends through a secure dashboard.

## Live Demo

Frontend: https://customer-feedback-platform-nine.vercel.app/

Backend API: https://customerfeedbackplatform.onrender.com/api

GitHub Repository: https://github.com/balamurugan-fullstack/CustomerFeedbackPlatform

---

# Features

## Public Feedback Portal
- Submit customer feedback
- Select a feedback category
- Add detailed comments
- Client-side and server-side validation
- Success and error notifications

## Admin Dashboard
- Secure admin login
- Total feedback count
- Category-wise distribution
- Recent submissions
- Search and filtering
- Full feedback preview modal
- Health monitoring panel

## Backend APIs
- POST /api/feedback
- GET /api/feedback
- GET /api/analytics/summary
- POST /api/auth/login
- GET /api/health

---

# System Design

## High-Level Architecture

```text
+---------------------+
|   Public Users      |
+----------+----------+
           |
           v
+---------------------+
| React Frontend      |
| (Vercel)            |
+----------+----------+
           |
           v
+---------------------+
| Express API         |
| (Render)            |
+----------+----------+
           |
           v
+---------------------+
| MongoDB Atlas       |
+---------------------+
```

## Request Flow

1. User submits feedback from the frontend.
2. Frontend sends a POST request to the backend API.
3. Backend validates the payload using Zod.
4. Feedback is stored in MongoDB.
5. Analytics endpoints aggregate feedback data.
6. Admin dashboard fetches analytics and feedback lists.

---

# Technology Stack

## Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Hook Form
- Zod

## Backend
- Node.js
- Express
- TypeScript
- Mongoose
- JWT Authentication
- Winston Logging

## Database
- MongoDB Atlas

## Deployment
- Vercel (Frontend)
- Render (Backend)

---

# Production Readiness

Implemented:
- Environment variable validation
- Centralized error handling
- Request ID tracking
- Structured logging
- Rate limiting
- Health-check endpoint
- JWT-based admin authentication
- Basic unit tests

---

# Local Development

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

## Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs at: http://localhost:3000

---

# Environment Variables

## Backend (.env)

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=your_password
CORS_ORIGIN=http://localhost:5173
```

## Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

---

# API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/login | Admin login |
| POST | /api/feedback | Submit feedback |
| GET | /api/feedback | Fetch feedback |
| GET | /api/analytics/summary | Analytics summary |
| GET | /api/health | Health check |

---

# Admin Access

Use the credentials configured through environment variables.

---

# Engineering Notes

Additional engineering decisions are documented in:
- DECISIONS.md
- TEACH_US.md

---

# Future Enhancements

- Role-Based Access Control (RBAC)
- Email notifications
- CI/CD pipeline
- Advanced monitoring
- Real-time analytics updates
- Database indexing optimization

---

# Author

Balamurugan N
Software Engineer