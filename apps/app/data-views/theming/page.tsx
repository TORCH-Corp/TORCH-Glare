"use client";

import { useState } from "react";

import { DataViews } from "@/components/DataViews";
import { Button } from "@/components/Button";
import type { Themes } from "@/utils/types";
import { orders, orderFields } from "../_data";
import { Callout, ExampleFrame } from "../_shared";

const THEMES: Themes[] = ["default", "dark", "light"];

export default function ThemingPage() {
  const [theme, setTheme] = useState<Themes>("default");

  return (
    <ExampleFrame
      title="Theming"
      description={
        <>
          <code>theme</code> is applied as <code>data-theme</code> on the root. Omit it and
          DataViews inherits from the nearest ancestor, which is what a <code>ThemeProvider</code>{" "}
          sets.
        </>
      }
      padded
    >
      <div className="flex h-full min-h-0 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {THEMES.map((t) => (
            <Button
              key={t}
              size="M"
              variant={theme === t ? "PrimeStyle" : "BorderStyle"}
              onClick={() => setTheme(t)}
            >
              {t}
            </Button>
          ))}
        </div>

        <Callout>
          The header bar and the config rail stay dark in every theme — that is deliberate, from the
          Figma spec, not a bug. They carry their own <code>data-theme=&quot;dark&quot;</code> so
          their child components resolve dark tokens even in a light host app. The view surfaces
          below them follow the theme you pick.
        </Callout>

        <div className="min-h-0 flex-1">
          <DataViews
            key={theme}
            title="Orders"
            data={orders}
            fields={orderFields}
            theme={theme}
            className="h-full"
          />
        </div>
      </div>
    </ExampleFrame>
  );
}
