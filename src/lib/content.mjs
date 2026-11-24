/** @param {string} value */
export function youtubeId(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    const host = url.hostname.toLowerCase();
    let id = null;
    if (host === 'youtu.be') id = url.pathname.split('/')[1];
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) {
      if (url.pathname === '/watch') id = url.searchParams.get('v');
      else if (/^\/(shorts|embed|live)\//.test(url.pathname)) id = url.pathname.split('/')[2];
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch { return null; }
}

/** @param {string} date */
export function formatDate(date) {
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year}`;
}

/**
 * @template {{id: string, data: {date: string, draft: boolean, example: boolean}}} T
 * @param {T[]} entries
 * @param {{includeExamples?: boolean, today?: string}} [options]
 */
export function selectWritings(entries, { includeExamples = false, today = new Date().toISOString().slice(0, 10) } = {}) {
  return entries.filter(({ data }) => !data.draft && (includeExamples || !data.example) && data.date <= today)
    .sort((a, b) => b.data.date.localeCompare(a.data.date) || a.id.localeCompare(b.id));
}
