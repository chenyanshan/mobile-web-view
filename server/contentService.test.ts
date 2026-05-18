import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createContentService } from "./contentService";

describe("resolveContentPath", () => {
  let tempRoot: string;

  beforeEach(async () => {
    tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "mobile-web-view-"));
    await fs.mkdir(path.join(tempRoot, "markdown"), { recursive: true });
    await fs.writeFile(path.join(tempRoot, "markdown", "demo.md"), "# Demo\n");
  });

  afterEach(async () => {
    await fs.rm(tempRoot, { recursive: true, force: true });
  });

  it("resolves markdown files inside allowlisted roots", async () => {
    const service = createContentService({
      roots: {
        markdown: path.join(tempRoot, "markdown"),
        html: path.join(tempRoot, "html")
      }
    });

    const resolved = await service.resolveContentPath("markdown/demo.md");

    expect(resolved.kind).toBe("markdown");
    expect(resolved.relativePath).toBe("demo.md");
  });

  it("rejects directory paths because ppt publishing is no longer supported", async () => {
    await fs.mkdir(path.join(tempRoot, "html"), { recursive: true });
    await fs.mkdir(path.join(tempRoot, "html", "deck"), { recursive: true });
    await fs.writeFile(path.join(tempRoot, "html", "deck", "index.html"), "<h1>Deck</h1>");

    const service = createContentService({
      roots: {
        markdown: path.join(tempRoot, "markdown"),
        html: path.join(tempRoot, "html")
      }
    });

    await expect(service.resolveContentPath("html/deck")).rejects.toThrow(
      /directory viewing is not supported/i
    );
  });
});
