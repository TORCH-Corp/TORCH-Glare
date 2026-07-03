import { Badge } from "@/components/Badge";
import { cn } from "@/utils/cn";

const COLORS = [
  "gray",
  "slate",
  "red",
  "orange",
  "yellow",
  "green",
  "ocean",
  "blue",
  "purple",
  "rose",
] as const;

const SIZES = ["XS", "S", "M"] as const;
const STYLES = ["subtle", "solid"] as const;

export function BadgeExample() {
  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        Badge Preview
      </h1>

      {COLORS.map((color) => (
        <div key={color} className="flex flex-col gap-3 w-full mb-8">
          <span
            className={cn(
              "text-sm capitalize",
              "text-content-system-global-primary"
            )}
          >
            {color}
          </span>

          {STYLES.map((badgeStyle) => (
            <div key={badgeStyle} className="flex flex-col gap-2">
              <span
                className={cn(
                  "text-xs uppercase tracking-wide",
                  "text-content-system-global-secondary"
                )}
              >
                {badgeStyle}
              </span>

              <div className="flex gap-2 items-start flex-wrap">
                {SIZES.map((size) => (
                  <Badge
                    key={`${size}-icon`}
                    label={`${color} ${size}`}
                    badgeStyle={badgeStyle}
                    color={color}
                    size={size}
                  />
                ))}
                {SIZES.map((size) => (
                  <Badge
                    key={`${size}-noicon`}
                    label={`${color} ${size} no-icon`}
                    badgeStyle={badgeStyle}
                    color={color}
                    size={size}
                    showIcon={false}
                  />
                ))}
                {SIZES.map((size) => (
                  <Badge
                    key={`${size}-closable`}
                    label={`${color} ${size} closable`}
                    badgeStyle={badgeStyle}
                    color={color}
                    size={size}
                    isClosable
                    onClose={() => {}}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
