import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("project documentation", () => {
  it("ships a project README and local mobile-web-view publish skill", async () => {
    const projectRoot = process.cwd();
    const readmePath = path.join(projectRoot, "README.md");
    const skillPath = path.join(
      projectRoot,
      "skills",
      "mobile-web-view-publish",
      "SKILL.md"
    );

    await expect(fs.stat(readmePath)).resolves.toBeTruthy();
    await expect(fs.stat(skillPath)).resolves.toBeTruthy();
  });
});
