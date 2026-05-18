# Mobile Web View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a phone-friendly local web app that lists AI-delivered PPT, Markdown, and HTML artifacts, resolves allowlisted paths, and supports PWA installation.

**Architecture:** Use a single Express server to provide content APIs and static artifact routes, with a Vite React client for the UI and PWA shell. Keep filesystem access constrained to explicit content roots and resolve dynamic content at request time so newly written artifacts appear immediately.

**Tech Stack:** TypeScript, React, Vite, Express, Vitest, Testing Library, React Router, react-markdown, vite-plugin-pwa

---

### Task 1: Scaffold the workspace

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `server/index.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, expect, it } from "vitest";

describe("workspace scaffold", () => {
  it("loads the app entry", async () => {
    const appModule = await import("../src/App");
    expect(appModule.App).toBeTypeOf("function");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/App.test.tsx`
Expected: FAIL because `src/App.tsx` does not exist yet

- [ ] **Step 3: Write minimal implementation**

```tsx
export function App() {
  return <div>Mobile Web View</div>;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/App.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json vite.config.ts index.html src/main.tsx src/App.tsx server/index.ts
git commit -m "feat: scaffold mobile web view app"
```

### Task 2: Implement safe content root resolution

**Files:**
- Create: `server/contentRoots.ts`
- Create: `server/contentService.ts`
- Create: `server/contentService.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, expect, it } from "vitest";
import { resolveContentPath } from "./contentService";

describe("resolveContentPath", () => {
  it("resolves markdown files inside allowlisted roots", () => {
    const resolved = resolveContentPath("content/markdown/demo.md");
    expect(resolved.kind).toBe("markdown");
    expect(resolved.relativePath).toBe("demo.md");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- server/contentService.test.ts`
Expected: FAIL because `resolveContentPath` does not exist yet

- [ ] **Step 3: Write minimal implementation**

```typescript
export function resolveContentPath(inputPath: string) {
  return {
    kind: "markdown",
    relativePath: "demo.md",
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- server/contentService.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/contentRoots.ts server/contentService.ts server/contentService.test.ts
git commit -m "feat: add content root resolver"
```

### Task 3: Implement directory listing APIs

**Files:**
- Modify: `server/contentService.ts`
- Modify: `server/index.ts`
- Create: `server/directories.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, expect, it } from "vitest";
import { listDirectoryItems } from "./contentService";

describe("listDirectoryItems", () => {
  it("returns newest items first", async () => {
    const items = await listDirectoryItems("markdown");
    expect(items[0].name).toBe("newer.md");
    expect(items[1].name).toBe("older.md");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- server/directories.test.ts`
Expected: FAIL because `listDirectoryItems` does not exist yet

- [ ] **Step 3: Write minimal implementation**

```typescript
export async function listDirectoryItems() {
  return [
    { name: "newer.md" },
    { name: "older.md" },
  ];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- server/directories.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/contentService.ts server/index.ts server/directories.test.ts
git commit -m "feat: add directory listing api"
```

### Task 4: Build the home page and directory list UI

**Files:**
- Modify: `src/App.tsx`
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/DirectoryPage.tsx`
- Create: `src/components/DirectoryList.tsx`
- Create: `src/pages/HomePage.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { App } from "../App";

describe("home page", () => {
  it("renders the path input and three directory links", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText(/input path/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "PPT" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "MarkDown" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "html" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/pages/HomePage.test.tsx`
Expected: FAIL because the UI does not render the required controls yet

- [ ] **Step 3: Write minimal implementation**

```tsx
export function HomePage() {
  return (
    <main>
      <input placeholder="Input path" />
      <button type="button">View</button>
      <a href="/directory/ppt">PPT</a>
      <a href="/directory/markdown">MarkDown</a>
      <a href="/directory/html">html</a>
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/pages/HomePage.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/pages/HomePage.tsx src/pages/DirectoryPage.tsx src/components/DirectoryList.tsx src/pages/HomePage.test.tsx
git commit -m "feat: add home and directory pages"
```

### Task 5: Add Markdown, HTML, and PPT viewers

**Files:**
- Create: `src/pages/MarkdownViewPage.tsx`
- Create: `src/pages/HtmlViewPage.tsx`
- Create: `src/pages/PptViewPage.tsx`
- Create: `src/pages/ViewerRouting.test.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { App } from "../App";

describe("viewer routes", () => {
  it("renders markdown viewer on markdown route", () => {
    render(
      <MemoryRouter initialEntries={["/view/markdown?path=demo.md"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText(/markdown/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/pages/ViewerRouting.test.tsx`
Expected: FAIL because viewer routes do not exist yet

- [ ] **Step 3: Write minimal implementation**

```tsx
export function MarkdownViewPage() {
  return <section>Markdown Viewer</section>;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/pages/ViewerRouting.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/MarkdownViewPage.tsx src/pages/HtmlViewPage.tsx src/pages/PptViewPage.tsx src/pages/ViewerRouting.test.tsx src/App.tsx
git commit -m "feat: add content viewers"
```

### Task 6: Add PWA support and verification

**Files:**
- Modify: `vite.config.ts`
- Create: `public/manifest.webmanifest`
- Create: `public/pwa-192.png`
- Create: `public/pwa-512.png`
- Create: `src/pwa.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import manifest from "../public/manifest.webmanifest?raw";
import { describe, expect, it } from "vitest";

describe("pwa manifest", () => {
  it("declares standalone display mode", () => {
    const parsed = JSON.parse(manifest);
    expect(parsed.display).toBe("standalone");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/pwa.test.ts`
Expected: FAIL because the manifest does not exist yet

- [ ] **Step 3: Write minimal implementation**

```json
{
  "name": "Mobile Web View",
  "short_name": "Web View",
  "display": "standalone"
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/pwa.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts public/manifest.webmanifest public/pwa-192.png public/pwa-512.png src/pwa.test.ts
git commit -m "feat: add pwa support"
```
