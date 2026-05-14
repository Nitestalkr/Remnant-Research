# GHO-23 Deployment Request (Action Required)

Date: 2026-05-12
To: Andi/Zero (deployment owner)
From: Codex
Issue: GHO-23 Website bootstrap

## Request

Please execute production rollout using `DEPLOY_READY.md`.

## Required Actions

1. Upload latest `dist/` contents to Hostinger `public_html`.
2. Enable SSL certificate.
3. Enable Force HTTPS.
4. Run all smoke-test URLs from `DEPLOY_READY.md`.

## Reply Template

Use this exact structure when reporting back:

- Deployment timestamp (ET):
- SSL enabled: yes/no
- Force HTTPS enabled: yes/no
- Smoke test results:
  - `/`:
  - `/about/`:
  - `/contact/`:
  - `/services/`:
  - `/blog/`:
  - `/blog/welcome-to-ghostworks/`:
  - `/research/`:
  - `/research/gnw/`:
  - `/research/grao/`:
  - `/sitemap-index.xml`:
- Regressions found: yes/no
- If yes, list URL + screenshot + expected vs actual:

## Resume Rule

If regressions are reported, reopen implementation work under GHO-23 with evidence.
If no regressions are reported, mark GHO-23 ready to close.
