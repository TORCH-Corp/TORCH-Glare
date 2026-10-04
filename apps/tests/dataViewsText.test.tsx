import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DataViews, DATA_VIEWS_STRINGS } from "@/components/DataViews";
import type { FieldConfig, Row } from "@/components/DataViews";

/**
 * The text DataViews writes on screen itself, in the languages it ships.
 *
 * Accessible names are deliberately out of scope — they stay English, by decision, so nothing here
 * asserts on an `aria-label`.
 *
 * The language comes from `<html lang>`, so these tests set that attribute rather than passing
 * anything, and have to put it back afterwards since it is shared document state.
 */

afterEach(() => {
  document.documentElement.removeAttribute("lang");
});

const ROWS: Row[] = [
  { id: "1", name: "Alpha", status: "Pending" },
  { id: "2", name: "Beta", status: "Shipped" },
];

const FIELDS: FieldConfig[] = [
  { path: "name", label: "Name", type: "text" },
  { path: "status", label: "Status", type: "enum-badge", variants: { Pending: "yellow" } },
];

const EN = DATA_VIEWS_STRINGS.en;
const AR = DATA_VIEWS_STRINGS.ar;

/** Two views, because `ViewSwitch` renders nothing with fewer than two — one option is noise. */
function renderSwitcher(labels?: { table?: string; board?: string }) {
  return render(
    <DataViews rows={ROWS} fields={FIELDS}>
      <DataViews.Header title="Orders">
        <DataViews.ViewSwitch />
      </DataViews.Header>
      <DataViews.Table label={labels?.table} />
      <DataViews.Board groupBy="status" label={labels?.board} />
    </DataViews>,
  );
}

describe("built-in strings · the status line", () => {
  /** `Panel.Sort` only shows it when nothing is sortable, which means every field hidden. */
  function renderNothingSortable() {
    return render(
      <DataViews
        rows={ROWS}
        fields={[{ path: "name", label: "Name", type: "hidden" }]}
        defaultPanelOpen
      >
        <DataViews.Panel>
          <DataViews.Panel.Tab value="config" label="Config">
            <DataViews.Panel.Sort />
          </DataViews.Panel.Tab>
        </DataViews.Panel>
        <DataViews.Table />
      </DataViews>,
    );
  }

  it("is English by default", async () => {
    renderNothingSortable();
    await waitFor(() => expect(screen.getByText(EN.noSortableColumns)).toBeInTheDocument());
  });

  it("is Arabic under lang=ar", async () => {
    document.documentElement.lang = "ar";
    renderNothingSortable();
    await waitFor(() => expect(screen.getByText(AR.noSortableColumns)).toBeInTheDocument());
    expect(screen.queryByText(EN.noSortableColumns)).not.toBeInTheDocument();
  });
});

describe("built-in strings · view switcher tabs", () => {
  it("uses the English defaults when no label is passed", async () => {
    renderSwitcher();
    await waitFor(() => expect(screen.getByRole("tab", { name: "List" })).toBeInTheDocument());
    expect(screen.getByRole("tab", { name: "Board" })).toBeInTheDocument();
  });

  it("translates those defaults under lang=ar", async () => {
    document.documentElement.lang = "ar";
    renderSwitcher();
    await waitFor(() => expect(screen.getByRole("tab", { name: "قائمة" })).toBeInTheDocument());
    expect(screen.getByRole("tab", { name: "لوحة" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "List" })).not.toBeInTheDocument();
  });

  // The whole reason `viewLabels` is keyed by the English default rather than replacing it.
  it("never overrides a label the caller passed", async () => {
    document.documentElement.lang = "ar";
    renderSwitcher({ table: "جدولي", board: "My Board" });
    await waitFor(() => expect(screen.getByRole("tab", { name: "جدولي" })).toBeInTheDocument());
    // Passed explicitly, so it stays English even on an Arabic page — the caller decides.
    expect(screen.getByRole("tab", { name: "My Board" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "قائمة" })).not.toBeInTheDocument();
  });

  // The memo hazard, and why it is not cosmetic: the view registry is memoised on a key built from
  // the views, and a defaulted label changes with the language while no prop changes. `useHtmlLang`
  // also starts at "en" and corrects in an effect, so keying on the prop would cache English on the
  // first render and never recompute — Arabic would never appear at all.
  it("follows a language switch on a mounted switcher", async () => {
    renderSwitcher();
    await waitFor(() => expect(screen.getByRole("tab", { name: "List" })).toBeInTheDocument());

    document.documentElement.lang = "ar";

    await waitFor(() => expect(screen.getByRole("tab", { name: "قائمة" })).toBeInTheDocument());
    expect(screen.queryByRole("tab", { name: "List" })).not.toBeInTheDocument();
  });
});

