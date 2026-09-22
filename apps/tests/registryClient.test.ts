/**
 * The in-process payload memo.
 *
 * `update` installs each item in turn and each resolves its own dependency closure, which overlap
 * heavily — without this, 55 installed items meant 287 item fetches. That was measured by counting
 * requests at a live origin, which is not something CI can do, so the behaviour is pinned here
 * instead.
 *
 * The counter assertions are deliberately two-sided: "one fetch for two calls" alone would also
 * pass if `fetch` were never called at all, or if the stub were broken.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    fetchItemByUrl,
    resetItemMemo,
    RegistryError,
} from "../../cli/src/shared/registryClient";
import { loadRegistry, resetRegistryCache } from "../../cli/src/shared/loadRegistry";

const item = (name: string) => ({
    version: "2.5.6",
    name,
    type: "components",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: `components/${name}.tsx`, target: `components/${name}.tsx`, content: "x" }],
});

const index = { version: "2.5.6", generatedBy: "test", npmVersions: {}, items: [] };

/** Stub `fetch`, returning `body` for any URL, and count the calls. */
function stubFetch(body: unknown | ((url: string) => unknown)) {
    const calls: string[] = [];
    vi.stubGlobal("fetch", async (url: string) => {
        calls.push(url);
        const payload = typeof body === "function" ? (body as (u: string) => unknown)(url) : body;
        return {
            ok: true,
            status: 200,
            text: async () => JSON.stringify(payload),
        } as Response;
    });
    return calls;
}

beforeEach(() => {
    resetItemMemo();
    resetRegistryCache();
    vi.unstubAllGlobals();
});

describe("item memo", () => {
    it("fetches once for repeated requests of the same item", async () => {
        const calls = stubFetch(item("Button"));

        const a = await fetchItemByUrl("https://r.test/components/Button.json");
        const b = await fetchItemByUrl("https://r.test/components/Button.json");

        expect(calls).toHaveLength(1);
        expect(a.name).toBe("Button");
        expect(b).toBe(a); // the same object, not merely equal
    });

    it("still fetches distinct items separately", async () => {
        // The control for the test above: proves the counter moves at all.
        const calls = stubFetch((url) => item(url.includes("Badge") ? "Badge" : "Button"));

        await fetchItemByUrl("https://r.test/components/Button.json");
        await fetchItemByUrl("https://r.test/components/Badge.json");

        expect(calls).toHaveLength(2);
    });

    it("deduplicates concurrent requests, not just sequential ones", async () => {
        // The `update` case: parallel workers reaching for the same dependency at once. Memoising
        // the promise rather than the result is what makes this one request instead of eight.
        const calls = stubFetch(item("Button"));

        const results = await Promise.all(
            Array.from({ length: 8 }, () => fetchItemByUrl("https://r.test/components/Button.json")),
        );

        expect(calls).toHaveLength(1);
        expect(new Set(results).size).toBe(1);
    });

    it("refetches after the memo is reset", async () => {
        // Proves the single fetch above is the memo's doing, and that the reset seam works.
        const calls = stubFetch(item("Button"));

        await fetchItemByUrl("https://r.test/components/Button.json");
        resetItemMemo();
        await fetchItemByUrl("https://r.test/components/Button.json");

        expect(calls).toHaveLength(2);
    });

    it("does not memoise a failure", async () => {
        // A transient blip must not poison every remaining item in an `update` run.
        let attempt = 0;
        const calls: string[] = [];
        vi.stubGlobal("fetch", async (url: string) => {
            calls.push(url);
            attempt++;
            if (attempt === 1) throw new Error("ECONNRESET");
            return { ok: true, status: 200, text: async () => JSON.stringify(item("Button")) } as Response;
        });

        await expect(fetchItemByUrl("https://r.test/components/Button.json")).rejects.toThrow(
            RegistryError,
        );
        const recovered = await fetchItemByUrl("https://r.test/components/Button.json");

        expect(calls).toHaveLength(2);
        expect(recovered.name).toBe("Button");
    });

    it("rejects an item with no files rather than installing nothing", async () => {
        stubFetch({ ...item("Button"), files: [] });
        await expect(fetchItemByUrl("https://r.test/components/Button.json")).rejects.toThrow(
            /no files/,
        );
    });

    it("rejects a malformed file entry", async () => {
        stubFetch({ ...item("Button"), files: [{ path: "a", target: "a" }] });
        await expect(fetchItemByUrl("https://r.test/components/Button.json")).rejects.toThrow(
            /malformed/,
        );
    });
});

describe("registry index cache", () => {
    // Tracks REGISTRY_URL, which is temporarily on `refactor/cli-v2` for pre-merge testing.
    const INDEX_URL =
        "https://raw.githubusercontent.com/TORCH-Corp/TORCH-Glare/refactor/cli-v2/registry/index.json";

    it("fetches the index once per process, from the Glare repo", async () => {
        const calls = stubFetch(index);

        await loadRegistry();
        await loadRegistry();

        expect(calls).toEqual([INDEX_URL]);
    });

    it("refetches after the cache is reset", async () => {
        const calls = stubFetch(index);

        await loadRegistry();
        resetRegistryCache();
        await loadRegistry();

        expect(calls).toHaveLength(2);
    });

});
