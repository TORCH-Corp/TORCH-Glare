"use client";

import { useState } from "react";

import { DataViews } from "@/components/DataViews";
import { Button } from "@/components/Button";
import { catalogue, catalogueFields, employees, employeeFields } from "../_data";
import { Callout, ExampleFrame } from "../_shared";

type Shape = "nested" | "flat";
type Expansion = "all" | "roots" | "none";
type Pane = "table" | "card";

export default function TreePage() {
  const [shape, setShape] = useState<Shape>("nested");
  const [expansion, setExpansion] = useState<Expansion>("roots");
  const [pane, setPane] = useState<Pane>("table");

  const nested = shape === "nested";

  return (
    <ExampleFrame
      title="Tree"
      description={
        <>
          A hierarchy sidebar with the selected node&apos;s subtree on the right. Works from either
          data shape — a nested <code>children</code> array or a flat parent pointer.
        </>
      }
      padded
    >
      <div className="flex h-full min-h-0 gap-4">
        <div className="min-h-0 flex-1">
          {/* Remounting on a shape change keeps the example honest: the two
              datasets are different, so this is a fresh Root, not a mutation. */}
          <DataViews.Root
            key={`${shape}-${expansion}-${pane}`}
            data={nested ? catalogue : employees}
            fields={nested ? catalogueFields : employeeFields}
            className="h-full"
          >
            <DataViews.Header title={nested ? "Catalogue" : "Org chart"}>
              <DataViews.ViewSwitch />
              <DataViews.Spacer />
              <DataViews.ConfigTrigger />
            </DataViews.Header>

            {nested ? (
              <DataViews.Tree
                childrenField="children"
                nodeLabel="name"
                defaultExpanded={expansion}
                defaultRightPane={pane}
              />
            ) : (
              <DataViews.Tree
                parentField="managerId"
                nodeLabel="name"
                defaultExpanded={expansion}
                defaultRightPane={pane}
              />
            )}
            <DataViews.Table />

            <DataViews.ConfigPanel />
          </DataViews.Root>
        </div>

        <aside className="flex w-72 shrink-0 flex-col gap-3 overflow-auto">
          <Control
            label="Data shape"
            options={[
              { id: "nested", label: "children[]" },
              { id: "flat", label: "parentId" },
            ]}
            value={shape}
            onChange={(v) => setShape(v as Shape)}
          />
          <Control
            label="defaultExpanded"
            options={[
              { id: "all", label: "all" },
              { id: "roots", label: "roots" },
              { id: "none", label: "none" },
            ]}
            value={expansion}
            onChange={(v) => setExpansion(v as Expansion)}
          />
          <Control
            label="defaultRightPane"
            options={[
              { id: "table", label: "table" },
              { id: "card", label: "card" },
            ]}
            value={pane}
            onChange={(v) => setPane(v as Pane)}
          />

          <Callout>
            <strong>Try it.</strong> Expand a node, then open <em>Filter &amp; Config.</em> — the
            node stays open. Rebuilding expansion on every re-render used to collapse the whole
            tree.
          </Callout>

          <Callout>
            The tree prunes its own forest rather than using the flat filter: a node survives if it
            matches <em>or any descendant does</em>, so filtering never orphans a match. Filter by
            status in the rail to see it.
          </Callout>

          <Callout>
            Drag a node onto another to reparent it — that is the one place a view legitimately
            rewrites the whole dataset, via <code>applyMove</code>.
          </Callout>
        </aside>
      </div>
    </ExampleFrame>
  );
}

function Control({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="typography-body-small-medium text-content-presentation-global-tertiary">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <Button
            key={o.id}
            size="S"
            variant={value === o.id ? "PrimeStyle" : "BorderStyle"}
            onClick={() => onChange(o.id)}
          >
            {o.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
