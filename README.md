# Desk Mate — AI Productivity Dashboard

Three AI tools in one dashboard: Smart Email Generator (`/email`), Meeting Notes Summarizer (`/meetings`), AI Research Assistant (`/research`), plus Home and Help & Responsible AI pages.

## Install & run
```
bun install
bun run dev
```

## Configuration
AI calls run server-side in `src/routes/api/generate.ts` → `src/lib/ai.server.ts` via Lovable AI Gateway.
The key `LOVABLE_API_KEY` is read only on the server (never exposed to the browser).
Prompts and input validation live in `src/lib/prompts.ts`.

## Testing
`bunx vitest run`. Manual: POST `/api/generate` with `{"tool":"meeting","notes":"..."}`.

## Deploy
Click Publish in Lovable.
