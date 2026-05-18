# Mobile Web View Workspace

## Purpose

This project is a local web delivery surface for AI-generated artifacts that need to be viewed from a phone.

## Content Directories

- Put Markdown documents under `content/markdown/<artifact-name>.md`.
- Put standalone HTML reports under `content/html/<artifact-name>.html`.

## Artifact Rules

- Markdown files should stay plain `.md` and avoid proprietary viewer requirements.
- HTML artifacts in this project should be single-file deliverables.
- Use descriptive names. Timestamped names are preferred for generated content.

## Viewer Safety

- The app may only expose project-scoped content roots that are explicitly allowlisted by the server.
- Do not broaden filesystem access without updating the server allowlist and this file.
- Path input must resolve through the server's safe path resolver before anything is rendered.

## Runtime Expectations

- The main UI is optimized for mobile browsers and PWA installation.
- AI-generated artifacts belong in `content/`, not in `src/` or `server/`.
- The app should reflect newly added files by reading the filesystem at request time instead of relying on a build-time index.

## Delivery Contract

- New content should appear at the top of each directory listing based on last modified time.
- Path viewing must support Markdown files and standalone HTML files.
- When generating sample content for tests or demos, keep it small and self-contained.
