# GHO-23 Release Summary

Date: 2026-05-12
Issue: GHO-23 Website bootstrap
Status: Implementation complete (repo-side)

## Implemented

- Visual revamp with subtle motion and dynamic atmosphere.
- Shared interaction patterns (navigation, cards, tables).
- Cross-page animation consistency on landing, about, contact, and research routes.
- SEO bootstrap hardening:
  - Open Graph default image path corrected.
  - Sitemap generation integrated.
- Encoding/copy cleanup for source content rendering.

## Key Files Updated

- `src/styles/global.css`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/components/Hero.astro`
- `src/components/ResearchCard.astro`
- `src/layouts/BaseLayout.astro`
- `src/pages/index.astro`
- `src/pages/about.astro`
- `src/pages/contact.astro`
- `src/pages/research/index.astro`
- `src/pages/research/gnw.astro`
- `src/pages/research/grao.astro`
- `astro.config.mjs`
- `package.json`
- `package-lock.json`
- `HANDOFF.md`
- `DEPLOY_READY.md`

## Verification

Executed on 2026-05-12:

- `npm run check` -> pass (0 errors, 0 warnings)
- `npm run build` -> pass
- Build artifacts include sitemap output:
  - `dist/sitemap-index.xml`
  - `dist/sitemap-0.xml`

## Remaining Work (External)

Deployment and production validation require Hostinger account actions outside this workspace.

Unblock owner: Andi/Zero (deployment owner)
Required action:
1. Upload `dist/` to Hostinger `public_html`.
2. Enable SSL and Force HTTPS.
3. Run live smoke tests in `DEPLOY_READY.md` and report results.
