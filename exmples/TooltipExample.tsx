import { Button } from "@/components/Button";
import { Tooltip } from "@/components/Tooltip";
import { cn } from "@/utils/cn";

export default function TooltipExample() {

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        Tooltip Preview
      </h1>
      <div className="flex flex-col gap-2 w-full">
        <Tooltip
          text={"Hello from the tooltip"}>
          <Button>Hover over me</Button>
        </Tooltip>
      </div>

    </>
  );
}
