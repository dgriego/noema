// Cloudflare Pages Function: POST /api/contact
// Validates the contact form and emails it to CONTACT_TO via Resend (https://resend.com).
//
// Environment (Cloudflare → Workers & Pages → noema → Settings → Variables and Secrets):
//   RESEND_API_KEY  (secret)  API key from resend.com
//   CONTACT_TO      (text)    inbox that receives inquiries
//   CONTACT_FROM    (text, optional) sender, e.g. "Noema Website <website@noemainteriordesign.com>".
//                   Defaults to Resend's test sender, which can only deliver to the
//                   email on your Resend account, until you verify your domain in Resend.

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

interface Context {
  request: Request;
  env: Env;
}

const LIMITS: Record<string, number> = {
  name: 120,
  email: 200,
  phone: 40,
  location: 200,
  service: 100,
  message: 5000,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const onRequestPost = async ({ request, env }: Context): Promise<Response> => {
  const wantsJson = (request.headers.get('Accept') ?? '').includes('application/json');

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(wantsJson, request, 400, 'Invalid form submission.');
  }

  // Honeypot: real visitors never fill this hidden field. Pretend it worked so bots move on.
  if (String(form.get('_gotcha') ?? '').trim()) return reply(wantsJson, request, 200);

  const field = (key: string) => String(form.get(key) ?? '').trim().slice(0, LIMITS[key]);
  const data = {
    name: field('name'),
    email: field('email'),
    phone: field('phone'),
    location: field('location'),
    service: field('service'),
    message: field('message'),
  };

  if (!data.name || !data.service || !data.message || !EMAIL_RE.test(data.email)) {
    return reply(wantsJson, request, 422, 'Please fill in your name, a valid email, a service, and a message.');
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO) {
    console.error('Contact form is not configured: set RESEND_API_KEY and CONTACT_TO.');
    return reply(wantsJson, request, 500, 'The form is not configured yet.');
  }

  const singleLine = (s: string) => s.replace(/[\r\n]+/g, ' ');
  const text = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || '-'}`,
    `Project location: ${data.location || '-'}`,
    `Service: ${data.service}`,
    '',
    data.message,
    '',
    '-- Sent from the contact form on noemainteriordesign.com. Reply to this email to answer the client directly.',
  ].join('\n');

  let res: Response;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM || 'Noema Website <onboarding@resend.dev>',
        to: env.CONTACT_TO.split(',').map((s) => s.trim()).filter(Boolean),
        reply_to: data.email,
        subject: singleLine(`New inquiry: ${data.service} from ${data.name}`),
        text,
      }),
    });
  } catch (err) {
    console.error('Resend request failed', err);
    return reply(wantsJson, request, 502, 'Sorry, the message could not be sent.');
  }

  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
    return reply(wantsJson, request, 502, 'Sorry, the message could not be sent.');
  }

  return reply(wantsJson, request, 200);
};

// Anything other than POST gets a 405 instead of falling through to the 404 page.
export const onRequest = (): Response =>
  new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });

function reply(wantsJson: boolean, request: Request, status: number, error?: string): Response {
  if (wantsJson) {
    return Response.json(error ? { ok: false, error } : { ok: true }, { status });
  }
  // No-JavaScript fallback: a normal form post. Success goes to /thanks.
  if (!error) return Response.redirect(new URL('/thanks', request.url).toString(), 303);
  const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Message not sent</title><body style="font-family:system-ui,sans-serif;max-width:40rem;margin:4rem auto;padding:0 1rem">
<h1>Your message wasn't sent</h1><p>${error}</p>
<p>Please go back and try again, or call/text <a href="tel:+15056297347">(505) 629-7347</a>.</p>
<p><a href="/contact">Back to the contact page</a></p></body>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
