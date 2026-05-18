import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createContentService } from "./contentService";

describe("listDirectoryItems", () => {
  let tempRoot: string;

  beforeEach(async () => {
    tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "mobile-web-view-list-"));
    const markdownRoot = path.join(tempRoot, "markdown");
    await fs.mkdir(markdownRoot, { recursive: true });

    const olderFile = path.join(markdownRoot, "older.md");
    const newerFile = path.join(markdownRoot, "newer.md");

    await fs.writeFile(olderFile, "# Older\n");
    await fs.writeFile(newerFile, "# Newer\n");

    const olderDate = new Date("2026-05-18T10:00:00.000Z");
    const newerDate = new Date("2026-05-18T11:00:00.000Z");
    await fs.utimes(olderFile, olderDate, olderDate);
    await fs.utimes(newerFile, newerDate, newerDate);
  });

  afterEach(async () => {
    await fs.rm(tempRoot, { recursive: true, force: true });
  });

  it("returns newest items first", async () => {
    const service = createContentService({
      roots: {
        markdown: path.join(tempRoot, "markdown"),
        html: path.join(tempRoot, "html")
      }
    });

    const items = await service.listDirectoryItems("markdown");

    expect(items[0].name).toBe("newer.md");
    expect(items[1].name).toBe("older.md");
  });
});
