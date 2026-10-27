import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Each portfolio project is one Markdown file in src/content/projects.
// Add a file to add a project; it gets its own SEO-friendly page automatically.
// Photos live in src/assets/photos/<folder>/; every photo in the listed folders
// appears in the project's gallery, so adding a photo is just dropping it in.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.enum(['Residential', 'Commercial', 'Styling']),
      location: z.string().default('Portland, OR'),
      cover: image(),
      coverAlt: z.string(),
      photos: z.array(z.string()).min(1),
      photoAlt: z.string(),
      order: z.number().default(99),
      featured: z.boolean().default(false),
    }),
});

export const collections = { projects };
