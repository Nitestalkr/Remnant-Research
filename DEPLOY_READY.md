# Deploy Ready Checklist (GHO-23)

Date: 2026-05-12
Issue: GHO-23 Website bootstrap

## Scope Completed

- Dynamic visual revamp with restrained motion across landing + core routes.
- Shared interaction polish (nav states, card/table micro-interactions).
- Sitemap integration active (`sitemap-index.xml` + `sitemap-0.xml`).
- Copy/encoding cleanup completed in `src`.

## Pre-Deploy Local Validation

Run from repo root:

```bash
npm run check
npm run build
```

Expected:

- `check`: 0 errors, 0 warnings.
- `build`: success, outputs static site to `dist/`.
- `dist/` includes:
  - `index.html`
  - `about/index.html`
  - `contact/index.html`
  - `services/index.html`
  - `blog/index.html`
  - `blog/welcome-to-ghostworks/index.html`
  - `research/index.html`
  - `research/gnw/index.html`
  - `research/grao/index.html`
  - `sitemap-index.xml`
  - `sitemap-0.xml`

## Hostinger Deployment Steps

1. Upload `dist/` contents to `public_html`.
2. Enable SSL in hPanel (`Security -> SSL`).
3. Enable Force HTTPS in hPanel (`Advanced -> Force HTTPS`).
4. Purge any Hostinger cache/CDN layer if enabled.

## Post-Deploy Smoke Test

Check these URLs over HTTPS:

- `https://ghostworks.info/`
- `https://ghostworks.info/about/`
- `https://ghostworks.info/contact/`
- `https://ghostworks.info/services/`
- `https://ghostworks.info/blog/`
- `https://ghostworks.info/blog/welcome-to-ghostworks/`
- `https://ghostworks.info/research/`
- `https://ghostworks.info/research/gnw/`
- `https://ghostworks.info/research/grao/`
- `https://ghostworks.info/sitemap-index.xml`

Verify:

- No broken glyphs in headings/body copy.
- Nav active states render correctly.
- Motion is present but subtle.
- External GitHub links open correctly.
- Canonical URLs and OG tags present in page source.

## Rollback Plan

- Keep previous deployed `public_html` snapshot or zip before overwrite.
- If regression appears, restore previous snapshot and reopen GHO-23 with failing URL + screenshot.
