import { ReactNode } from "react";

import { DemoNav } from "./_shared";

export default function FormBuilderLayout({ children }: { children: ReactNode }) {
  return (
    // `h-screen` + `min-h-0` gives the page a real height to hand down, so a form can fill it.
    <div className="flex h-screen flex-col bg-background-presentation-body-primary p-8">
      <div className="mx-auto flex min-h-0 w-full max-w-full flex-1 flex-col gap-8">
        <DemoNav />
        {children}
      </div>
    </div>
  );
}
