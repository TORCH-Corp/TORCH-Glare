import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/AlertDialog";
import { Button } from "@/components/Button";
import { cn } from "@/utils/cn";
import { useState } from "react";

export default function AlertDialogExample() {
  const [sizes] = useState<any>(["XS", "S", "M"]);

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        AlertDialog Preview
      </h1>
      <div className="flex flex-col gap-2 w-full">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="BorderStyle">Show Dialog</Button>
          </AlertDialogTrigger>

          <AlertDialogContent >
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <div className="flex justify-center items-center gap-2">
                <AlertDialogAction><p>Done</p><i className="ri-check-line"></i></AlertDialogAction>
                <span className="w-[1px] h-[28px] bg-border-presentation-action-disabled rounded-sm"></span>
                <AlertDialogCancel> <i className="ri-close-line"></i></AlertDialogCancel>
              </div>
            </AlertDialogHeader>
            <AlertDialogDescription className="p-[12px_8px_12px_8px] sm:p-[24px_48px_48px_48px]">
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
