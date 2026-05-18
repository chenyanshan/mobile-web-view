import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resolvePath } from "../api";
import { Shell } from "../components/Shell";

export function HomePage() {
  const navigate = useNavigate();
  const [inputPath, setInputPath] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedPath = inputPath.trim();

    if (!trimmedPath) {
      setError("Enter a path to view.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const resolved = await resolvePath(trimmedPath);
      navigate(resolved.route);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to resolve path.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Shell
      title="Mobile Web View"
      description="Phone-friendly access to AI-generated Markdown and HTML artifacts."
    >
      <form className="path-bar" onSubmit={handleSubmit}>
        <input
          aria-label="Input path"
          placeholder="Input path"
          value={inputPath}
          onChange={(event) => setInputPath(event.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "View"}
        </button>
      </form>
      {error ? <div className="status">{error}</div> : null}
      <section className="tile-grid">
        <Link aria-label="MarkDown" className="tile" to="/directory/markdown">
          <strong>MarkDown</strong>
          <span>Readable Markdown documents with polished rendering</span>
        </Link>
        <Link aria-label="html" className="tile" to="/directory/html">
          <strong>html</strong>
          <span>Standalone HTML reports and pages</span>
        </Link>
      </section>
    </Shell>
  );
}
