# Mobile Shop POS

An offline-first point-of-sale app for mobile phone and accessories shops. This workspace adapts [Olgax POS](https://github.com/OLGAX-com/olgax-pos) and its MIT-licensed code for the product in [mobile-shop-pos-roadmap.md](mobile-shop-pos-roadmap.md).

The app lives in [`olgax-pos/`](olgax-pos/). It supports English, Arabic, and Sorani Kurdish, including right-to-left layout. The upstream MIT license and copyright notice are preserved in [`olgax-pos/LICENSE`](olgax-pos/LICENSE).

## Run locally

Requirements: Node.js 20+, pnpm 9+, and PostgreSQL 14+.

```bash
cd olgax-pos
pnpm install
cp .env.example .env
```

Set `DATABASE_URL`, `BETTER_AUTH_SECRET` (at least 32 characters), and `BETTER_AUTH_URL` in `.env`, then run:

```bash
pnpm db:migrate
pnpm dev
```

Open `http://localhost:3000` and follow the setup wizard. See [`olgax-pos/docs/getting-started.md`](olgax-pos/docs/getting-started.md) for Docker and deployment details.