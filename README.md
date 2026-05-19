# Proponiq — Smart Proposals, Bigger Wins

A working AI-powered proposal SaaS for freelancers, agencies and consultants — built with Next.js 15, Auth.js, Prisma + Neon Postgres, and Groq.

## What you can actually do

1. **Sign in with Google** at `/login` (first time → onboarding flow asking your user type, business, services)
2. **See your dashboard** at `/dashboard` (proposal counts + recent list)
3. **Click "New proposal"** → choose between:
   - **AI draft** — short brief (client, project, scope, budget, tone) → Groq generates in ~5 seconds
   - **From template** — 7 premium starter templates (brand identity, web design, SaaS MVP, SEO retainer, strategy, copywriting, blank)
4. **Edit** the result in a rich-text Tiptap editor with autosave
5. **Send by email** — one-click flow that publishes the share link and emails the client with a personalised note (via Resend)
6. **Track** when a client opens the proposal — status flips `SENT → VIEWED` and you get an email the first time it's opened
7. **Client signs** from the public link (typed signature + required email + consent checkbox + IP/UA audit) → status flips to `SIGNED`, you get a "🎉 signed" email, the signer gets a receipt
8. **Download as PDF** from the editor sidebar or the public share page — server-rendered, branded, paginated
9. **Upgrade to Pro / Agency** via real **Stripe** subscription checkout. Free plan caps at 5 proposals/month.
10. **Manage your subscription** through the Stripe Customer Portal from Settings
11. **Export everything as JSON** or **permanently delete your account** from Settings → Danger zone

## Tech stack

| Layer | Tool |
| --- | --- |
| Framework | Next.js 15 (App Router) + React 19 |
| Language | TypeScript strict |
| Styling | Tailwind CSS 3 + custom design tokens |
| Animation | Framer Motion |
| Auth | Auth.js v5 (NextAuth) + Google OAuth + Prisma adapter |
| Database | Neon Postgres + Prisma ORM |
| AI | Groq (`llama-3.3-70b-versatile` by default) |
| Editor | Tiptap (ProseMirror) |
| PDF | `@react-pdf/renderer` (server-side) |
| Billing | Stripe Checkout + Customer Portal + Webhooks |
| Email | Resend (transactional) |
| Validation | Zod |
| Toasts | Sonner |
| Icons | Lucide |
| Theming | next-themes (dark/light) |

## Setup

### 1. Install

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

You'll need:

| Variable | Where to get it |
| --- | --- |
| `DATABASE_URL` | Neon project dashboard → "Connection string" (use the **pooled** one with `-pooler` in the host) |
| `AUTH_SECRET` | Run `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google Cloud Console → APIs & Services → Credentials. Redirect URI: `http://localhost:3000/api/auth/callback/google` |
| `GROQ_API_KEY` | https://console.groq.com/keys |
| `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` + four `STRIPE_PRICE_*` | https://dashboard.stripe.com — create one product per plan (Pro & Agency) with a monthly + yearly price each, then copy the price IDs |
| `RESEND_API_KEY` + `EMAIL_FROM` | https://resend.com/api-keys (dev: `EMAIL_FROM="Proponiq <onboarding@resend.dev>"`) |

> **Graceful degradation.** Stripe and Resend are optional during development — if their env vars are missing, the UI falls back: pricing CTAs redirect to sign-up, the Send dialog returns a helpful error, and view/sign emails are skipped with a console warning. The rest of the app works.

### 3. Push the database schema

```bash
npm run db:push
```

This creates the tables (`User`, `Account`, `Session`, `Proposal`, `ProposalSignature`, `ProposalView`, plus billing fields on `User`) in your Neon database.

### 4. (Optional) Set up Stripe webhooks for local dev

If you want real subscription flows locally, install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The CLI prints a `whsec_...` value — copy it into `STRIPE_WEBHOOK_SECRET`. Leave that terminal open while testing checkout.

### 5. Run it

```bash
npm run dev
```

Open <http://localhost:3000>. The **marketing landing** is at `/`. Click **Start free** or **Sign in** → you'll be sent to `/login` → continue with Google → land on `/dashboard`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local dev server |
| `npm run build` | Generate Prisma client + build for production |
| `npm run start` | Run the production build |
| `npm run db:push` | Sync `prisma/schema.prisma` to the database |
| `npm run db:studio` | Open Prisma Studio (visual DB inspector) |
| `npm run db:generate` | Regenerate the Prisma client |

## Project layout

