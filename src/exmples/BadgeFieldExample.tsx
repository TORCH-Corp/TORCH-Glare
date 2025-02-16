import { Badge } from "@/components/base/Badge";
import { BadgeField } from "@/components/base/BadgeField";
import { Button } from "@/components/base/Button";
import { cn } from "@/components/base/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useState } from "react";

export default function BadgeFieldExample() {
  const { theme } = useTheme();
  const [badges, setBadges] = useState<any>([
    { label: "Badge 1", isSelected: true, variant: "green" },
    { label: "Badge 2", isSelected: true, variant: "navy" },
    { label: "Badge 3", isSelected: true, variant: "greenLight" },
    { label: "Badge 4", isSelected: false, variant: "purple" },
    { label: "Badge 5", isSelected: false, variant: "rose" },
    { label: "Badge 6", isSelected: false, variant: "blue" },
    { label: "Badge 7", isSelected: false, variant: "yellow" },
    { label: "Badge 8", isSelected: false, variant: "cocktailGreen" },
    { label: "Badge 9", isSelected: false, variant: "gray" },
    { label: "Badge 10", isSelected: false, variant: "redLight" },
  ]);
  const [anotherSizes] = useState<any>(["XS", "S", "M"]);
  const [error, setError] = useState(false);
  const [value, setValue] = useState("");

  return (
    <>
      <h1
        className={cn("text-2xl", {
          "text-black": theme === "light",
          "text-white": theme === "dark",
        })}
      >
        BadgeField Preview
      </h1>

      {/* Loop through variants and sizes */}
      {anotherSizes.map((size: any) => (
        <div key={`${size}-badgeField`} className="">
          <h2
            className={cn("text-lg font-semibold", {
              "text-black": theme === "light",
              "text-white": theme === "dark",
            })}
          >{`Size: ${size}`}</h2>
          <BadgeField
            theme="dark"
            size={size}
            variant={"PresentationStyle"}
            badgesChildren={
              <>
                {badges.map(
                  (badge: any) =>
                    badge.isSelected && (
                      <Badge
                        key={badge.label}
                        size={size}
                        variant={badge.variant}
                        label={badge.label}
                        isSelected={badge.isSelected}
                        onUnselect={() => {
                          setBadges((prev: any) =>
                            prev.map((b: any) =>
                              b.label === badge.label
                                ? { ...b, isSelected: false }
                                : b
                            )
                          );
                        }}
                      />
                    )
                )}
              </>
            }
            popoverChildren={
              <div className="flex flex-col gap-1">
                {badges.map(
                  (badge: any) =>
                    !badge.isSelected && (
                      <Badge
                        key={badge.label}
                        size={size}
                        variant={badge.variant}
                        label={badge.label}
                        isSelected={badge.isSelected}
                        onClick={() => {
                          setBadges((prev: any) =>
                            prev.map((b: any) =>
                              b.label === badge.label
                                ? { ...b, isSelected: true }
                                : b
                            )
                          );
                        }}
                      />
                    )
                )}
              </div>
            }
            errorMessage={error ? "This is an error message" : undefined}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`select a badge`}
          />
        </div>
      ))}

      {/* Toggle Error State */}
      <Button
        onClick={() => setError((prev) => !prev)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Toggle Error State
      </Button>
    </>
  );
}
