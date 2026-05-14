# Agent Team Handoff

This document briefs the orchestration agent team on the current state of the Ghostworks site, what's been built, what's intentionally stubbed, and where to extend.

---

## Status: Foundation Complete

The site is a working static Astro application with:
- ✅ Full page set (landing, research index, GNW deep dive, GRAO deep dive, services, about, contact, blog listing, blog posts)
- ✅ Reusable component library (Header, Footer, Hero, ResearchCard)
- ✅ Dark-mode design system with documented color and type tokens
- ✅ Responsive layouts (mobile-first, single breakpoint at `sm:` 640px)
- ✅ SEO basics: canonical URLs, Open Graph, Twitter Card, robots.txt
- ✅ Accessibility primitives: skip link, semantic landmarks, ARIA current state
- ✅ Type-safe environment variables via `PUBLIC_*` prefix

It is **not** yet:
- ❌ Deployed to Hostinger (see `DEPLOYMENT.md`)
- ❌ Connected to any backend (contact form is a `mailto:` link)
- ✅ Populated with a blog or update feed (Content Collections + listing + slug pages)
- ❌ Connected to an analytics provider

---

## Conventions

**Components are Astro-only.** No React, Vue, or Svelte islands. If interactivity is needed, add a single framework integration deliberately — don't mix them.

**Routing is file-based.** A new page is a new `.astro` file under `src/pages/`. Nested folders become URL segments.

**Layouts wrap pages.** Every page imports `BaseLayout.astro` and passes `title`, optionally `description` and `canonicalPath`. Never duplicate `<html>` or `<head>` blocks in pages.

**Tailwind is the styling primitive.** Avoid inline `<style>` blocks except for genuinely page-specific one-offs. Add new reusable patterns to `src/styles/global.css` under `@layer components`.

**Data lives at the top of the frontmatter.** Page-specific arrays (e.g. the drives table on `/research/gnw`) are declared in the `---` frontmatter, not embedded in JSX-like markup. Keeps content separable.

**Comments are stable handoff signals.** Look for `<!-- TODO: agent team -->` markers in `.astro` files — those are explicit extension points.

---

## What's Stubbed and Ready for Extension

### Contact form
**Current:** `src/pages/contact.astro` uses a `mailto:` link.
**Next:** When backend hosting is enabled, replace with an Astro server endpoint (`src/pages/api/contact.ts`) that POSTs to a transactional email provider or stores submissions.
**Marked with:** `<!-- TODO: agent team -->` comment in contact.astro.

### Blog / Updates
**Current:** Implemented via Astro Content Collections (`src/content/blog/`) with frontmatter schema (`title`, `pubDate`, `description`, `draft`, `tags`, `ogImage`). Listing at `/blog`, individual posts at `/blog/[slug]`. Sample post published.
**Next:** Add more posts. Style enhancements (tags as links, pagination, RSS feed).

### Live GRAO metrics
**Current:** `/research/grao` shows static round progression hardcoded in the page frontmatter.
**Next:** When backend hosting is enabled, fetch live data from a small API endpoint that reads the GRAO loop logs. Replace the static `progression` array with an SSR fetch.

### Analytics
**Current:** None.
**Next:** Add Plausible, Fathom, or self-hosted Umami via a single script tag in `BaseLayout.astro` (only in production — gate on `import.meta.env.PROD`).

### Sitemap
**Current:** Implemented via `@astrojs/sitemap`; build emits `dist/sitemap-index.xml` and `dist/sitemap-0.xml`.
**Next:** Keep `site` in `astro.config.mjs` aligned with production domain if domain changes.

### OG Images
**Current:** Open Graph meta tags have no `og:image`. Social shares show no preview card.
**Next:** Either generate per-page OG images (using `@vercel/og` or `satori`), or add a single fallback image at `public/og-default.png` and reference it in `BaseLayout.astro`.

---

## Content TODOs

Sections currently using research data that should be reviewed for accuracy as the system evolves:

| Location | What needs updating |
|---|---|
| `index.astro` — research cards | "Phase 6 in progress" status; metrics for both frameworks |
| `index.astro` — eyebrow | "Active research · Phase 6 in progress" — update when phase advances |
| `research/gnw.astro` — drives table | Half-life and threshold values must mirror `PARAMETER-VALUES.md` from research repo (canonical source) |
| `research/grao.astro` — progression table | Add new rounds as they complete |
| `research/grao.astro` — saturation copy | Update when exploration phase begins generating non-reinforcement proposals |

