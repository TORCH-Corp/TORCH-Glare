import Link from "next/link";
import { byGroup, GROUPS } from "./_examples";

/** The suite index — a list of the examples, and nothing else. */
export default function DataViewsIndex() {
  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-8">
      {GROUPS.map((group) => (
        <section key={group} className="flex flex-col gap-2">
          <h2 className="typography-body-small-medium text-content-presentation-global-secondary">
            {group}
          </h2>
          <div className="flex flex-wrap gap-2">
            {byGroup(group).map((example) => (
              <Link
                key={example.slug}
                href={`/data-views/${example.slug}`}
                className="border-border-presentation-global-primary bg-background-presentation-form-field-primary hover:border-border-presentation-action-hover typography-body-medium-regular text-content-presentation-global-primary rounded-[8px] border px-3 py-2 transition-colors"
              >
                {example.title}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
