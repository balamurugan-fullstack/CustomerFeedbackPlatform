# DECISIONS.md

## Project
**Acowale CRM Machine Test by Balamurugan N**

---

## 1. Why did you choose this technology stack?

I chose **React + TypeScript + Vite** for the frontend and **Node.js + Express + TypeScript** for the backend.

### Reasons
- Strong type safety across the application
- Fast development experience with Vite
- Reusable component architecture in React
- Lightweight and flexible API development with Express
- Easy deployment on Vercel and Render

---

## 2. Why did you choose this database?

I selected **MongoDB Atlas**.

### Reasons
- Feedback data is naturally document-oriented
- Flexible schema for future feature additions
- Quick setup for a cloud-hosted production environment
- Good integration with Mongoose

---

## 3. Why did you structure your application this way?

The application is separated into **frontend** and **backend** folders.

### Backend structure
- `routes/` → API endpoints
- `controllers/` → Request handling
- `services/` → Business logic
- `models/` → Database schemas
- `middleware/` → Authentication, validation, logging, rate limiting
- `utils/` → Shared helpers

This keeps responsibilities isolated and makes the codebase easier to maintain.

---

## 4. What trade-offs did you make due to time constraints?

- Implemented a lightweight JWT-based admin authentication flow
- Kept monitoring and observability simple
- Added focused unit tests instead of broad test coverage
- Prioritized deployment stability over advanced infrastructure automation

---

## 5. What would you improve if you had one more week?

- Role-Based Access Control (RBAC)
- Email notifications for new feedback
- More comprehensive automated tests
- CI/CD pipeline with GitHub Actions
- Better observability and monitoring dashboards
- Database indexing optimization

---

## 6. What was the most difficult technical challenge you faced?

The most difficult challenge was configuring deployment across:
- Render (backend)
- Vercel (frontend)
- MongoDB Atlas (database)

while ensuring environment variables, CORS, authentication, and production builds worked correctly together.

---

## 7. Which AI tools did you use?

- ChatGPT
- GitHub Copilot
- Cursor AI

---

## 8. Share one instance where AI helped you.

AI helped me troubleshoot deployment issues related to:
- MongoDB Atlas connection configuration
- Render environment variables
- Frontend-to-backend API integration

---

## 9. Share one instance where you disagreed with AI and why.

AI initially suggested that the Render root directory configuration was incorrect. After reviewing the deployment settings and build logs, I determined that the actual issue was related to dependency installation and TypeScript type resolution, so I followed a different debugging path.

---

## 10. What would break first if this application suddenly had 100,000 users?

The first bottleneck would likely be:
1. Database query performance for analytics aggregation
2. API rate limits
3. Dashboard read operations

I would address this with indexing, caching, pagination, and precomputed analytics.

---

## 11. What is one thing in this assignment that you would improve, change, or challenge?

I would add a requirement for **real-time analytics updates or asynchronous processing** so candidates can demonstrate event-driven architecture, queue-based workflows, and scalability decisions.

---

# Additional Engineering Decisions

## Frontend UX Decisions
- Added toast notifications for success and error feedback
- Included search and filtering for admin productivity
- Used a modal for full feedback comments to keep the dashboard compact
- Added health monitoring inside the admin dashboard for operational visibility

## Production Readiness Decisions
- Environment variable validation using Zod
- Centralized error handling middleware
- Request ID tracking
- Structured logging
- Rate limiting
- Health-check endpoint
- JWT authentication for admin access

## Deployment Decisions
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

This separation keeps the frontend globally accessible while allowing the backend and database to scale independently.