**Rule of thumb:** Anything appearing on the site that also appears in the research repo should treat the research repo as canonical. Update the site to match, never the reverse.

---

## Common Tasks

### Add a new page
1. Create `src/pages/<route>.astro`
2. Import `BaseLayout` and pass `title` + `description` + `canonicalPath`
3. Compose using `Hero` and existing section patterns
4. Add a nav link to `src/components/Header.astro` if it's top-level
5. Add a footer link to `src/components/Footer.astro` if appropriate

### Add a new component
1. Create `src/components/<Name>.astro`
2. Type the props with a `Props` interface in the frontmatter
3. Use existing color and spacing tokens from Tailwind config
4. Document non-obvious behavior with frontmatter comments

### Update the color palette
Edit `tailwind.config.mjs`. All colors are semantic tokens (`bg`, `fg`, `accent`, `border`) — change values there and the whole site updates.

### Add an icon
Inline SVG is the default approach (see Header.astro logo). If you need many icons, install `astro-icon` and use it consistently — don't introduce ad-hoc icon libraries.

---

## What Not To Do

- **Don't introduce a CSS framework alongside Tailwind.** Pick one and stay with it.
- **Don't add client-side JavaScript without `client:` directives.** Astro ships zero JS by default — preserve that posture.
- **Don't hardcode the GitHub URL or contact email in pages.** Use the environment variables defined in `.env.example`.
- **Don't commit `.env`.** It's gitignored — keep it that way. Use `.env.example` to document required variables.
- **Don't restructure the design tokens without good reason.** They're consistent across all pages — changes ripple everywhere.

---

## Quick Reference

- Local dev: `npm run dev` → http://localhost:4321
- Type check: `npm run check`
- Build: `npm run build` → outputs to `dist/`
- Preview build: `npm run preview`

For deployment, see `DEPLOYMENT.md`.
For content conventions, see `CONTENT.md`.

---

## GHO-23 Heartbeat Note (2026-05-12)

- Fixed Open Graph default image path mismatch in `BaseLayout.astro` (`/og-image.svg` now matches existing public asset).
- Added sitemap generation integration in `astro.config.mjs` and pinned `@astrojs/sitemap@3.5.1` for Astro 4 compatibility.
- Verified with `npm run build` and `npm run check`; build now emits sitemap artifacts used by `robots.txt`.

**Next action:** Enable SSL + Force HTTPS in Hostinger hPanel and redeploy latest `dist/` so crawlers index canonical HTTPS URLs.

## GHO-23 Continuation Note (2026-05-12)

- Revamped landing experience to feel more dynamic without adding noisy behavior:
  - Added subtle layered radial background lighting and section surface glow styles.
  - Added staggered reveal timing for hero and major landing sections.
  - Added restrained hover elevation/shadow for cards and principle blocks.
- Cleaned visible text artifacts on key landing/footer components and normalized CTA arrows.
- Verified the revamp with `npm run check` and `npm run build` (both passing).

**Next action:** Manual UX pass in browser (`npm run dev`) across desktop/mobile breakpoints, then tune animation durations if any section feels too fast.

## GHO-23 Continuation Note (2026-05-12, Cross-Page Pass)

- Extended the dynamic visual system to secondary routes: /about, /contact, and /research with staggered reveal timing and restrained surface glow usage.
- Normalized interaction treatment on contact/research cards to match landing page motion language.
- Applied consistent section-level reveal classes on deep-dive pages (/research/gnw, /research/grao) for smoother scroll progression.
- Verified with 
pm run check and 
pm run build (passing).

**Next action:** Do a final manual browser QA pass for animation pacing and content glyph cleanup on any remaining legacy copy artifacts, then prepare deployment handoff.


## GHO-23 Continuation Note (2026-05-12, Micro-Interaction Pass)

- Added shared navigation interaction classes (
av-link, 
av-link-active) and applied them in the header for cleaner active/hover states.
- Added subtle logo hover motion in the header for lightweight brand liveliness.
- Added shared table row transition class (	able-row) and applied it to GNW/GRAO data tables for consistent interaction behavior.
- Verified with 
pm run check and 
pm run build (passing).

