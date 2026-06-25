# forge-ai-hq — Agent Instructions

Top-of-funnel lead generation tool for [aioperator.ceo](https://aioperator.ceo). Users take a 12-question AI readiness assessment, receive a scored tier result, and can submit their email to get a personalized score report. The tool feeds leads into the AI Operator Platform curriculum.

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
- API key in `.env.local` as `RESEND_API_KEY` (also set in Vercel env vars)
- `FROM` address: controlled by `EMAIL_DOMAIN_VERIFIED` env var:
  - `true` → `support@aioperator.ceo` (verified domain in Resend dashboard)
  - unset/false → `onboarding@resend.dev` (Resend sandbox fallback)
- Three emails sent on lead capture: score report (immediate), Day 2 drip, Day 4 drip
- Email templates live in `src/lib/email-templates.ts`

### Notion (Leads DB)
- DB ID: `48a9ad6e-416d-4e58-bc69-30ce6a0b70dc` (Assessment Leads)
- API key in `.env.local` as `NOTION_API_KEY` (also set in Vercel env vars)
- `capture-lead/route.ts` logs every lead to Notion non-blocking
- `api/leads/route.ts` queries Notion to serve the admin dashboard

### Admin Dashboard
- Protected by `ADMIN_TOKEN` env var (check `x-admin-token` header)
- UI at `/admin` — reads from Notion via `GET /api/leads`

### Paddle
- Not yet wired — do not add Paddle client-side scripts until a paywall feature is scoped
- `/action-plan` page currently has a placeholder; replace with trial CTA → `https://aioperator.ceo/auth`

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
    dashboard/
      page.tsx            # Post-quiz dashboard (tier, tracks, milestones, action plan CTA)
    action-plan/
      page.tsx            # Placeholder — replace Paddle checkout with trial CTA
    admin/
      page.tsx            # Token-protected leads dashboard (reads from Notion)
    api/
      capture-lead/
        route.ts          # POST — sends score report + Day 2/4 drip emails; logs to Notion
      leads/
        route.ts          # GET — token-protected; queries Notion Assessment Leads DB
  components/
    site-header.tsx       # Nav component
    ui/                   # shadcn/ui components (do not hand-edit)
  lib/
    quiz.ts               # Questions, tiers, scoring logic — source of truth
    email-templates.ts    # buildScoreReport, buildDripDay2, buildDripDay4
    utils.ts              # cn() helper
```

---

## Routing

| Route | Description |
|---|---|
| `GET /` | Landing page |
| `GET /quiz` | 12-question assessment (client-rendered) |
| `GET /results?score=N` | Score results + email capture |
| `GET /dashboard` | Post-quiz dashboard |
| `GET /action-plan` | Placeholder — pending trial CTA replacement |
| `GET /admin` | Token-protected leads dashboard |
| `POST /api/capture-lead` | Sends score report + drip emails; accepts `{ email, score, tier }` |
| `GET /api/leads` | Returns all leads from Notion (requires `x-admin-token` header) |
| `POST /api/paddle-webhook` | Paddle event handler (stub — inert until `PADDLE_WEBHOOK_SECRET` is set) |

Score is passed as a URL param (`/results?score=18`) — no localStorage, no context.

---

## Scoring System

Defined in `src/lib/quiz.ts`. Do not change without updating all four tiers.

- 12 questions × 3 points max = **36 point maximum**
- 4 tiers: AI Explorer (0–9), AI Practitioner (10–18), AI Operator (19–27), AI Commander (28–36)
- Each tier has: `name`, `tagline`, `description`, `nextStep`, `accent` (Tailwind bg class)

---

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `RESEND_API_KEY` | `.env.local` + Vercel | Resend email API authentication |
| `EMAIL_DOMAIN_VERIFIED` | `.env.local` + Vercel | `"true"` → send from `support@aioperator.ceo` |
| `NOTION_API_KEY` | `.env.local` + Vercel | Notion integration — logs leads to Assessment Leads DB |
| `ADMIN_TOKEN` | `.env.local` + Vercel | Protects `GET /api/leads` and `/admin` page |

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
