import type { PropsWithChildren, ReactNode } from "react";
import { Link } from "react-router-dom";

interface ShellProps extends PropsWithChildren {
  title: string;
  description?: string;
  backHref?: string;
  headerAction?: ReactNode;
}

export function Shell({ title, description, backHref, headerAction, children }: ShellProps) {
  return (
    <main className="shell">
      <section className="hero">
        {backHref ? (
          <p>
            <Link to={backHref}>Back</Link>
          </p>
        ) : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </section>
      {headerAction}
      {children}
    </main>
  );
}
