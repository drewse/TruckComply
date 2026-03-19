---
name: TruckComply project context
description: Full MVP SaaS for Canadian trucking compliance built from scratch
type: project
---

TruckComply is a Canadian trucking compliance SaaS built with Next.js App Router, Supabase, Stripe.

**Why:** Acquire users via SEO (high-intent pages), convert to paying customers, manage compliance via dashboards.

**Business model:**
- One-time setup fee: $149 CAD
- Monthly subscription: $39 CAD/month

**Tech stack:** Next.js 16, TypeScript, Tailwind CSS, Supabase (auth+db+storage), Stripe, React Hook Form + Zod

**Structure:**
- `app/(marketing)/` — Public SEO pages (/, /cvor-ontario, /start-trucking-canada, /checkout)
- `app/app/` — Customer dashboard (/app, /services, /documents, /billing, /settings)
- `app/admin/` — Admin dashboard (/admin, /customers, /orders, /tasks, /partners, /billing)
- `app/partner/` — Partner dashboard (/partner, /completed, /settings)
- `app/api/` — API routes (checkout, billing, webhooks)
- `components/ui/` — Button, Card, Badge, Input, Select, Dialog, Tabs, etc.
- `components/marketing/` — Navbar, Footer, StickyCTA, PricingCards
- `components/dashboard/` — Sidebar, StatusBadge
- `lib/` — supabase client/server, stripe, utils
- `supabase/migrations/` — Full DB schema with RLS
- `supabase/seed.sql` — Sample data

**How to apply:** This is the primary project in this workspace. All future work relates to this codebase.
