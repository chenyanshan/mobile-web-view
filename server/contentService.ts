import fs from "node:fs/promises";
import path from "node:path";
import type {
  ContentKind,
  DirectoryItem,
  MarkdownResponse,
  ResolveResponse
} from "../shared/content";
import { contentRoots, projectRoot } from "./contentRoots";

interface ContentRoots {
  markdown: string;
  html: string;
}

interface ContentServiceOptions {
  roots?: ContentRoots;
}

const viewRoutes: Record<ContentKind, string> = {
  markdown: "/view/markdown",
  html: "/view/html"
};

function normalizeUserPath(inputPath: string) {
  return inputPath.trim().replaceAll("\\", "/");
}

function buildAssetPath(kind: ContentKind, relativePath: string) {
  return `/content/${kind}/${relativePath}`;
}

async function statIfExists(targetPath: string) {
  try {
    return await fs.stat(targetPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

function inferKindForFile(rootKey: string, extension: string): ContentKind {
  if (rootKey === "markdown" || extension === ".md") {
    return "markdown";
  }

  return "html";
}

export function createContentService(options: ContentServiceOptions = {}) {
  const roots = options.roots ?? contentRoots;

  async function resolveContentPath(inputPath: string): Promise<ResolveResponse> {
    const normalizedInput = normalizeUserPath(inputPath);

    for (const [kind, rootPath] of Object.entries(roots) as Array<[ContentKind, string]>) {
      const resolvedRoot = path.resolve(rootPath);
      const rootWithSep = `${resolvedRoot}${path.sep}`;
      const candidatePaths = new Set<string>();

      if (path.isAbsolute(normalizedInput)) {
        candidatePaths.add(path.resolve(normalizedInput));
      } else {
        candidatePaths.add(path.resolve(rootPath, normalizedInput));

        const rootAlias = `${kind}/`;
        if (normalizedInput.startsWith(rootAlias)) {
          candidatePaths.add(path.resolve(rootPath, normalizedInput.slice(rootAlias.length)));
        }

        const contentAlias = `content/${kind}/`;
        if (normalizedInput.startsWith(contentAlias)) {
          candidatePaths.add(path.resolve(rootPath, normalizedInput.slice(contentAlias.length)));
          candidatePaths.add(path.resolve(projectRoot, normalizedInput));
        }
      }

      for (const absolutePath of candidatePaths) {
        if (absolutePath !== resolvedRoot && !absolutePath.startsWith(rootWithSep)) {
          continue;
        }

        const entryStat = await statIfExists(absolutePath);
        if (!entryStat) {
          continue;
        }

        const relativePath = path.relative(rootPath, absolutePath).replaceAll("\\", "/");

        if (entryStat.isDirectory()) {
          throw new Error("Directory viewing is not supported. Publish a single HTML file or Markdown file instead.");
        }

        const extension = path.extname(absolutePath).toLowerCase();
        const resolvedKind = inferKindForFile(kind, extension);

        return {
          type: resolvedKind,
          kind: resolvedKind,
          relativePath,
          route: `${viewRoutes[resolvedKind]}?path=${encodeURIComponent(relativePath)}`,
          assetPath: resolvedKind === "markdown" ? undefined : buildAssetPath(resolvedKind, relativePath)
        };
      }
    }

    throw new Error("Path is not allowlisted or does not exist");
  }

  async function listDirectoryItems(kind: ContentKind, currentPath = ""): Promise<DirectoryItem[]> {
    const rootPath = roots[kind];
    const directoryPath = path.resolve(rootPath, currentPath);
    const rootWithSep = `${path.resolve(rootPath)}${path.sep}`;

    if (directoryPath !== path.resolve(rootPath) && !directoryPath.startsWith(rootWithSep)) {
      throw new Error("Directory path is outside allowlisted roots");
    }

    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    const items: DirectoryItem[] = [];

    for (const entry of entries) {
      if (kind === "markdown" && !entry.isFile()) {
        continue;
      }

      if (kind === "markdown" && path.extname(entry.name).toLowerCase() !== ".md") {
        continue;
      }

      if (kind === "html" && (!entry.isFile() || path.extname(entry.name).toLowerCase() !== ".html")) {
        continue;
      }

      const absolutePath = path.join(directoryPath, entry.name);
      const entryStat = await fs.stat(absolutePath);
      const relativePath = path.relative(rootPath, absolutePath).replaceAll("\\", "/");
      const resolvedKind = inferKindForFile(kind, path.extname(entry.name).toLowerCase());

      items.push({
        name: entry.name,
        relativePath,
        kind: resolvedKind,
        modifiedAt: entryStat.mtime.toISOString(),
        viewUrl: `${viewRoutes[resolvedKind]}?path=${encodeURIComponent(relativePath)}`
      });
    }

    return items.sort((left, right) => right.modifiedAt.localeCompare(left.modifiedAt));
  }

  async function readMarkdown(relativePath: string): Promise<MarkdownResponse> {
    const absolutePath = path.resolve(roots.markdown, relativePath);
    const rootWithSep = `${path.resolve(roots.markdown)}${path.sep}`;

    if (absolutePath !== path.resolve(roots.markdown) && !absolutePath.startsWith(rootWithSep)) {
      throw new Error("Markdown path is outside allowlisted roots");
    }

    const content = await fs.readFile(absolutePath, "utf8");

    return {
      relativePath,
      content
    };
  }

  return {
    resolveContentPath,
    listDirectoryItems,
    readMarkdown
  };
}
