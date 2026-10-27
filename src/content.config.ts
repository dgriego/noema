import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Each portfolio project is one Markdown file in src/content/projects.
// Add a file to add a project; it gets its own SEO-friendly page automatically.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['Residential', 'Commercial', 'Styling']),
    location: z.string().default('Portland, OR'),
    cover: z.string(),
    coverAlt: z.string(),
    gallery: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    order: z.number().default(99),
    featured: z.boolean().default(false),
  }),
});

export const collections = { projects };
