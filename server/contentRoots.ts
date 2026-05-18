import path from "node:path";
import type { ContentKind } from "../shared/content";

export const projectRoot = process.cwd();

export const contentRoots: Record<ContentKind, string> = {
  markdown: path.join(projectRoot, "content", "markdown"),
  html: path.join(projectRoot, "content", "html")
};

export const allowlistedRoots = Object.values(contentRoots);
