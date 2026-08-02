import type {
  DynamicRecord,
  FieldConfig,
  FieldType,
  InboxConfig,
} from "../../components/DataViews/types";
import { findFirstDefined, formatPathLabel } from "./pathUtils";
import { isPlainObject, isCurrencyField, isRatingField } from "./nestedDataUtils";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}/;

const KEY_HINTS: Array<[RegExp, FieldType]> = [
  [/(^|[._])status$/i, "enum-badge"],
  [/(^|[._])priority$/i, "enum-badge"],
  [/(^|[._])avatar(url)?$/i, "avatar"],
  [/(^|[._])email$/i, "link"],
  [/(^|[._])phone$/i, "link"],
  [/(^|[._])url$|website$|homepage$/i, "link"],
  [/(^|[._])(image|thumbnail|photo|picture)$/i, "image"],
  [/(^|[._])tags?$|labels?$/i, "badge-array"],
  [/(date|time)$/i, "date-format"],
];

export function inferFieldType(path: string, value: unknown): FieldType {
  for (const [re, type] of KEY_HINTS) {
    if (re.test(path)) return type;
  }

  if (isCurrencyField(path)) return "currency";
  if (isRatingField(path) && typeof value === "number" && value <= 5) return "star-rating";

  if (value === null || value === undefined) return "text";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (Array.isArray(value)) return "badge-array";
  if (typeof value === "string") {
    if (ISO_DATE.test(value) && !isNaN(Date.parse(value))) return "date-format";
    return "text";
  }
  return "text";
}

export function detectFields(data: readonly DynamicRecord[]): FieldConfig[] {
  if (!data || data.length === 0) return [];

  const allKeys = new Set<string>();
  for (const item of data) {
    if (item && typeof item === "object") {
      for (const k of Object.keys(item)) allKeys.add(k);
    }
  }

  const fields: FieldConfig[] = [];
  let order = 0;

  for (const key of allKeys) {
    if (key.startsWith("_")) continue;

    const sample = findFirstDefined(data, key);
    if (isPlainObject(sample)) continue;
    if (Array.isArray(sample) && sample.length > 0 && isPlainObject(sample[0])) continue;

    fields.push({
      path: key,
      label: formatPathLabel(key),
      type: inferFieldType(key, sample),
      visible: true,
      order: order++,
    });
  }

  return fields
    .sort((a, b) => {
      if (a.path === "id") return -1;
      if (b.path === "id") return 1;
      return (a.label || "").localeCompare(b.label || "");
    })
    .map((f, i) => ({ ...f, order: i }));
}

/**
 * Merge one field override over its base, later keys winning.
 *
 * The categorical-filter props are handled as a **pair** rather than key-wise:
 * a plain spread of `{ filterVariant: "checkbox", filterMode: "multi" }` and
 * `{ filterVariant: "searchable-select" }` would leave a stale
 * `filterMode: "multi"` attached to a variant that is inherently single-select
 * — the exact combination `CategoricalFilterStyle` exists to forbid.
 */
function mergeOne(base: FieldConfig, override: FieldConfig): FieldConfig {
  const merged = { ...base, ...override } as FieldConfig & {
    filterVariant?: string;
    filterMode?: string;
  };
  if (override.filterVariant === "searchable-select") delete merged.filterMode;
  return merged as FieldConfig;
}

export function mergeFields(
  detected: readonly FieldConfig[],
  custom?: readonly FieldConfig[],
): FieldConfig[] {
  if (!custom || custom.length === 0) return [...detected];

  const out = [...detected];
  const byPath = new Map(out.map((f, i) => [f.path, i]));

  for (const c of custom) {
    if (!c.path) continue;
    const existing = byPath.get(c.path);
    if (existing != null) {
      out[existing] = mergeOne(out[existing], c);
    } else {
      out.push({
        ...c,
        path: c.path,
        label: c.label ?? formatPathLabel(c.path),
        visible: c.visible ?? true,
        order: c.order ?? out.length,
      });
      byPath.set(c.path, out.length - 1);
    }
  }

  return out
    .map((f, i) => ({ ...f, order: f.order ?? i }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function visibleFields(fields: readonly FieldConfig[]): FieldConfig[] {
  return fields.filter((f) => f.type !== "hidden" && f.visible !== false);
}

const STARRED_PATTERNS = ["isStarred", "starred", "favorite", "isFavorite", "pinned"];
const READ_PATTERNS = ["isRead", "read", "seen", "viewed"];
const ATTACHMENT_PATTERNS = ["hasAttachment", "hasAttachments", "attachments", "files"];
const PRIORITY_PATTERNS = ["priority", "urgency", "level", "importance"];

function pickField(sample: DynamicRecord, patterns: string[]): string | null {
  for (const p of patterns) {
    if (p in sample) return p;
  }
  return null;
}

export function resolveInboxConfig(
  data: readonly DynamicRecord[],
  user?: InboxConfig,
): Required<Omit<InboxConfig, "titlePath" | "previewPath">> &
  Pick<InboxConfig, "titlePath" | "previewPath"> {
  const sample = data?.[0] && typeof data[0] === "object" ? data[0] : {};

  const auto = {
    starredField: pickField(sample, STARRED_PATTERNS),
    readField: pickField(sample, READ_PATTERNS),
    attachmentField: pickField(sample, ATTACHMENT_PATTERNS),
    priorityField: pickField(sample, PRIORITY_PATTERNS),
  };

  return {
    starredField: user?.starredField !== undefined ? user.starredField : auto.starredField,
    readField: user?.readField !== undefined ? user.readField : auto.readField,
    attachmentField:
      user?.attachmentField !== undefined ? user.attachmentField : auto.attachmentField,
    priorityField: user?.priorityField !== undefined ? user.priorityField : auto.priorityField,
    titlePath: user?.titlePath,
    previewPath: user?.previewPath,
  };
}
