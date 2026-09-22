import type { Registry, RegistryItem, RegistryItemPayload } from "../types/main.js";

/**
 * HTTP client for the hosted component registry.
 *
 * Until 2.5.7 the CLI shipped the whole library inside its own npm tarball and copied from there,
 * which meant a one-line component fix required publishing a new version of the CLI. Components now
 * come from a registry over HTTP, so source and tooling version independently.
 *
 * Everything here is fetch + JSON. `resolveInstallPlan` still does the dependency walk locally
 * against a single fetched index, rather than recursing over the network per item — that keeps the
 * resolver a pure, synchronous, testable function, and turns an N-deep request waterfall into one
 * request plus one parallel batch.
 */

/**
 * Where components come from: the `registry/` directory on the Glare repo's default branch,
 * served by raw.githubusercontent.com.
 *
 * Fetched straight from the repo rather than through a branded URL on the docs site. The site was
 * proxying this exact origin, and measuring it made the case plain: the proxy was *slower* than
 * what it proxied (0.31-0.67s vs 0.27s), traded a CDN for a single VPS, and coupled every install
 * to a website deploy. raw already sends `access-control-allow-origin: *`, which was the one thing
 * the route added that could not be got for free.
 *
 * ⚠️ TEMPORARY: pointed at `refactor/cli-v2` so the registry can be tested from the branch before
 * it reaches `main`. **Put this back to `main` before merging or publishing** — otherwise the
 * released CLI installs every component from a feature branch, and every install breaks the day
 * that branch is deleted. `pnpm run deploy` refuses to publish while this says anything else.
 */
const REGISTRY_URL =
    "https://raw.githubusercontent.com/TORCH-Corp/TORCH-Glare/refactor/cli-v2/registry";

/** Parallel item fetches. Measured ~275ms per request; `add DataViews` is 55 items. */
const CONCURRENCY = 8;

const REQUEST_TIMEOUT_MS = 20_000;

export class RegistryError extends Error {}

async function getJson<T>(url: string): Promise<T> {
    let response: Response;
    try {
        response = await fetch(url, {
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
            headers: { Accept: "application/json" },
        });
    } catch (error) {
        // Offline, DNS failure, timeout. Deliberately distinguished from a 404 below: conflating
        // them sends people hunting for a typo in a component name when the network is at fault.
        throw new RegistryError(
            `Could not reach the registry at ${url}\n   ${(error as Error).message}`
        );
    }

    if (response.status === 404) {
        throw new RegistryError(`Not found in the registry: ${url}`);
    }
    if (!response.ok) {
        throw new RegistryError(`Registry returned ${response.status} for ${url}`);
    }

    const body = await response.text();
    try {
        return JSON.parse(body) as T;
    } catch {
        throw new RegistryError(
            `Registry returned invalid JSON from ${url} ` +
                `(${body.slice(0, 80).replace(/\s+/g, " ")}…)`
        );
    }
}

/** Fetch the registry index: every item, its dependencies and its file list, without content. */
export async function fetchRegistryIndex(): Promise<Registry> {
    const registry = await getJson<Registry>(indexUrl());
    if (!registry || !Array.isArray(registry.items)) {
        throw new RegistryError(`Registry index at ${indexUrl()} has no items array.`);
    }
    return registry;
}

/** The index URL, exported so an error can name it without re-deriving it. */
export function indexUrl(): string {
    return `${REGISTRY_URL}/index.json`;
}

/**
 * Payloads already fetched in this process, keyed by absolute URL.
 *
 * `update` is what makes this matter. It calls `add` once per installed item, and each call
 * resolves its own dependency closure — which overlap heavily. Measured with 55 items installed:
 * 287 item fetches for 55 distinct items, every one a request the registry host has to serve.
 * With this, 55.
 */
const memo = new Map<string, Promise<RegistryItemPayload>>();

/** Test seam, and a guard against one command's fetches leaking into another's. */
export function resetItemMemo(): void {
    memo.clear();
}

/** Fetch one item payload by its absolute URL, memoised and validated. */
export async function fetchItemByUrl(url: string): Promise<RegistryItemPayload> {
    const hit = memo.get(url);
    if (hit) return hit;

    const pending = (async () => {
        const payload = await getJson<RegistryItemPayload>(url);

        if (!Array.isArray(payload.files) || payload.files.length === 0) {
            throw new RegistryError(`Registry item at ${url} has no files.`);
        }
        for (const file of payload.files) {
            if (typeof file?.target !== "string" || typeof file?.content !== "string") {
                throw new RegistryError(`Registry item at ${url} has a malformed file entry.`);
            }
        }

        return payload;
    })();

    memo.set(url, pending);
    try {
        return await pending;
    } catch (error) {
        // Do not memoise a failure — a transient network error should not poison the rest of
        // the run, and `update` would otherwise repeat one blip across every remaining item.
        memo.delete(url);
        throw error;
    }
}

/**
 * Fetch every item in an install plan, `CONCURRENCY` at a time.
 *
 * Serially this is the difference between roughly 15s and 2s for `add DataViews`; unbounded it is
 * 55 simultaneous connections, which is how you get rate-limited by a registry host.
 */
export async function fetchRegistryItems(
    items: RegistryItem[]
): Promise<Map<string, RegistryItemPayload>> {
    const out = new Map<string, RegistryItemPayload>();
    const queue = [...items];

    const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
        for (let next = queue.shift(); next; next = queue.shift()) {
            const url = `${REGISTRY_URL}/${next.type}/${next.name}.json`;
            out.set(`${next.type}/${next.name}`, await fetchItemByUrl(url));
        }
    });

    await Promise.all(workers);
    return out;
}
