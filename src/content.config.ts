import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { youtubeId } from './lib/content.mjs';

export const collections = {
  writings: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/writings' }),
    schema: z.object({
      title: z.string().trim().min(1),
      date: z.iso.date(),
      type: z.enum(['lecture', 'research', 'article', 'project', 'youtube']),
      description: z.string().optional(),
      youtube: z.string().refine((value) => youtubeId(value) !== null, 'Use a valid HTTPS YouTube video URL.').optional(),
      draft: z.boolean().default(false),
      example: z.boolean().default(false),
    }).refine((data) => data.type !== 'youtube' || Boolean(data.youtube), {
      message: 'YouTube entries need a youtube video URL.', path: ['youtube'],
    }),
  }),
};