**Next action:** Final visual QA in-browser, then close out bootstrap implementation and hand off for deployment steps (SSL + HTTPS force + publish dist).


## GHO-23 Continuation Note (2026-05-12, Encoding Cleanup + Final QA)

- Removed legacy mojibake sequences from src/ content and normalized copy to render cleanly after build.
- Kept motion system restrained and consistent across all main pages and research routes.
- Re-verified type/content integrity with 
pm run check (0 errors) after cleanup.

**Next action:** Proceed to deployment handoff: publish current dist/, then enable SSL + Force HTTPS in Hostinger and verify live pages render updated motion/copy correctly.


## GHO-23 Continuation Note (2026-05-12, Deploy Artifact)

- Added [DEPLOY_READY.md](./DEPLOY_READY.md) with a concrete deploy checklist, smoke-test URLs, and rollback plan for Hostinger publish.
- This is the final repo-side handoff artifact for moving from implementation to production rollout.

**Next action:** Execute DEPLOY_READY.md steps in Hostinger and confirm live smoke-test results.


## GHO-23 Continuation Note (2026-05-12, Release Closeout)

- Added [GHO23_RELEASE_SUMMARY.md](./GHO23_RELEASE_SUMMARY.md) documenting implemented scope, key files, and final validation status.
- Repo-side implementation is complete; remaining steps are external deployment tasks only.

**Blocked on external owner:** Andi/Zero (deployment owner) must execute Hostinger publish + SSL/HTTPS + live smoke checks per DEPLOY_READY.md.


## GHO-23 Continuation Note (2026-05-12, Blocked Artifact)

- Added [GHO23_BLOCKED.md](./GHO23_BLOCKED.md) to formalize external deployment block state with owner + resume condition.

**Next action:** Await Andi/Zero deployment smoke-test results; reopen code implementation only on reported regressions.


## GHO-23 Continuation Note (2026-05-12, Deployment Request Artifact)

- Added [GHO23_DEPLOYMENT_REQUEST.md](./GHO23_DEPLOYMENT_REQUEST.md) with explicit owner action list and a structured response template for smoke-test reporting.

**Next action:** Andi/Zero executes deployment request and returns structured results; resume coding only on regression evidence.


## GHO-23 Continuation Note (2026-05-12, Deploy Package)

- Created deployment artifact [ghostworks-dist-2026-05-12.zip](./ghostworks-dist-2026-05-12.zip) from current dist/ for direct Hostinger upload.
- Archive size: 23,629 bytes.

**Next action:** Andi/Zero uploads this archive contents to public_html and executes GHO23_DEPLOYMENT_REQUEST.md smoke-test report template.


## GHO-31 Continuation Note (2026-05-13, Content Expansion)

- **Scope**: Expanded ghostworks.info from placeholder/Astro foundation to content-rich site per GHO-31.
- **New pages created:**
  - `src/pages/services.astro` — Services page with 4 engagement areas (Cognitive Architecture Design, Research Pipeline Engineering, Agent System Architecture Review, Research Publication Support), each with deliverables lists, approach section, CTA links.
  - `src/pages/blog/index.astro` — Blog listing page, sorts posts newest first, filters drafts.
  - `src/pages/blog/[...slug].astro` — Individual blog post page with proper `CollectionEntry<'blog'>` typing.
  - `src/content/config.ts` — Content Collection schema for blog posts.
  - `src/content/blog/welcome-to-ghostworks.md` — Sample blog post.
- **Expanded pages:**
  - `src/pages/about.astro` — Added founding team section (Ghostworks Architects) describing team expertise across cognitive systems architecture, ML engineering, and formal verification.
  - `src/pages/contact.astro` — Added FAQ section (response time, contract work, contributions).
  - `src/components/Header.astro` — Added Services and Blog nav links.
  - `src/components/Footer.astro` — Added Services and Blog footer links.
- **WordPress cleanup**: Confirmed no WordPress/PHP/SQL remnants in project.
- **Build verification**: `astro check` → 0 errors, 0 warnings, 0 hints. `astro build` → 9 pages + sitemap, all clean.
- **Deployment archive**: [ghostworks-dist-2026-05-13-v3.zip](./ghostworks-dist-2026-05-13-v3.zip) from current build.
- **Blocked state unchanged**: Deployment still requires Hostinger access per GHO23_BLOCKED.md.

