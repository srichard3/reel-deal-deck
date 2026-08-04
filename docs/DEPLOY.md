# Getting the site live

Written so a non-developer can follow it. Budget about 90 minutes for the first deploy.

---

## What you need

| Thing | Cost | Notes |
|---|---|---|
| A domain | ~$12–15/yr | `reeldealdeck.com` — buy it if you have not |
| A Netlify account | Free | The free tier is genuinely enough for this site |
| A GitHub account | Free | Where the code lives |

There is no server, no database, and no monthly hosting bill. The site is static files.

---

## First deploy

1. **Push the repo to GitHub.** Create an empty repository, then:

```bash
git remote add origin https://github.com/<you>/reel-deal-deck.git
git push -u origin main
```

2. **Connect Netlify.** Netlify → *Add new site* → *Import an existing project* → pick the repo.
   It will read `netlify.toml` and fill in the settings automatically:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 20

3. **Deploy.** It takes under a minute. You get a temporary `*.netlify.app` URL — check it works.

4. **Add the domain.** Netlify → *Domain management* → *Add custom domain* → `reeldealdeck.com`.
   Follow its DNS instructions at your registrar. HTTPS is automatic and free; allow up to an hour.

5. **Set the canonical host.** Pick `https://reeldealdeck.com` **or** `https://www.reeldealdeck.com`
   and redirect the other. Netlify does this for you when you set a primary domain. Do not skip it —
   serving both splits your search rankings between two addresses.

After this, every `git push` to `main` rebuilds and redeploys automatically. The GitHub Action in
`.github/workflows/deploy.yml` runs `npm run check` on every push, so a broken link or a missing
meta description fails before it reaches the live site.

---

## Updating the site

```bash
npm run build     # rebuild dist/
npm run dev       # rebuild and preview at http://localhost:4173
npm run check     # link, heading, meta, schema and TODO audit
```

Then commit and push. That is the whole workflow.

---

## The Open Graph images

`static/og/*.png` are the images that appear when someone shares a link on Instagram, Facebook,
iMessage or Slack. They currently ship as **generated placeholders** — real, valid PNGs at the
correct 1200×630 size, so nothing 404s and no share preview breaks, but they are geometric rather
than designed.

Alongside each one is a matching `.svg` with proper typography and the brand mark.

**To upgrade them** (worth doing before any real promotion):

1. Open each `static/og/<name>.svg` in a browser, or in Figma / Illustrator / Sketch.
2. Export at exactly **1200 × 630 px** as PNG.
3. Replace `static/og/<name>.png` with the export, keeping the filename identical.
4. `npm run build`, commit, push.

No code changes needed — the filenames are already wired up.

Once you have real product photography, the best OG images are simply good photographs of the deck
with the logo in a corner. Replace the generated ones at that point.

---

## Pre-launch checklist

Run `npm run check` and resolve everything it lists. Then:

- [ ] **All `TODO-CONFIRM` markers resolved.** `npm run check` lists each one with file and line.
      These are the decisions only Ken and Audrey can make — pricing, the exact Trout Unlimited
      contribution, lead times, wholesale terms, surnames.
- [ ] **Ken has read all 54 fly pages.** Credibility with expert anglers is the whole asset.
- [ ] **Real photography** replacing the CSS card renderings, on `/deck/` at minimum.
- [ ] **Checkout provider connected** — see [COMMERCE.md](COMMERCE.md). Until then, every purchase
      control on the site is a clearly-labelled placeholder that stores interest locally and sends
      nothing. Verify this is still true before launch: nothing may imply an order was taken.
- [ ] **Email capture wired** to a real provider, and confirm you can export the list.
- [ ] **Search Console and Bing verified, sitemap submitted** — see [LAUNCH.md](LAUNCH.md).
- [ ] **Test on a real phone**, not just a desktop browser window. Most of your traffic will be mobile.
- [ ] **Check both light and dark mode.** The site ships both and people use both.

---

## If something breaks

| Symptom | Cause | Fix |
|---|---|---|
| Build fails in CI | A page's front-matter JSON is malformed | Check the `<!--meta {...} -->` block parses as JSON |
| `npm run check` reports broken links | A page links to a route that no longer exists | Fix the link, or add a redirect in `static/_redirects` |
| A fly page 404s | Slug changed | Never change slugs — add a redirect instead |
| Share preview is blank | OG image path wrong | `meta.ogImage` must match a real file in `static/og/` |
| Styles missing locally | Opened `dist/index.html` as a file | Use `npm run dev` — the site needs a server for absolute paths |
