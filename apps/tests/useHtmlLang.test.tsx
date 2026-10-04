import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useHtmlLang } from "@/hooks/useHtmlLang";

/**
 * `<html lang>` as a React value.
 *
 * The test that matters is the first one: this hook used to seed `"en"` and correct in an effect,
 * which meant an Arabic page rendered English once before settling. That flash is invisible to an
 * assertion made *after* render — Testing Library flushes effects — so it is caught by recording the
 * value on every render and checking how many there were.
 */

afterEach(() => {
  document.documentElement.removeAttribute("lang");
});

/** Records the hook's value once per render, so the render sequence itself can be asserted. */
function Probe({ seen }: { seen: string[] }) {
  const lang = useHtmlLang();
  seen.push(lang);
  return <span data-testid="lang">{lang}</span>;
}

describe("useHtmlLang", () => {
  it("reads the language on the very first render, with no English flash", () => {
    // Set before mounting, exactly as an app does: i18n.ts writes `lang` at module scope, before
    // React mounts.
    document.documentElement.lang = "ar";
    const seen: string[] = [];

    render(<Probe seen={seen} />);

    expect(screen.getByTestId("lang")).toHaveTextContent("ar");
    // The assertion with teeth: one render, already correct. Seeding "en" and fixing it in an effect
    // would make this ["en", "ar"].
    expect(seen).toEqual(["ar"]);
  });

  it("defaults to English when the attribute is absent", () => {
    const seen: string[] = [];
    render(<Probe seen={seen} />);
    expect(seen).toEqual(["en"]);
  });

  it("follows a change after mount", async () => {
    const seen: string[] = [];
    render(<Probe seen={seen} />);
    expect(seen).toEqual(["en"]);

    document.documentElement.lang = "ar";

    await waitFor(() => expect(screen.getByTestId("lang")).toHaveTextContent("ar"));
    expect(seen).toEqual(["en", "ar"]);
  });

  // An embedded app gets its language pushed in by the shell, possibly several times.
  it("follows repeated changes", async () => {
    render(<Probe seen={[]} />);
    for (const tag of ["ar", "en", "ar"]) {
      document.documentElement.lang = tag;
      await waitFor(() => expect(screen.getByTestId("lang")).toHaveTextContent(tag));
    }
  });

  it("drops region and case", () => {
    for (const [tag, expected] of [
      ["ar-SA", "ar"],
      ["AR", "ar"],
      ["en-GB", "en"],
      ["fr-CA", "fr"],
    ] as const) {
      document.documentElement.lang = tag;
      const { unmount } = render(<Probe seen={[]} />);
      expect(screen.getByTestId("lang")).toHaveTextContent(expected);
      unmount();
    }
  });

  it("treats an empty attribute as English", () => {
    document.documentElement.lang = "";
    render(<Probe seen={[]} />);
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
  });

  it("stops observing once unmounted", async () => {
    const seen: string[] = [];
    const { unmount } = render(<Probe seen={seen} />);
    unmount();

    document.documentElement.lang = "ar";
    await new Promise((r) => setTimeout(r, 50));

    // Still just the single mounted render — a leaked observer would have pushed another.
    expect(seen).toEqual(["en"]);
  });
});
