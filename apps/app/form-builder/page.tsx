import Link from "next/link";

import { EXAMPLES } from "./_examples";

export default function FormBuilderIndexPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="typography-headers-large-medium text-content-presentation-global-primary">
          FormBuilder examples
        </h1>
        <p className="typography-body-medium-regular text-content-presentation-global-secondary">
          The compound <code>FormBuilder</code> (fields as JSX) and the config-driven{" "}
          <code>FormRenderer</code>. Each example submits to a dummy async request.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {EXAMPLES.map((e) => (
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
    </div>
  );
}
