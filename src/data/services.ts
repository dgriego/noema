export const services = [
  {
    id: 'consultations',
    title: 'Design Consultations',
    summary: 'Expert guidance in a focused one-hour session, in person in Portland or virtually.',
    body: 'Whether you need help selecting paint colors, reworking a floor plan, or pulling a room together, a consultation gives you clarity and direction. It is the first step for every project type.',
    includes: [
      '60-minute consultation (in person in Portland, OR, or virtual)',
      'Follow-up design notes and resources',
      'Clear next steps you can act on right away',
    ],
    price: '$175 for one hour',
  },
  {
    id: 'residential-design',
    title: 'Full-Service Residential Design',
    summary: 'Comprehensive design for remodels and larger projects, from concept to completion.',
    body: 'Includes space planning, finishes, custom selections, and collaboration with your contractors and architects. The work balances playfulness and longevity to create homes that are both functional and beautiful.',
    includes: ['Space planning and floor plans', 'Finish and material selections', '3D renderings', 'Contractor and trade coordination'],
    price: '$85 / hour, billed monthly',
    note: 'A 50% deposit, based on estimated project hours, is required to begin.',
  },
  {
    id: 'commercial-design',
    title: 'Commercial Interior Design',
    summary: 'Restaurants, cafés, boutiques, and studios designed to tell your brand’s story.',
    body: 'I work with small businesses, hospitality venues, and community organizations to design interiors that reflect their values and connect with the people they serve, creating environments that feel memorable and hold up to everyday use.',
    includes: ['Programming and layout', 'Brand-aligned material palettes', 'Lighting and fixture selection', 'Coordination with builders'],
    price: '$85 / hour, billed monthly',
    note: 'A 50% deposit, based on estimated project hours, is required to begin.',
  },
  {
    id: 'styling',
    title: 'Residential Styling',
    summary: 'The finishing details that bring warmth and identity to a home.',
    body: 'I help curate furniture, textiles, lighting, art, and accessories so your home feels whole. Often that means working with what you already love and filling the gaps.',
    includes: ['Furniture and accessory curation', 'Art and textile layering', 'Editing of existing pieces'],
    price: '$100 / hour, 4-hour minimum',
  },
  {
    id: 'virtual-design',
    title: 'Virtual Design (E-Design)',
    summary: 'Professional design guidance wherever you are, for bedrooms, nurseries, and smaller living areas.',
    body: 'A complete room plan delivered digitally, so you can shop and install at your own pace. Presentations are completed 2–4 weeks after your consultation.',
    includes: ['Space planning', 'Curated furniture selections with links', 'Color scheme', 'Two rounds of revisions'],
    price: 'From $1,500 per room',
    note: 'Not available for kitchens or bathrooms. Paid in full up front.',
  },
] as const;

export const process = [
  { title: 'Discovery Call', time: 'Up to 15 minutes, complimentary', body: 'I listen to your story, your lifestyle, and what you hope your space can become, and we see whether we’re a good fit.' },
  { title: 'Consultation', time: '1 hour', body: 'In person (Portland area) or virtually, we walk through your space together while I take measurements, review layout challenges, and identify opportunities.' },
  { title: 'Design Proposal', time: '1 week after consultation', body: 'A tailored proposal outlining scope, budget, and timeline: a clear, transparent roadmap.' },
  { title: 'Concept Development', time: '1–2 weeks', body: 'Color palettes, materials, spatial flow, and mood explored through concept boards. You help refine the direction.' },
  { title: 'Design Presentation', time: '4–6 weeks', body: 'A fully developed package with floor plans, 3D renderings, furniture selections, and material samples.' },
  { title: 'Procurement & Coordination', time: 'Ongoing', body: 'An organized sourcing list with direct purchase links. You place orders; I track selections and coordinate trades.' },
  { title: 'Installation & Styling', time: 'Install day', body: 'Furniture placed, lighting arranged, décor layered, so the result feels effortless and wholly yours.' },
  { title: 'Final Walkthrough', time: 'Completion', body: 'We walk the finished space together and make final adjustments so it is ready to hold new memories.' },
] as const;

export const faqs = [
  {
    q: 'Do you only work in Portland?',
    a: 'In-person consultations, full-service design, and styling are offered across the Portland, Oregon, metro area. Virtual consultations and e-design are available anywhere.',
  },
  {
    q: 'How much does an interior designer cost in Portland?',
    a: 'At Noema, consultations are $175 for one hour, full-service design is $85/hour (billed monthly), styling is $100/hour with a 4-hour minimum, and virtual design starts at $1,500 per room.',
  },
  {
    q: 'How do I get started?',
    a: 'Book a complimentary 15-minute discovery call. We’ll talk about your space and goals, then schedule a one-hour consultation if it’s a good fit.',
  },
  {
    q: 'Do you design commercial spaces?',
    a: 'Yes. Noema designs restaurants, cafés, boutiques, studios, and community spaces, with interiors that reflect the brand and serve the people who use them.',
  },
  {
    q: 'Do I need to buy all new furniture?',
    a: 'No. Styling projects often start with what you already own. We keep what you love, edit what isn’t working, and fill the gaps.',
  },
] as const;
