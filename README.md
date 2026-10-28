# Noema Interior Design

Marketing site for [Noema Interior Design](https://noemainteriors.com), a Portland, OR interior design studio.

Built with [Astro](https://astro.build): pages are pre-rendered to static HTML with zero client JavaScript (apart from the mobile menu toggle), which keeps it fast, cheap to host, and easy for search engines to read.

## Quick start

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # type-check + build to dist/
npm run preview   # serve the built site
```

## Brand

- **Logo:** `src/assets/brand/logo.png` (header wordmark) and `logo-footer.png` (boxed lockup). Both are the original Squarespace logos with the white background made transparent. The favicon (`public/favicon.png`) is the original "n" mark.
- **Fonts** (original brand fonts, self-hosted from the Fontsource packages via Astro's Fonts API in `astro.config.mjs`, which preloads them and generates size-matched fallbacks): Archivo Black for the display marquee, Archivo for headings and body, and Space Grotesk for labels, nav, and buttons.
- **Colors:** slate `#4f6469` / `#53696e` (small label text) / `#c3d8de` (from the logo), red accent `#b23d39` (from the original site), cream `#f4eee3`. Text colors meet WCAG AA contrast; keep it that way when changing them.

## Editing content

| What | Where |
| --- | --- |
| Phone, email, socials, service area, booking link | `src/config/site.ts` |
| Services, pricing, process steps, FAQ | `src/data/services.ts` |
| Portfolio projects | `src/content/projects/*.md`: one file per project |
| Page copy | `src/pages/*.astro` |
| Colors, fonts, spacing | `src/styles/global.css` (`:root` tokens) |

**Add a portfolio project:** copy an existing file in `src/content/projects/`, rename it (the filename becomes the URL, e.g. `bathroom-remodel.md` → `/portfolio/bathroom-remodel`), and update the front matter. Set `featured: true` to show it on the home page. The build fails with a clear message if a required field is missing.

### Photos

All photos live in the repo under `src/assets/photos/<folder>/` (one folder per project, plus `about/` for Martha's portraits). Astro resizes them and serves WebP at build time; nothing loads from Squarespace.

- **Add a photo to a project:** drop it in that project's folder. Each project's `photos:` front matter lists its folder(s), and every photo in them appears in the gallery, sorted by filename. The `cover:` photo is shown at the top and left out of the grid.
- **Name photos for search:** lowercase words joined by hyphens, describing the room and place, numbered for order, e.g. `kitchen-interior-design-portland-07.jpg`. The name carries into the published image URL, and camera names like `DSCF0161.jpg` tell Google nothing.
- **Before committing new photos, run:**

  ```bash
  node scripts/optimize-photos.mjs
  ```

  It applies the camera's rotation, caps the long edge at 3200px, re-encodes as JPEG, and **strips all metadata, including GPS location** (phone photos otherwise publish where the client lives). Camera originals shrink from ~10 MB to under 1 MB.
- **iPhone `.heic` files:** the optimizer can't decode them on Windows; export as JPEG first (Photos app → Export, or set the iPhone to Settings → Camera → Formats → Most Compatible).
- The original full-resolution photos are kept in the studio's Google Drive folder, not in the repo.

## Deploying to Cloudflare Workers

The site runs as a Cloudflare Worker with static assets: Cloudflare serves the built pages in `dist/` directly from its edge cache, and the small Worker in `worker/` only runs for `/api/*` (the contact form). Configuration lives in `wrangler.jsonc`.

The repo is already connected (**Workers & Pages → noema**, via Workers Builds). To recreate it from scratch:

1. Workers & Pages → **Create → Import a repository** → pick `dgriego/noema`. The Worker name must be `noema` (it has to match `name` in `wrangler.jsonc`).
2. **Settings → Build:**
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - **Builds for non-production branches: on**, with command `npx wrangler versions upload` (this is what creates preview links)
   - Build variable `NODE_VERSION` = `22`
3. Add the contact form variables (see below). Every push to `main` deploys to production.
4. **Domain:** the site lives at **noemainteriors.com** (Worker → **Settings → Domains & Routes → Custom domain**). Add `www.noemainteriors.com` there too, so www works. The `noema.<subdomain>.workers.dev` address is turned off (`"workers_dev": false` in `wrangler.jsonc`); preview links still work.
5. **Old domain:** when `noemainteriordesign.com` leaves Squarespace, point it at Cloudflare and add a 301 redirect to `https://noemainteriors.com` (Rules → Redirect Rules, keeping the path), so existing Google rankings and links carry over.

Manual deploy from your machine (after `npx wrangler login`): `npm run cf:deploy`.

### Preview links

Every push to a branch other than `main` uploads a new version **without** publishing it, and each version gets its own URL. `<subdomain>` is your account's workers.dev subdomain (shown under **Settings → Domains & Routes**):

| What | URL |
| --- | --- |
| Production (`main`) | `https://noema.<subdomain>.workers.dev` (and your custom domain) |
| Latest build of a branch | `https://<branch>-noema.<subdomain>.workers.dev`, e.g. `https://new-photos-noema.<subdomain>.workers.dev` |
| One specific version | `https://<version-id-prefix>-noema.<subdomain>.workers.dev` |

Where to find them:

- **GitHub:** each commit gets a **Workers Builds: noema** check; on pull requests Cloudflare also comments with the preview URL. Click **Details** to open the build log, which ends with the URL.
- **Dashboard:** Workers & Pages → noema → **Deployments** (versions and their preview links) and **Builds**.
- **Command line** (after `npx wrangler login`): `npx wrangler versions list`.

Typical flow: `git switch -c my-change`, push, open a PR, review the preview link, then merge to publish.

Preview links require `"preview_urls": true` in `wrangler.jsonc` (already set) and are public but unlisted. To restrict them to the studio, enable **Cloudflare Access** for preview URLs under **Settings → Domains & Routes** (free for small teams).

Previews use the same variables and secrets as production, so **a test submission of the contact form on a preview link sends a real email**.

### Cloudflare-specific files

- `wrangler.jsonc`: Worker name, static asset settings, and which paths run code
- `worker/index.ts`: the Worker entry point; routes `/api/contact` and hands everything else to the static assets
- `worker/contact.ts`: the contact form handler
- `public/_redirects`: 301s for old Squarespace URLs (`/services-1`, `/comingsoon`, etc.)
- `public/_headers`: long-term caching for hashed assets and basic security headers

The asset router serves `about.html` at `/about` (and redirects `/about.html` and `/about/` there) and uses `404.html` for unknown pages.

Optional: turn on **Web Analytics** in the Cloudflare dashboard (free). Worker logs are enabled (`observability` in `wrangler.jsonc`) and show contact form errors under Worker → **Logs**.

## Contact form

The form posts to `/api/contact`, handled by the Worker, which validates the fields, drops bots that fill the hidden `_gotcha` honeypot, and emails the inquiry to you through [Resend](https://resend.com). The email's Reply-To is the client's address, so you can just hit Reply.

Setup (one time):

1. Create a free Resend account and an API key (**API Keys → Create**, "Sending access").
2. In Cloudflare: Worker (noema) → **Settings → Variables and Secrets**:
   - `RESEND_API_KEY`: the key, as type **Secret**
3. Save. Changes apply right away (`keep_vars` in `wrangler.jsonc` keeps later deploys from wiping them).

Inquiries go to `CONTACT_TO` and are sent from `CONTACT_FROM`, both set under `vars` in `wrangler.jsonc` (comma-separate `CONTACT_TO` for more than one). `CONTACT_TO` is martha@noemainteriors.com, a Google Workspace mailbox. Edit it there and push to change it; a value set in the dashboard is replaced on the next deploy.

Until you verify your domain in Resend, mail is sent from Resend's test address and **can only be delivered to the email you signed up to Resend with**, so `CONTACT_TO` must be that address. For a branded sender and better deliverability, verify `noemainteriors.com` in Resend (it gives you DNS records to add in Cloudflare), then set `CONTACT_FROM` to something like `Noema Website <website@noemainteriors.com>`.

With JavaScript on, the form submits in the background, shows errors inline, and sends the visitor to `/thanks`. Without JavaScript it posts normally and the Worker redirects to `/thanks`.

**Local testing:** copy `.dev.vars.example` to `.dev.vars`, fill it in, and run `npm run cf:dev` (builds, then serves the site and the Worker at http://localhost:8787). `npm run dev` still works for page work, but the form needs `cf:dev`.

## Booking link

Set `bookingUrl` in `src/config/site.ts` to a scheduling page (Calendly, Acuity, etc.). Every "Book a Call" / "Book a Discovery Call" button then opens it; while it is empty they go to `/contact`.

## SEO checklist

Built in:

- Unique `<title>` / meta description per page, canonical URLs, Open Graph tags
- `HomeAndConstructionBusiness` JSON-LD (local business) on every page, plus `FAQPage`, `Service`, `Person`, and `BreadcrumbList` where relevant
- `sitemap-index.xml` (auto-generated) and `robots.txt`
- One indexable page per portfolio project with location-keyword copy
- Optimized, responsive WebP images with alt text; self-hosted fonts

After launch:

1. **Google Search Console:** verify the domain and submit `https://noemainteriors.com/sitemap-index.xml`.
2. **Google Business Profile:** this has the biggest impact on local search. Category "Interior designer", service area = Portland metro, link to the site, add photos, and ask clients for reviews.
3. Fill in `email` and `social.instagram` in `src/config/site.ts`.
4. Use the same name and phone number everywhere online (Houzz, Yelp, Instagram bio).
5. Add more projects over time; each one is a new page that can rank for searches like "kitchen designer Portland".
