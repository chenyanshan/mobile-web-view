import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSearchParams } from "react-router-dom";
import { fetchMarkdown } from "../api";
import { Shell } from "../components/Shell";

export function MarkdownViewPage() {
  const [searchParams] = useSearchParams();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const relativePath = searchParams.get("path") ?? "";

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        const response = await fetchMarkdown(relativePath);
        if (!cancelled) {
          setContent(response.content);
          setError("");
        }
      } catch (caughtError) {
        if (!cancelled) {
          setError(caughtError instanceof Error ? caughtError.message : "Unable to load markdown.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    if (relativePath) {
      void load();
    } else {
      setError("Missing markdown path.");
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [relativePath]);

  return (
    <Shell title="Markdown Viewer" description={relativePath} backHref="/directory/markdown">
      {isLoading ? <div className="status">Loading markdown...</div> : null}
      {!isLoading && error ? <div className="status">{error}</div> : null}
      {!isLoading && !error ? (
        <article className="markdown-card">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
      ) : null}
    </Shell>
  );
}
