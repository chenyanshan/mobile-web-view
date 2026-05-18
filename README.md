# Mobile Web View

`mobile-web-view` is a local phone-friendly delivery surface for AI-generated Markdown and standalone HTML artifacts.

## What It Serves

- `content/markdown/*.md`
- `content/html/*.html`

The app intentionally does not support HTML PPT folders, multi-file HTML bundles, or arbitrary directory browsing.

## How It Is Meant To Be Used

This project is designed to work together with the repo-shipped skill:

- `skills/mobile-web-view-publish/`

When you are working in another project and you want an AI-generated document or report to be viewable on your phone, the AI should use the skill shipped in this repository and copy the output into this project.

Typical trigger phrases:

- "我要用手机看"
- "我要远程看"
- "把这个报告放到 mobile-web-view"
- "copy this report so I can view it remotely on my phone"

## Skill Contract

The `mobile-web-view-publish` skill only supports:

- Markdown files
- standalone single-file HTML files

It must not be used for:

- HTML PPT folders
- multi-file HTML bundles
- directories with `index.html`

## Publish Targets

- Markdown -> `content/markdown/<name>.md`
- HTML -> `content/html/<name>.html`

## Local Skill Path

This repository ships the reusable skill and script as normal project assets:

- Skill: `skills/mobile-web-view-publish/SKILL.md`
- Script: `skills/mobile-web-view-publish/scripts/publish_mobile_web_view.py`

Example commands:

```bash
python3 skills/mobile-web-view-publish/scripts/publish_mobile_web_view.py --source /abs/path/report.md
python3 skills/mobile-web-view-publish/scripts/publish_mobile_web_view.py --source /abs/path/report.html
```

If another person wants to reuse the same phone-delivery workflow in a different project, this repository is expected to include the skill as part of the project package.

## Run The Viewer

```bash
npm install
npm run build
NODE_ENV=production node_modules/.bin/tsx server/index.ts
```

Default address:

- `http://<LAN-IP>:43211/`

## Related Files

- Project rules: `AGENTS.md`
- Path resolver and listing logic: `server/contentService.ts`
- Home page and viewer routes: `src/App.tsx`
