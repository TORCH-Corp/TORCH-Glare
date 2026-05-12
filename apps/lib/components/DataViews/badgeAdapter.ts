import type { BadgeVariant } from "./types"

type TorchBadgeColor =
  | "gray"
  | "slate"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "ocean"
  | "blue"
  | "purple"
  | "rose"

type TorchBadgeStyle = "solid" | "subtle"

export type ResolvedBadgeProps = {
  color: TorchBadgeColor
  badgeStyle: TorchBadgeStyle
}

/**
 * Map the dataviews BadgeVariant set to torch-glare Badge props.
 * Defaults to `subtle` style (glare's native default — colored dot + subtle bg).
 * The legacy "Light" / "navy" / "bluePurple" variants explicitly request solid
 * fills, kept distinct for backwards compat with the data-views examples.
 */
export function resolveBadgeVariant(variant?: BadgeVariant): ResolvedBadgeProps {
  switch (variant) {
    case "green":          return { color: "green",  badgeStyle: "subtle" }
    case "greenLight":     return { color: "green",  badgeStyle: "subtle" }
    case "cocktailGreen":  return { color: "green",  badgeStyle: "solid" }
    case "yellow":         return { color: "yellow", badgeStyle: "subtle" }
    case "redOrange":      return { color: "orange", badgeStyle: "subtle" }
    case "redLight":       return { color: "red",    badgeStyle: "subtle" }
    case "rose":           return { color: "rose",   badgeStyle: "subtle" }
    case "purple":         return { color: "purple", badgeStyle: "subtle" }
    case "bluePurple":     return { color: "purple", badgeStyle: "solid" }
    case "blue":           return { color: "blue",   badgeStyle: "subtle" }
    case "navy":           return { color: "blue",   badgeStyle: "solid" }
    case "highlight":      return { color: "yellow", badgeStyle: "subtle" }
    case "gray":
    default:               return { color: "gray",   badgeStyle: "subtle" }
  }
}
