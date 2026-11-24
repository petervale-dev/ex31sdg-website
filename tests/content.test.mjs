import test from 'node:test';
import assert from 'node:assert/strict';
import { youtubeId, selectWritings, formatDate } from '../src/lib/content.mjs';

test('date labels retain the author’s calendar date regardless of time zone', () => {
  assert.equal(formatDate('2026-06-14'), '14.06.2026');
  assert.equal(formatDate('2024-02-29'), '29.02.2024');
});

test('only published, non-example, non-future writings appear in production', () => {
  const entry = (id, date, rest = {}) => ({ id, data: { date, draft: false, example: false, ...rest } });
  const entries = [entry('older', '2026-01-01'), entry('draft', '2026-06-01', { draft: true }), entry('example', '2026-06-01', { example: true }), entry('future', '2027-01-01'), entry('newer', '2026-06-01')];
  assert.deepEqual(selectWritings(entries, { today: '2026-11-24' }).map(e => e.id), ['newer', 'older']);
  assert.equal(selectWritings(entries, { today: '2026-11-24', includeExamples: true }).length, 3);
});

test('YouTube links accept standard, short, shorts, live and embed URLs', () => {
  const id = 'AbCdEf123_-';
  for (const url of [`https://youtube.com/watch?v=${id}&t=30`, `https://youtu.be/${id}`, `https://www.youtube.com/shorts/${id}`, `https://m.youtube.com/live/${id}`, `https://www.youtube.com/embed/${id}`]) {
    assert.equal(youtubeId(url), id);
  }
});

test('untrusted hosts, insecure URLs and malformed video IDs are rejected', () => {
  for (const value of ['javascript:alert(1)', 'http://youtu.be/AbCdEf123_-', 'https://youtube.com.evil.test/watch?v=AbCdEf123_-', 'https://evil.test/AbCdEf123_-', 'https://youtube.com/watch?v=short', 'not a URL']) {
    assert.equal(youtubeId(value), null);
  }
});
