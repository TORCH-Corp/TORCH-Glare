"use client";

import React from "react";
import { cn } from "../../utils/cn";
import { getByPath } from "../../utils/dataViews/path";
import type { CurrencyOptions, FieldConfig, Row } from "../../utils/dataViews/types";
import { Avatar, AvatarFallback, AvatarImage } from "../Avatar";
import { Badge } from "../Badge";
import { resolveBadgeVariant } from "./badge";

/**
 * Paints one field of one row.
 *
 * This is the whole of DataViews' relationship with your data: read the value at `field.path` and
 * turn it into pixels. Every view — table cell, board card, inbox row, tree node — goes through
 * here, so a field looks the same wherever it appears and there is one place to add a type.
 *
 * `field.render` wins over `field.type`, so anything not covered below is a one-line escape hatch
 * rather than a reason to extend `FieldType`.
 */
export function Cell({
  field,
  row,
  className,
}: {
  field: FieldConfig;
  row: Row;
  className?: string;
}) {
  const value = getByPath(row, field.path);

  if (field.render) return <>{field.render(value, row)}</>;

  const type = field.type ?? "text";
  if (type === "hidden") return null;

  // `boolean` and `progress-bar` render something meaningful for a missing value — false, and an
  // empty bar — so they are the two types that never show the placeholder.
  if (isBlank(value) && type !== "boolean" && type !== "progress-bar") {
    return className ? <span className={className}>{NULL_PLACEHOLDER}</span> : NULL_PLACEHOLDER;
  }

  const content = paint(type, field, row, value);
  if (content === null) return null;
  return className ? <span className={className}>{content}</span> : <>{content}</>;
}

const NULL_PLACEHOLDER = <span className="text-content-presentation-global-tertiary">-</span>;

/**
 * An empty array counts as blank. It has to: `String([])` is `""`, so without this an `image`
 * field handed `[]` renders `<img src="">`, which the browser resolves to the current page and
 * re-downloads it. `badge-array` checks `Array.isArray` before this ever applies.
 */
function isBlank(value: unknown) {
  if (Array.isArray(value)) return value.length === 0;
  return value === undefined || value === null || value === "";
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

function formatWithToken(d: Date, token: string): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return token
    .replace(/YYYY/g, String(d.getFullYear()))
    .replace(/MM/g, pad(d.getMonth() + 1))
    .replace(/DD/g, pad(d.getDate()))
    .replace(/HH/g, pad(d.getHours()))
    .replace(/mm/g, pad(d.getMinutes()))
    .replace(/ss/g, pad(d.getSeconds()));
}

