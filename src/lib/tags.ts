import { getCollection, type CollectionEntry } from 'astro:content';

const base = import.meta.env.BASE_URL;
const join = (p: string) => `${base}${base.endsWith('/') ? '' : '/'}${p}`;

/** Reproduces Ghost's tag slug from a tag name (verified lossless against the export). */
export const slugifyTag = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const tagHref = (name: string) => join(`tag/${slugifyTag(name)}/`);

/** slug -> { display name, posts (newest first) } across all non-draft posts. */
export async function getTagMap() {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
  const map = new Map<string, { name: string; posts: CollectionEntry<'posts'>[] }>();
  for (const post of posts) {
    for (const name of post.data.tags) {
      const slug = slugifyTag(name);
      const entry = map.get(slug) ?? { name, posts: [] };
      entry.posts.push(post);
      map.set(slug, entry);
    }
  }
  return map;
}
