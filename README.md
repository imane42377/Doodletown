# Doodletown — Playful Learning for Curious Kids

A cheerful sketchbook-inspired landing page built with **plain Vite + React + TypeScript + Tailwind CSS v4** and Framer Motion animations.

## Quick start

```bash
bun install      # or: npm install / pnpm install
bun dev          # http://localhost:5173
bun run build    # production build into ./dist
```

## Signup form / email capture

The hero "Start learning — it's free!" form sends signups to an endpoint of your choice.

1. **Out of the box (no setup):** emails are saved to `localStorage` under the key `doodletown:signups` so you can demo the flow immediately. Open DevTools → Application → Local Storage to inspect.
2. **Connect a real backend:** create a `.env` file at the project root with:

   ```env
   VITE_FORM_ENDPOINT=https://formspree.io/f/your-id
   # or any endpoint that accepts JSON: { email, source }
   # e.g. Formspree, Web3Forms, Resend, your own /api/signup, etc.
   ```

   The form will POST `{ "email": "...", "source": "doodletown-landing" }` as JSON.

## Stack
- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Framer Motion (animations)
- Lucide React (icons)
