# OctoFit Tracker frontend

The presentation tier uses React 19, Vite, Bootstrap, and React Router.

From the repository root, install dependencies and run the Vite development
server:

```bash
npm install --prefix octofit-tracker/frontend
npm run dev --prefix octofit-tracker/frontend
```

The frontend listens on port `5173`.

In GitHub Codespaces, define `VITE_CODESPACE_NAME` in
`octofit-tracker/frontend/.env.local` so the browser can reach the forwarded API:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

Vite reads this value at startup. Restart the development server after creating
or changing `.env.local`. When it is unset, the frontend uses
`http://localhost:8000`; `VITE_API_BASE_URL` can optionally override that local
fallback.

To create a production build or lint the frontend:

```bash
npm run build --prefix octofit-tracker/frontend
npm run lint --prefix octofit-tracker/frontend
```
