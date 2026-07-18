# Product and engineering decisions

## Scope and product framing
- The project is framed as a customer feedback intelligence platform for capturing public feedback and reviewing it through an internal admin experience.
- The current implementation supports two main journeys: a public feedback submission flow and an admin dashboard for reviewing submissions, analytics, and system health.

## Frontend choices
- React + TypeScript + Vite + Tailwind were chosen to create a fast single-page experience with clear component boundaries.
- The public page focuses on a polished feedback submission experience with field validation, success feedback, and toast notifications.
- The admin experience is implemented as a protected area that exposes analytics cards, search/filter controls, a feedback table, and a health status panel.
- The feedback table includes a lightweight preview of each comment and a modal to display the full content without changing the rest of the dashboard layout.

## Backend choices
- Express + TypeScript provides the API layer for feedback submission, authentication, analytics, and health checks.
- Zod is used to validate environment values and request payloads so invalid input is handled predictably.
- Mongoose persists feedback documents to MongoDB, while the service layer handles retrieval, sorting, filtering, and pagination.
- Request ID tracking, structured logging, centralized error handling, and rate limiting are included to make the API more production-friendly.
- Health checks and internal monitoring endpoints are exposed in a way that reflects the current admin-protected workflow.

## Data and persistence
- Feedback records are stored in MongoDB through Mongoose models and are returned as paginated lists to the admin interface.
- The admin dashboard can filter feedback by search term, category, and sorting order, then render aggregated analytics for review.
- The current implementation favors a simple and maintainable persistence model over a more complex event-driven architecture.

## Operational trade-offs
- The current system uses a lightweight token-based admin guard for local and demo-style usage rather than a full enterprise auth system.
- The implementation prioritizes clarity, speed of setup, and a realistic demo experience over full-scale identity integration or advanced observability.
- The health monitoring view is intentionally simple but useful for confirming that the API and database are reachable from the admin workspace.

## Future improvements
- Replace the lightweight admin token flow with a stronger identity provider and role-based access control.
- Add email delivery for new submissions and operational notifications.
- Expand automated regression coverage for analytics, feedback validation, and health endpoint behavior.
- Add deployment-oriented monitoring, CI checks, and richer production hardening.
