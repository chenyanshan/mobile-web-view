import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import type { ContentKind, DirectoryItem } from "../../shared/content";
import { fetchDirectory } from "../api";
import { DirectoryList } from "../components/DirectoryList";
import { Shell } from "../components/Shell";

const validKinds: ContentKind[] = ["markdown", "html"];

function isContentKind(value: string | undefined): value is ContentKind {
  return validKinds.includes(value as ContentKind);
}

export function DirectoryPage() {
  const { kind } = useParams();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<DirectoryItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const currentPath = searchParams.get("path") ?? "";
  const directoryKind = kind;

  useEffect(() => {
    if (!isContentKind(directoryKind)) {
      setError("Unknown directory type.");
      setIsLoading(false);
      return;
    }

    const resolvedKind: ContentKind = directoryKind;
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        const response = await fetchDirectory(resolvedKind, currentPath);
        if (!cancelled) {
          setItems(response.items);
          setError("");
        }
      } catch (caughtError) {
        if (!cancelled) {
          setError(caughtError instanceof Error ? caughtError.message : "Unable to load directory.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [directoryKind, currentPath]);

  return (
    <Shell
      title={`${directoryKind ?? "Unknown"} Directory`}
      description={currentPath || "Newest files first."}
      backHref="/"
    >
      {isLoading ? <div className="status">Loading directory...</div> : null}
      {!isLoading && error ? <div className="status">{error}</div> : null}
      {!isLoading && !error ? <DirectoryList items={items} /> : null}
    </Shell>
  );
}
