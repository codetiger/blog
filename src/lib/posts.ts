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

/** Strip markdown/HTML markers from a block so it reads as plain prose. */
function stripInline(s: string): string {
  return s
    .replace(/^\s*>+\s?/gm, '')              // blockquote markers
    .replace(/^\s*[-*+]\s+/gm, '')           // bullet list markers
    .replace(/^\s*\d+\.\s+/gm, '')           // ordered list markers
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links -> link text
    .replace(/[*_~`]+/g, '')                 // emphasis / inline-code marks
    .replace(/\s+/g, ' ')                    // collapse whitespace
    .trim();
}

/**
 * A short plain-text summary derived from a post's markdown body — used in the
 * feed when a post has no hand-written `excerpt`. Drops code blocks, images and
 * captioned figures, then takes the first real paragraph and truncates it on a
 * word boundary.
 */
export function summarize(entry: CollectionEntry<'posts'>, max = 180): string {
  const text = (entry.body ?? '')
    .replace(/^\s*(import|export)\s.*$/gm, ' ') // MDX import/export statements
    .replace(/```[\s\S]*?```/g, ' ')           // fenced code blocks
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/<figure[\s\S]*?<\/figure>/gi, ' ') // captioned images
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')     // markdown images
    .replace(/<[^>]+>/g, ' ');                 // any remaining HTML tags

  let para = '';
  for (const block of text.split(/\n{2,}/)) {
    if (/^\s*#{1,6}\s/.test(block)) continue;  // skip headings
    const cleaned = stripInline(block);
    if (cleaned) { para = cleaned; break; }
  }

  if (para.length <= max) return para;
  const cut = para.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return cut.slice(0, lastSpace > 40 ? lastSpace : max).trimEnd() + '…';
}
