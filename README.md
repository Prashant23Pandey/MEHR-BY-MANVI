# Pear replica

A Next.js recreation of the Pear scroll experience, with a working application form, SQLite or hosted libSQL/Turso storage, rate limiting, optional Turnstile verification, and optional webhook delivery.

## Requirements

- Node.js 22.5 or newer (uses `node:sqlite`)
- npm

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production

### Vercel + Turso

1. Create a Turso database and set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`
   in the Vercel project environment variables.
2. Set `IP_HASH_SALT`, both Turnstile keys, and optionally
   `APPLICATION_WEBHOOK_URL`.
3. Run `npm run db:init` with the production Turso variables to create the
   schema.
4. Deploy. Vercel builds and runs the Next.js app automatically.

When `TURSO_DATABASE_URL` is set, the app uses the hosted database and ignores
`DATABASE_PATH`.

### Docker/VPS with SQLite

1. Set the environment variables below.
2. Point `DATABASE_PATH` at a persistent volume and run `npm run db:init`.
3. Run `npm run build` and start with `npm start`.

SQLite requires a persistent filesystem. On serverless platforms, use Turso or
another hosted database instead of the local SQLite path.

## Scripts

- `npm run dev` - development server
- `npm run build` - production build
- `npm start` - production server
- `npm run lint` - ESLint
- `npm run typecheck` - TypeScript check
- `npm run db:init` - create the SQLite/Turso database schema
- `npm run db:seed` - insert sample applications
- `npm run db:list` - list recent applications

## Environment

Copy `.env.example` to `.env.local` for local development. Database scripts load
`.env.local` and `.env` automatically; platform environment variables take
precedence.

- `TURSO_DATABASE_URL` - hosted libSQL/Turso database URL; enables remote mode
- `TURSO_AUTH_TOKEN` - Turso authentication token
- `DATABASE_PATH` - local SQLite file path; ignored when Turso is configured
- `IP_HASH_SALT` - random secret used for hashed IP rate limiting
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` - Cloudflare Turnstile site key
- `TURNSTILE_SECRET_KEY` - Cloudflare Turnstile secret key
- `APPLICATION_WEBHOOK_URL` - optional webhook for new applications

Set both Turnstile keys to enable verification, or leave both blank to disable
it. Set `IP_HASH_SALT` to a random value in production. The application endpoint
is `POST /api/apply`.

## Troubleshooting

On Windows, OneDrive or antivirus scans can lock `.next` during a build. Stop any
running dev server, remove `.next`, and run `npm run build` again.

Node prints an experimental warning for `node:sqlite`; this is expected.

## Structure

- `src/app` - App Router pages, metadata, global styles, and API route
- `src/components` - scene and UI components
- `src/hooks` - scroll progress handling
- `src/lib` - content, timeline, utilities, and database helpers
- `db` - SQLite schema and seed data
- `public` - fonts, films, posters, favicons, and artwork
