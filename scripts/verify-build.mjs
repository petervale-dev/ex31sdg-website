import assert from 'node:assert/strict';
import { mkdir, writeFile, rm, readFile, readdir, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const fixtureDir = join(root, 'src/content/writings/build-verification');
const dist = join(root, 'dist');
const base = '/ex31sdg-website';
const types = ['lecture', 'research', 'article', 'project', 'youtube'];
async function files(directory) {
  const result = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, item.name);
    if (item.isDirectory()) result.push(...await files(path));
    else result.push(path);
  }
  return result;
}
await mkdir(fixtureDir, { recursive: false });
try {
  for (let i = 0; i < 22; i++) {
    const type = types[i % types.length];
    await writeFile(join(fixtureDir, `writing-${String(i).padStart(2, '0')}.md`), `---\ntitle: Verification writing ${i}\ndate: '2026-01-01'\ntype: ${type}\n${type === 'youtube' ? 'youtube: https://youtu.be/AbCdEf123_-\n' : ''}---\n\nA temporary build verification entry.\n`);
  }
  await writeFile(join(fixtureDir, 'draft.md'), "---\ntitle: Hidden draft\ndate: '2026-01-01'\ntype: article\ndraft: true\n---\nNot public.\n");
  await writeFile(join(fixtureDir, 'future.md'), "---\ntitle: Future writing\ndate: '2999-01-01'\ntype: article\n---\nNot public.\n");
  const result = spawnSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: root, encoding: 'utf8', env: { ...process.env, BASE_PATH: base, SHOW_EXAMPLE_CONTENT: '0', ASTRO_TELEMETRY_DISABLED: '1' },
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const home = await readFile(join(dist, 'index.html'), 'utf8');
  const archive = await readFile(join(dist, 'writings/index.html'), 'utf8');
  const second = await readFile(join(dist, 'writings/page/2/index.html'), 'utf8');
  assert.equal((home.match(/class="writing-row"/g) || []).length, 5);
  assert.equal((archive.match(/class="writing-row"/g) || []).length, 20);
  assert.equal((second.match(/class="writing-row"/g) || []).length, 2);
  assert.ok(home.includes(`${base}/writings/`));
  assert.ok(second.includes(`${base}/writings/`));
  assert.ok(!home.includes('<script'), 'The landing page should ship no JavaScript.');
  assert.ok(home.includes('https://cal.com/ex31sdg/become-a-partner-introduction-call'));
  for (const label of ['Lecture', 'Research', 'Article', 'Project', 'YouTube']) assert.ok(archive.includes(label));
  const htmlFiles = (await files(dist)).filter(p => p.endsWith('.html'));
  let checkedLinks = 0;
  for (const path of htmlFiles) {
    const html = await readFile(path, 'utf8');
    assert.ok(!html.includes('Hidden draft') && !html.includes('Future writing'));
    assert.ok(!html.includes('Example writing — for preview only.'));
    assert.ok(!html.includes('/writings/example-'));
    for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (!raw.startsWith('/')) continue;
      const url = new URL(raw.replaceAll('&amp;', '&'), 'https://example.test');
      assert.ok(url.pathname.startsWith(`${base}/`), `Missing Pages base in ${raw}`);
      let target = resolve(dist, `.${decodeURIComponent(url.pathname.slice(base.length))}`);
      if ((await stat(target)).isDirectory()) target = join(target, 'index.html');
      await stat(target);
      checkedLinks++;
    }
  }
  const video = await readFile(join(dist, 'writings/build-verification/writing-04/index.html'), 'utf8');
  assert.ok(video.includes('data-video-id="AbCdEf123_-"'));
  assert.ok(!video.includes('<iframe'), 'YouTube must load only after a click.');
  assert.equal((await files(join(dist, 'writings'))).some(p => p.includes('example-')), false);
  console.log(`Verified: ${htmlFiles.length} pages, ${checkedLinks} local links/assets, 22 writings, 2 archive pages, all 5 types, hidden drafts/future/example entries, no homepage JavaScript, and click-to-load YouTube.`);
} finally {
  await rm(fixtureDir, { recursive: true, force: true });
}
