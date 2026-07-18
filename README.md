# Customer Feedback Platform

This project includes:
- A public feedback submission route at `/`
- An admin dashboard route at `/admin` intended for internal review workflows
- Internal health monitoring at `/health` that now requires admin authorization
- A backend API with validation, logging, health checks, rate limiting, and request IDs
- Render deployment configuration via [render.yaml](backend/render.yaml)
- An engineering decision log in [DECISIONS.md](DECISIONS.md)

## Run locally

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```