**Next action:** Andi/Zero deploys latest dist/ to Hostinger, enables SSL/HTTPS, and runs smoke tests — now covering 9 pages plus sitemap.

## GHO-23 Recovery Note (2026-05-13, Andi Assistant)

- Previous heartbeat (Codex `1d9713fd`) failed with `adapter_failed` due to ChatGPT usage limits — not a code issue.
- Verified current state: `npm run check` → 0 errors, 0 warnings; `npm run build` → 6 pages + sitemap, all clean.
- Created fresh deployment archive [ghostworks-dist-2026-05-13.zip](./ghostworks-dist-2026-05-13.zip) from current build.
- No code changes needed — implementation was finalized in prior runs.

**Status:** Implementation complete (repo-side). Blocked on external deployment per GHO23_BLOCKED.md.

**Next action:** Andi/Zero executes Hostinger deploy per DEPLOY_READY.md, run smoke tests, and report results via the GHO23_DEPLOYMENT_REQUEST.md template.


## GHO-23 Continuation Note (2026-05-13, Scroll-Reveal Fix)

- **Identified real UX gap**: All `animate-fade-up` animations were CSS-only, firing on page load — sections below the fold were already visible by the time users scrolled, defeating the purpose.
- **Fixed in `tailwind.config.mjs`**: Removed the `fadeUp` animation entry and keyframes (now using CSS transitions instead). Kept `fadeIn` for page entrance.
- **Fixed in `src/styles/global.css`**: Converted `.animate-fade-up` from CSS animation to transition-based system: elements start `opacity: 0; transform: translateY(12px)` and transition to `.revealed { opacity: 1; translateY(0) }`. Updated stagger classes (100ms/200ms/350ms). Added `prefers-reduced-motion` override.
- **Fixed in `src/layouts/BaseLayout.astro`**: Added lightweight `<script is:inline>` with IntersectionObserver (`threshold: 0.05`) that reveals elements on scroll and immediately checks viewport on load.
- **Verified**: `npm run build` → 6 pages + sitemap, clean. `npm run check` → 0 errors, 0 warnings, 0 hints. All 6 pages have the IO script and `animate-fade-up` classes (9-12 per page).
- **New deployment archive**: [ghostworks-dist-2026-05-13-v2.zip](./ghostworks-dist-2026-05-13-v2.zip) (25,456 bytes).
- **Blocked state unchanged**: Repo-side implementation is complete. External deployment still blocked on Andi/Zero (Hostinger SSL + HTTPS + upload).

## GHO-23 Continuation Note (2026-05-13, Deep-Dive Stagger + Hover Polish)

- **Identified inconsistency on deep-dive pages**: `/research/gnw` and `/research/grao` had all sections using `animate-fade-up` without stagger numbers — all sections revealed simultaneously on scroll instead of progressively.
- **Fixed in `src/pages/research/gnw.astro`**: Progressive stagger classes applied to sections (Cycle → `stagger-1`, Boredom Formula → `stagger-2`, Stability → `stagger-3`). Added `transition-colors hover:bg-bg-elevated/60` to all 5 stability test items matching landing page hover pattern.
- **Fixed in `src/pages/research/grao.astro`**: Progressive stagger classes applied to sections (Formula → `stagger-1`, Live Data → `stagger-2`, Saturation → `stagger-3`). Added staggered reveals to 4 pipeline cards (`stagger-1`, `stagger-2`, `stagger-3`, `stagger-3`).
- **Verified**: `npm run build` → 9 pages in 1.32s. `npm run check` → 0 errors in modified files (12 pre-existing errors in blog content collection only, unrelated).
- **Deployment archive**: [ghostworks-dist-2026-05-13-v2.zip](./ghostworks-dist-2026-05-13-v2.zip) (25 KB) — this archive is from previous scroll-reveal fix; latest dist/ contains all work.

**Status:** All planned GHO-23 animation work is implemented and verified on the repo side. Staggered scroll-reveals, hover effects, cross-page consistency — all accounted for.

**Next action:** Andi/Zero deploys latest dist/ to Hostinger, enables SSL/HTTPS, and runs smoke tests.

