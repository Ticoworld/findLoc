# Backend (Express + MongoDB) - Scaffold

This backend scaffolds MongoDB integration for users, preferences, locations (nodes), pathways (edges), route history, and best-route caching.

Notes:
- Do NOT commit real credentials. Use `.env` locally.
- The frontend currently uses local config. You can switch `campusGraphService` to fetch from this API later.

## Quick start

1) Create `.env` in `server/`:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=change_this_secret
PORT=4000
# Optional: SMTP (Gmail App Password recommended)
# If using Gmail, set:
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=465
# SMTP_SECURE=true
# SMTP_USER=youraddress@gmail.com
# SMTP_PASS=your_app_password
# EMAIL_FROM="AE-FUNAI Navigator <youraddress@gmail.com>"
# Allow CORS from frontend
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=youraddress@gmail.com
```

2) Install dependencies and run dev server

```
npm install
node server/index.js
```

## Endpoints (initial)

- POST /auth/register
- POST /auth/login
- GET  /graph         (nodes + edges)
- POST /graph/nodes   (admin)
- POST /graph/edges   (admin)
- POST /routes/history
- GET  /routes/history
