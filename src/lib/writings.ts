import { getCollection } from 'astro:content';
import { selectWritings } from './content.mjs';

export async function getWritings() {
  return selectWritings(await getCollection('writings'), {
    includeExamples: import.meta.env.DEV || import.meta.env.SHOW_EXAMPLE_CONTENT === '1',
  });
}

export function withBase(path = '') {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export const typeLabels = {
  lecture: 'Lecture', research: 'Research', article: 'Article', project: 'Project', youtube: 'YouTube',
} as const;
