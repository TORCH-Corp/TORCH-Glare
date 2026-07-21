import { ReactNode } from "react";

import { DemoNav } from "./_shared";

export default function FormBuilderLayout({ children }: { children: ReactNode }) {
  return (
    // At `lg`+ the page is a fixed-height column so a form can fill it; below that it grows with
    // its content and the page scrolls normally.
    <div className="flex min-h-screen flex-col bg-background-presentation-body-primary p-8 lg:h-screen">
      <div className="mx-auto flex w-full max-w-full flex-col gap-8 lg:min-h-0 lg:flex-1">
        <DemoNav />
        {children}
      </div>
    </div>
  );
}
