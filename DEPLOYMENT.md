# Deployment

Ghostworks is built as a static Astro site. The default deployment target is Hostinger, but the build output is portable to any static host (Netlify, Cloudflare Pages, Vercel, etc.).

---

## Build

```bash
npm install
npm run build
```

Output is written to `dist/`. That folder is the entire deployable site — every file under it is a static asset.

---

## Hostinger — Static Hosting

Hostinger's shared and Business plans serve static files from a `public_html` directory.

### One-time setup

1. **Point DNS to Hostinger.** In your Hostinger dashboard, ensure the domain `ghostworks.info` is configured with Hostinger's nameservers.
2. **Enable HTTPS.** Under hPanel → Security → SSL, generate a free Let's Encrypt certificate for `ghostworks.info` and `www.ghostworks.info`.
3. **Force HTTPS.** Under hPanel → Advanced → Force HTTPS, enable the toggle.

### Deploy via File Manager (simplest)

1. Run `npm run build` locally
2. Open hPanel → Files → File Manager → navigate to `public_html`
3. Delete any existing default files (e.g. `default.php`)
4. Upload the **contents** of `dist/` (not the `dist/` folder itself) into `public_html`
5. Verify at `https://ghostworks.info`

### Deploy via FTP / SFTP

Hostinger provides FTP credentials under hPanel → Files → FTP Accounts.

```bash
# Example with lftp (Linux/macOS/WSL)
lftp -e "mirror -R dist/ public_html/" -u USERNAME ftp.ghostworks.info
```

For Windows, use FileZilla or WinSCP. Connect to the host, mirror `dist/` into `public_html`.

### Deploy via Git (Hostinger Business plan and above)

1. In hPanel → Advanced → Git, create a new repository tracking your Ghostworks site git repo
2. Configure the deploy branch (typically `main`)
3. Set the deployment script to:
   ```bash
   npm install && npm run build && rm -rf public_html/* && cp -r dist/* public_html/
   ```
4. Trigger a manual deploy or configure auto-deploy on push

---

## Hostinger — Adding Backend Endpoints

If you need server endpoints (contact form, live GRAO metrics API, etc.), Hostinger's VPS or Cloud plans support Node.js.

### Steps

1. **Upgrade to a Node.js-capable plan** (VPS or Cloud Startup minimum)
2. **Install the Node.js adapter** in this project:
   ```bash
   npm install @astrojs/node
   ```
3. **Update `astro.config.mjs`:**
   ```js
   import node from '@astrojs/node';
   export default defineConfig({
     // ...
     output: 'server',
     adapter: node({ mode: 'standalone' }),
   });
   ```
4. **Add server endpoints** under `src/pages/api/`. Example contact form: `src/pages/api/contact.ts`
5. **Build and deploy:**
   ```bash
   npm run build
   # Upload entire project (not just dist/) to the server
   # On the server:
   node ./dist/server/entry.mjs
   ```
6. **Process manager:** Use `pm2` to keep the server running:
   ```bash
   npm install -g pm2
   pm2 start ./dist/server/entry.mjs --name ghostworks
   pm2 save
   pm2 startup
   ```

---

## Alternative: Cloudflare Pages

Strongly recommended over Hostinger static if you want zero-config CI/CD and a CDN by default.

1. Push the repo to GitHub
2. Connect the repo in Cloudflare Pages dashboard
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Add custom domain `ghostworks.info` and update DNS to point to Cloudflare

This is faster, free at the relevant scale, and gives you preview deployments per PR.

---

## Environment Variables in Production

In Hostinger, set environment variables under hPanel → Advanced → Environment Variables (Cloud/VPS only).

Required:
- `PUBLIC_SITE_URL=https://ghostworks.info`
- `PUBLIC_CONTACT_EMAIL=...`
- `PUBLIC_GITHUB_REPO=https://github.com/Nitestalkr/Remnant-Research`

For static hosting, environment variables are baked at build time — set them in your build environment before running `npm run build`.

---

## Post-Deployment Checks

After deployment, verify:

- [ ] `https://ghostworks.info` loads without certificate warnings
- [ ] `https://www.ghostworks.info` redirects to apex (or vice versa, consistently)
- [ ] All nine pages render: `/`, `/research`, `/research/gnw`, `/research/grao`, `/services`, `/blog`, `/blog/welcome-to-ghostworks`, `/about`, `/contact`
- [ ] Favicon appears in browser tab
- [ ] Open Graph preview is correct (test with [opengraph.xyz](https://www.opengraph.xyz/))
- [ ] No 404s for static assets in DevTools Network tab
- [ ] Skip link is reachable via keyboard (Tab from address bar)
- [ ] Lighthouse score: aim for 95+ on Performance, Accessibility, Best Practices, SEO
