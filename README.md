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

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project → Import** this repo. It auto-detects Astro; no settings changes are needed.
3. Add an environment variable `PUBLIC_FORM_ENDPOINT` (see Contact form below).
4. Deploy. Every push to `main` deploys to production, and every PR gets a preview URL.
5. **Domain:** Project → Settings → Domains → add `noemainteriordesign.com` and `www.noemainteriordesign.com`, then update DNS at your registrar as Vercel instructs (moving the domain off Squarespace).

`vercel.json` holds 301 redirects for old Squarespace URLs (`/services-1`, `/comingsoon`, etc.), long-term caching for hashed assets, and basic security headers.

Optional: enable **Vercel Web Analytics** and **Speed Insights** in the project dashboard (free tier available).

## Contact form

The form posts to whatever URL is in `PUBLIC_FORM_ENDPOINT`. [Formspree](https://formspree.io) works out of the box (free tier: 50 submissions/month). Create a form, then paste its endpoint, e.g. `https://formspree.io/f/abcdwxyz`. It honors the `_next` (redirect to `/thanks`), `_subject`, and `_gotcha` (spam honeypot) fields already in the form.

With JavaScript on, the form submits in the background, shows errors inline, and sends the visitor to `/thanks`. Without JavaScript it posts normally, and the provider redirects to `/thanks`.

**Until `PUBLIC_FORM_ENDPOINT` is set, the form is hidden** and the Contact page shows call, text, and email buttons instead, so no inquiry can be lost to a misconfiguration.

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
