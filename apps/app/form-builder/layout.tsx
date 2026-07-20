import { ReactNode } from "react";

import { DemoNav } from "./_shared";

export default function FormBuilderLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background-presentation-body-primary p-8">
      <div className="mx-auto flex max-w-full flex-col gap-8">
        <DemoNav />
        {children}
      </div>
    </div>
  );
}