```
app/
  (marketing)/             Public marketing site
    page.tsx               Landing
  (app)/                   Authenticated app (auth-guarded layout)
    layout.tsx             Session check + app shell
    dashboard/page.tsx     Stats + recent proposals
    proposals/
      page.tsx             Full list
      new/page.tsx         AI brief form
      [id]/page.tsx        Tiptap editor + autosave
    settings/page.tsx
  login/page.tsx           Google sign-in
  p/[token]/page.tsx       Public share view (no auth)
  api/
    auth/[...nextauth]/      Auth.js handlers
    ai/draft/                POST → Groq proposal generation
    proposals/               GET / POST
    proposals/[id]/          GET / PATCH / DELETE
    proposals/[id]/pdf/      GET → server-rendered PDF
    proposals/[id]/send/     POST → email proposal to client
    proposals/from-template/ POST → create from a template
    p/[token]/track/         POST view-tracking pixel + first-view email
    p/[token]/sign/          POST → record e-signature + signed emails
    p/[token]/pdf/           GET → public PDF download
    stripe/checkout/         POST → start subscription checkout
    stripe/portal/           POST → open customer portal
    stripe/webhook/          POST ← Stripe webhook events
    onboarding/              POST → save profile after first sign-in
    account/export/          GET → JSON dump of all user data
    account/delete/          POST → permanent account deletion
  layout.tsx               Root (fonts, theme, metadata)
  globals.css              Tailwind + design tokens + .prose-proposal
  icon.webp                Favicon
  sitemap.ts / robots.ts
auth.ts                    Auth.js v5 config
middleware.ts              Route gate for /dashboard, /proposals, /settings
prisma/schema.prisma       DB schema (User, Account, Session, Proposal, ProposalView)
lib/
  db.ts                    Prisma singleton
  groq.ts                  Groq client
  proposal-ai.ts           Brief → Groq → ProseMirror JSON
  templates.ts             Starter proposal templates (7 categories)
  plans.ts                 Plan limits + Stripe price-ID mapping
  quota.ts                 Per-plan proposal quota check
  stripe.ts                Stripe SDK singleton
  email.ts                 Resend client + EMAIL_FROM helpers
  email-templates.ts       Sent / Viewed / Signed / Receipt HTML templates
  pdf/
    proposal-pdf.tsx       React-PDF document
    render.ts              Server-side render → Buffer
  utils.ts                 cn()
components/
  navbar.tsx               Marketing nav
  logo.tsx                 Brand mark
  theme-provider.tsx
  theme-toggle.tsx
  app/                     App-only components
    app-header.tsx         Dashboard nav with user menu
    proposal-card.tsx
    new-proposal-form.tsx  Brief form (calls /api/ai/draft)
    proposal-editor.tsx    Editor shell + autosave + share
    tiptap-editor.tsx      Tiptap with toolbar
    public-proposal-view.tsx
    track-view.tsx         Pixel that POSTs to /api/p/[token]/track
  sections/                Marketing sections (hero, features, pricing…)
  ui/                      Button, Input, Textarea, Label, Badge,
                           DropdownMenu, Toaster, Section
types/next-auth.d.ts       Augments Session.user with `id`
```

## Architecture notes

- **Route groups** (`(marketing)` and `(app)`) keep the public site and the dashboard on separate layout trees without changing URLs.
- **Middleware** does a cheap cookie check at the edge for `/dashboard`, `/proposals`, `/settings`; pages then re-verify with `auth()` server-side.
- **Database sessions** are used (not JWT) because they pair cleanly with the Prisma adapter and let us revoke sessions later.
- **AI generation** returns a JSON payload that's converted to **ProseMirror JSON** before being stored. Tiptap hydrates the same JSON for editing and for the public read-only view — single source of truth.
- **Autosave** debounces field + content changes by 800ms and PATCHes `/api/proposals/[id]`.
- **View tracking** fires once per browser session (via `sessionStorage`) so the owner refreshing a public link doesn't inflate counts.

## Production deploy (recommended path)

1. Push to GitHub.
2. Import the repo into [Vercel](https://vercel.com).
3. Add all env vars from `.env.local` to the Vercel project.
4. **Add `https://YOUR-DOMAIN/api/auth/callback/google`** to your Google OAuth client's authorized redirect URIs.
5. Set `NEXTAUTH_URL=https://YOUR-DOMAIN` in Vercel.
6. Deploy. Run `npx prisma db push` once against the production `DATABASE_URL` (or set up Prisma migrate).

## What's not built yet (Phase 4+)

- Clients as first-class records (`/clients` page)
- AI assistant inside the editor (select → improve / tighten / expand)
- Smart automated follow-ups (drip sequences after N days unread)
- CRM integrations (HubSpot, Pipedrive)
- Team/agency seats and roles
- Custom branding (logo upload, brand colors per workspace)
- White-label proposal links + custom domains
- Image uploads + file attachments inside proposals
- Proposal versioning + diff viewer
- Variables (`{{client.name}}`, `{{date}}`) in templates

The current build is a working **commercial product** — a real freelancer can sign in, draft a proposal with AI, edit it, send it by email, have the client read & e-sign it, get notified on every interaction, download a branded PDF, pay for a subscription, manage that subscription, and export or delete their data.

## License

Proprietary / demo. © Proponiq.
