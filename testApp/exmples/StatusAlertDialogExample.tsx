import { AlertDialogAction } from "@/components/AlertDialog";
import { Button } from "@/components/Button";
import { StatusAlertDialog } from "@/components/StatusAlertDialog";
import { cn } from "@/utils/cn";
import { useState } from "react";

export default function StatusAlertDialogExample() {
  const [variant] = useState<any>(["info", "success", "warning", "error"]);

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        StatusAlertDialog Preview
      </h1>
      {
        variant.map((item: any) => (
          <div className="flex flex-col gap-2 w-full">
            <StatusAlertDialog
              actionButton={<AlertDialogAction><p className="px-[3px]">Done</p><i className="ri-check-line"></i></AlertDialogAction>}
              variant={item}
              TriggerChild={<Button variant="BorderStyle">Show Dialog Variant {item}</Button>}
              title="Are you sure?"
              description="This action cannot be undone. This will permanently delete your account and remove your data from our servers." />
          </div>
        ))
      }

    </>
  );
}
