import { Badge } from "@/components/Badge";
import { BadgeField } from "@/components/BadgeField";
import { Button } from "@/components/Button";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { ActionButton } from "@/components/ActionButton";
import { Tag } from "@/hooks/useTagSelection";

export default function BadgeFieldExample() {
  const tags: Tag[] = [
    { id: '1', name: 'Electronics', isSelected: true, variant: 'blue', value: 'Electronics', live: false },
    { id: '2', name: 'Books', isSelected: false, variant: 'green', value: 'Books', live: false },
    { id: '3', name: 'Clothing', isSelected: false, variant: 'purple', value: 'Clothing', live: false },
    { id: '4', name: 'Home', isSelected: false, variant: 'yellow', value: 'Home', live: false },
    { id: '5', name: 'Sports', isSelected: false, variant: 'navy', value: 'Sports', live: false },
    { id: '8', name: 'Limited Edition', isSelected: false, variant: 'cocktailGreen', value: 'Limited Edition', live: false },
  ];
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
            tags={tags}
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
