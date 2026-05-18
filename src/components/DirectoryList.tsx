import { Link } from "react-router-dom";
import type { DirectoryItem } from "../../shared/content";

interface DirectoryListProps {
  items: DirectoryItem[];
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function DirectoryList({ items }: DirectoryListProps) {
  if (!items.length) {
    return <div className="status">No items yet.</div>;
  }

  return (
    <section className="list">
      {items.map((item) => (
        <Link key={`${item.kind}-${item.relativePath}`} className="list-item" to={item.viewUrl}>
          <div className="list-item-header">
            <div>
              <strong>{item.name}</strong>
              <span>{item.kind}</span>
            </div>
            <time dateTime={item.modifiedAt}>{formatTime(item.modifiedAt)}</time>
          </div>
        </Link>
      ))}
    </section>
  );
}
