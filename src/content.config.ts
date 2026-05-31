import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One collection for every article. Migrated posts are plain `.md`;
// articles that embed interactive components are `.mdx`. Both live here
// and share the same validated frontmatter shape.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    slug: z.string(),
    excerpt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featureImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// Standalone pages (e.g. About). Kept separate from `posts` so they never appear
// in the post list, tag pages, RSS, or pagination.
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { posts, pages };
