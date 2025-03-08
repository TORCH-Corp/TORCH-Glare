import { Badge } from "@/components/Badge";
import { BadgeField } from "@/components/BadgeField";
import { Button } from "@/components/Button";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { ActionButton } from "@/components/ActionButton";

export default function BadgeFieldExample() {
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
          "text-content-system-global-primary": true

        })}
      >
        BadgeField Preview
      </h1>

      {/* Loop through variants and sizes */}
      {anotherSizes.map((size: any) => (
        <div key={`${size}-badgeField`} className="">
          <h2
            className={cn("text-lg font-semibold", {
              "text-content-system-global-primary": true

            })}
          >{`Size: ${size}`}</h2>
          <BadgeField
            size={size}
            icon={<i className="ri-add-line"></i>}
            actionButton={
              <ActionButton size={size}><i className="ri-add-line"></i></ActionButton>
            }
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
          >
          </BadgeField>
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
