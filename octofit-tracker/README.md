# OctoFit Tracker

OctoFit Tracker is initialized as a multi-tier application:

- `frontend/`: React 19, Vite, Bootstrap, and React Router on port `5173`.
- `backend/`: Express and TypeScript API on port `8000`, with a starter health
  endpoint at `/api/health`.
- MongoDB: Mongoose data access is configured for `mongodb://localhost:27017/octofit_db`
  by default; set `MONGODB_URI` to override the connection string.

Run either development server from the repository root:

```bash
npm run dev --prefix octofit-tracker/frontend
npm run dev --prefix octofit-tracker/backend
```

Build the backend with `npm run build --prefix octofit-tracker/backend`.
