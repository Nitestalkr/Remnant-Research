import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    draft: z.boolean().optional().default(false),
    tags: z.array(z.string()).optional().default([]),
    ogImage: z.string().optional(),
  }),
});

export const collections = { blog };
