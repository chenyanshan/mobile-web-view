# Mobile Web View Design

## Goal

Build a local web service that lets a phone browse AI-delivered artifacts immediately after they are written into this repository. The first version must support three managed content buckets: HTML PPT folders, Markdown documents, and standalone HTML reports. It must also accept a user-entered path and render supported content directly.

## Product Shape

The home page has four primary surfaces:

1. A path input and a `View` action.
2. A `PPT` directory entry.
3. A `MarkDown` directory entry.
4. An `html` directory entry.

Each directory entry opens a list view sorted by newest modified item first. The list must update as files are added because the server reads the filesystem on demand instead of relying on a precomputed manifest.

## Supported Content

### PPT

- Source location: `content/ppt/`
- Unit of content: one folder per artifact
- Entry rule: the folder must contain `index.html`
- Viewer behavior: render the folder entry document while preserving relative asset paths

### Markdown

- Source location: `content/markdown/`
- Unit of content: one `.md` file per artifact
- Viewer behavior: render with a polished GitHub-like reading layout optimized for mobile

### HTML

- Source location: `content/html/`
- Unit of content: one `.html` file per artifact, optionally with sibling assets
- Viewer behavior: render the HTML document directly while preserving relative asset paths

## Path Input

The path input is a convenience viewer for content already reachable by the service. The server receives the path, resolves it against an allowlist, determines the content type, and returns a descriptor that tells the client which viewer route to open.

Supported path targets:

- A Markdown file
- A standalone HTML file
- A directory containing `index.html`
- An allowlisted directory, which should open as a list view

Invalid or disallowed paths return a clear error message instead of partial rendering.

## Safety Boundaries

The first version should not expose arbitrary filesystem access. The server allowlist should include:

- `content/ppt`
- `content/markdown`
- `content/html`

The implementation may support future external roots, but that should be modeled as explicit server configuration rather than implicit access to any absolute path.

## Architecture

Use a single Node-based application with two concerns:

1. An Express server that exposes JSON APIs for directory listing and path resolution, and serves static artifact files from safe routes.
2. A Vite-built React front end that renders the mobile UI, list pages, Markdown reader, HTML/PPT viewers, and PWA shell.

This keeps deployment simple: one local process, one port, and one URL for phone access.

## API Design

### `GET /api/directories/:kind`

Returns directory items for `ppt`, `markdown`, or `html`, sorted by descending modified time.

Response fields:

- `name`
- `relativePath`
- `kind`
- `modifiedAt`
- `viewUrl`

### `GET /api/resolve?path=...`

Resolves a user-supplied path into one of:

- `directory`
- `markdown`
- `html`
- `ppt`

The response includes the normalized relative path and target route for the front end.

### `GET /api/markdown?path=...`

Returns Markdown file content for allowlisted paths.

### Static content routes

- `/content/ppt/...`
- `/content/html/...`

These routes map only to safe content roots.

## Frontend Routes

- `/` for the home page
- `/directory/:kind` for list views
- `/view/markdown` for rendered Markdown
- `/view/html` for standalone HTML
- `/view/ppt` for PPT folders

The client can pass the resolved relative path in query parameters.

## UI Behavior

The UI is phone-first:

- The home page should fit comfortably on a narrow viewport.
- List items should prioritize scanability: title, type, modified time, open affordance.
- Markdown should render with restrained, document-oriented styling.
- HTML and PPT should open in an embedded frame when same-origin rendering is practical.

## PWA Scope

The app must support installation as a PWA with:

- `manifest.webmanifest`
- App icons
- Standalone display mode
- A service worker for shell caching

The service worker should cache the application shell and static assets. It should not aggressively cache artifact content because the whole point is to see newly written files immediately.

## Testing

Implementation should follow focused TDD for the server logic:

- Safe path resolution
- Directory listing sort order
- Content kind detection

Frontend tests should cover:

- Home page navigation
- Directory list rendering
- Path-view routing behavior

At minimum, a production build and automated test run must pass before completion.

## AGENTS Guidance

`AGENTS.md` should define where AI-generated artifacts belong, the rules for content structure, and the expectation that the app reflects filesystem changes without rebuilds.

## Non-Goals

- Rich document editing inside the app
- Authentication
- Arbitrary full-disk browsing
- Background indexing database
- Multi-user collaboration
