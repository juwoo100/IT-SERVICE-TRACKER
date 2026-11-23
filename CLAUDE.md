# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

IT Service Tracker: a ticketing app with two independent npm packages, `backend/` (Express 5 + Mongoose, ESM) and `frontend/` (React 19 + Vite + Tailwind 3, ESM). There is no root `package.json`; run commands from inside each package. The README describes the Figma design concept (palette `#FFBF00` amber / `#F2F0EF` background, Inter 16px base).

## Commands

Backend (`cd backend`):

- `npm run dev` — run with `node --watch` (auto-restart)
- `npm start` — run once
- Requires `backend/.env` (copy `.env.example`): `MONGO_URI`, `PORT` (default 5000), `JWT_SECRET` (server exits on startup if missing), `JWT_EXPIRES_IN` (default `1d`).
- `npm test` — Jest + supertest against an in-memory MongoDB (`mongodb-memory-server`); no `.env` or real DB needed. Jest runs in native ESM mode via `--experimental-vm-modules`.
  - Single file: `npm test -- tests/tickets.test.js`
  - Single test by name: `npm test -- -t "returns 404"`
  - `tests/setupEnv.js` sets test-only `JWT_SECRET`/`JWT_EXPIRES_IN`; `tests/setupDb.js` starts a fresh mongod per test file and wipes all collections after each test; `tests/helpers.js` has `registerUser()`, `auth(token)` and a `validTicket` fixture.

Frontend (`cd frontend`):

- `npm run dev` — Vite dev server
- `npm run build` / `npm run preview`
- `npm run lint` — ESLint (flat config in `eslint.config.js`)
- API base URL is read from `import.meta.env.VITE_API_BASE_URL` (falls back to `http://localhost:5000`).

The frontend has no test suite.

## Architecture

**Backend request flow** (`backend/app.js`): `cors()` → `express.json()` → routes → 404 handler → error handler (maps JSON parse failures to 400, else 500). `app.js` only builds and exports the app (tests import it directly); `server.js` loads `.env`, checks `JWT_SECRET`, and calls `app.listen()` only after `connectDB()` (`db.js`) succeeds.

- `/auth` (`routes/authRoutes.js`): `POST /register`, `POST /login` return `{ token, user }`; `GET /me` returns the current user. JWT payload is `{ id }`.
- `/tickets` (`routes/ticketRoutes.js`) is mounted behind `middleware/requireAuth.js`, which verifies the `Authorization: Bearer <token>` header, loads the user from the DB, and sets `req.user`.
- Ticket routes whitelist writable fields via `pickFields` (`CREATE_FIELDS` / `UPDATE_FIELDS`); `username` and `createdBy` are always taken from `req.user`, never the request body. A `router.param("ticketId")` hook rejects invalid ObjectIds with 400. Mongoose `ValidationError` → 400 via `handleError`. Updates use `runValidators: true`.
- Tickets are currently not scoped per user: any authenticated user can list/read/update/delete all tickets.

**Models** (`backend/models/`):

- `Ticket`: enums `status` (`open|in_progress|closed`), `category` (`general|hardware|software|network|account|other`), `reportTo` (`admin|support`); `createdBy` refs `User`; timestamps on.
- `User`: password is `select: false` and hashed in a pre-save hook (bcrypt, 10 rounds) — use `.select("+password")` before calling `comparePassword`. `toJSON` strips `password` and `__v`, so returning a user document in a response is safe. Login wraps inputs in `String()` to block NoSQL operator injection; keep that pattern for any query built from request input.

**Frontend**:

- All HTTP goes through `src/api/ticketAPI.js` `request()`, which attaches the bearer token from `localStorage.token` and throws an `Error` carrying the backend's `message` on non-2xx responses. Add new endpoints there rather than calling `fetch` directly.
- Auth state lives only in `localStorage` (`token`, `username`), set/cleared in `components/Login.jsx`. There is no auth context or route guard; components read `localStorage` directly.
- Routes are defined in `src/App.jsx` (`/`, `/dashboard`, `/login`, `/new`, `/tickets/:ticketId`). `TicketForm` uses `react-hook-form`.
- When adding ticket fields or enum values, update the Mongoose schema, the `CREATE_FIELDS`/`UPDATE_FIELDS` whitelists, and the frontend form/detail components together.

## Working rules

- Make small, focused changes: one feature or fix at a time. If a change touches more than 2 - 3 files, show me a plan first and wait for approval.
- For new features, read the spec in `docs/specs/` first. If something isn't in the spec, ask instead of guessing.
- Run tests before saying a task is done, and add or update tests for every backend change.
- Never read, print, or edit `.env` files. Use `.env.example` for reference.
- Don't add new npm packages without asking me.
- Flag any change to auth ot security code (`requireAuth.js`, `User` model, password or token handling) so I review it line by line.
- Keep wrapping request input in `String()` for any database query.
