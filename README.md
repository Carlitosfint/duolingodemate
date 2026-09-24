<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/de1470c1-bbae-45b8-9a1a-c09c77e8d10b

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app (a local embedded PostgreSQL database is created automatically):
   `npm run dev`
3. Open `http://localhost:3000`. Firebase credentials are still required to
   sign in. For AI features, copy `.env.example` to `.env.local` and set
   `GEMINI_API_KEY`. A deployed/production instance must configure `SQL_*`.

## Checks

The same three that CI runs on every push:

```
npm run lint   # TypeScript
npm test       # unit tests, plus database tests on an in-memory Postgres
npm run build
```

## Database changes

The schema lives in `src/db/schema.ts`. After pulling changes that touch it,
apply them to the production database (Supabase) before deploying:

```
npm run db:push
```

The local embedded database adds new columns by itself on startup.
