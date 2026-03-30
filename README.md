# RepoSage Client

React + Vite frontend for RepoSage. This app handles GitHub login, repository browsing, indexing controls, and the chat UI for asking questions about indexed repositories.

## Features

- GitHub authentication flow
- Repository dashboard with index status
- Chat interface with source panel
- Dark/light theme toggle
- Toasts, error boundary, and animated UI surfaces
- Optional 3D background and avatar with reduced-motion and low-end-device fallback

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Environment

Create `client/.env`:

```env
# Local:
# VITE_API_URL=http://localhost:5000

# Production example:
VITE_API_URL=https://reposage-server.onrender.com
VITE_GITHUB_CLIENT_ID=your_github_oauth_app_client_id
```

## Notes

- The client expects the backend API to be available at `VITE_API_URL`.
- Current deployed backend: `https://reposage-server.onrender.com`
- Current deployed frontend: `https://reposage-github.vercel.app/`
- If the device is low-end or reduced motion is enabled, 3D visuals fall back to a lightweight CSS background.
- Production output is written to `client/dist`.
