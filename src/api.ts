import type {
  DirectoryResponse,
  MarkdownResponse,
  ResolveResponse
} from "../shared/content";

async function readJson<T>(input: string): Promise<T> {
  const response = await fetch(input);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function fetchDirectory(kind: string, currentPath = "") {
  const url = new URL(`/api/directories/${kind}`, window.location.origin);
  if (currentPath) {
    url.searchParams.set("path", currentPath);
  }

  return readJson<DirectoryResponse>(url.toString());
}

export function resolvePath(inputPath: string) {
  const url = new URL("/api/resolve", window.location.origin);
  url.searchParams.set("path", inputPath);
  return readJson<ResolveResponse>(url.toString());
}

export function fetchMarkdown(relativePath: string) {
  const url = new URL("/api/markdown", window.location.origin);
  url.searchParams.set("path", relativePath);
  return readJson<MarkdownResponse>(url.toString());
}
