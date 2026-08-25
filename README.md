# Omlat — عملات

The exchange desk in your pocket. Live mid-market rates across 150+ currencies, gold, and silver.

Pick a region, choose your currency, then set where it's going. Omlat shows you an honest rate, instantly.

## Features

- Guided **region → currency** picker (no endless scrolling)
- Live rates with light/dark themes
- Mobile-friendly with a numeric keypad for amounts

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Vision benchmark

Open [http://localhost:3000/benchmark](http://localhost:3000/benchmark) for the marketplace vision lab (phone simulation + race mode).

Add your keys to `.env.local`:

```
FXRATES_API_KEY=your_key_here
OPENROUTER_API_KEY=your_key_here
```

The currency desk and `/benchmark` both send `Authorization: Bearer …` from the server so keys never go in the browser bundle. You can also paste an OpenRouter key on the benchmark page.

## Tech

Next.js · TypeScript · Tailwind CSS · next-themes
