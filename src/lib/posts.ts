import { getCollection, type CollectionEntry } from 'astro:content';

const base = import.meta.env.BASE_URL;
const join = (p: string) => `${base}${base.endsWith('/') ? '' : '/'}${p}`;

export const postHref = (slug: string) => join(`${slug}/`);
export const homeHref = base.endsWith('/') ? base : base + '/';

/** All non-draft posts, newest first. */
export async function getSortedPosts(): Promise<CollectionEntry<'posts'>[]> {
  return (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
}
