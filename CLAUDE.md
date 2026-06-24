# forge-ai-hq — Agent Instructions

Top-of-funnel lead generation tool for [aioperator.ceo](https://aioperator.ceo). Users take an 8-question AI readiness assessment, receive a scored tier result, and can submit their email to get a personalized score report. The tool feeds leads into the AI Operator Platform curriculum.

Live at: **https://assess.aioperator.ceo**

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript, `src/` directory) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (installed via `npx shadcn@latest add`) |
| Email | Resend API (direct `fetch`, no SDK) |
| Payments | Paddle (for future upgrade flows) |
| Hosting | Vercel |
| Path alias | `@/*` → `src/*` |

**React version:** 19  
**Node target:** 24.x (set in Vercel project)

---

## Services & Integrations

### Resend
- API key in `.env.local` as `RESEND_API_KEY`
- Also set in Vercel env vars (production + preview)
- `FROM` address: `support@aioperator.ceo` — requires `aioperator.ceo` to be verified as a domain in the Resend dashboard
- Until the domain is verified, use `onboarding@resend.dev` as a fallback
- Email logic lives in `src/app/api/capture-lead/route.ts`

### Paddle
- Used to collect payment for any future paid features or upgrade flows
- Not yet integrated in this codebase — add when building a paywall

### Vercel
- Project: `forge-ai-hq` (team: lzglow)
- Production domain: `assess.aioperator.ceo`
- GitHub auto-deploys: every push to `main` triggers a production deployment
- Project ID: `prj_0Lpp3wQhXpS720R5EV1BlSqAT3My`

### GitHub
- Repo: `github.com/lzglow/forge-ai-hq`
- Branch: `main` (deploy branch)

### Lovable.ai
- This project is also maintained via [Lovable.ai](https://lovable.dev)
- Lovable syncs directly with the GitHub repo
- When making manual edits outside Lovable, pull before pushing to avoid conflicts
- Do not rename or restructure files in ways that break Lovable's sync assumptions

---

## Project Structure

```
src/
  app/
    layout.tsx            # Root layout — metadata, dark class, body font
    page.tsx              # Landing page — hero, stats, tier preview
    globals.css           # Tailwind imports + CSS variables
    quiz/
      page.tsx            # Interactive quiz (client component)
    results/
      page.tsx            # Server wrapper with Suspense
      results-client.tsx  # Score display, email capture form (client)
    api/
      capture-lead/
        route.ts          # POST — sends score report email via Resend
  components/
    ui/                   # shadcn/ui components (do not hand-edit)
  lib/
    quiz.ts               # Questions, tiers, scoring logic — source of truth
    utils.ts              # cn() helper
```

---

## Routing

| Route | Description |
|---|---|
| `GET /` | Landing page |
| `GET /quiz` | 8-question assessment (client-rendered) |
| `GET /results?score=N` | Score results + email capture |
| `POST /api/capture-lead` | Sends score report email; accepts `{ email, score, tier }` |

Score is passed as a URL param (`/results?score=18`) — no localStorage, no context.

---

## Scoring System

Defined in `src/lib/quiz.ts`. Do not change without updating all four tiers.

- 8 questions × 3 points max = **24 point maximum**
- 4 tiers: AI Explorer (0–6), AI Practitioner (7–12), AI Operator (13–18), AI Commander (19–24)
- Each tier has: `name`, `tagline`, `description`, `nextStep`, `accent` (Tailwind bg class)

---

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `RESEND_API_KEY` | `.env.local` + Vercel | Resend email API authentication |

Never commit `.env.local`. It is gitignored via `.env*`.

---

## Commands

```bash
npm run dev       # Start dev server at localhost:3000
npm run build     # Production build
npm run lint      # ESLint
npx shadcn@latest add <component>   # Add a shadcn component
```

---

## Architecture Rules

1. **Quiz logic is the source of truth in `src/lib/quiz.ts`** — scoring, tiers, and copy all live there. The UI reads from it; never hardcode tier names or score ranges in components.
2. **No API client libraries for Resend** — use direct `fetch` to `https://api.resend.com/emails`. Keeps the bundle small.
3. **Client components are opt-in** — only add `"use client"` when you need browser APIs (useState, useRouter, useSearchParams). Pages that can be server components should stay server components.
4. **shadcn components are generated** — run `npx shadcn@latest add` to add new ones. Do not hand-edit files in `src/components/ui/`.
5. **Score passes through the URL** — `/results?score=N` is the contract between quiz and results. Do not change this to localStorage or context without a clear reason.
6. **Lovable.ai also edits this repo** — always `git pull` before making changes to avoid diverging from Lovable's last sync.
7. **Paddle is not yet wired** — do not add Paddle client-side scripts until a paywall feature is scoped. Keep the codebase clean until then.

---

## Definition of Done

- [ ] `npm run build` passes with no errors
- [ ] `npm run lint` passes clean
- [ ] Quiz flows end-to-end: landing → quiz → results → email sent
- [ ] Email delivers to inbox (test with a real address before shipping)
- [ ] No secrets committed (check `.env.local` is gitignored)
- [ ] Pushed to `main` and Vercel deploy completes green
