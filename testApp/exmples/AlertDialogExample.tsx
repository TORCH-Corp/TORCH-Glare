import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogLabel, AlertDialogTitle, AlertDialogTrigger } from "@/components/AlertDialog";
import { Button } from "@/components/Button";
import { cn } from "@/utils/cn";
import { useState } from "react";

export default function AlertDialogExample() {
  const [variant] = useState<any>(["info", "success", "warning", "error", "default"]);

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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="BorderStyle">{`Show Dialog type  ${item}`}</Button>
              </AlertDialogTrigger>

              <AlertDialogContent variant={item} >
                <AlertDialogHeader>
                  <AlertDialogTitle >
                    <AlertDialogLabel title="Are you sure?" />
                  </AlertDialogTitle>
                  <div className="flex justify-center items-center gap-2">
                    <AlertDialogAction>Continue</AlertDialogAction>
                    <span className="w-[1px] h-[28px] bg-border-presentation-action-disabled rounded-sm"></span>
                    <AlertDialogCancel> <i className="ri-close-line"></i></AlertDialogCancel>
                  </div>
                </AlertDialogHeader>
                <AlertDialogDescription  >
                  you cant undo this action if you click on continue.
                </AlertDialogDescription>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))
      }

    </>
  );
}
