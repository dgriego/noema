// Cloudflare Worker entry point. The built Astro site in dist/ is served as static assets;
// only /api/* reaches this code (see "run_worker_first" in wrangler.jsonc).
import { handleContact, type ContactEnv } from './contact';

interface Env extends ContactEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/contact') {
      if (request.method === 'POST') return handleContact(request, env);
      return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
    }

    // Any other /api/* path, or anything the asset router hands us, falls back to the site.
    return env.ASSETS.fetch(request);
  },
};
