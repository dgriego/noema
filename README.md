# Noema Interior Design

Marketing site for [Noema Interior Design](https://noemainteriordesign.com), a Portland, OR interior design studio.

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
- **Fonts** (original brand fonts, self-hosted via Fontsource): Archivo Black for the display marquee, Archivo for headings and body, and Space Grotesk for labels, nav, and buttons.
- **Colors:** slate `#4f6469` / `#6e878c` / `#c3d8de` (from the logo), red accent `#b23d39` (from the original site), cream `#f4eee3`.

## Editing content

| What | Where |
| --- | --- |
| Phone, email, socials, service area, booking link | `src/config/site.ts` |
| Services, pricing, process steps, FAQ | `src/data/services.ts` |
| Portfolio projects | `src/content/projects/*.md`: one file per project |
| Page copy | `src/pages/*.astro` |
| Colors, fonts, spacing | `src/styles/global.css` (`:root` tokens) |

**Add a portfolio project:** copy an existing file in `src/content/projects/`, rename it (the filename becomes the URL, e.g. `bathroom-remodel.md` → `/portfolio/bathroom-remodel`), and update the front matter. Set `featured: true` to show it on the home page. The build fails with a clear message if a required field is missing.

**Images:** place new photos in `src/assets/` and reference them, or use any `images.squarespace-cdn.com` URL. Either way Astro resizes them and converts them to WebP at build time.

> ⚠️ Current photos are loaded from the Squarespace CDN. Download them into `src/assets/` before cancelling the Squarespace plan, or they'll stop resolving.

## Deploying to Cloudflare Pages

1. Push this repo to GitHub (`dgriego/noema`).
2. In Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**, then pick the repo.
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable `NODE_VERSION` = `22`
3. Add the contact form variables (see below), then deploy. Every push to `main` deploys to production, and every other branch gets a preview URL.
4. **Domain:** Pages project → **Custom domains** → add `noemainteriordesign.com` and `www.noemainteriordesign.com`. The domain has to use Cloudflare DNS: add it under **Websites** (free plan) and switch the nameservers at your registrar, or transfer it to Cloudflare Registrar (at-cost pricing). That moves it off Squarespace.

Cloudflare-specific files:

- `public/_redirects`: 301s for old Squarespace URLs (`/services-1`, `/comingsoon`, etc.)
- `public/_headers`: long-term caching for hashed assets and basic security headers
- `functions/api/contact.ts`: the contact form handler (a Pages Function)

Pages serves `about.html` at `/about` (clean URLs) and uses `404.html` automatically.

Optional: turn on **Web Analytics** for the project in the Cloudflare dashboard (free).

## Contact form

The form posts to `/api/contact`, a Pages Function that validates the fields, drops bots that fill the hidden `_gotcha` honeypot, and emails the inquiry to you through [Resend](https://resend.com). The email's Reply-To is the client's address, so you can just hit Reply.

Setup (one time):

1. Create a free Resend account and an API key (**API Keys → Create**, "Sending access").
2. In Cloudflare: Pages project → **Settings → Variables and Secrets**, for Production (and Preview if you want to test there):
   - `RESEND_API_KEY`: the key, as type **Secret**
   - `CONTACT_TO`: the inbox that should receive inquiries (comma-separate for more than one)
3. Redeploy (variables apply to new deployments).

Until you verify your domain in Resend, mail is sent from Resend's test address and **can only be delivered to the email you signed up to Resend with**, so use that address for `CONTACT_TO`. For a branded sender and better deliverability, verify `noemainteriordesign.com` in Resend (it gives you DNS records to add in Cloudflare), then set `CONTACT_FROM` to something like `Noema Website <website@noemainteriordesign.com>`.

With JavaScript on, the form submits in the background, shows errors inline, and sends the visitor to `/thanks`. Without JavaScript it posts normally and the function redirects to `/thanks`.

**Local testing:** copy `.dev.vars.example` to `.dev.vars`, fill it in, and run `npm run cf:dev` (builds, then serves the site with the function at http://localhost:8788). `npm run dev` still works for page work, but the form needs `cf:dev`.

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

1. **Google Search Console:** verify the domain and submit `https://noemainteriordesign.com/sitemap-index.xml`.
2. **Google Business Profile:** this has the biggest impact on local search. Category "Interior designer", service area = Portland metro, link to the site, add photos, and ask clients for reviews.
3. Fill in `email` and `social.instagram` in `src/config/site.ts`.
4. Use the same name and phone number everywhere online (Houzz, Yelp, Instagram bio).
5. Add more projects over time; each one is a new page that can rank for searches like "kitchen designer Portland".
