// Single source of truth for business details. Update here; every page, the footer,
// and the structured data (JSON-LD) Google reads pick it up automatically.
export const site = {
  name: 'Noema Interior Design',
  shortName: 'Noema',
  url: 'https://noemainteriordesign.com',
  tagline: 'Interior design rooted in meaning, memory, and perception.',
  description:
    'Noema is a Portland, Oregon interior design studio offering residential, commercial, and virtual interior design, styling, and consultations.',
  owner: 'Martha Roark',
  phone: '(505) 629-7347',
  phoneHref: 'tel:+15056297347',
  email: '', // e.g. 'hello@noemainteriordesign.com'; shown site-wide once set
  city: 'Portland',
  region: 'OR',
  country: 'US',
  geo: { latitude: 45.5152, longitude: -122.6784 },
  areaServed: ['Portland', 'Beaverton', 'Lake Oswego', 'Vancouver, WA', 'Hillsboro', 'Milwaukie'],
  social: {
    instagram: '', // e.g. 'https://www.instagram.com/noemainteriordesign'
    pinterest: '',
  },
  smsHref: 'sms:+15056297347',
  formEndpoint: import.meta.env.PUBLIC_FORM_ENDPOINT ?? '',
  // Scheduling link (Calendly, Acuity, etc.). When set, every "Book" button opens it
  // instead of the contact page.
  bookingUrl: '',
  ogImage:
    'https://images.squarespace-cdn.com/content/v1/68bdc17cbdcca60b479128dc/cd3a23d6-ceda-4fd3-9537-9bf393541e28/DGS01535.jpg',
};

export const bookHref = site.bookingUrl || '/contact';

export const nav = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
];
