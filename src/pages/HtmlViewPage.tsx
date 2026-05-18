import { useSearchParams } from "react-router-dom";
import { Shell } from "../components/Shell";

export function HtmlViewPage() {
  const [searchParams] = useSearchParams();
  const relativePath = searchParams.get("path") ?? "";
  const assetPath = `/content/html/${relativePath}`;

  return (
    <Shell title="HTML Viewer" description={relativePath} backHref="/directory/html">
      <section className="frame-card">
        <iframe src={assetPath} title="HTML Viewer" />
      </section>
    </Shell>
  );
}
