# EX31SDG

Astro landing page and writing archive, matching the desktop and mobile layouts inside **Final site** in [Paper](https://app.paper.design/file/01M84WJQPYF9N66C5WW6CEDXCB/p-1-0). Paper is unchanged.

## Preview and build

Use Node.js 22.23.4 or newer (Node 24 recommended).

```sh
npm ci
npm run dev
```

Open the local address printed in the terminal. Development previews show the five example articles from the design. Production builds exclude them.

```sh
npm run check
npm test
npm run build
npm run preview
```

For a review build that includes examples: `SHOW_EXAMPLE_CONTENT=1 npm run build`, then `npm run preview`.

## Add a writing

Create a Markdown file in `src/content/writings/`, such as `my-first-writing.md`:

```md
---
title: My first writing
date: '2026-11-24'
type: article
description: A short description for search and sharing.
draft: false
---

Your writing goes here.
```

Required fields: `title`, `date`, `type`. Types: `lecture`, `research`, `article`, `project`, `youtube`. The file name becomes the URL; keep it stable after publication. Use `draft: true` to hide a writing. Future dates stay hidden until a build on or after that date. New and updated content requires a new static build.

The homepage shows the five newest entries. An **All writings** link appears when there are more. The archive at `/writings/` has 20 entries per page.

For a YouTube entry, use `type: youtube` and add `youtube: https://www.youtube.com/watch?v=YOUR_VIDEO_ID` to the metadata. Replace the placeholder with the real video URL. Standard, short, Shorts, live, and embed links are supported. Other writing types can also include a `youtube` field. The player connects to YouTube only after the visitor clicks **Play video**. Writing text works without JavaScript.

## Design and assets

Inter fonts are bundled locally. The supplied ocean picture lives in `src/assets/`; Astro generates responsive AVIF, WebP, and PNG copies during builds. Copy and spelling are preserved from Paper. The status bar in the mobile design is device chrome, not a simulated clock on the website; its top breathing room is preserved.

The partnership button points to [your Cal.com introduction call](https://cal.com/ex31sdg/become-a-partner-introduction-call).

## GitHub Pages

Repository: [petervale-dev/ex31sdg-website](https://github.com/petervale-dev/ex31sdg-website).

The workflow in `.github/workflows/pages.yml` is **manual only**: a push does not publish the site. Choose GitHub Actions as the Pages source and manually run **Publish to GitHub Pages** to publish new writings or design updates.

The workflow builds at the domain root with `BASE_PATH=/`; the site URL is `https://ex31sdg.com/`. The custom domain is configured on this repository's Pages settings. `public/CNAME` also records the intended domain. If the domain changes, update `site` in `astro.config.mjs` and the Pages custom domain together.

## Integration verification

`node scripts/verify-build.mjs` temporarily creates writings, builds under the Pages subpath, checks pagination, all five types, draft/example exclusion, and local links/assets, then removes its fixtures. Run a normal or example preview build afterward to restore the desired output.
