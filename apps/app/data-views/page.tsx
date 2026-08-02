import Link from "next/link";

import { GROUPS } from "./_examples";

export default function DataViewsIndexPage() {
  return (
    <div className="h-full overflow-auto p-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="typography-headers-large-medium text-content-presentation-global-primary">
            DataViews examples
          </h1>
          <p className="max-w-2xl typography-body-medium-regular text-content-presentation-global-secondary">
            One record set, rendered as a table, board, inbox, or tree. Call{" "}
            <code>&lt;DataViews /&gt;</code> for the standard screen, or compose{" "}
            <code>DataViews.Root</code> with the parts you want. Every page below is a runnable
            example.
          </p>
        </header>

        {GROUPS.map((group) => (
          <section key={group.title} className="flex flex-col gap-3">
            <h2 className="typography-body-large-medium text-content-presentation-global-primary">
              {group.title}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.items.map((e) => (
                <Link
                  key={e.href}
                  href={e.href}
                  className="flex flex-col gap-1 rounded-[12px] border border-border-presentation-action-primary bg-background-presentation-form-base p-4 transition-colors hover:bg-background-presentation-action-hover"
                >
                  <span className="typography-body-large-medium text-content-presentation-global-primary">
                    {e.title}
                  </span>
                  <span className="typography-body-small-regular text-content-presentation-global-secondary">
                    {e.blurb}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
