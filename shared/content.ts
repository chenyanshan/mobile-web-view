export type ContentKind = "markdown" | "html";

export type ResolvedPathType = ContentKind;

export interface DirectoryItem {
  name: string;
  relativePath: string;
  kind: ContentKind;
  modifiedAt: string;
  viewUrl: string;
}

export interface DirectoryResponse {
  kind: ContentKind;
  currentPath: string;
  items: DirectoryItem[];
}

export interface ResolveResponse {
  type: ResolvedPathType;
  kind: ContentKind;
  relativePath: string;
  route: string;
  assetPath?: string;
}

export interface MarkdownResponse {
  relativePath: string;
  content: string;
}