function toInitials(s: string): string {
  if (!s) return "?";
  const parts = String(s).trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

function IconNode({ icon }: { icon: string }) {
  if (/^ri-/.test(icon)) return <i className={icon} />;
  return <span aria-hidden>{icon}</span>;
}

// ─── The type switch ──────────────────────────────────────────────────────────

function paint(
  type: NonNullable<FieldConfig["type"]>,
  field: FieldConfig,
  row: Row,
  value: unknown,
): React.ReactNode {
  switch (type) {
    case "number": {
      return (
        <span className="font-mono text-content-presentation-global-primary">
          {typeof value === "number" ? value.toLocaleString() : String(value)}
        </span>
      );
    }

    case "date":
      return <span className="text-content-presentation-global-primary">{String(value)}</span>;

    case "date-format": {
      const opts = field.dateFormat;
      let formatted = String(value);
      try {
        const d = value instanceof Date ? value : new Date(value as string | number);
        if (!Number.isNaN(d.getTime())) {
          if (typeof opts === "object" && opts) {
            formatted = new Intl.DateTimeFormat(undefined, opts).format(d);
          } else if (typeof opts === "string") {
            formatted = formatWithToken(d, opts);
          } else {
            formatted = new Intl.DateTimeFormat(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            }).format(d);
          }
        }
      } catch {
        /* fall through to the raw string */
      }
      return <span className="text-content-presentation-global-primary">{formatted}</span>;
    }

    case "boolean": {
      const isTrue = !!value;
      const variant = isTrue ? (field.trueVariant ?? "green") : (field.falseVariant ?? "gray");
      return (
        <Badge
          {...resolveBadgeVariant(variant)}
          label={isTrue ? (field.trueLabel ?? "Yes") : (field.falseLabel ?? "No")}
          size="S"
        />
      );
    }

    case "enum-badge": {
      const key = String(value);
      const variant = field.variants?.[key] ?? field.defaultVariant ?? "gray";
      return <Badge {...resolveBadgeVariant(variant)} label={key} size="S" />;
    }

    case "badge-array": {
      const badgeProps = resolveBadgeVariant(field.variant ?? "blue");
      if (!Array.isArray(value)) {
        return <Badge {...badgeProps} label={String(value)} size="XS" />;
      }
      const limit = field.limit ?? value.length;
      const head = value.slice(0, limit);
      const overflow = value.length - head.length;
      return (
        <div className="flex flex-wrap gap-1">
          {/* Keyed by position, not by value — a badge-array is free to repeat one. */}
          {head.map((v, i) => (
            <Badge key={i} {...badgeProps} label={String(v)} size="XS" />
          ))}
          {overflow > 0 && (
            <Badge {...resolveBadgeVariant("gray")} label={`+${overflow}`} size="XS" />
          )}
        </div>
      );
    }

    case "currency": {
      const num = Number(value);
      if (Number.isNaN(num)) {
        return <span className="text-content-presentation-global-primary">{String(value)}</span>;
      }
      const opts: CurrencyOptions =
        typeof field.currency === "string" ? { code: field.currency } : (field.currency ?? {});
      const plain = () =>
        `${opts.symbol ?? "$"}${num.toLocaleString(opts.locale, {
          minimumFractionDigits: opts.decimals,
          maximumFractionDigits: opts.decimals,
        })}`;

      let formatted: string;
      if (opts.code) {
        try {
          formatted = new Intl.NumberFormat(opts.locale, {
            style: "currency",
            currency: opts.code,
            minimumFractionDigits: opts.decimals,
            maximumFractionDigits: opts.decimals,
          }).format(num);
        } catch {
          formatted = plain();
        }
      } else {
        formatted = plain();
      }
      return <span className="font-semibold text-green-600">{formatted}</span>;
    }

    case "number-format": {
      const num = Number(value);
      if (Number.isNaN(num)) {
        return <span className="text-content-presentation-global-primary">{String(value)}</span>;
      }
      return (
        <span className="font-mono text-content-presentation-global-primary">
          {new Intl.NumberFormat(undefined, field.format).format(num)}
        </span>
      );
    }

    case "progress-bar": {
      const raw = Number(value);
      const num = Number.isFinite(raw) ? raw : 0;
      const pct = Math.max(0, Math.min(100, num));
      // Thresholds are percentages of the bar, not values: below `warn` is red, at or above `ok`
      // is green, and everything between is amber.
      const [warn, ok] = field.thresholds ?? [40, 70];
      const color = num >= ok ? "bg-green-500" : num >= warn ? "bg-yellow-500" : "bg-red-500";
      return (
        <div className="flex min-w-[120px] items-center gap-2">
          <div className="bg-background-presentation-form-field-primary h-2 flex-1 overflow-hidden rounded-full">
            <div className={cn("h-full transition-all", color)} style={{ width: `${pct}%` }} />
          </div>
          <span className="text-content-presentation-global-primary w-10 text-right text-xs font-medium tabular-nums">
            {Math.round(num)}%
          </span>
        </div>
      );
    }

    case "star-rating": {
      const num = Number(value);
      const max = field.max ?? 5;
      const filled = Math.max(0, Math.min(max, Math.floor(num)));
      return (
        <div className="flex items-center gap-2">
          <div className="flex">
            {Array.from({ length: max }).map((_, i) => (
              <span key={i} className={i < filled ? "text-yellow-500" : "text-gray-300"} aria-hidden>
                ★
              </span>
            ))}
          </div>
          <span className="text-sm font-semibold tabular-nums">
            {Number.isFinite(num) ? num : "-"}
          </span>
        </div>
      );
    }

    case "icon-text": {
      const icon = field.icon ?? "";
      const after = field.iconPosition === "after";
      return (
        <span className="text-content-presentation-global-primary inline-flex items-center gap-1.5">
          {!after && icon && <IconNode icon={icon} />}
          <span>{String(value)}</span>
          {after && icon && <IconNode icon={icon} />}
        </span>
      );
    }

    case "two-line": {
      const secondary = field.secondaryPath != null ? getByPath(row, field.secondaryPath) : null;
      return (
        <div className="leading-tight">
          <div className="text-content-presentation-global-primary font-semibold">
            {String(value)}
          </div>
          {secondary != null && (
            <div className="text-content-presentation-global-secondary text-xs">
              {String(secondary)}
            </div>
          )}
        </div>
      );
    }

    case "avatar": {
      const src = typeof value === "string" ? value : null;
      // Without a `fallbackPath` there is no name to derive initials from — falling back to the
      // image URL would spell them out of "ht".
      const fallbackSource = field.fallbackPath != null ? getByPath(row, field.fallbackPath) : null;
      const initials = toInitials(String(fallbackSource ?? "?"));
      return (
        <Avatar>
          {src && <AvatarImage src={src} alt={initials} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      );
    }

    case "link": {
      const v = String(value);
      let href = v;
      if (field.linkType === "mailto" && !v.startsWith("mailto:")) href = `mailto:${v}`;
      else if (field.linkType === "tel" && !v.startsWith("tel:")) href = `tel:${v}`;
      return (
        <a
          href={href}
          target={field.linkType === "url" ? "_blank" : undefined}
          rel={field.linkType === "url" ? "noopener noreferrer" : undefined}
          className="text-blue-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {v}
        </a>
      );
    }

    case "image":
      return (
        // eslint-disable-next-line @next/next/no-img-element -- the src is arbitrary consumer data
        <img
          src={String(value)}
          alt=""
          className="border-border-presentation-global-primary h-10 w-10 rounded border object-cover"
        />
      );

    case "text":
    default:
      return <span className="text-content-presentation-global-primary">{String(value)}</span>;
  }
}
