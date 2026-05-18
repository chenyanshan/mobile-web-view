---
name: mobile-web-view-publish
description: Use when the user says a document, report, web page, markdown, or html file should be viewed remotely on a phone, asks to put output into the mobile-web-view project, or uses phrases like 我要用手机看, 远程看, 手机远程看, remote phone view, or put this in mobile-web-view.
---

# Mobile Web View Publish

Copy deliverables into this `mobile-web-view` project so they can be opened from the phone viewer.

## Trigger

Use this skill when the user asks for any of these outcomes:

- "我要用手机看"
- "我要远程看"
- "远程用手机看"
- "把这个报告放到 mobile-web-view"
- "把这个 html 放到手机上看"
- "copy this report so I can view it remotely on my phone"

## Delivery Target

The delivery project is fixed:

- `/Users/chenyanshan/Documents/vibecoding/mobile-web-view`

Publish into exactly one of these buckets:

- Markdown file: `content/markdown/<name>.md`
- Standalone HTML file: `content/html/<name>.html`

## Routing Rules

Choose the bucket by artifact shape, not by the wording alone.

- `.md` file or Markdown report: publish as `markdown`
- Single self-contained `.html` file: publish as `html`

Important boundary:

- The current `html` bucket is for a single HTML file.
- Do not use this skill for directory-based slide decks or multi-file HTML bundles.

## Workflow

1. Identify the artifact the user wants to view remotely.
2. If the artifact already exists on disk, copy it with `scripts/publish_mobile_web_view.py`.
3. If the artifact only exists in the current response, materialize it as a file first, then publish it.
4. Never move or delete the source artifact. Copy only.
5. After publishing, confirm the destination path exists.
6. Report the destination path and the relative viewer route.

## Commands

Use the helper script from this skill directory.

Markdown:

```bash
python3 skills/mobile-web-view-publish/scripts/publish_mobile_web_view.py --source /abs/path/report.md
```

Standalone HTML:

```bash
python3 skills/mobile-web-view-publish/scripts/publish_mobile_web_view.py --source /abs/path/report.html
```

Rename while publishing:

```bash
python3 skills/mobile-web-view-publish/scripts/publish_mobile_web_view.py --source /abs/path/report.md --name weekly-summary
```

Overwrite an existing published artifact:

```bash
python3 skills/mobile-web-view-publish/scripts/publish_mobile_web_view.py --source /abs/path/report.md --name weekly-summary --overwrite
```

## Unsupported Shapes

Do not use this skill for:

- HTML PPT folders
- multi-file HTML bundles
- directories that require `index.html`

This skill is only for Markdown files and standalone single-file HTML.

## Output Contract

After copying, tell the user:

- what was copied
- where it was copied
- which viewer route matches it

If the phone viewer is already running, the useful routes are:

- Home: `http://<LAN-IP>:43211/`
- Markdown: `/view/markdown?path=<relativePath>`
- HTML: `/view/html?path=<relativePath>`