describe("built-in strings · resolving the tag", () => {
  // Reading the DOM means taking whatever the app wrote there, which is not always a bare "ar".
  for (const tag of ["ar-SA", "AR", "ar-EG"]) {
    it(`resolves ${tag} to Arabic`, async () => {
      document.documentElement.lang = tag;
      renderSwitcher();
      await waitFor(() => expect(screen.getByRole("tab", { name: "قائمة" })).toBeInTheDocument());
    });
  }

  for (const tag of ["fr", "de-DE", ""]) {
    it(`falls back to English for ${JSON.stringify(tag)}`, async () => {
      document.documentElement.lang = tag;
      renderSwitcher();
      // English, not a blank tab.
      await waitFor(() => expect(screen.getByRole("tab", { name: "List" })).toBeInTheDocument());
    });
  }
});

describe("built-in strings · the tables themselves", () => {
  /**
   * Every leaf string a table holds, as `path -> rendered`.
   *
   * Recursing matters: `viewLabels` is a nested record, and a check that only looked at the top
   * level would silently skip the six tab names — reporting a pass while most of the Arabic went
   * unverified.
   */
  function leaves(table: Record<string, unknown>, prefix = ""): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(table)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "function") out[path] = (value as (s: string) => string)("X");
      else if (typeof value === "string") out[path] = value;
      else if (value && typeof value === "object")
        Object.assign(out, leaves(value as Record<string, unknown>, path));
      else throw new Error(`${path} is neither string, function nor record`);
    }
    return out;
  }

  it("covers the same keys in both languages, with nothing blank or padded", () => {
    const en = leaves(DATA_VIEWS_STRINGS.en);
    const ar = leaves(DATA_VIEWS_STRINGS.ar);

    expect(Object.keys(ar).sort()).toEqual(Object.keys(en).sort());
    // Guards the recursion itself: 6 tab names + the status line + the pane title.
    expect(Object.keys(en).length).toBeGreaterThanOrEqual(8);

    for (const [lang, table] of [
      ["en", en],
      ["ar", ar],
    ] as const) {
      for (const [path, value] of Object.entries(table)) {
        expect(value, `${lang}.${path}`).toBeTruthy();
        expect(value.trim(), `${lang}.${path}`).toBe(value);
      }
    }
  });

  it("does not leave any Arabic entry still in English", () => {
    const arabic = /[؀-ۿ]/;
    for (const [path, value] of Object.entries(leaves(DATA_VIEWS_STRINGS.ar))) {
      expect(arabic.test(value), `ar.${path} has no Arabic characters`).toBe(true);
    }
  });

  // The decision this revert recorded: accessible names are not localized.
  it("holds no accessible-name keys", () => {
    const keys = Object.keys(DATA_VIEWS_STRINGS.en);
    for (const gone of [
      "openSearch",
      "clearSearch",
      "closePanel",
      "showColumn",
      "selectAllRows",
      "selectRow",
      "reorderRow",
    ]) {
      expect(keys, `${gone} should have been removed with the aria-label revert`).not.toContain(gone);
    }
  });
});
