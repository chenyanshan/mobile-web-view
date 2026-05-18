import fs from "node:fs/promises";
import path from "node:path";
import express from "express";
import { createServer as createViteServer } from "vite";
import type { ContentKind } from "../shared/content";
import { getServerConfig } from "./config";
import { contentRoots, projectRoot } from "./contentRoots";
import { createContentService } from "./contentService";

const app = express();
const { port, host } = getServerConfig(process.env);
const service = createContentService();
const isProduction = process.env.NODE_ENV === "production";

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.get("/api/directories/:kind", async (request, response) => {
  try {
    const kind = request.params.kind as ContentKind;
    const currentPath = typeof request.query.path === "string" ? request.query.path : "";
    const items = await service.listDirectoryItems(kind, currentPath);

    response.json({
      kind,
      currentPath,
      items
    });
  } catch (error) {
    response.status(400).json({
      error: error instanceof Error ? error.message : "Unable to list directory."
    });
  }
});

app.get("/api/resolve", async (request, response) => {
  try {
    const inputPath = typeof request.query.path === "string" ? request.query.path : "";
    const resolved = await service.resolveContentPath(inputPath);
    response.json(resolved);
  } catch (error) {
    response.status(400).json({
      error: error instanceof Error ? error.message : "Unable to resolve path."
    });
  }
});

app.get("/api/markdown", async (request, response) => {
  try {
    const relativePath = typeof request.query.path === "string" ? request.query.path : "";
    const markdown = await service.readMarkdown(relativePath);
    response.json(markdown);
  } catch (error) {
    response.status(400).json({
      error: error instanceof Error ? error.message : "Unable to load markdown."
    });
  }
});

for (const [kind, rootPath] of Object.entries(contentRoots) as Array<[ContentKind, string]>) {
  app.use(`/content/${kind}`, express.static(rootPath));
}

async function start() {
  if (isProduction) {
    const clientDist = path.join(projectRoot, "dist", "client");
    app.use(express.static(clientDist));
    app.use(async (_request, response) => {
      response.sendFile(path.join(clientDist, "index.html"));
    });
  } else {
    const vite = await createViteServer({
      root: projectRoot,
      server: {
        middlewareMode: true
      },
      appType: "spa"
    });

    app.use(vite.middlewares);

    app.use(async (request, response, next) => {
      try {
        const templatePath = path.join(projectRoot, "index.html");
        const template = await fs.readFile(templatePath, "utf8");
        const transformed = await vite.transformIndexHtml(request.originalUrl, template);
        response.status(200).set({ "Content-Type": "text/html" }).end(transformed);
      } catch (error) {
        vite.ssrFixStacktrace(error as Error);
        next(error);
      }
    });
  }

  app.listen(port, host, () => {
    console.log(`Mobile Web View server listening on http://${host}:${port}`);
  });
}

void start();
