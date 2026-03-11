
# Web-Game-test

This project now runs as a Next.js App Router site that is ready to deploy on Vercel.

## Development

Install dependencies and start the local server:

```bash
npm install
npm run dev
```

## Routing model

- The homepage renders from a static catalog in `lib/game-data.js`.
- Each playable entry gets a slug route like `/vectoid-td`.
- The slug page uses one shared iframe layout instead of many duplicated HTML wrappers.

## Deploy on Vercel

1. Push this repository to GitHub.
2. Import the repo into Vercel.
3. Use the default Next.js build settings.
